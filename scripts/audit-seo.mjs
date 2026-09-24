import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const SITE = "https://joyhealth.cc";
const decode = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|#x[\da-f]+|#\d+);/gi, (entity) => {
  const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  return named[entity] ?? String.fromCodePoint(Number(entity.startsWith("&#x") ? `0x${entity.slice(3, -1)}` : entity.slice(2, -1)));
});
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, key, double, single]) => [key.toLowerCase(), decode(double ?? single)]));

// This parser targets the site's generated sitemap format, not arbitrary XML.
export function sitemapEntries(xml) {
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>\s*$/);
  assert.doesNotMatch(xml, /<!DOCTYPE|<!ENTITY|<priority>|<changefreq>/i);
  const entries = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>\s*)?<\/url>/g)].map(([, location, lastModified]) => ({ location: decode(location), lastModified }));
  const remainder = xml
    .replace(/^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/, "")
    .replace(/<url>\s*<loc>[^<]+<\/loc>\s*(?:<lastmod>[^<]+<\/lastmod>\s*)?<\/url>/g, "")
    .replace(/<\/urlset>\s*$/, "");
  assert.equal(remainder.trim(), "", "Unexpected sitemap XML content");
  assert.ok(entries.length > 0 && entries.length <= 50_000);
  assert.equal(entries.length, (xml.match(/<url>/g) ?? []).length);
  assert.ok(Buffer.byteLength(xml) < 50 * 1024 * 1024);
  assert.equal(new Set(entries.map(({ location }) => location)).size, entries.length);
  for (const { location, lastModified } of entries) {
    const url = new URL(location);
    assert.equal(url.origin, SITE);
    assert.equal(url.search + url.hash, "");
    assert.ok(url.pathname === "/" || !url.pathname.endsWith("/"));
    if (lastModified) {
      assert.match(lastModified, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(new Date(lastModified).toISOString().slice(0, 10), lastModified);
      assert.ok(lastModified <= new Date().toISOString().slice(0, 10), `Future date: ${location}`);
    }
  }
  return entries;
}

