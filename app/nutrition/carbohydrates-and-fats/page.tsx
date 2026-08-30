import type { Metadata } from "next";
import Link from "next/link";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import { buildBreadcrumbJsonLd } from "../../lib/seo";

const title = "Carbohydrates and fats: types, sources, and tradeoffs";
const description =
  "A practical guide to carbohydrate and fat categories, Nutrition Facts fields, food sources, and why replacement context matters.";
const canonicalUrl =
  "https://joyhealth.cc/nutrition/carbohydrates-and-fats";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nutrition/carbohydrates-and-fats" },
  openGraph: {
    type: "article",
    url: "/nutrition/carbohydrates-and-fats",
    siteName: "Joy Health",
    title: `${title} | Joy Health`,
    description,
    publishedTime: "2026-08-28",
    images: [],
  },
  twitter: {
    card: "summary",
    title: `${title} | Joy Health`,
    description,
    images: [],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${canonicalUrl}#article`,
  mainEntityOfPage: canonicalUrl,
  headline: title,
  description,
  author: { "@type": "Organization", name: "Joy Health", url: "https://joyhealth.cc/" },
  publisher: { "@type": "Organization", name: "Joy Health", url: "https://joyhealth.cc/" },
  datePublished: "2026-08-28",
  inLanguage: "en-US",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Nutrition", path: "/nutrition" },
  {
    name: "Carbohydrates and fats",
    path: "/nutrition/carbohydrates-and-fats",
  },
]);

function Citation({ source }: Readonly<{ source: number }>) {
  return (
    <sup className="citation">
      <a href={`#source-${source}`} aria-label={`Source ${source}`}>
        [{source}]
      </a>
    </sup>
  );
}

