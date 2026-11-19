/** Cloudflare Worker entry point for Joy Health. */
import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
  isImageOptimizationPath,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { INDEXABLE_PUBLICATIONS } from "../app/lib/publications";
import {
  parseRepHandle,
  REP_COOKIE,
  REP_COOKIE_MAX_AGE_SECONDS,
  REP_HANDLES,
  REP_PARAM,
  repFromCookieHeader,
  repStoreUrl,
  STORE_LINK_PATH,
  type RepHandle,
} from "../app/lib/reps";
import { SITE_URL } from "../app/lib/seo";

const canonicalOrigin = new URL(SITE_URL);
const pagePaths = new Set<string>(INDEXABLE_PUBLICATIONS.map(({ path }) => path));
const canonicalPaths = new Set<string>([...pagePaths, "/sitemap.xml", "/robots.txt", STORE_LINK_PATH]);

// Machine-readable mirrors written by `scripts/build-agent-files.mjs`.
const markdownPathFor = (path: string) => (path === "/" ? "/index.md" : `${path}.md`);
const markdownPaths = new Set<string>([...pagePaths].map(markdownPathFor));
const agentTextPaths = new Set<string>(["/llms.txt", "/llms-full.txt"]);

// Responses that crawlers re-fetch and can revalidate with If-None-Match.
const revalidatablePaths = new Set<string>([
  ...pagePaths,
  ...markdownPaths,
  ...agentTextPaths,
  "/sitemap.xml",
  "/robots.txt",
  "/feed.xml",
  "/data/supplement-labels.json",
  "/data/supplement-labels.csv",
]);

