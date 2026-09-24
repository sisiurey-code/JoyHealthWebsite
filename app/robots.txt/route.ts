import { absoluteUrl } from "../lib/seo";

export const dynamic = "force-static";

/**
 * robots.txt as a route rather than `robots.ts`, because the metadata API has
 * no field for Content-Signal (https://contentsignals.org/). All three signals
 * say yes, by the publisher's decision on 2026-09-24: the site wants to be
 * indexed, cited in AI answers, and learned from.
 */
export function GET() {
  const body = [
    "User-agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
