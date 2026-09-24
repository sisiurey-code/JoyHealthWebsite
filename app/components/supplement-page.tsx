import Link from "next/link";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { dailyTableRows, DailyAmountsTable } from "./daily-amounts-table";
import { Citation } from "./citation";
import { GuideContents } from "./guide-contents";
import { JsonLd } from "./json-ld";
import { SourceList, type Source } from "./source-list";
import { FDA_QUESTIONS, UL_DEFINITION } from "../lib/supplement-sources";
import { SupplementFactsTable } from "./supplement-facts-table";
import {
  formatEditorialDate,
  getGuide,
  type NutritionGuide,
} from "../lib/publications";
import { buildBreadcrumbJsonLd, buildSupplementJsonLd } from "../lib/seo";
import { LABEL_TRANSCRIBED_ON, PRODUCT_LABELS, type ProductLabel } from "../lib/supplement-labels";
import type { SupplementProduct } from "../lib/supplements";
import {
  responsiveProductSources,
  USANA_PRODUCT_IMAGES,
  USANA_STOREFRONT_URL,
} from "../lib/usana";

type GuideKey = Parameters<typeof getGuide>[0];

type CitationHost = ReactElement<{ children?: ReactNode; source?: number }>;

/** `Citation` numbers in a node, in document order. */
function citedIn(node: ReactNode): number[] {
  if (Array.isArray(node)) return node.flatMap(citedIn);
  if (!isValidElement(node)) return [];
  const element = node as CitationHost;
  if (element.type === Citation) return [element.props.source!];
  return citedIn(element.props.children);
}

/** Copies a node with every `Citation` renumbered. */
function renumberCitations(node: ReactNode, number: (source: number) => number): ReactNode {
  if (Array.isArray(node)) return node.map((child) => renumberCitations(child, number));
  if (!isValidElement(node)) return node;
  const element = node as CitationHost;
  if (element.type === Citation) return cloneElement(element, { source: number(element.props.source!) });
  if (element.props.children === undefined) return element;
  return cloneElement(element, { children: renumberCitations(element.props.children, number) });
}

const SECTIONS = [
  { id: "label-title", label: "The label" },
  { id: "daily-title", label: "Daily amounts" },
  { id: "testing-title", label: "Testing" },
  { id: "checks-title", label: "Before taking" },
  { id: "sources-title", label: "Sources" },
] as const;

// Two figures side by side at every width; each is at most 320px wide.
const imageSizes = "(max-width: 760px) 45vw, 320px";

type SupplementPageProps = Readonly<{
  product: SupplementProduct;
  /**
   * Sources this page cites. A `Citation` in the page's content gives the
   * 1-based position in this list; the page renumbers every source by first
   * appearance, so the order here only matters for uncited sources.
   */
  sources: readonly Source[];
  /** Inline answer-first summary; rendered as the page's first paragraph. */
  lede: ReactNode;
  labelNotes?: ReactNode;
  /** Label photos can lag the published label; omit them when they do. */
  showLabelImage?: boolean;
  dailyIntro: ReactNode;
  testing: ReactNode;
  /** List items of product-specific checks. */
  checks: ReactNode;
  relatedGuides: readonly GuideKey[];
}>;