export default function CarbohydratesAndFatsGuide() {
  return (
    <main>
      <article className="guide-article">
        <header className="guide-intro">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/nutrition">Nutrition</Link></li>
              <li aria-current="page">Carbohydrates and fats</li>
            </ol>
          </nav>
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            Carbohydrate and fat are umbrella categories, not verdicts. This
            guide separates the label fields, food sources, and policy terms
            inside each one. It does not prescribe a macronutrient ratio or a
            therapeutic diet.
          </p>
          <div className="guide-meta" aria-label="Article details">
            <p>Prepared by <strong>Joy Health</strong></p>
            <p><time dateTime="2026-08-28">Published August 28, 2026</time></p>
          </div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">What this means</h2>
          <div className="guide-copy">
            <p>
              On a U.S. Nutrition Facts label, Total Carbohydrate sits above
              separate lines for Dietary Fiber, Total Sugars, and Added Sugars.
              Added Sugars is part of Total Sugars, not another amount to add.
              Total Fat similarly sits above Saturated Fat and Trans Fat.
              <Citation source={1} />
            </p>
            <p>
              Those fields answer narrower questions than the words
              <em> carbohydrate</em> or <em>fat</em> alone. They also say little
              by themselves about the food source, ingredients, preparation,
              taste, access, or role in a broader eating pattern.
            </p>
            <aside className="key-point" aria-label="Key point">
              <strong>Move from umbrella to type.</strong> Ask which
              carbohydrate or which fat, from what food, in what serving, and
              compared with what alternative.
            </aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What guidance can tell us</h2>
          <div className="guide-copy">
            <p>
              The sources here play two roles. FDA defines U.S. label fields.
              WHO and the current U.S. Dietary Guidelines provide population
              policy. None tests Joy Health&apos;s reading sequence or supplies a
              personal diet plan.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Carbohydrate fields</dt>
                <dd>
                  Total Carbohydrate is the broad label amount. Dietary Fiber,
                  Total Sugars, and Added Sugars provide additional detail.
                  Total Sugars and Trans Fat do not have a percent Daily Value
                  on the Nutrition Facts label.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Fat fields</dt>
                <dd>
                  Total Fat, Saturated Fat, and Trans Fat are shown separately.
                  FDA provides Daily Values for total and saturated fat, but
                  not for trans fat.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Carbohydrate sources</dt>
                <dd>
                  WHO recommends that carbohydrate intake for people age 2 and
                  older come primarily from whole grains, vegetables, fruits,
                  and pulses. This is global public-health policy, not a rule
                  that every meal must contain every category.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Fat replacement</dt>
                <dd>
                  WHO recommends limiting saturated and trans fats and names
                  polyunsaturated fats, monounsaturated fats from plant sources,
                  and carbohydrates from foods with naturally occurring fiber
                  as replacement categories. The replacement is part of the
                  recommendation, not an optional detail.
                  <Citation source={3} />
                </dd>
              </div>
              <div>
                <dt>Current U.S. policy</dt>
                <dd>
                  The Dietary Guidelines for Americans, 2025–2030 prioritizes
                  fiber-rich whole grains and states that saturated fat should
                  generally stay below 10 percent of daily calories. This is a
                  population policy limit, not a personalized treatment target.
                  <Citation source={4} />
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="use-title">
          <h2 id="use-title">How to use the information</h2>
          <div className="guide-copy">
            <ol className="reading-steps">
              <li>
                <h3>Read the serving basis first.</h3>
                <p>
                  Label grams and percent Daily Values describe the listed
                  serving. Check that basis before comparing two foods.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Open the umbrella.</h3>
                <p>
                  For carbohydrate, look at fiber, total sugars, and added
                  sugars when they answer your question. For fat, distinguish
                  total, saturated, and trans fat. Do not let the top line erase
                  the subcategories.
                </p>
              </li>
              <li>
                <h3>Name the food source.</h3>
                <p>
                  A number does not identify whether carbohydrate came from a
                  whole grain, pulse, fruit, vegetable, or another source, or
                  whether fat came from a food rich in unsaturated or saturated
                  fatty acids. Use the ingredient list and food context too.
                  <Citation source={2} /><Citation source={3} />
                </p>
              </li>
              <li>
                <h3>Name the replacement.</h3>
                <p>
                  If a choice reduces one category, ask what takes its place.
                  Joy Health treats “less saturated fat” as an incomplete
                  comparison until the replacement food or nutrient is named.
                  <Citation source={3} />
                </p>
              </li>
            </ol>
            <div className="worked-example">
              <p className="eyebrow">A narrow comparison</p>
              <p>
                Suppose two products use the same serving size and have equal
                Total Carbohydrate. One may still contain more Dietary Fiber or
                Added Sugars. Equal top-line carbohydrate does not make the
                products identical. The same logic applies when equal Total Fat
                masks different Saturated Fat amounts. The label comparison is
                useful, but it remains one part of the food&apos;s context.
                <Citation source={1} />
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>Neither carbohydrate nor fat is one uniform substance or one health score.</li>
              <li>Policy recommendations are not proof that one isolated food causes an outcome.</li>
              <li>Replacement guidance depends on what replaces the reduced nutrient and on the broader diet.</li>
              <li>Labels do not capture every distinction among starches, fibers, sugars, or fatty acids.</li>
              <li>This guide excludes diabetes, cholesterol treatment, ketogenic or low-fat prescriptions, glycemic-index plans, and weight loss.</li>
            </ul>
            <p>
              For a diagnosed condition or prescribed diet, use qualified care
              for decisions that depend on your laboratory results, medicines,
              symptoms, or treatment plan.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              All four sources were read on August 28, 2026. FDA supplies label
              mechanics; WHO and the U.S. Dietary Guidelines supply population
              policy. No health-outcome claim is adopted here.
            </p>
            <ol className="source-list">
              <li id="source-1">
                <a href="https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label">How to Understand and Use the Nutrition Facts Label</a>
                <p>FDA. Used for carbohydrate and fat fields, sugars, and Daily Value context. Limitation: label guidance, not an outcome study or personal target.</p>
              </li>
              <li id="source-2">
                <a href="https://www.who.int/publications/i/item/9789240073593">Carbohydrate intake for adults and children</a>
                <p>World Health Organization, 2023. Used for preferred carbohydrate-source policy. Limitation: global population guidance, not a U.S. label rule or personal plan.</p>
              </li>
              <li id="source-3">
                <a href="https://www.who.int/publications/i/item/9789240073630">Saturated fatty acid and trans-fatty acid intake for adults and children</a>
                <p>World Health Organization, 2023. Used for limits and replacement categories. Limitation: policy based on evidence of varying design and certainty; no causal outcome claim is adopted.</p>
              </li>
              <li id="source-4">
                <a href="https://cdn.realfood.gov/DGA.pdf">Dietary Guidelines for Americans, 2025–2030</a>
                <p>HHS and USDA. Used for current U.S. whole-grain and saturated-fat policy. Limitation: population guidance, not individualized treatment.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="guide-provenance" aria-labelledby="about-title">
          <div><p className="eyebrow">About this guide</p><h2 id="about-title">Prepared by Joy Health</h2></div>
          <div><p>Joy Health is an educational publisher, not a medical practice. The comparison sequence is Joy Health interpretation checked against the claim-source record. No external clinical reviewer participated.</p><Link href="/standards">Read our editorial standards</Link></div>
        </section>
        <aside className="medical-note" aria-label="Medical information notice"><strong>Medical information notice:</strong> Joy Health offers general education, not medical advice, diagnosis, or treatment. Seek qualified care for personal medical questions and urgent help for emergencies.</aside>
      </article>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