/** Audit final HTTP responses and server HTML; no browser JavaScript executes. */
export async function auditSeo(request) {
  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200, "sitemap status");
  assert.match(sitemap.headers.get("content-type") ?? "", /^(?:application|text)\/xml\b/i);
  const entries = sitemapEntries(await sitemap.text());
  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const rules = await robots.text();
  assert.match(rules, /^User-agent: \*\s*\n(?:Content-Signal: [^\n]+\n)?Allow: \/\s*$/im);
  // Content signals may be absent, but must never refuse search or AI answers.
  for (const [, signals] of rules.matchAll(/^Content-Signal:\s*(.+)$/gim)) {
    assert.doesNotMatch(signals, /\b(?:search|ai-input)\s*=\s*no\b/i, "Content-Signal refuses search or ai-input");
  }
  assert.doesNotMatch(rules, /^Disallow:\s*\S/m);
  assert.match(rules, /^Sitemap: https:\/\/joyhealth\.cc\/sitemap\.xml\s*$/im);
  const pages = new Map();
  const assets = new Set();
  const titles = new Set();
  const descriptions = new Set();
  for (const { location } of entries) {
    const pathname = new URL(location).pathname;
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex|nofollow|none/i, pathname);
    const html = (await response.text()).replace(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi, "");
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
    assert.ok(head, `Missing head: ${pathname}`);
    const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attrs(tag));
    const oneMeta = (key) => {
      const matches = meta.filter((item) => item.name === key || item.property === key);
      assert.equal(matches.length, 1, `${pathname}: expected one ${key}`);
      assert.ok(matches[0].content?.trim(), `${pathname}: empty ${key}`);
      return matches[0].content;
    };
    const titleTags = [...head.matchAll(/<title>([^<]+)<\/title>/gi)];
    assert.equal(titleTags.length, 1, pathname);
    const title = decode(titleTags[0][1]);
    const description = oneMeta("description");
    assert.ok(!titles.has(title), `Duplicate title: ${pathname}`);
    assert.ok(!descriptions.has(description), `Duplicate description: ${pathname}`);
    titles.add(title); descriptions.add(description);
    const headLinks = [...head.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attrs(tag));
    const canonicals = headLinks.filter(({ rel }) => rel === "canonical");
    assert.deepEqual(canonicals.map(({ href }) => new URL(href).href), [location], pathname);
    // Machine-readable twin for agents; noindexed so the HTML stays the cited page.
    const markdownLinks = headLinks.filter(({ rel, type }) => rel === "alternate" && type === "text/markdown");
    assert.equal(markdownLinks.length, 1, `${pathname}: Markdown alternate`);
    const markdown = await request(new URL(markdownLinks[0].href).pathname);
    assert.equal(markdown.status, 200, `${pathname}: Markdown twin status`);
    assert.match(markdown.headers.get("content-type") ?? "", /^text\/markdown\b/i);
    assert.match(markdown.headers.get("x-robots-tag") ?? "", /noindex/i);
    assert.ok((await markdown.text()).includes(`\ncanonical_url: ${location}\n`), `${pathname}: Markdown canonical`);
    assert.equal(new URL(oneMeta("og:url")).href, location);
    assert.equal(oneMeta("og:title"), title);
    assert.equal(oneMeta("twitter:title"), title);
    assert.equal(oneMeta("og:description"), description);
    assert.equal(oneMeta("twitter:description"), description);
    oneMeta("viewport");
    for (const item of meta.filter(({ name, property }) => name === "twitter:image" || property === "og:image")) {
      const image = new URL(item.content);
      assert.equal(image.origin, SITE);
      assets.add(image.pathname);
    }
    for (const item of meta.filter(({ name }) => /^(robots|googlebot)$/.test(name ?? ""))) {
      assert.doesNotMatch(item.content, /noindex|nofollow|none/i, pathname);
    }
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${pathname}: H1 count`);
    assert.match(html, /<html\b[^>]*lang="en"/i);
    assert.match(html, /<main\b[\s\S]*?<\/main>/i);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => decode(id));
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${pathname}`);
    const links = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attrs(tag)).filter(({ href }) => href);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(([, json]) => JSON.parse(json));
    for (const schema of schemas) {
      assert.equal(schema["@context"], "https://schema.org");
      const nodes = schema["@graph"] ?? [schema];
      const ids = new Set(nodes.map((node) => node["@id"]).filter(Boolean));
      for (const node of nodes) {
        assert.ok(node["@type"], `${pathname}: structured data node without @type`);
        // Entity links must point at Wikidata items or English Wikipedia articles.
        JSON.stringify(node, (key, value) => {
          if (key === "sameAs") {
            for (const url of [value].flat()) assert.match(url, /^https:\/\/(?:www\.wikidata\.org\/wiki\/Q\d+|en\.wikipedia\.org\/wiki\/[^\s/]+)$/, `${pathname}: sameAs ${url}`);
          }
          // A bare {"@id"} reference into this page's graph must resolve.
          if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).join() === "@id" && value["@id"].startsWith(`${SITE}${pathname}#`) && schema["@graph"]) {
            assert.ok(ids.has(value["@id"]), `${pathname}: dangling @id ${value["@id"]}`);
          }
          return value;
        });
        for (const download of [node.distribution ?? []].flat()) {
          const url = new URL(download.contentUrl);
          assert.equal(url.origin, SITE, `${pathname}: dataset download origin`);
          assets.add(url.pathname);
        }
      }
    }
    pages.set(pathname, { ids: new Set(ids), links });
  }
  let internalLinks = 0;
  const incoming = new Set(["/"]);
  for (const [pathname, { links }] of pages) {
    for (const { href } of links) {
      const url = new URL(href, `${SITE}${pathname}`);
      if (url.hostname !== "joyhealth.cc" && url.hostname !== "www.joyhealth.cc") continue;
      assert.equal(url.origin, SITE, `Noncanonical internal link: ${pathname} -> ${href}`);
      if (/\.[a-z0-9]+$/i.test(url.pathname)) { assets.add(url.pathname); continue; }
      assert.ok(pages.has(url.pathname), `Broken/unlisted internal page: ${pathname} -> ${href}`);
      assert.equal(url.search, "", `Internal query variant: ${href}`);
      if (url.hash) assert.ok(pages.get(url.pathname).ids.has(decodeURIComponent(url.hash.slice(1))), `Broken fragment: ${pathname} -> ${href}`);
      if (url.pathname !== pathname) incoming.add(url.pathname);
      internalLinks++;
    }
  }
  for (const pathname of pages.keys()) assert.ok(incoming.has(pathname), `Orphan page: ${pathname}`);
  const reachable = new Set(["/"]);
  for (const pathname of reachable) {
    for (const { href } of pages.get(pathname).links) {
      const url = new URL(href, `${SITE}${pathname}`);
      if (url.origin === SITE && pages.has(url.pathname)) reachable.add(url.pathname);
    }
  }
  assert.equal(reachable.size, pages.size, "Every sitemap page must be reachable from home");
  for (const pathname of assets) assert.equal((await request(pathname)).status, 200, `Linked asset: ${pathname}`);
  const llms = await request("/llms.txt");
  assert.equal(llms.status, 200, "llms.txt status");
  const llmsText = await llms.text();
  for (const { location } of entries) assert.ok(llmsText.includes(`](${location})`), `llms.txt omits ${location}`);
  const missing = await request("/seo-audit-page-that-does-not-exist");
  assert.equal(missing.status, 404, "Unknown routes must not be soft 404s");
  return { pages: pages.size, internalLinks, linkedAssets: assets.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const origin = new URL(process.argv[2] ?? SITE);
  assert.ok(["http:", "https:"].includes(origin.protocol));
  const result = await auditSeo((pathname) => fetch(new URL(pathname, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
    headers: { "user-agent": "JoyHealth-SEO-Audit/1.0", accept: "text/html,application/xml,text/plain,*/*" },
  }));
  console.log(`SEO audit passed for ${origin.origin}: ${JSON.stringify(result)}`);
}
