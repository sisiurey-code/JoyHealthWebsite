/** Cloudflare Worker entry point for Joy Health. */
import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
  isImageOptimizationPath,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

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

  return new Response(response.body, {
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

    if (
      isProductionHost &&
      (url.protocol === "http:" || url.hostname === "www.joyhealth.cc")
    ) {
      const canonicalUrl = new URL(url);
      canonicalUrl.protocol = "https:";
      canonicalUrl.hostname = "joyhealth.cc";
      return secureResponse(
        request,
        new Response(null, {
          status: 308,
          headers: { location: canonicalUrl.toString() },
        }),
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
    return secureResponse(request, response);
  },
};

export default worker;