/** Shared layout for `/supplements/*`: the label as text first, then context. */
export function SupplementPage({
  product,
  sources,
  lede,
  labelNotes,
  showLabelImage = true,
  dailyIntro,
  testing,
  checks,
  relatedGuides,
}: SupplementPageProps) {
  const label: ProductLabel = PRODUCT_LABELS[product.key];
  const images = USANA_PRODUCT_IMAGES[product.key];
  const limitSources = dailyTableRows(product.key).flatMap(({ limit }) =>
    limit ? [{ ...limit.source, note: "Used for the adult Tolerable Upper Intake Level and what it counts. Read September 23, 2026." }] : [],
  );
  // Sources are numbered by first appearance, top to bottom. Page citations
  // index `sources`; the layout's own citations (label, limits table, FDA)
  // are placed where they render. Uncited page sources go last.
  const pageUrl = (index: number) => {
    const source = sources[index - 1];
    if (!source) throw new Error(`${product.path}: citation ${index} has no source`);
    return source.url;
  };
  const appearance = [
    ...citedIn(lede).map(pageUrl),
    ...(label.labelSource ? [label.labelSource.url] : []),
    ...citedIn(labelNotes).map(pageUrl),
    ...citedIn(dailyIntro).map(pageUrl),
    ...limitSources.map(({ url }) => url),
    ...(limitSources.length ? [UL_DEFINITION.url] : []),
    ...citedIn(testing).map(pageUrl),
    ...citedIn(checks).map(pageUrl),
    FDA_QUESTIONS.url,
    ...sources.map(({ url }) => url),
  ];
  const byUrl = new Map<string, Source>(
    [...sources, ...limitSources, UL_DEFINITION, FDA_QUESTIONS].reverse().map((source) => [source.url, source]),
  );
  const allSources = [...new Set(appearance)].map((url) => byUrl.get(url)!);
  const citeFor = (url: string) => {
    const index = allSources.findIndex((source) => source.url === url);
    if (index < 0) throw new Error(`${product.path}: cited source missing from list: ${url}`);
    return index + 1;
  };
  const renumber = (node: ReactNode) => renumberCitations(node, (index) => citeFor(pageUrl(index)));
  const related = relatedGuides.map((key) => getGuide(key) as NutritionGuide);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Supplements", path: "/usana" },
    { name: product.name, path: product.path },
  ]);

  const supplementJsonLd = buildSupplementJsonLd(product, allSources);

  return (
    <main id="main-content">
      <article className="guide-article supplement-article">
        <header className="guide-intro">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/usana">Supplements</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
          <p className="eyebrow">USANA supplement label</p>
          <h1>{product.heading}</h1>
          <p className="guide-dek">{renumber(lede)}</p>
          <div className="guide-meta" role="group" aria-label="Page details">
            <p>Prepared by <strong>Joy Health</strong></p>
            <p>
              <time dateTime={product.datePublished}>
                {`Published ${formatEditorialDate(product.datePublished)}`}
              </time>
            </p>
            <p>
              Label checked{" "}
              <strong>
                <time dateTime={LABEL_TRANSCRIBED_ON}>
                  {formatEditorialDate(LABEL_TRANSCRIBED_ON)}
                </time>
              </strong>
            </p>
          </div>
        </header>

        <div className="supplement-figures">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.product.src}
              srcSet={responsiveProductSources(images.product)}
              sizes={imageSizes}
              alt={images.product.alt}
              width={images.product.width}
              height={images.product.height}
              decoding="async"
            />
          </figure>
          {showLabelImage ? (
            <figure>
              <a href={images.facts.src} aria-label={`Open the full-size label photo for ${product.name}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images.facts.src}
                  srcSet={responsiveProductSources(images.facts)}
                  sizes={imageSizes}
                  alt={images.facts.alt}
                  width={images.facts.width}
                  height={images.facts.height}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>Label photo. The table below is the same label as text.</figcaption>
            </figure>
          ) : null}
        </div>

        <GuideContents sections={SECTIONS} />

        <section className="guide-section" aria-labelledby="label-title">
          <h2 id="label-title">What is in {product.name}? The ingredient label, as text</h2>
          <div className="guide-copy">
            <p>
              {label.labelSource ? (
                <>
                  Joy Health transcribed every row below and checked it against
                  the U.S. label USANA publishes.
                  <Citation source={citeFor(label.labelSource.url)} />
                </>
              ) : (
                <>
                  Joy Health transcribed every row below from the package photo.
                  USANA had not published this label online when we checked.
                </>
              )}{" "}
              Amounts, units, and % Daily Values are exactly as printed.
              Formulas change, so compare the label on your own package.
            </p>
            {label.directions ? (
              <p>
                <strong>Directions on the label:</strong> {label.directions}
              </p>
            ) : null}
            {label.panels.map((panel) => (
              <SupplementFactsTable
                key={panel.name ?? panel.kind}
                panel={panel}
                productName={product.name}
              />
            ))}
            {label.otherIngredients.map(({ panel, text }) => (
              <p key={panel ?? "other"}>
                <strong>Other ingredients{panel ? ` (${panel})` : ""}:</strong> {text}
              </p>
            ))}
            {label.contains ? (
              <p>
                <strong>Contains:</strong> {label.contains}
              </p>
            ) : null}
            {renumber(labelNotes)}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="daily-title">
          <h2 id="daily-title">How much does {product.name} add up to in a day?</h2>
          <div className="guide-copy">
            {renumber(dailyIntro)}
            <DailyAmountsTable productKey={product.key} citeFor={citeFor} />
            {limitSources.length ? (
              <p className="facts-table-notes">
                {label.servingsPerDay
                  ? "Daily amounts multiply the label's per-serving amounts by the servings its directions call for."
                  : "The label does not say how many servings to take in a day, so its amounts are per serving."}{" "}
                Food, drinks, fortified foods, and other supplements add to
                these totals. A Tolerable Upper Intake Level (UL) is the highest
                daily intake likely to pose no risk of adverse effects for almost
                all healthy people in an age group. It is not a recommended
                intake.
                <Citation source={citeFor(UL_DEFINITION.url)} />
              </p>
            ) : null}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="testing-title">
          <h2 id="testing-title">Is {product.name} third-party tested?</h2>
          <div className="guide-copy">{renumber(testing)}</div>
        </section>

        <section className="guide-section" aria-labelledby="checks-title">
          <h2 id="checks-title">What to check before taking {product.name}</h2>
          <div className="guide-copy">
            <ul className="limit-list">{renumber(checks)}</ul>
            <p>
              FDA does not approve dietary supplements before they are sold,
              and it advises talking with a doctor, pharmacist, or other health
              professional before using one, because some supplements interact
              with medicines or other supplements.
              <Citation source={citeFor(FDA_QUESTIONS.url)} />
            </p>
          </div>
        </section>

        <div className="usana-product-conversion supplement-store">
          <p>
            <strong>Affiliate disclosure:</strong> Joy Health may earn a
            commission if you buy through this link. It opens USANA&apos;s
            storefront, where you can check the current label and price for{" "}
            {product.name}.
          </p>
          <a href={USANA_STOREFRONT_URL} rel="sponsored">
            See {product.name} on the USANA store <span aria-hidden="true">↗</span>
          </a>
        </div>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              Every source was read on September 23, 2026. Manufacturer
              documents are records of what the label says, not independent
              evidence that a product works.
            </p>
            <SourceList sources={allSources} />
          </div>
        </section>

        <nav className="related-guides" aria-labelledby="related-guides-title">
          <div>
            <p className="eyebrow">Keep reading</p>
            <h2 id="related-guides-title">Related guides</h2>
          </div>
          <ul>
            {related.map((guide) => (
              <li key={guide.path}>
                <p className="guide-topic">{guide.topic}</p>
                <h3>
                  <Link href={guide.path}>{guide.title}</Link>
                </h3>
                <p>{guide.summary}</p>
              </li>
            ))}
            <li>
              <p className="guide-topic">All products</p>
              <h3>
                <Link href="/usana#products">Compare every product on the shelf</Link>
              </h3>
              <p>Each product side by side, with testing records and where the labels overlap.</p>
            </li>
          </ul>
        </nav>

        <section className="guide-provenance" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About this page</p>
            <h2 id="about-title">Prepared by Joy Health</h2>
          </div>
          <div>
            <p>
              Joy Health is an educational publisher, not a medical practice.
              The label transcription and daily totals are Joy Health&apos;s
              work; the upper limits come from the National Academies as
              reported by NIH. No external clinical reviewer participated. Joy
              Health earns commissions on purchases made through the storefront
              link on this page.
            </p>
            <Link href="/standards">Read our editorial standards</Link>
          </div>
        </section>
        <aside className="medical-note" aria-label="Medical information notice">
          <strong>Medical information notice:</strong> Joy Health offers
          general education, not medical advice, diagnosis, or treatment. Seek
          qualified care for personal medical questions and urgent help for
          emergencies.
        </aside>
      </article>
      <JsonLd data={supplementJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
