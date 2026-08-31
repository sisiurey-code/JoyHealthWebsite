import type { Metadata } from "next";
import Link from "next/link";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import {
  formatEditorialDate,
  READING_FOOD_LABELS_GUIDE,
} from "../../lib/publications";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "../../lib/seo";

const guide = READING_FOOD_LABELS_GUIDE;
const { title, description } = guide;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: guide.path },
  openGraph: {
    type: "article",
    url: guide.path,
    siteName: "Joy Health",
    title: `${title} | Joy Health`,
    description,
    publishedTime: guide.datePublished,
    images: [],
  },
  twitter: {
    card: "summary",
    title: `${title} | Joy Health`,
    description,
    images: [],
  },
};

const articleJsonLd = buildArticleJsonLd(guide);

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Nutrition", path: "/nutrition" },
  {
    name: guide.breadcrumbLabel,
    path: guide.path,
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

export default function FoodLabelsGuide() {
  return (
    <main>
      <article className="guide-article">
        <header className="guide-intro">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/nutrition">Nutrition</Link>
              </li>
              <li aria-current="page">Reading food labels</li>
            </ol>
          </nav>
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            This guide follows FDA consumer guidance for Nutrition Facts labels
            on packaged foods the agency regulates in the United States. It
            explains what the fields mean and offers a repeatable reading
            order; it does not set personal targets or decide whether a food is
            right for you.
            <Citation source={1} />
          </p>
          <div className="guide-meta" aria-label="Article details">
            <p>
              Prepared by <strong>Joy Health</strong>
            </p>
            <p>
              <time dateTime={guide.datePublished}>
                {`Published ${formatEditorialDate(guide.datePublished)}`}
              </time>
            </p>
          </div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">
            Start with serving size, then use the 5% and 20% Daily Value rule
          </h2>
          <div className="guide-copy">
            <p>
              The most useful first question is not whether the package is
              healthy. It is: what amount does this panel describe? FDA says a
              serving size reflects the amount people typically eat or drink,
              not a recommended amount. The per-serving calorie and nutrient
              amounts use that serving as their basis; some labels also show a
              separate per-package column.
              <Citation source={1} />
            </p>
            <p>
              That makes the label a structured comparison tool, not a score.
              Joy Health&apos;s interpretation is to begin with serving
              information, compare like with like, and then read only the
              nutrients that answer the question you actually have.
            </p>
            <aside className="key-point" aria-label="Key point">
              <strong>Start with the denominator.</strong> If a package contains
              two servings and you use the full package, the displayed amounts
              generally need to be doubled unless a separate per-package column
              is already shown.
              <Citation source={1} />
            </aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What the evidence can tell us</h2>
          <div className="guide-copy">
            <p>
              The sources for this guide are FDA regulatory and consumer
              guidance. They establish how these FDA-regulated U.S. label
              fields are meant to be read. They do not test whether reading a
              label changes a person&apos;s health, so the claims here stay with
              label mechanics.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Serving information</dt>
                <dd>
                  Serving size is standardized for comparison and reflects a
                  typical amount consumed. It is not a recommendation. Calories
                  and nutrient quantities in the per-serving column refer to
                  that amount; some labels also show a separate per-package
                  column.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Percent Daily Value</dt>
                <dd>
                  Percent Daily Value, or %DV, shows how much one serving
                  contributes to the Daily Value for an individual nutrient.
                  FDA&apos;s general guide calls 5% DV or less low and 20% DV or
                  more high for that nutrient per serving.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Total and added sugars</dt>
                <dd>
                  Total Sugars includes naturally occurring and added sugars.
                  When a label says &ldquo;Includes X g Added Sugars,&rdquo;
                  that amount is part of Total Sugars, not an extra amount to
                  add again. FDA allows single-ingredient sugars and syrups to
                  omit the added-sugars gram declaration while still showing
                  percent Daily Value.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Ingredient list</dt>
                <dd>
                  FDA says ingredients are generally listed from greatest to
                  least predominance by weight. Joy Health interprets that as a
                  relative order, not an exact percentage breakdown. FDA also
                  notes that some ingredients may be grouped under terms such
                  as flavors or spices while certain incidental additives are
                  exempt.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Allergen information</dt>
                <dd>
                  A Contains statement can identify major food allergens, but
                  not every allergen-containing product uses that format. FDA
                  advises reading the complete ingredient information every
                  time because formulations can change. May contain statements
                  are voluntary.
                  <Citation source={3} />
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
                <h3>Find the serving basis.</h3>
                <p>
                  Read both serving size and servings per container before any
                  other number. Decide whether you are looking at one serving,
                  part of one, or more than one.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Make the comparison fair.</h3>
                <p>
                  When comparing two products, first check whether their serving
                  sizes match. Joy Health uses this as a like-for-like rule
                  because different bases can make side-by-side numbers
                  misleading.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Read the amount and %DV together.</h3>
                <p>
                  Use the grams, milligrams, or micrograms for the quantity,
                  then %DV for context. Remember that the 5% and 20% guide
                  describes one nutrient in one serving, not the food as a
                  whole.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Keep total and added sugars separate.</h3>
                <p>
                  When the label says &ldquo;Includes X g Added Sugars,&rdquo;
                  read that amount as part of Total Sugars. Do not add the two
                  lines together. Single-ingredient sugars and syrups can omit
                  the added-sugars grams while still showing percent Daily
                  Value.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Finish with the rest of the package.</h3>
                <p>
                  Use the ingredient list for relative ingredient order. If an
                  allergy question is relevant, read the complete ingredient
                  information rather than relying only on a Contains or May
                  contain line.
                  <Citation source={2} />
                  <Citation source={3} />
                </p>
              </li>
            </ol>

            <div className="worked-example">
              <p className="eyebrow">A narrow example</p>
              <p>
                Imagine two products with the same serving size. One lists 4%
                DV sodium and the other 22% DV. On FDA&apos;s scale, the first is
                low in sodium per serving and the second is high. That comparison
                says nothing by itself about their other nutrients,
                ingredients, price, taste, or fit in a broader eating pattern.
                <Citation source={1} />
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>
                Daily Values are general U.S. labeling references, not exact
                personal requirements. Needs and priorities can vary.
                <Citation source={1} />
              </li>
              <li>
                A label describes selected quantities. It cannot, by itself,
                decide whether a food is good or bad or how it fits a whole
                eating pattern. This is Joy Health interpretation.
              </li>
              <li>
                Ingredient order shows relative predominance by weight, not
                exact proportions or the health effect of an ingredient.
                <Citation source={2} />
              </li>
              <li>
                Allergen labels have important boundaries. A missing Contains
                or May contain statement is not, by itself, an allergen-free
                guarantee.
                <Citation source={3} />
              </li>
              <li>
                This guide does not cover Supplement Facts labels, restaurant
                menus, every nonpackaged food, or every food regulated by an
                agency other than FDA.
              </li>
            </ul>
            <p>
              If you have a diagnosed or suspected food allergy, a medical
              condition, or a prescribed diet, use qualified professional
              guidance for decisions that depend on your circumstances.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              All three sources were read on August 22, 2026. They are FDA
              consumer or regulatory guidance for FDA-regulated packaged foods
              in the United States, not clinical studies or individualized
              nutrition guidance. No commercial conflicts were disclosed.
            </p>
            <ol className="source-list">
              <li id="source-1">
                <a href="https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label">
                  How to Understand and Use the Nutrition Facts Label
                </a>
                <p>
                  U.S. Food and Drug Administration. Used for serving
                  information, nutrient fields, %DV, sugars, and comparison
                  conventions. Limitation: regulatory consumer guidance, not a
                  personalized assessment or health-outcome study.
                </p>
              </li>
              <li id="source-2">
                <a href="https://www.fda.gov/food/food-additives-and-gras-ingredients-information-consumers/types-food-ingredients">
                  Types of Food Ingredients
                </a>
                <p>
                  U.S. Food and Drug Administration. Used for ingredient order,
                  grouped terms, and exemptions. Limitation: it does not reveal
                  the exact formulation or health effects of a specific product.
                </p>
              </li>
              <li id="source-3">
                <a href="https://www.fda.gov/consumers/consumer-updates/have-food-allergies-read-label">
                  Have Food Allergies? Read the Label
                </a>
                <p>
                  U.S. Food and Drug Administration. Used for major-allergen
                  declarations, Contains statements, voluntary advisory labels,
                  and repeated label checks. Limitation: general safety
                  education, not an individual allergy-management plan.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="guide-provenance" aria-labelledby="about-guide-title">
          <div>
            <p className="eyebrow">About this guide</p>
            <h2 id="about-guide-title">Prepared by Joy Health</h2>
          </div>
          <div>
            <p>
              Joy Health is an educational publisher, not a medical practice.
              This guide was checked against the claim-source record created for
              this page. No external clinical reviewer participated.
            </p>
            <Link href="/standards">Read our editorial standards</Link>
          </div>
        </section>

        <aside className="medical-note" aria-label="Medical information notice">
          <strong>Medical information notice:</strong> Joy Health offers general
          education, not medical advice, diagnosis, or treatment. Seek qualified
          care for personal medical questions and urgent help for emergencies.
        </aside>
      </article>

      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