function ifNoneMatchHits(header: string | null, tag: string): boolean {
  if (!header) return false;
  const opaque = (value: string) => value.trim().replace(/^W\//, "");
  return header.split(",").some((value) => value.trim() === "*" || opaque(value) === opaque(tag));
}

/**
 * Adds an ETag from the response body and answers a matching If-None-Match
 * with 304, so crawlers can recheck unchanged pages without downloading them.
 * GET only: a HEAD response may not carry the body the tag describes.
 */
async function withEntityTag(request: Request, response: Response): Promise<Response> {
  if (request.method !== "GET" || response.status !== 200) return response;
  const body = await response.arrayBuffer();
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", body));
  const tag = `"${[...digest.slice(0, 16)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}"`;
  const headers = new Headers(response.headers);
  headers.set("ETag", tag);
  if (ifNoneMatchHits(request.headers.get("if-none-match"), tag)) {
    headers.delete("Content-Length");
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { status: 200, headers });
}

/** True when the client ranks Markdown at least as high as HTML. Browsers never ask for it. */
function prefersMarkdown(accept: string | null): boolean {
  let markdown = 0;
  let html = 0;
  for (const part of (accept ?? "").toLowerCase().split(",")) {
    const [type, ...params] = part.split(";").map((value) => value.trim());
    const qualityParam = params.find((param) => param.startsWith("q="));
    const quality = qualityParam ? Number(qualityParam.slice(2)) || 0 : 1;
    if (type === "text/markdown") markdown = Math.max(markdown, quality);
    if (type === "text/html") html = Math.max(html, quality);
  }
  return markdown > 0 && markdown >= html;
}

async function serveAgentFile(
  request: Request,
  env: Env,
  assetPath: string,
  extraHeaders: Record<string, string>,
): Promise<Response> {
  const asset = await env.ASSETS.fetch(
    new Request(new URL(assetPath, request.url), { method: request.method }),
  );
  if (!asset.ok) return asset;
  const headers = new Headers(asset.headers);
  headers.set(
    "Content-Type",
    assetPath.endsWith(".md") ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8",
  );
  for (const [name, value] of Object.entries(extraHeaders)) headers.set(name, value);
  return new Response(asset.body, { status: 200, headers });
}

function randomRep(): RepHandle {
  // Rejection sampling keeps the draw uniform for any number of representatives.
  const limit = 256 - (256 % REP_HANDLES.length);
  const byte = new Uint8Array(1);
  do crypto.getRandomValues(byte);
  while (byte[0] >= limit);
  return REP_HANDLES[byte[0] % REP_HANDLES.length];
}

/** A redirect that also remembers the visitor's representative. Never cached. */
function repRedirect(location: string, rep: RepHandle): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Set-Cookie": `${REP_COOKIE}=${rep}; Max-Age=${REP_COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax; Secure`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Store links and personal links. A personal link (`?rep=<handle>`) always
 * wins; otherwise the visitor keeps the representative they already have, and
 * a new visitor gets one at random when they first open the store. Nothing is
 * logged, and the cookie holds only the handle.
 */
function routeRepresentative(request: Request, url: URL): Response | undefined {
  const named = parseRepHandle(url.searchParams.get(REP_PARAM));

  if (url.pathname === STORE_LINK_PATH || url.pathname.startsWith(`${STORE_LINK_PATH}/`)) {
    const rep = named ?? repFromCookieHeader(request.headers.get("cookie")) ?? randomRep();
    // An unknown product falls back to the full store rather than a dead end.
    return repRedirect(repStoreUrl(rep, url.pathname.slice(STORE_LINK_PATH.length + 1)), rep);
  }

  if (named && pagePaths.has(url.pathname)) {
    // Remember the representative, then show the page at its canonical URL.
    const clean = new URL(url);
    clean.searchParams.delete(REP_PARAM);
    return repRedirect(clean.toString(), named);
  }

  return undefined;
}

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const securityHeaders = {
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

function secureResponse(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }

  const hostname = new URL(request.url).hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if (!isLocal && hostname !== "joyhealth.cc" && hostname !== "www.joyhealth.cc") {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return new Response(request.method === "HEAD" ? null : response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const isLocalPreview =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const isProductionHost =
      url.hostname === "joyhealth.cc" || url.hostname === "www.joyhealth.cc";

    // Normalize only known public routes; unknown paths retain true 404s.
    const normalizedPath = url.pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    const publicPath = canonicalPaths.has(normalizedPath) ? normalizedPath : url.pathname;
    if (
      isProductionHost &&
      (url.origin !== canonicalOrigin.origin || url.pathname !== publicPath)
    ) {
      const canonicalUrl = new URL(url);
      canonicalUrl.protocol = canonicalOrigin.protocol;
      canonicalUrl.host = canonicalOrigin.host;
      canonicalUrl.pathname = publicPath;
      return secureResponse(
        request,
        new Response(null, {
          status: 308,
          headers: { location: canonicalUrl.toString() },
        }),
      );
    }

    const response = await route(request, env, ctx, url, isLocalPreview);
    return revalidatablePaths.has(url.pathname) ? withEntityTag(request, response) : response;
  },
};

async function route(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
  isLocalPreview: boolean,
): Promise<Response> {
  const representative = routeRepresentative(request, url);
  if (representative) return secureResponse(request, representative);

  if (markdownPaths.has(url.pathname) || agentTextPaths.has(url.pathname)) {
    // Identify the HTML original without excluding the public Markdown copy.
    const headers: Record<string, string> = {};
    if (markdownPaths.has(url.pathname)) {
      const pagePath = url.pathname === "/index.md" ? "/" : url.pathname.slice(0, -3);
      headers.Link = `<${new URL(pagePath, SITE_URL).href}>; rel="canonical"`;
    }
    return secureResponse(
      request,
      await serveAgentFile(request, env, url.pathname, headers),
    );
  }

  if (pagePaths.has(url.pathname) && prefersMarkdown(request.headers.get("accept"))) {
    // Negotiated Markdown for the canonical URL. Never noindex this variant:
    // an indexer asking for Markdown must not drop the canonical page.
    return secureResponse(
      request,
      await serveAgentFile(request, env, markdownPathFor(url.pathname), { Vary: "Accept" }),
    );
  }

  // The Cloudflare worker runs before assets in local development. Forward
  // Vite's source modules and virtual runtime paths to the dev asset server so
  // the preview receives its stylesheet, hydration runtime, and HMR client.
  if (
    isLocalPreview &&
    (url.pathname.startsWith("/@") ||
      url.pathname.startsWith("/app/") ||
      url.pathname.startsWith("/node_modules/"))
  ) {
    const response = await env.ASSETS.fetch(request);
    return secureResponse(request, response);
  }

  if (url.pathname.startsWith("/_next/static/")) {
    const response = await env.ASSETS.fetch(request);
    return secureResponse(request, response);
  }

  if (isImageOptimizationPath(url.pathname)) {
    const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
    const response = await handleImageOptimization(
      request,
      {
        fetchAsset: (path) =>
          env.ASSETS.fetch(new Request(new URL(path, request.url))),
      },
      allowedWidths,
    );
    return secureResponse(request, response);
  }

  const response = await handler.fetch(request, env, ctx);
  const securedResponse = secureResponse(request, response);
  if (pagePaths.has(url.pathname)) {
    securedResponse.headers.append("Vary", "Accept");
    // Agents that only read headers can find the Markdown twin without parsing HTML.
    securedResponse.headers.append(
      "Link",
      `<${new URL(markdownPathFor(url.pathname), SITE_URL).href}>; rel="alternate"; type="text/markdown"`,
    );
  }
  return securedResponse;
}

export default worker;
