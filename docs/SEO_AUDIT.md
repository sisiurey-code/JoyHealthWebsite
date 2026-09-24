# Technical SEO audit — 2026-09-07 (America/Los_Angeles)

Scope: sitemap XML, crawlability, canonicalization, metadata, structured data,
internal discovery, and technical release safeguards. No site prose or editorial
publication/review dates were changed. Existing uncommitted work was preserved.
HTTP observations were collected on 2026-09-08 UTC. These are observations of the
then-live deployment; the implementation changes below are local and have not
been deployed by this audit.

## Screenshot finding

The supplied Search Console screenshot reports one URL,
`https://joyhealth.cc/sitemap.xml`, as **Crawled — currently not indexed**. It shows
September 4 as the first detection date and August 31 as the last crawl date.
This is the Page Indexing report, not evidence that sitemap parsing failed or
that an article is excluded. The XML document is a discovery resource; appearing
as a search result is not its success criterion.

Use the Sitemaps report to check submission processing, last read, and discovered
pages. Use URL Inspection on the HTML pages to assess their index status and
Google-selected canonical. The screenshot does not establish either of those
current states. Do not repeatedly request indexing of the XML document or change
its URL to clear this report.

References: [Page Indexing report](https://support.google.com/webmasters/answer/7440203)
and [Sitemaps report](https://support.google.com/webmasters/answer/7451001).

## Findings and disposition

| Area | Finding | Disposition |
| --- | --- | --- |
| Sitemap transport and XML | Live endpoint returned 200 and `application/xml`. A standard XML parser accepted the document, with 11 entries in the sitemap namespace. | Healthy; retained the single root sitemap. |
| Sitemap inventory | Eleven unique canonical HTTPS URLs; no error pages, query variants, or fragment URLs. | Retained inventory; added generation guards for duplicate and malformed paths. |
| Sitemap dates | Existing editorial dates are explicit; home and standards omit dates. | Preserved dates. Added calendar/future-date validation; never substitute build time. |
| Canonical redirects | Host/scheme normalization and framework slash normalization were separate, allowing redirect chains. Repeated separators on known paths could return 404. | Normalize known public paths, HTTPS, and hostname together in one 308; preserve query strings. Unknown pages remain 404. |
| HEAD behavior | The built Worker returned GET response bodies for HEAD requests, including sitemap and robots. This was demonstrated locally; an edge server may suppress the body independently. | Return bodyless HEAD responses while preserving status and headers. |
| Metadata maintenance | Non-article pages duplicated canonical, Open Graph, and Twitter setup. Article metadata did not emit a substantive modification date if one were supplied. | Derive non-article metadata from the publication registry; use absolute URLs and consistent locale; propagate an existing article modification date when present. No titles or descriptions were rewritten. |
| Page indexing eligibility | Live audit found successful HTML responses, self-canonicals, unique titles/descriptions, and no blocking index directives on all 11 public pages. | Passed. This establishes technical eligibility, not actual Google inclusion. |
| Internal discovery | Live audit checked 306 internal links and all page fragments; every sitemap page was reachable from home. | Passed; made these checks part of the release gate. |
| Structured data | Existing Article, BreadcrumbList, WebSite, Organization, and ItemList data is parsed and covered by rendered assertions for the applicable content. | Retained existing data; no invented credentials, prices, ratings, or article images. |
| Product rich results | USANA is a multi-product comparison. Its Product entries have no offers, aggregate ratings, or reviews. | Do not claim Product rich-result eligibility. Do not manufacture missing facts to satisfy a validator. |
| Social previews | Existing general pages use the shared image; guides deliberately omit decorative article images. | Preserved policy; audit verifies social metadata matches page metadata and referenced social assets resolve. |
| Errors and preview hosts | True 404 behavior and preview-host `noindex, nofollow` were already present. | Preserved and covered by integration tests. |
| Static rendering and assets | Existing checks cover prerendered HTML/RSC, responsive images, and emitted JS/CSS. | Preserved; no new dependencies or browser JavaScript. |
| Release coverage | Tests did not globally enforce title/description uniqueness, every internal target/fragment, or combined redirects/HEAD. | Added a reusable audit and focused regression cases to `npm run check`. |

Google treats redirects, canonical tags, and sitemap inclusion as canonicalization
signals. Aligning them is useful; it does not force Google's choice.
[Canonicalization documentation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

A single sitemap is sufficient for this inventory. Google ignores `priority` and
`changefreq`, and last-modified values should represent significant updates.
[Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Product snippets have eligibility requirements beyond valid JSON-LD syntax;
Google's guidance focuses on pages about a single product or its variants.
[Product snippet documentation](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).

## Reproducible verification

```bash
npm run check
npm run seo:audit
# Optional: inspect a local HTTP server with production canonical metadata.
npm run seo:audit -- http://localhost:3000
```

`npm run check` builds the application and runs the full rendered test suite,
including the audit against the built Worker. All 30 tests passed, alongside
responsive-image verification, lint, and typechecking. Static main-element HTML
was compared with a snapshot taken before this task's edits and was identical
on all 11 public pages and the 404.

`seo:audit` checks live HTTP responses without following redirects for canonical
resources, sitemap shape, robots, per-page metadata, structured-data JSON,
internal links, fragments, reachability, linked assets, social image assets, and
a true missing-page response. It fails on the first defect. Its XML checks target
this repository's generated format, not arbitrary XML. The live XML was also
independently checked with Python's standard `xml.etree.ElementTree` parser.

The sitemap body also matched when fetched using the audit user agent and a
Googlebot user-agent string. A spoofed user agent does not prove how Cloudflare
handles verified Googlebot IPs; Search Console and server-side observations are
needed for that conclusion. An earlier Python urllib probe received 403 while
curl and the Node audit succeeded, so do not generalize these probes into a claim
that every client or crawler is accepted.

## Limits and next production checkpoint

- No deployment or Search Console mutation was performed.
- No current Search Console account data was available beyond the screenshot.
  Actual article index status, selected canonicals, impressions, and sitemap
  processing state remain unverified.
- No field Core Web Vitals or browser performance benchmark was collected.
  Asset/render checks are not a substitute for those measurements.
- No external health-source link or content review was performed. This task
  deliberately makes no new health claims or substantive review-date changes.
- Local structured-data assertions are not an external Rich Results Test result.
  Article, breadcrumb, and product eligibility should be inspected with Google's
  validator against the intended release as described in the operations runbook.
- After deploying the verified change, run `npm run seo:audit` again and verify
  combined redirect/HEAD behavior at the edge. Then check the existing Sitemaps
  submission and representative HTML URLs in Search Console. The XML's Page
  Indexing exclusion by itself is not a reason to resubmit.
