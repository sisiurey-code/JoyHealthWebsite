# Content research and quality checks

Use these checks when writing or updating health information. They protect
accuracy, reader understanding, accessibility, and privacy. They do not prescribe
product direction, publishing volume, assigned roles, mandatory briefs, or a
review calendar.

Build and production verification, Search Console observations, and technical
diagnostics are in [SEO_OPERATIONS.md](SEO_OPERATIONS.md). Public editorial
standards are at `/standards`.

## Research and claims

Read the sources behind material health claims. Prefer sources suited to the
question: accountable public-health or medical institutions, systematic reviews,
evidence-based guidelines, and relevant primary studies. Manufacturer materials
can establish what a label says or what the company reports; they do not
independently verify efficacy.

For each material claim, retain enough context to explain:

- which source supports it and what was actually read;
- the population, product, exposure, comparator, and outcome studied;
- whether the finding is causal, associative, descriptive, or interpretive;
- limitations, uncertainty, and conflicts that affect its meaning; and
- where the page adds Joy Health interpretation.

Keep wording within the evidence. An association does not establish causation,
a preliminary finding is not settled, and quality certification does not prove
clinical benefit outside its scope. Correct or remove unsupported claims.
Name credentials and reviewers only when verified and actually involved.

## Planning a useful page

Useful prompts, rather than a mandatory form:

- What question will the page answer, and for whom?
- Would an existing page answer it better with an update?
- What sources, limitations, and commercial connections matter?
- What useful explanation, comparison, or reference will the page add?
- Which existing pages help readers discover it and continue reading?

Search queries can reveal reader language and questions. They do not establish
a health conclusion or justify stronger wording. Privacy-filtered Search Console
query rows do not represent every search. Keep raw exports and account details
out of the repository; use sanitized aggregates when they help the work.

## Page quality

Check that the finished page has:

- a clear purpose and distinct, useful content;
- a descriptive title, H1, and page-specific description;
- complete semantic HTML available without client-side JavaScript;
- a consistent canonical URL and sitemap entry;
- sources and limitations near the claims they qualify;
- truthful dates and provenance;
- visible commercial disclosures where relevant; and
- structured data that agrees with the visible content.

Use images, tables, and interactive tools when they help readers. Provide
meaningful alternative text and keep data understandable through HTML or
accompanying text. Avoid exaggerated titles and repetitive keyword variants.

## Links and commercial content

Make each page discoverable through crawlable internal links. Use descriptive
anchors and link to related material where it helps the reader. Update inbound
links when a page moves or is retired; relevance matters more than a link count.

Disclose affiliate relationships and mark compensated links with
`rel="sponsored"`. State selection criteria and tradeoffs for recommendations.
Keep claim strength independent of compensation, popularity, and traffic.
Distinguish a manufacturer's statement from independent evidence, and avoid
implying that testing or certification establishes a health benefit.

## Verification

Before considering content changes complete:

- compare material claims with the sources actually read;
- check that uncertainty, conflicts, and interpretations remain visible;
- align title, description, canonical, dates, structured data, and sitemap;
- check internal links and affiliate disclosures;
- verify readable content without client-side JavaScript; and
- run `npm run check`.

After a separately authorized deployment, use the production checks in
[SEO_OPERATIONS.md](SEO_OPERATIONS.md). A passing build or indexing request
does not establish scientific correctness or Google index inclusion.

## Updates, corrections, and dates

Change a substantive review date only after reviewing the affected content and
sources. Formatting, dependency updates, metadata edits, and indexing requests
are not substantive reviews. Keep visible dates, the publication registry,
Open Graph metadata, structured data, sitemap, and tests consistent.

For an error, check the cited evidence and related claims, correct misleading
information promptly, and explain material corrections visibly with a date.
Protect reporter privacy. Record what was reviewed and changed without silently
rewriting the meaning of the earlier account.

Recheck sources when evidence, guidance, a product label, certification, or a
source's availability changes. A link checker can identify failures; it cannot
establish whether the underlying claim remains valid. An elapsed reminder does
not justify advancing the public review date.

## Moving or retiring content

When a requested change moves or removes a page:

1. Use one permanent redirect when a true successor answers the same need.
2. Return a truthful 404 or 410 when there is no appropriate successor.
3. Update the registry, sitemap, navigation, internal links, and route tests
   together.
4. Preserve correction information needed to explain material health-content
   changes, and verify the resulting responses.

An unrelated homepage redirect hides a missing page. Reusing a canonical path
for a different subject can also mislead readers and search engines.

## Learning from search observations

Compare page and query observations with the page's actual purpose. Check
crawlability, Google's selected canonical, and the amount of available data
before changing titles or content. Keep `insufficient data` as a possible result;
search performance alone does not establish content quality or medical validity.

## References

- [Google: creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
