import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { formatEditorialDate, PUBLICATIONS } from "../lib/publications";
import { ProductShelf } from "../components/product-shelf";
import { UsanaCatalogDock } from "../components/usana-catalog-dock";
import { UsanaProductCards } from "../components/usana-product-cards";
import { JsonLd } from "../components/json-ld";
import { LabelOverlapMatrix, overlapMatrixRows } from "../components/label-overlap-matrix";
import {
  buildLabelDatasetJsonLd,
  LABEL_DATA_CSV_PATH,
  LABEL_DATA_JSON_PATH,
  LABEL_DATA_LICENSE,
} from "../lib/label-dataset";
import { LABEL_TRANSCRIBED_ON } from "../lib/supplement-labels";
import {
  absoluteUrl,
  buildPageMetadata,
  buildProductListJsonLd,
  topicJsonLd,
  WEBSITE_ID,
} from "../lib/seo";
import { UL_DEFINITION } from "../lib/supplement-sources";
import { SUPPLEMENT_PRODUCTS } from "../lib/supplements";
import {
  USANA_BRAND_NAME,
  USANA_PRODUCT_CATALOG,
  USANA_PRODUCT_IMAGES,
  USANA_STOREFRONT_URL,
} from "../lib/usana";

const usana = PUBLICATIONS.usana;

export const metadata: Metadata = buildPageMetadata(PUBLICATIONS.usana);

const productListJsonLd = buildProductListJsonLd(
  "USANA supplements compared on Joy Health",
  USANA_BRAND_NAME,
  USANA_PRODUCT_CATALOG.map((product) => ({
    name: product.name,
    description: product.description,
    imagePath: USANA_PRODUCT_IMAGES[product.key].product.src,
    path: SUPPLEMENT_PRODUCTS.find(({ key }) => key === product.key)!.path,
  })),
);

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${absoluteUrl(usana.path)}#webpage`,
  url: absoluteUrl(usana.path),
  name: usana.title,
  description: usana.description,
  isPartOf: { "@id": WEBSITE_ID },
  inLanguage: "en-US",
  dateModified: usana.dateModified,
  ...topicJsonLd(usana.key),
};

const datasetJsonLd = buildLabelDatasetJsonLd();

/**
 * The source list is numbered by first appearance, top to bottom. The
 * hand-numbered entries (1–10) come before the overlap table; the table's
 * sources and the sources cited after it are numbered from data, so the
 * numbers cannot drift when the table changes.
 */
const FIRST_OVERLAP_SOURCE = 11;
const OVERLAP_ROWS = overlapMatrixRows();
const OVERLAP_NOTES: Readonly<Record<string, string>> = {
  "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/":
    "Used for the supplemental magnesium upper limit and what it counts. Read September 23, 2026.",
  "https://ods.od.nih.gov/factsheets/Niacin-HealthProfessional/":
    "Used for the niacin upper limit and its basis in skin flushing. Read September 23, 2026.",
};
const overlapSources = [
  UL_DEFINITION,
  ...OVERLAP_ROWS.map(({ limit }) => ({
    ...limit.source,
    note:
      OVERLAP_NOTES[limit.source.url] ??
      "Used for the adult upper limit and what it counts. Read September 23, 2026.",
  })),
].filter((source, index, list) => list.findIndex(({ url }) => url === source.url) === index);

const CLEAR_PROTEIN_DRINK_LISTING = {
  title: "Buy Nutritionals, USANA Clear Protein Drink listing",
  url: "https://www.buynutritionals.com/usana-clear-protein-drink",
  note: "Authorized independent distributor listing used for the current flavor, package quantity, protein amount, calories, sugar claim, and noncarbonated ready-to-drink format. Read August 30, 2026.",
} as const;

const FDA_SUPPLEMENT_QA = {
  title: "U.S. Food and Drug Administration, Questions and Answers on Dietary Supplements",
  url: "https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements",
  note: "Regulatory context for manufacturing practices, premarket approval, labeling, and consumer safety. Read August 30, 2026.",
} as const;

/** Sources cited after the overlap table, in order of appearance; uncited last. */
const laterSources = [
  CLEAR_PROTEIN_DRINK_LISTING,
  FDA_SUPPLEMENT_QA,
  {
    title: "NSF/ANSI 173-2025, Dietary Supplements",
    url: "https://standards.nsf.org/discussion/nsfansi-173-2025-dietary-supplements-uploaded",
    note: "Official standards-development record describing the standard's scope and evaluation criteria. Read August 29, 2026.",
  },
] as const;
const FIRST_LATER_SOURCE = FIRST_OVERLAP_SOURCE + overlapSources.length;

