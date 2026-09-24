import { INDEXABLE_PUBLICATIONS, PUBLICATIONS } from "../lib/publications";
import { absoluteUrl, FEED_PATH, SITE_NAME } from "../lib/seo";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => `&#${character.charCodeAt(0)};`);

const rfc822 = (isoDate: string) => new Date(`${isoDate}T00:00:00.000Z`).toUTCString();

/**
 * RSS 2.0 feed of dated publications, newest first. Item dates are the
 * editorial publication dates; the feed never substitutes build time.
 */
export function GET() {
  const items = INDEXABLE_PUBLICATIONS.flatMap((publication) =>
    "datePublished" in publication && publication.datePublished
      ? [{ ...publication, datePublished: publication.datePublished }]
      : [],
  ).sort((left, right) => right.datePublished.localeCompare(left.datePublished));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${SITE_NAME}</title>
<link>${absoluteUrl("/")}</link>
<description>${escapeXml(PUBLICATIONS.home.description)}</description>
<language>en-us</language>
<atom:link href="${absoluteUrl(FEED_PATH)}" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `<item>
<title>${escapeXml(item.title)}</title>
<link>${absoluteUrl(item.path)}</link>
<guid isPermaLink="true">${absoluteUrl(item.path)}</guid>
<description>${escapeXml(item.description)}</description>
<pubDate>${rfc822(item.datePublished)}</pubDate>
</item>`,
  )
  .join("\n")}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
