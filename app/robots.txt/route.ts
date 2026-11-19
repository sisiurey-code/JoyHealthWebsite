import { absoluteUrl } from "../lib/seo";

export const dynamic = "force-static";

/** Public crawl access and sitemap discovery, without a content-use declaration. */
export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
