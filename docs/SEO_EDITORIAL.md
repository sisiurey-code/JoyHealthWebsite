# SEO-informed editorial operations

This document defines how Joy Health turns audience and search observations
into careful editorial decisions. It covers opportunity intake, query-to-page
alignment, content briefs, research, internal linking, publication, updates,
corrections, and retirement.

Release verification, production checks, Search Console procedures, metrics,
and incidents live in [`SEO_OPERATIONS.md`](SEO_OPERATIONS.md). The public
editorial promises remain visible at `/standards`, and repository-wide health
content rules are summarized in the public [editorial standards](/standards).

## Editorial boundary

Search data may reveal a question, vocabulary mismatch, or unmet reader need.
It may not determine a health conclusion, strengthen a claim beyond the
evidence, refresh a review date, or justify a near-duplicate page.

Joy Health publishes for readers first. SEO work must preserve these rules:

- Every material health claim traces to a source that was actually read.
- Source findings, Joy Health interpretation, and unresolved uncertainty remain
  distinguishable.
- General education never becomes individualized medical advice, diagnosis, or
  treatment.
- Credentials or expert review are named only when verified and genuinely
  involved.
- Compensation never buys an undisclosed placement, ranking, or conclusion.
- No page exists solely to target a keyword variant.
- Indexable content remains useful in semantic HTML without client-side
  JavaScript.

## Sources of editorial opportunity

An opportunity may enter the workflow from:

- a recurring reader question;
- a Search Console query theme or query-to-page mismatch;
- a gap exposed while researching an existing guide;
- a change in authoritative guidance, regulation, evidence, product formula, or
  label;
- a correction or source failure;
- an existing page that is incomplete for its stated reader outcome; or
- an original reference aid, comparison, or framework Joy Health can support
  more usefully than another summary page.

Keyword volume alone is not a sufficient reason to publish. Search Console
also applies privacy filtering, so missing visible query rows do not prove that
no reader need exists.

## Opportunity triage

Before research begins, assess the opportunity against every criterion below.
Use written reasoning rather than a numeric score that creates false precision.

| Criterion | Question |
| --- | --- |
| Audience need | Who needs this, and what should they be able to understand or do afterward? |
| Site fit | Does it strengthen Joy Health's existing nutrition, label, hydration, supplement, or evidence-literacy focus? |
| Existing coverage | Can an existing page satisfy the need through a substantive update? |
| Original contribution | What analysis, decision aid, comparison, or synthesis will be more useful than paraphrasing sources? |
| Evidence availability | Are appropriate primary studies, systematic reviews, and accountable institutions available? |
| Safety and uncertainty | Can the page preserve meaningful limits and avoid individualized advice? |
| Maintenance burden | Which sources or claims are likely to change, and can Joy Health review them responsibly? |
| Internal-link fit | Which existing pages lead into this question, and where should the completed page send the reader next? |
| Commercial conflict | Could compensation or a product relationship distort the topic, framing, placement, or conclusion? |

Reject or defer the opportunity when evidence is inadequate, the topic is
outside the site's focus, the only contribution is keyword targeting, or the
maintenance burden cannot be owned.

## Query-to-page alignment

Maintain one intended primary page for each distinct reader intent. The map may
live in an editorial working document or sanitized review log; do not commit raw
Search Console exports.

For each supported theme, record:

- the reader's question in plain language;
- the intended canonical page;
- the page's scope and non-scope;
- adjacent pages and how their intent differs;
- the observation window and filters, if Search Console informed the decision;
  and
- whether the action is `keep`, `update`, `consolidate`, `create`, `retire`, or
  `insufficient evidence`.

### Update an existing page when

- the new question is within its stated scope;
- the same reader would reasonably expect the answer there;
- adding the material improves completeness without obscuring the page's main
  purpose; and
- the evidence review can be performed for every affected claim.

### Create a new page when

- the reader outcome is materially different;
- the subject needs its own evidence set, limitations, or safety context;
- the existing page would become unfocused or unwieldy; and
- the new page contributes more than a keyword-specific restatement.

### Consolidate or retire when

- two pages answer the same intent without a defensible distinction;
- one page no longer has adequate evidence or an owner;
- a page is obsolete and a true successor exists; or
- keeping the page would mislead readers about current guidance.

Do not create a second page merely because Google displays an unexpected page
for a query. First inspect the query's likely intent, the selected canonical,
on-page scope, and internal links.

