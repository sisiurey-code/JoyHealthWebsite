# SEO release, measurement, and Search Console operations

This runbook defines how Joy Health verifies the public site, observes Google
Search, records evidence, and responds to SEO incidents. It does not choose
topics or change health claims. Topic selection, content briefs, source review,
internal linking, corrections, and content retirement live in
[`SEO_EDITORIAL.md`](SEO_EDITORIAL.md).

Joy Health has one canonical public origin, one public URL registry, one
sitemap, and one observable path from source publication through crawling and
index status. Repository checks establish what the site intends to publish.
Production checks establish what the origin currently serves. Google Search
Console reports what Google observed. None of those evidence layers substitutes
for another.

## Automated technical audit

Run `npm run seo:audit` to check the currently deployed canonical origin, or
`npm run seo:audit -- http://localhost:3000` against a local HTTP server. The
same audit runs against the built Worker inside `npm run check`, checking
sitemap structure, metadata uniqueness, canonicals, social metadata, internal
page/fragment links, reachability, linked assets, and 404 behavior. HTTP checks
fail rather than silently following a canonical resource through a redirect.
See [`SEO_AUDIT.md`](SEO_AUDIT.md) for the dated findings and validation limits.

## Answer engines and AI assistants

Assistants such as ChatGPT, Claude, Perplexity, and Google's AI features answer
from pages they retrieve, usually passage by passage. The site serves the same
content in forms those systems read cheaply, generated from the built pages so
they cannot drift:

| Surface | What it is | Indexing |
| --- | --- | --- |
| `/<path>.md` (home: `/index.md`) | Markdown twin of every sitemap page, with a front-matter block naming the canonical URL | `X-Robots-Tag: noindex`, so search indexes keep the HTML page |
| `Accept: text/markdown` on a canonical URL | The same twin, negotiated, with `Vary: Accept` | Never `noindex`: an indexer asking for Markdown must not drop the page |
| `/llms.txt` | Curated index of every page with its description ([llmstxt.org](https://llmstxt.org) format) | `noindex` |
| `/llms-full.txt` | Every page's Markdown in sitemap order | `noindex` |
| `/feed.xml` | RSS of dated guides and product pages, editorial dates only | Normal |
| `/data/supplement-labels.json`, `.csv` | Every transcribed label row, with daily amounts and upper limits (JSON), generated from `app/lib/supplement-labels.ts`; described by a `Dataset` on `/usana#label-data`; licensed CC BY 4.0 | Normal |
| `/robots.txt` | `Content-Signal: search=yes, ai-input=yes, ai-train=yes` ([contentsignals.org](https://contentsignals.org/)), the publisher's decision of 2026-09-24 | Normal |

`scripts/build-agent-files.mjs` writes the twins and both text files after
every `vinext build` (the `postbuild` script), rendering through the built
Worker. Never hand-edit them in `dist/`. Every page head links its twin and the
feed with `<link rel="alternate">`, the HTML response repeats the twin in a
`Link` header, and the release gate checks all of it. Markdown headings end in
`{#id}` (the HTML fragment), so an agent can cite one section as
`canonical#id`.

Structured data links each page to the entities it discusses: `about` and
`mentions` point at Wikidata items and English Wikipedia articles listed in
`app/lib/entities.ts` (`PAGE_TOPICS`). Add an entity only when the visible page
discusses it, and resolve new identifiers against the Wikidata API first.
Product pages describe a `WebPage` about a `DietarySupplement` whose
ingredients and directions come from the label records, with `citation`
entries that equal the visible source list; the creatine guide cites its
sources the same way. `DietarySupplement` is a schema.org subtype of `Product`,
and the pages state no price or rating, so Search Console may list them as
product snippets missing `offers`, `review`, or `aggregateRating`. That is
expected: do not add offers or ratings the page does not show.

The Worker adds an `ETag` to pages, twins, feeds, and data files and answers a
matching `If-None-Match` with `304`, so crawlers can recheck unchanged pages
cheaply.

Evidence that `llms.txt` changes how any assistant ranks or cites pages is
thin; treat it and the twins as low-cost conveniences for agents that fetch
pages, not as a ranking lever. What demonstrably matters is that crawlers can
fetch the HTML, that the search indexes assistants draw on contain the pages,
and that each page answers its question in a self-contained opening passage
with its sources. `npm run aeo:probe` is a rough local check of that last point:
it ranks the Markdown corpus with BM25 for a fixed set of reader questions and
reports whether the top passage contains the answer. It is a lexical proxy, not
a model of any assistant, so use it to catch regressions in answer-first copy,
not as a score to optimize.

Checks after a deploy:

```bash
curl -sI https://joyhealth.cc/nutrition/hydration.md | grep -iE 'content-type|x-robots-tag'
curl -s -H 'Accept: text/markdown' https://joyhealth.cc/nutrition/hydration | head -5
curl -s https://joyhealth.cc/llms.txt | head -12
curl -s -A 'Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)' -o /dev/null -w '%{http_code}\n' https://joyhealth.cc/
curl -s https://joyhealth.cc/robots.txt | grep Content-Signal
curl -s -o /dev/null -w '%{http_code}\n' -H "If-None-Match: $(curl -s -D - -o /dev/null https://joyhealth.cc/usana | grep -i '^etag' | cut -d' ' -f2 | tr -d '\r')" https://joyhealth.cc/usana
```

The last command should print `304`; Cloudflare may weaken the ETag when it
compresses a response, and the Worker compares tags weakly. HTML keeps its ETag
only because of the zone's Cache Rule "ETags" (expression: hostname equals
`joyhealth.cc`; action: eligible for cache, Respect strong ETags). Without that
rule, Cloudflare's HTML features, such as Email Obfuscation, Automatic HTTPS
Rewrites, Rocket Loader, Cloudflare Fonts, and Replace insecure JavaScript
libraries, drop the ETag from HTML while Markdown, text, and data files keep
theirs. The rule also turns off Rocket Loader, Email Obfuscation, and
Automatic HTTPS Rewrites for the hostname, whatever their zone toggles say, so
revisit it before publishing an email address on the site. On 2026-09-24 the
rule first used a full-URI wildcard of `joyhealth.cc` with no `*`, which
matched nothing; matching the hostname fixed it. If this check prints `200`,
confirm the rule still exists and matches.

Account-side steps that code cannot take (each needs the owner's decision):

- **Bing Webmaster Tools:** verify the site (it can import the Search Console
  property) and submit the sitemap. Bing's index feeds Copilot and has been
  among the search providers behind ChatGPT search.
- **IndexNow:** `public/<key>.txt` holds the site's IndexNow key (public by
  design). After a deploy that adds or substantively changes pages, preview
  with `npm run indexnow -- --since YYYY-MM-DD` (reads `lastmod` from the live
  sitemap) or `npm run indexnow -- /path ...`, then add `--submit`. Submit only
  added, updated, or deleted URLs. Cloudflare's Crawler Hints setting is an
  alternative that notifies IndexNow engines automatically; either is enough.
- **Cloudflare bot settings:** on 2026-09-23 every major AI crawler user agent
  received HTTP 200, and `robots.txt` is the site's own, not Cloudflare's
  managed version. Keep "Block AI bots" and AI Crawl Control blocking off if
  assistant visibility is the goal. Browser Integrity Check returns error 1010
  to the `Python-urllib` user agent, which some agent tools send; other HTTP
  clients were allowed.

A Page Indexing exclusion for `sitemap.xml` itself is different from an error
in the Sitemaps report. Evaluate XML processing in the Sitemaps report and
index inclusion on the HTML URLs. Do not try to get the XML document indexed
as a search result or repeatedly resubmit it to clear an indexing exclusion.

## Operating boundaries

- **Canonical origin:** `https://joyhealth.cc`
- **Public URL source of truth:** `INDEXABLE_PUBLICATIONS` in
  `app/lib/publications.ts`
- **Submitted sitemap:** `https://joyhealth.cc/sitemap.xml`
- **Release gate:** `npm run check`
- **Search performance source:** the Search Console property that covers the
  canonical origin
- **Privacy boundary:** do not commit verification tokens, account details,
  private screenshots, raw query exports, or other private Search Console data
- **Tracking boundary:** Search Console is sufficient for search operations.
  Adding on-site analytics or affiliate-event tracking requires a separate,
  explicit product and privacy decision.

The operator must never describe a live URL Inspection test as proof that a URL
is indexed. A successful test establishes current fetchability and indexing
eligibility only.

## Roles and access

Every active release period needs these roles. One person may hold more than one
role, but each responsibility must have an owner and backup.

| Role | Responsibility |
| --- | --- |
| Release operator | Runs the clean-checkout gate, deploys, and verifies production |
| Search Console owner | Confirms the property, records Google observations, and sets checkpoints |
| Editorial owner | Decides whether search observations warrant content review under `SEO_EDITORIAL.md` |

Keep personal account identifiers and access instructions outside the
repository. The operational log may use a role, team alias, or non-sensitive
owner name. If no owner or backup is available, record the gap; do not make an
unowned Search Console change.

## Evidence and success model

SEO operations use guardrails and trends, not a single score.

| Area | Evidence | Interpretation |
| --- | --- | --- |
| Release integrity | Clean build, tests, prerender manifest, deploy dry run | The repository can produce the intended static site |
| Production integrity | Status, content type, redirects, robots, sitemap, canonical pages | The canonical origin serves the intended site |
| Google accessibility | Live test, indexing allowed, selected canonical | Google can currently fetch and interpret the inspected URL |
| Index presence | Page Indexing and URL Inspection status | Google currently reports the canonical URL as indexed or excluded |
| Search reach | Impressions, queries, and pages with impressions | The site is appearing for search demand |
| Search engagement | Clicks and CTR by page and query | Searchers choose the result when it appears |
| Page experience | Search Console Core Web Vitals page groups | Real users receive acceptable loading, responsiveness, and stability |

Technical failures are incidents. Index inclusion, impressions, clicks, CTR,
and average position are observations rather than release service-level
objectives: Google controls indexing and result presentation, and new sites may
have too little data for meaningful comparisons.

Use average position only as a diagnostic alongside impressions, clicks, page,
query, country, device, and search type. It is not the north-star metric.

## Release procedure

### Before deployment

Run release validation from a clean checkout with Node.js 22.13 or newer:

```bash
npm ci
npm run check
npm run build
node -e "const fs=require('node:fs');const m=JSON.parse(fs.readFileSync('dist/server/vinext-prerender.json','utf8'));const pages=m.routes.filter(r=>r.reason!=='api');const bad=pages.filter(r=>r.status!=='rendered'||r.revalidate!==false);if(bad.length||pages.length!==21){console.error(bad);process.exit(1)}console.log('Verified 20 public routes plus the 404 as static artifacts; /feed.xml, /robots.txt, and /data/* are served by the Worker.')"
npx wrangler deploy --dry-run --config dist/server/wrangler.json
```

`npm run check` is the release gate. Its rendered integration tests verify:

- the exact, unique sitemap route set and truthful publication/review dates;
- a unique title, description, canonical URL, and H1 for every public page;
- canonical-host redirects, preview-host `noindex`, and a true 404;
- parseable structured data whose visible identity and dates agree with the
  sitemap;
- affiliate disclosures and `rel="sponsored"` beside affected links;
- public content in server-rendered HTML without depending on client-side
  JavaScript; and
- every public route and the 404 in Vinext's prerender manifest with matching
  HTML/RSC artifacts.

The explicit route count is a deliberate release tripwire. When a route is
intentionally added or retired, update the publication registry, rendered
integration tests, this command, and the expected production count in the same
review. Do not weaken the check to accept an unexplained route.

A publication or review date changes only after substantive review of the
underlying content and its sources. A build, formatting change, metadata-only
change, sitemap submission, or Search Console request is not an editorial
review.

### Deploy

Deploy only the commit that passed the clean-checkout gate. Record its full or
short Git commit in the operational log. If production cannot be tied to a
verified commit, stop and resolve release provenance before interpreting search
changes.

### After deployment: production transport

Run the following read-only checks against the exact production origin. These
checks verify transport and publication; they do not prove Google indexing.

#### Home, sitemap, and robots

```bash
curl -fsS -o /dev/null -w 'home status=%{http_code} type=%{content_type}\n' https://joyhealth.cc/
curl -fsS -o /dev/null -w 'sitemap status=%{http_code} type=%{content_type} redirects=%{num_redirects} final=%{url_effective}\n' https://joyhealth.cc/sitemap.xml
curl -fsS https://joyhealth.cc/robots.txt | grep -F 'Sitemap: https://joyhealth.cc/sitemap.xml'
```

Expected results:

- the home page returns `200` with an HTML content type;
- the sitemap returns `200`, `application/xml`, zero redirects, and the exact
  submitted URL; and
- `robots.txt` names the exact canonical sitemap.

#### XML validity

When `xmllint` is installed:

```bash
curl -fsS https://joyhealth.cc/sitemap.xml | xmllint --noout -
```

Node.js 22 can perform the required fixed-shape checks without another
dependency:

```bash
curl -fsS https://joyhealth.cc/sitemap.xml | node -e '
let xml = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { xml += chunk; });
process.stdin.on("end", () => {
  if (!/^<\?xml\s/.test(xml)) throw new Error("Missing XML declaration");
  if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(xml)) throw new Error("Wrong urlset namespace");
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!locations.length || new Set(locations).size !== locations.length) throw new Error("Missing or duplicate loc values");
  for (const location of locations) {
    const url = new URL(location);
    if (url.origin !== "https://joyhealth.cc") throw new Error(`Noncanonical URL: ${location}`);
  }
  console.log(`Verified ${locations.length} unique canonical sitemap URLs.`);
});
'
```

The expected count is 20. Investigate any other count against
`app/lib/publications.ts` and the rendered integration test before treating it
as intentional.

#### Every sitemap page

Verify that every submitted URL returns HTML and self-canonicalizes:

```bash
node --input-type=module -e '
const sitemapUrl = "https://joyhealth.cc/sitemap.xml";
const sitemapResponse = await fetch(sitemapUrl);
if (!sitemapResponse.ok) throw new Error(`Sitemap HTTP ${sitemapResponse.status}`);
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const url of urls) {
  const response = await fetch(url, { headers: { accept: "text/html" } });
  const html = await response.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const expected = new URL(url).toString().replace(/\/$/, "");
  const actual = canonical ? new URL(canonical).toString().replace(/\/$/, "") : "";
  if (response.status !== 200 || !/^text\/html\b/i.test(response.headers.get("content-type") ?? "") || actual !== expected) {
    throw new Error(`${url}: status=${response.status} canonical=${canonical ?? "missing"}`);
  }
  console.log(`ok ${url}`);
}
'
```

This is a live transport check, not a substitute for the richer rendered
integration tests.

#### Anonymous and Googlebot parity

```bash
joy_health_anonymous_hash=$(curl -fsS https://joyhealth.cc/sitemap.xml | sha256sum | cut -d' ' -f1)
joy_health_googlebot_hash=$(curl -fsS -A 'Googlebot' https://joyhealth.cc/sitemap.xml | sha256sum | cut -d' ' -f1)
test "$joy_health_anonymous_hash" = "$joy_health_googlebot_hash"
printf '%s\n' "$joy_health_anonymous_hash"
```

The comparison must exit zero. Do not special-case Googlebot or weaken the
anonymous response to make the hashes agree.

#### Redirect and error boundaries

```bash
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' http://joyhealth.cc/standards
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' 'https://www.joyhealth.cc/nutrition?source=www'
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://joyhealth.cc/nutrition/
curl -sS -o /dev/null -w '%{http_code}\n' https://joyhealth.cc/this-page-should-not-exist-seo-check
```

Expected results, in order:

```text
308 https://joyhealth.cc/standards
308 https://joyhealth.cc/nutrition?source=www
308 https://joyhealth.cc/nutrition
404
```

When an actual preview hostname is available, set it explicitly and confirm it
cannot be indexed:

```bash
joy_health_preview_url='https://REPLACE-WITH-THE-ACTUAL-PREVIEW-HOST/'
curl -fsSI "$joy_health_preview_url" | tr -d '\r' | grep -Fi 'X-Robots-Tag: noindex, nofollow'
```

Record this check as `not applicable: no preview hostname` when no preview
exists. Do not invent or probe hostnames. Do not require `CF-Cache-Status: HIT`;
the contract is successful build-time prerendering, not a particular edge-cache
state.

### Record the release

Create one operational-log entry containing the deployed commit, intended route
count, repository checks, production checks, exceptions, owner, and next UTC
checkpoint. A successful release with no Search Console change still receives
a short entry so production provenance remains reconstructable.

## Search Console operations

The following steps require a human with access to the correct Search Console
property. They are not repository automation.

### Property and sitemap discipline

1. Use the exact domain property or URL-prefix property that covers
   `https://joyhealth.cc`. Confirm the selected property before interpreting any
   report; HTTP, HTTPS, `www`, and non-`www` URL-prefix properties are distinct.
2. Keep one submitted sitemap:
   `https://joyhealth.cc/sitemap.xml`. Do not submit HTTP, `www`, renamed, or
   duplicate variants.
3. Never repeatedly resubmit a sitemap to clear a processing-state discrepancy.
   Resubmit only after fixing a concrete sitemap defect or confirming that the
   existing record used the wrong property or exact URL.

### New publication or substantive update

After deploying a new canonical URL or a substantive update:

1. Complete the production procedure above.
2. Inspect the exact canonical URL in Search Console.
3. Run one live test.
4. Request indexing once for the highest-priority changed URL. Let the sitemap
   remain the discovery mechanism for the complete route set.
5. Record these observations separately:

   - **Live test accessible:** whether Google can fetch the current response.
   - **Indexing allowed:** whether robots and `noindex` rules permit indexing.
   - **User-declared canonical:** the canonical emitted by Joy Health.
   - **Google-selected canonical:** the canonical Google reports for the URL.
   - **Indexed status:** whether the canonical URL is actually included in
     Google's index.
   - **Sitemap processing status:** whether the submitted sitemap was fetched
     and parsed successfully.

Never summarize those observations as `Google passed it`.

### Launch cadence

Until the Search Console owner records that launch state is stable, review once
per calendar week:

- Page Indexing;
- Sitemaps;
- Core Web Vitals;
- Manual Actions;
- Security Issues; and
- Search results performance, if enough data exists.

The owner defines stability in the operational log. At minimum, production
checks must remain clean, the intended sitemap must have a settled processing
state, and no unexplained indexing exclusion, manual action, security issue, or
poor Core Web Vitals group may remain open. After that, change to monthly
review. Return to weekly review after a route migration, material publishing
expansion, sustained unexplained search decline, manual action, security issue,
or Core Web Vitals regression.

### Search performance review

Use a 28-day period compared with the preceding 28 days unless a documented
event calls for a different window. Record the window and filters so the review
can be repeated.

Review:

- total clicks and impressions;
- CTR, interpreted with position and query mix;
- pages receiving impressions;
- queries and query themes, separated into branded and non-branded when the
  available data makes that distinction meaningful;
- search type, device, country, and search appearance when relevant;
- page-level gains or losses rather than only sitewide totals; and
- persistent title-link rewrites or snippet mismatch when enough impressions
  exist to show a pattern.

Search Console applies privacy filtering and aggregation, so visible query rows
will not necessarily reconcile to site totals. Do not treat missing low-volume
queries as zero demand. Do not use average position as a promise of where every
searcher saw a result.

Do not rewrite titles, descriptions, headings, or content from one or two
observations. When a sufficiently supported query-to-page or snippet issue
appears, send it to the editorial workflow in `SEO_EDITORIAL.md`. Search data
may identify a question or mismatch; it may not dictate a health conclusion.

### Core Web Vitals

Use Search Console Core Web Vitals as field evidence. Current good thresholds
at the 75th percentile are:

- Largest Contentful Paint: at or below 2.5 seconds;
- Interaction to Next Paint: below 200 milliseconds; and
- Cumulative Layout Shift: below 0.1.

Record the affected mobile or desktop page group, metric, status, and first
observation date. Use lab tools to reproduce and diagnose a problem, but do not
describe a Lighthouse or PageSpeed lab result as proof of field performance.
After a fix is deployed, verify production, start Search Console validation when
appropriate, and record the validation state without promising a completion
date.

## Decision matrix

| Observation | Required response |
| --- | --- |
| Production URL returns 4xx/5xx, wrong content type, wrong canonical, or unexpected `noindex` | Open a technical incident and fix the concrete production defect |
| Sitemap fails independent HTTP, content-type, XML, host, or parity checks | Classify and fix the defect, verify production, then resubmit once if needed |
| Independent sitemap checks pass but Search Console reports a processing error | Record exact error and UTC time; wait until the explicit checkpoint; do not change code or resubmit |
| Live test succeeds but URL is not indexed | Record eligibility, canonical, and exclusion state; inspect duplication or content fit; do not repeatedly request indexing |
| Google selects a different canonical | Compare rendered content, redirects, internal links, and sitemap entries before changing metadata |
| Impressions rise while clicks remain flat | Segment by page and query; consider title/snippet review only with a meaningful sample |
| One page appears for another page's intended query | Review query-to-page alignment under `SEO_EDITORIAL.md`; do not create a keyword variant automatically |
| Sitewide clicks or impressions decline | Separate technical/indexing failure, demand change, page-group change, and query change before editing content |
| A source or health recommendation changes | Start substantive editorial review; do not refresh dates before the review is complete |
| A Core Web Vitals page group becomes poor | Reproduce by page type and metric, fix the responsible regression, and validate after deployment |
| Manual Action or Security Issue appears | Escalate immediately; preserve the exact notice privately and do not make speculative bulk changes |

## Rollback and recovery

When a deployment introduces a production-integrity failure, restore the last
known-good verified commit through the normal Cloudflare deployment path or
ship a focused revert through the normal repository workflow. Do not edit DNS,
canonicals, robots rules, or sitemap membership as a speculative workaround for
an unrelated failure.

After recovery:

1. rerun every failed production check and the full redirect/error boundary;
2. confirm the restored production commit and intended route count;
3. inspect the affected canonical URL in Search Console only after production
   is stable;
4. record the failure window, recovery commit, checks, and next checkpoint; and
5. open editorial review as well when readers could have received materially
   incorrect health or product information.

A rollback restores production behavior; it does not erase Search Console
observations. Preserve the timeline and allow Google to recrawl the corrected
state without repeated indexing requests.

## Operational log template

Copy one entry for a release, material editorial review, changed Search Console
state, performance review, or incident resolution. Do not paste credentials,
verification tokens, personal account details, private query rows, screenshots
containing private data, or raw exports.

```text
Event type:
UTC date/time:
Observation window and filters (if applicable):
Release commit:
Public URLs changed:
Intended route set/count:
Repository checks run and result:
Production checks run and result:
Search Console property type confirmed:
Live test accessible:
Indexing allowed:
User-declared canonical:
Google-selected canonical:
Indexed status:
Sitemap processing status:
Core Web Vitals summary:
Search performance summary (sanitized aggregates only):
Search Console owner:
Editorial owner, if review is required:
Next checkpoint (explicit UTC date):
Resolution / next action:
```

Use `not checked`, `not applicable`, or `insufficient data` instead of leaving
ambiguous blanks.

## 2026-08-31 launch baseline

This is a historical observation, not a rolling status block. Add later events
as new operational-log entries rather than silently rewriting this baseline.

- **Release commit:** `4eae5fc`.
- **Production sitemap:** `https://joyhealth.cc/sitemap.xml` returned HTTP 200,
  `application/xml`, valid XML, no redirect, 11 unique canonical URLs, and
  identical bodies for anonymous and Googlebot requests.
- **Live inspection:** available URLs were reported accessible to Google and
  indexable in the operator's live tests.
- **Operator actions already taken:** indexing was requested for the available
  URLs and the exact XML sitemap was submitted once.
- **Sitemap processing observation:** the Search Console sitemap report then
  displayed `could not be read` even though the independent production checks
  passed.
- **Owner / next checkpoint:** the Search Console owner must record an explicit
  UTC checkpoint in the operational log; none is stored in this repository.
- **Next action:** wait for processing, then recheck the same submission at that
  recorded checkpoint. Do not repeatedly resubmit it.

## Escalation for the launch sitemap discrepancy

- If the sitemap report clears on its own, record the resolution. Make no code
  change and do not resubmit.
- If it still reports unreadable at the next recorded checkpoint, rerun every
  production transport, XML, all-page, and Googlebot-parity check above, then
  use live inspection on the exact submitted sitemap URL.
- If those checks still pass, keep the code unchanged. Record the exact Search
  Console error text and UTC observation time for support or later comparison.
- If a production check fails, open a new incident for the concrete failure.
  Classify it as DNS/TLS, redirect, 4xx/5xx, content type, malformed XML, bot
  blocking, canonical mismatch, or route-set corruption before editing source.
- Resubmit once only after a concrete sitemap defect was fixed or the existing
  Search Console record was shown to reference the wrong exact URL or property.

Do not promise a Google processing or indexing deadline. The Search Console
owner chooses and records explicit calendar checkpoints. While production
checks pass, a processing-state discrepancy is an observation to monitor, not a
reason to change the sitemap, robots rules, URLs, metadata, content, or Worker.

## Authoritative references

- [Google Search Console documentation](https://support.google.com/webmasters/)
- [Google: Search Console and analytics data for SEO](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console)
- [Google: debugging search traffic drops](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Sitemaps protocol](https://www.sitemaps.org/protocol.html)