function citationLink(number: number) {
  return (
    <a className="citation" href={`#usana-source-${number}`} aria-label={`Source ${number}`}>
      [{number}]
    </a>
  );
}

function overlapCite(url: string) {
  const index = overlapSources.findIndex((source) => source.url === url);
  if (index < 0) throw new Error(`/usana: overlap source missing: ${url}`);
  return citationLink(FIRST_OVERLAP_SOURCE + index);
}

function laterCite(url: string) {
  const index = laterSources.findIndex((source) => source.url === url);
  if (index < 0) throw new Error(`/usana: later source missing: ${url}`);
  return citationLink(FIRST_LATER_SOURCE + index);
}

export default function UsanaPage() {
  return (
    <div className="page-shell usana-shell">
      <SiteHeader active="usana" />

      <main id="main-content">
        <section className="usana-hero" aria-labelledby="usana-title">
          <div className="usana-hero-inner content-shell">
            <div className="usana-hero-copy">
              <p className="eyebrow">Supplement guide</p>
              <h1 id="usana-title">
                USANA supplements, compared label by label.
              </h1>
              <p>
                Compare CellSentials, HealthPak, and six focused formulas by
                their Supplement Facts labels, see which third-party testing
                claims are independently verified, and keep the ingredient
                overlap and limits in view before you choose.
              </p>
              <div className="usana-hero-actions">
                <a
                  className="usana-products-link"
                  href={USANA_STOREFRONT_URL}
                  rel="sponsored"
                  aria-describedby="usana-hero-store-disclosure"
                >
                  Shop USANA <span aria-hidden="true">↗</span>
                </a>
                <Link href="#products">
                  Compare the products
                </Link>
                <Link href="/nutrition/supplement-evidence-and-safety">
                  Read the supplement evidence guide
                </Link>
              </div>
              <p className="usana-hero-affiliate-note" id="usana-hero-store-disclosure">
                The products on this page are made by USANA. Storefront links
                are affiliate links: Joy Health may earn a commission, and our
                evidence standards do not change.
              </p>
            </div>

            <ProductShelf
              caption="A few of the products reviewed below. The storefront carries the full catalog."
            />
          </div>
        </section>

        <section className="usana-signal-band" aria-label="Manufacturer evidence signals">
          <dl className="content-shell">
            <div>
              <dt>67%</dt>
              <dd>
                of product sales tied to products whose manufacturing,
                production, and quality control USANA reports operating in-house
                <a className="citation" href="#usana-source-1" aria-label="Source 1">
                  [1]
                </a>
              </dd>
            </div>
            <div>
              <dt>11</dt>
              <dd>
                finished products in the current NSF/ANSI 173 official listing
                <a className="citation" href="#usana-source-2" aria-label="Source 2">
                  [2]
                </a>
              </dd>
            </div>
            <div>
              <dt>$10.7M</dt>
              <dd>
                invested in research and development in 2025, according to
                USANA&apos;s sustainability reporting
                <a className="citation" href="#usana-source-3" aria-label="Source 3">
                  [3]
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="usana-products content-shell"
          id="products"
          aria-labelledby="products-title"
        >
          <header className="usana-products-heading">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="products-title">Each USANA product, with its Supplement Facts label.</h2>
            </div>
            <div>
              <p>
                The flagships come first, then the focused formulas that are
                easier to compare. Tap or click a card to flip between the
                product and its Supplement Facts label. The order is ours, not
                the manufacturer&apos;s.
              </p>
              <div className="usana-products-criteria">
                <p className="usana-products-criteria-label">Product selection criteria</p>
                <ul aria-label="Product selection criteria">
                  <li>Clear purpose in the catalog</li>
                  <li>Current formula information</li>
                  <li>Cost and ingredient overlap</li>
                </ul>
              </div>
            </div>
          </header>

          <UsanaProductCards />

          <div className="usana-product-conversion">
            <p>
              <strong>Affiliate disclosure:</strong> Joy Health may earn a
              commission if you buy through this link. Start with the current
              label and avoid paying twice for overlapping ingredients.
            </p>
            <a href={USANA_STOREFRONT_URL} rel="sponsored">
              See prices and current formulas <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="usana-overlap content-shell" id="overlap" aria-labelledby="overlap-title">
          <header className="usana-section-heading">
            <p className="eyebrow">Label overlap</p>
            <h2 id="overlap-title">Where the labels overlap, and the upper limits</h2>
            <p>
              Several of these products repeat the same nutrients. The table
              shows each product&apos;s daily amount at its label directions
              next to the adult Tolerable Upper Intake Level (UL), the highest
              daily intake likely to pose no risk of adverse effects for almost
              all healthy adults. A UL is not a target.
              {overlapCite(UL_DEFINITION.url)} HealthPak repeats
              CellSentials&apos; vitamins and minerals, so read those two
              columns as alternatives rather than a stack.
            </p>
          </header>
          <LabelOverlapMatrix cite={overlapCite} />
          <p className="usana-overlap-note">
            Three amounts stand out. MagneCal D (520 mg) and HealthPak (486 mg)
            each exceed, on their own, the 350 mg upper limit for magnesium
            from supplements, and CellSentials and HealthPak each provide 40 mg
            of niacin against a 35 mg limit that is based on skin flushing.
            {overlapCite("https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/")}
            {overlapCite("https://ods.od.nih.gov/factsheets/Niacin-HealthProfessional/")}{" "}
            Combinations add up quickly: CellSentials with MagneCal D, both at
            their label directions, comes to 746 mg of supplemental magnesium a
            day. Food, fortified foods, and other supplements add to every
            total.
          </p>
          <p className="usana-overlap-note">
            Food changes the picture differently for the two nutrients. Most
            U.S. adults already get more niacin from food than recommended,
            while many get less magnesium than recommended, and neither upper
            limit counts what food provides.
            {overlapCite("https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/")}
            {overlapCite("https://ods.od.nih.gov/factsheets/Niacin-HealthProfessional/")}{" "}
            <strong>Joy Health interpretation:</strong> label directions are
            the manufacturer&apos;s, not a minimum. One serving a day of
            CellSentials, HealthPak, or MagneCal D, each on its own, stays under
            both limits, which is a reasonable option for someone whose diet
            already covers much of what the supplement adds.
            Each product&apos;s page has its full label as text and what to
            check before taking it.
          </p>
          <div className="usana-overlap-note">
            <h3 id="label-data">Download the label data</h3>
            <p>
              Every label row on the product pages, with the daily amounts and
              upper limits in this table, is available as{" "}
              <a href={LABEL_DATA_JSON_PATH}>JSON</a> and{" "}
              <a href={LABEL_DATA_CSV_PATH}>CSV</a>. The files are generated
              from the same transcription the pages use, checked{" "}
              <time dateTime={LABEL_TRANSCRIBED_ON}>
                {formatEditorialDate(LABEL_TRANSCRIBED_ON)}
              </time>
              , so they always match what the pages show. Amounts are as
              printed; the label discrepancies we found are described on each
              product page. The files are licensed{" "}
              <a href={LABEL_DATA_LICENSE} rel="license">CC BY 4.0</a>: reuse
              them freely, crediting Joy Health with a link to this page.
            </p>
          </div>
        </section>

        <section className="usana-quality content-shell" id="quality" aria-labelledby="quality-title">
          <header className="usana-section-heading">
            <p className="eyebrow">Quality evidence</p>
            <h2 id="quality-title">Is USANA third-party tested?</h2>
            <p>
              NSF&apos;s official listing names 11 finished products. That is
              individual product evidence, rather than a brand-wide conclusion. Manufacturing
              control and company investment answer different quality questions.
            </p>
          </header>

          <div className="usana-quality-grid">
            <article>
              <span aria-hidden="true">01</span>
              <h3>Manufacturing control</h3>
              <p>
                USANA says it conducts manufacturing, production, and quality
                control for roughly two-thirds of its nutritional products at
                its Salt Lake City facility. Keeping those operations in-house
                can make process ownership and corrective action more direct.
                <a className="citation" href="#usana-source-1" aria-label="Source 1">
                  [1]
                </a>
              </p>
              <p className="usana-interpretation">
                <strong>Joy Health interpretation:</strong> In-house control can
                make accountability for production and corrective action more
                direct. It does not prove that every product is superior or
                appropriate for every person.
              </p>
            </article>

            <article>
              <span aria-hidden="true">02</span>
              <h3>Finished-product verification</h3>
              <p>
                NSF&apos;s official listing identifies 11 USANA finished products
                under{` `}
                <a href="https://standards.nsf.org/discussion/nsfansi-173-2025-dietary-supplements-uploaded">
                  NSF/ANSI 173
                </a>
                , including HealthPak, CellSentials Core Minerals, CellSentials
                Vita-Antioxidant, Procosa, BiOmega, and MagneCal D.
                <a className="citation" href="#usana-source-2" aria-label="Source 2">
                  [2]
                </a>
              </p>
              <p className="usana-interpretation">
                <strong>Joy Health interpretation:</strong> A listing applies to
                the named products and certification scope. It should not be
                generalized to every item in the catalog.
              </p>
            </article>

            <article>
              <span aria-hidden="true">03</span>
              <h3>Quality systems investment</h3>
              <p>
                USANA reports that every employee required to receive current
                good manufacturing practices training was current in 2025. The
                same report states that 15 new products launched that year.
                <a className="citation" href="#usana-source-3" aria-label="Source 3">
                  [3]
                </a>
              </p>
              <p className="usana-interpretation">
                <strong>Joy Health interpretation:</strong> Training and launches
                indicate organizational activity. The figures are
                company-reported and do not establish a clinical outcome.
              </p>
            </article>
          </div>
        </section>

        <section className="usana-innovation" aria-labelledby="innovation-title">
          <div className="usana-innovation-inner content-shell">
            <div>
              <p className="eyebrow">Recent changes</p>
              <h2 id="innovation-title">Recent formula changes and launches.</h2>
              <dl className="usana-innovation-ledger">
                <div><dt>2025</dt><dd>major nutritionals refresh</dd></div>
                <div><dt>2026</dt><dd>new active-nutrition formats</dd></div>
                <div><dt>Current catalog</dt><dd>supplements, nutritionals, and skincare</dd></div>
              </dl>
            </div>
            <div className="usana-innovation-copy">
              <p>
                USANA&apos;s 2025 reporting describes research spanning human
                nutrition, cellular biology, biochemistry, genetics, the
                microbiome, natural-product chemistry, and clinical research.
                Its stated work includes new products, reformulations, and
                adaptations for different regulatory markets.
                <a className="citation" href="#usana-source-1" aria-label="Source 1">
                  [1]
                </a>
              </p>
              <div className="usana-innovation-example">
                <p className="eyebrow">2025 formulation update</p>
                <h3>CellSentials was reformulated in 2025.</h3>
                <p>
                  A company announcement records the addition of PQQ to the
                  InCelligence Complex and the launch of Core Aminos and
                  Circulate+ alongside other portfolio updates.
                  <a className="citation" href="#usana-source-10" aria-label="Source 10">
                    [10]
                  </a>
                </p>
              </div>
              <p className="usana-interpretation">
                The announcement confirms a new version of CellSentials. It does not prove
                the newer version improves health outcomes; that question depends on the
                ingredient, amount, and evidence for the intended use.
              </p>

              <div className="usana-innovation-timeline" aria-label="Recent USANA product development">
                <article>
                  <span>01 · Foundation</span>
                  <h3>Four established products changed in 2025.</h3>
                  <p>
                    USANA&apos;s 2025 announcements named updates to
                    CellSentials, HealthPak, BiOmega, and Proflavanol alongside
                    launches including Core Aminos, Marine Collagen Peptides,
                    and Circulate+.
                    <a className="citation" href="#usana-source-10" aria-label="Source 10">[10]</a>
                  </p>
                </article>
                <article>
                  <span>02 · New format</span>
                  <h3>Clear Protein + Creatine Mix puts protein, creatine, and electrolytes in one glass.</h3>
                  <p>
                    The August 2026 launch combines 10 grams of clear whey
                    protein, 5 grams of creatine monohydrate, and more than 600
                    milligrams of electrolytes per serving. The combination can
                    save time, space, and steps for someone already using all three.
                    <a className="citation" href="#usana-source-9" aria-label="Source 9">[9]</a>
                  </p>
                </article>
                <article>
                  <span>03 · Ready to drink</span>
                  <h3>Clear Protein Drink is ready-to-drink clear whey.</h3>
                  <p>
                    Each piña colada can contains 22 grams of clear whey protein
                    isolate, zero sugar, and 90 calories. It is noncarbonated and
                    sold in 12-packs. We like it cold when a powder and shaker
                    bottle would be more trouble than they are worth.
                    {laterCite(CLEAR_PROTEIN_DRINK_LISTING.url)}
                  </p>
                </article>
              </div>

              <div className="usana-innovation-conversion">
                <p>
                  The button opens the manufacturer&apos;s storefront. Check the
                  serving size, Supplement Facts, and specific ingredients before
                  choosing.
                </p>
                <a href={USANA_STOREFRONT_URL} rel="sponsored">
                  See what is available now <span aria-hidden="true">↗</span>
                </a>
                <small>
                  Affiliate link. Joy Health may earn a commission; our evidence
                  standards do not change.
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="usana-limits content-shell" aria-labelledby="limits-title">
          <div>
            <p className="eyebrow">Limits</p>
            <h2 id="limits-title">Quality is not the same question as efficacy.</h2>
          </div>
          <div>
            <p>
              FDA requires dietary-supplement manufacturers to follow current
              good manufacturing practices, but it does not approve dietary
              supplements before marketing. FDA also advises discussing
              supplement use with a doctor, pharmacist, or other health
              professional because products can interact with medicines or
              other supplements.
              {laterCite(FDA_SUPPLEMENT_QA.url)}
            </p>
            <ul aria-label="Three supplement verification checks">
              <li>
                <details>
                  <summary>Verify the exact product and current label.</summary>
                  <div className="usana-limit-detail">
                    <p>
                      <strong>Start online:</strong> confirm the product name,
                      country or market, serving size, active amounts, other
                      ingredients, allergens, directions, and warnings on the
                      current product page.
                    </p>
                    <p>
                      <strong>Check again in hand:</strong> compare those details
                      with the package that arrives. Formulas and package sizes
                      can change, and labels can differ between markets.
                    </p>
                    <p className="usana-limit-result">
                      This verifies which formula you are evaluating. It does not
                      establish that the formula works for a particular purpose.
                    </p>
                  </div>
                </details>
              </li>
              <li>
                <details>
                  <summary>
                    Match the ingredient, form, amount, and intended use to the evidence.
                  </summary>
                  <div className="usana-limit-detail">
                    <p>
                      <strong>Write down the comparison:</strong> exact ingredient,
                      chemical form when relevant, daily amount, study population,
                      duration, and measured outcome. A shared ingredient name is
                      not enough when the amount or intended use differs.
                    </p>
                    <p>
                      <strong>Prefer the closest match:</strong> give more weight to
                      evidence that resembles the product and purpose you are
                      assessing. Treat company announcements as formula records,
                      not independent efficacy evidence.
                    </p>
                    <p className="usana-limit-result">
                      <Link href="/nutrition/supplement-evidence-and-safety">
                        Use the supplement evidence guide
                      </Link>{" "}
                      for a fuller comparison method.
                    </p>
                  </div>
                </details>
              </li>
              <li>
                <details>
                  <summary>
                    Keep personal safety and medication questions separate from brand quality.
                  </summary>
                  <div className="usana-limit-detail">
                    <p>
                      <strong>Prepare one complete list:</strong> include medicines,
                      supplements, amounts, timing, allergies, and relevant health
                      conditions. Bring the list and the current product label to
                      a doctor or pharmacist before adding the product.
                    </p>
                    <p>
                      <strong>Ask about the formula:</strong> brand reputation and
                      manufacturing controls do not answer questions about
                      interactions, ingredient overlap, or whether the product is
                      appropriate for one person.
                    </p>
                    <p className="usana-limit-result">
                      The FDA recommends discussing supplement use with a health
                      professional because medicines and supplements can interact.
                      {laterCite(FDA_SUPPLEMENT_QA.url)}
                    </p>
                  </div>
                </details>
              </li>
            </ul>
          </div>
        </section>

        <UsanaCatalogDock />

        <section className="usana-sources content-shell" aria-labelledby="usana-sources-title">
          <header>
            <p className="eyebrow">Sources</p>
            <h2 id="usana-sources-title">Sources we read.</h2>
            <p>
              Updated <time dateTime={usana.dateModified}>
                {formatEditorialDate(usana.dateModified)}
              </time> after rechecking NSF&apos;s official listing and adding the
              label overlap table. Other source read dates are stated below.
            </p>
          </header>
          <ol className="source-list usana-source-list">
            <li id="usana-source-1">
              <a href="https://ir.usana.com/company-information">
                USANA Health Sciences, Company Information
              </a>
              <p>
                Company-reported manufacturing share, R&amp;D scope, scientific
                disciplines, and product-development approach. Read August 29
                and re-read August 31, 2026.
              </p>
            </li>
            <li id="usana-source-2">
              <a href="https://info.nsf.org/Certified/Dietary/Listings.asp?CompanyName=usana&amp;StandardExt=FP">
                NSF Official Listings, USANA finished products under NSF/ANSI 173
              </a>
              <p>
                Independent listing record naming the facility, certification
                standard, finished products, and each product&apos;s recommended
                daily serving. Read August 29 and August 31, 2026, when it named
                12 finished products, and re-read September 23, 2026, when it
                named 11; the counts on this page were corrected in the September 24,
                2026 update.
              </p>
            </li>
            <li id="usana-source-3">
              <a href="https://ir.usana.com/sustainability">
                USANA Health Sciences, 2025 Sustainability Highlights
              </a>
              <p>
                Company-reported R&amp;D investment, product launches, and GMP
                training completion. Read August 29, 2026.
              </p>
            </li>
            <li id="usana-source-4">
              <a href="https://ir.usana.com/sec-filings/all-sec-filings/content/0000896264-26-000056/usna-20260704.htm">
                USANA Health Sciences, 2026 second-quarter filing
              </a>
              <p>
                Current company filing used for product-line mix,
                Essentials/CellSentials sales context, and company reporting.
                Read August 29, 2026.
              </p>
            </li>
            <li id="usana-source-5">
              <a href="https://ir.usana.com/news-events/press-releases/detail/820/tested-trusted-approved-usana-cellsentials-earns">
                USANA Health Sciences, 2026 CellSentials ConsumerLab announcement
              </a>
              <p>
                Company announcement describing the reported testing scope and
                current formulation. ConsumerLab&apos;s underlying report was not
                available in the source reviewed here. Read August 29, 2026.
              </p>
            </li>
            <li id="usana-source-6">
              <a href="https://askthescientists.com/qa/usana-products/">
                Ask The Scientists, USANA product overview
              </a>
              <p>
                USANA-owned product reference used for the catalog roles and
                ingredient summaries for HealthPak, Procosa, and BiOmega. It is
                product information, not independent efficacy evidence. Read
                August 29, 2026.
              </p>
            </li>
            <li id="usana-source-7">
              <a href="https://ir.usana.com/news-events/press-releases/detail/805/proven-power-for-strong-bone-support--usanas-magnecal-d">
                USANA Health Sciences, 2025 MagneCal D ConsumerLab announcement
              </a>
              <p>
                Company announcement describing ingredients and the reported
                purity, potency, label-accuracy, and disintegration checks.
                Read August 29, 2026.
              </p>
            </li>
            <li id="usana-source-8">
              <a href="https://www.usana.com/content/96e011a2-a52a-4880-8f05-d3505154462f.pdf">
                USANA, U.S. CoQuinone 30 Supplement Facts
              </a>
              <p>
                Product label used for active ingredients, other ingredients,
                allergens, and the absence of established Daily Values. Read
                August 29, 2026.
              </p>
            </li>
            <li id="usana-source-9">
              <a href="https://ir.usana.com/news-events/press-releases/detail/841/usana-introduces-3-in-1-protein-creatine-and-electrolyte">
                USANA Health Sciences, 2026 Clear Protein + Creatine Mix announcement
              </a>
              <p>
                Company announcement used for the launch date, format, serving
                amounts, flavors, and manufacturing statement. It is not
                comparative clinical evidence. Read August 30, 2026.
              </p>
            </li>
            <li id="usana-source-10">
              <a href="https://ir.usana.com/news-events/press-releases/detail/795/usana-expands-its-nutritionals-line-with-powerful-new">
                USANA Health Sciences, 2025 Nutritionals Portfolio Announcement
              </a>
              <p>
                Company announcement used for the Core Aminos format and
                ingredients, plus named formulation changes and launches. It is
                not independent efficacy evidence. Read August 30, 2026.
              </p>
            </li>
            {overlapSources.map((source, index) => (
              <li id={`usana-source-${FIRST_OVERLAP_SOURCE + index}`} key={source.url}>
                <a href={source.url}>{source.title}</a>
                <p>
                  {source.publisher}. {source.note}
                </p>
              </li>
            ))}
            {laterSources.map((source, index) => (
              <li id={`usana-source-${FIRST_LATER_SOURCE + index}`} key={source.url}>
                <a href={source.url}>{source.title}</a>
                <p>{source.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <SiteFooter />
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={productListJsonLd} />
      <JsonLd data={datasetJsonLd} />
    </div>
  );
}