## Content brief

Complete this brief before drafting a new indexable health page or materially
expanding an existing one. `Not applicable` requires a short explanation.

```text
Working title:
Proposed canonical path:
New page or substantive update:
Editorial owner:
Intended audience:
Reader question:
Reader outcome:
In scope:
Explicitly out of scope:
Existing page closest to this intent:
Why that page should not absorb this work:
Observed query themes and evidence window, if applicable:
Original Joy Health contribution:
Candidate authoritative sources:
Material uncertainties and limitations:
Conflicts or commercial connections:
Qualified external review required or completed:
Planned contextual inbound links:
Planned contextual outbound links:
Proposed title:
Proposed H1:
Proposed description:
Structured-data type, if visibly supported:
Publication or modification date rule:
Future review triggers:
Earliest measurement checkpoint:
Decision: proceed / revise / defer / reject
Decision rationale:
```

The brief is a decision record, not a promise to publish. Research may reveal
that the page should narrow, merge into an existing guide, or stop.

## Research and claim discipline

### Source selection

Prefer, as appropriate to the question:

1. accountable public-health, regulatory, or medical institutions;
2. systematic reviews and evidence-based guidelines;
3. primary studies needed to understand the underlying evidence; and
4. manufacturer or company materials only for facts the organization can
   establish about itself, such as a current label, reported process, financial
   filing, or product announcement.

A source's authority is limited to what it can establish. A regulator's consumer
page may explain a rule but not prove a product outcome. A manufacturer can
describe its process but cannot independently verify its own efficacy claim.
A quality certification does not establish clinical benefit outside the
program's published scope.

### Claim record

For every material claim, preserve enough working context to answer:

- Which source supports it?
- Was the source actually read?
- What population, product, exposure, comparator, and outcome did it study or
  regulate?
- Is the statement causal, associative, descriptive, or interpretive?
- What limitation or conflict would change how a reasonable reader understands
  it?
- Is the wording Joy Health interpretation, and is that distinction visible?

Do not infer causation from association, generalize beyond the studied context,
or describe a preliminary result as settled. When evidence cannot support the
planned claim, change or remove the claim rather than searching for a weaker
source that agrees with it.

## Drafting and on-page package

Every indexable page needs:

- one clear reader purpose;
- a unique, descriptive title;
- one descriptive H1 that accurately represents the visible page;
- a page-specific description that summarizes rather than teases;
- one self-canonical URL;
- complete server-rendered main content;
- visible publication or substantive modification dates when used in metadata;
- sources, limitations, conflicts, and provenance appropriate to the claims;
- a general-education medical notice where health content requires it; and
- structured data only when the visible page genuinely satisfies that type.

Titles and headings may use the language readers use when it is accurate. Do
not force exact-match repetition, exaggeration, urgency, or certainty to chase a
query. Google may generate title links and snippets from multiple on-page
signals; a rewrite is an observation to investigate, not proof that the title
must change.

Images, tables, and decision aids should exist because they improve
understanding. Do not add generic decorative media solely to populate metadata.
Original visuals must have descriptive alternative text when they communicate
content, and complex data must remain understandable in HTML or accompanying
text.

## Internal linking

Internal links should form a useful knowledge path rather than a keyword grid.

- Every indexable page must have at least one crawlable inbound link from
  another public page.
- The nutrition hub remains the complete public guide inventory.
- Add contextual links where another guide answers the reader's next reasonable
  question.
- Use concise, descriptive anchor text that makes sense in its sentence.
- Prefer links inside relevant explanatory content over isolated lists.
- Do not enforce a minimum contextual-link count; relevance is an editorial
  decision.
- Do not add reciprocal links unless both directions help readers.
- Keep commercial and educational transitions explicit. Product content should
  point readers to the independent evaluation framework when relevant.
- Remove or update internal links in the same change that retires or redirects a
  canonical page.

Before publishing, read only the anchor text on the page. Each anchor should
still set a reasonable expectation for its destination without being stuffed
with variants.

## Commercial and affiliate content

Editorial usefulness and claim strength must remain independent of commercial
performance.

- State product selection criteria and tradeoffs before recommending.
- Place the material-connection disclosure next to every affected
  recommendation and link.
- Mark compensated or affiliate outbound links with `rel="sponsored"`.
- Use manufacturer sources only for claims they can establish and label that
  evidence role clearly.
- Do not imply that quality control, third-party listing, popularity, investment,
  or innovation proves efficacy.
- Do not let search demand or conversion performance produce a stronger health
  claim, hidden limitation, or undisclosed ranking.
- Review educational and commercial page performance separately. A commercial
  page's traffic does not set the editorial backlog by itself.

## Prepublication review

Before merging a new page or substantive update, confirm:

- the brief still matches the finished page;
- every material health claim maps to a source actually read;
- source findings and Joy Health interpretation are distinguishable;
- limitations and conflicts are visible near the claims they qualify;
- the title, H1, description, canonical, visible dates, Open Graph data,
  structured data, and sitemap entry agree;
- contextual internal links are useful and resolve to canonical routes;
- affected affiliate links have adjacent disclosure and `rel="sponsored"`;
- no unpublished or placeholder page is linked;
- the content remains useful without client-side JavaScript; and
- `npm run check` passes.

After deployment, follow the new-publication procedure in
`SEO_OPERATIONS.md`. A successful release or indexing request does not complete
editorial review.

## Updates, corrections, and review dates

### No date change

Do not change publication or modification dates for:

- spelling, punctuation, formatting, or style changes;
- refactoring or dependency updates;
- metadata-only changes that do not alter the substance;
- sitemap submission or indexing requests; or
- replacing a URL with an equivalent source location after confirming the
  underlying source is unchanged.

### Substantive update

A modification date may change only after reviewing the affected content and
underlying sources. Examples include:

- new or changed authoritative guidance;
- a materially revised evidence base;
- a product formula, label, certification, or regulatory change;
- a new limitation that changes interpretation;
- a correction that changes the meaning of a guide; or
- a substantial expansion that answers a new part of the reader's question.

Update every date surface together: the visible page, publication registry,
Open Graph metadata, structured data, sitemap, and tests. Record what was
reviewed and what changed.

### Correction protocol

1. Assess the possible error against the cited source and page scope.
2. Correct urgent safety or materially misleading information promptly.
3. If the correction changes meaning, add a visible dated correction note that
   states what changed without exposing private reporter information.
4. Review nearby claims that depend on the same evidence.
5. Update the modification date only after substantive review.
6. Record the correction and next review trigger.

Do not silently rewrite a material error or use a generic `updated` label that
conceals the correction.

## Source health and recurring review

At least quarterly, check whether cited sources are still reachable and whether
high-change authorities, regulations, product labels, and certifications have
materially changed. Automation may identify a redirect or failure, but a human
must determine whether the source and supported claim remain valid.

Each guide also needs explicit review triggers at publication. Examples include
a new edition of dietary guidance, a regulator changing label rules, a study
retraction, a product reformulation, or a certification listing change.

Schedule a substantive review of every health guide at least annually. If
capacity prevents a review by its checkpoint, mark it overdue and prioritize by
safety, likelihood of change, traffic, and commercial connection. Do not
advance the public review date merely because a calendar reminder fired or an
automated link check passed.

## Content retirement and redirects

Retirement is an editorial decision, not a way to hide weak performance.

1. Identify whether a true successor answers the same reader need.
2. Review inbound internal links and any material external references known to
   the operator.
3. If a true successor exists, use one permanent redirect to its canonical URL
   and update internal links.
4. If no successor exists, return a truthful 404 or 410 rather than redirecting
   to an unrelated hub or home page.
5. Remove the retired URL from `INDEXABLE_PUBLICATIONS`, the sitemap, navigation,
   internal links, and route tests in the same change.
6. Preserve any correction or retirement record needed to explain a material
   health-content change.
7. Verify production and observe the change through `SEO_OPERATIONS.md`.

Do not reuse an established canonical path for a materially different topic.

## Postpublication learning

At the explicit checkpoint recorded in `SEO_OPERATIONS.md`, assess:

- whether Google discovered and selected the intended canonical;
- which page and query themes received impressions;
- whether the observed intent matches the page's brief;
- whether readers would benefit from a clearer title, description, opening, or
  internal path;
- whether the page exposed a better follow-up question; and
- whether a source or limitation needs review.

Possible decisions are `keep`, `investigate`, `update`, `consolidate`, `create a
new brief`, or `insufficient data`. Preserve `insufficient data` as a legitimate
outcome. Do not publish more pages simply because the first page has not yet
earned impressions.

## Authoritative references

- [Google: creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
