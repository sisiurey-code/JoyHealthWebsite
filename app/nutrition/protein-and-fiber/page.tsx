import type { Metadata } from "next";
import Link from "next/link";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import { buildBreadcrumbJsonLd } from "../../lib/seo";

const title = "Protein and fiber: two different jobs in a meal";
const description =
  "A practical guide to what protein and fiber are, where they appear in foods and Nutrition Facts labels, and why their reference values are not interchangeable personal targets.";
const canonicalUrl = "https://joyhealth.cc/nutrition/protein-and-fiber";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nutrition/protein-and-fiber" },
  openGraph: {
    type: "article",
    url: "/nutrition/protein-and-fiber",
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
  author: {
    "@type": "Organization",
    name: "Joy Health",
    url: "https://joyhealth.cc/",
  },
  publisher: {
    "@type": "Organization",
    name: "Joy Health",
    url: "https://joyhealth.cc/",
  },
  datePublished: "2026-08-28",
  inLanguage: "en-US",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Nutrition", path: "/nutrition" },
  { name: "Protein and fiber", path: "/nutrition/protein-and-fiber" },
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

export default function ProteinAndFiberGuide() {
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
              <li aria-current="page">Protein and fiber</li>
            </ol>
          </nav>
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            Protein and fiber can appear in the same food, but they are not the
            same nutrient and do not form one combined score. This guide keeps
            their definitions, food sources, and reference values separate. It
            does not calculate a personal target.
          </p>
          <div className="guide-meta" aria-label="Article details">
            <p>
              Prepared by <strong>Joy Health</strong>
            </p>
            <p>
              <time dateTime="2026-08-28">Published August 28, 2026</time>
            </p>
          </div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">What this means</h2>
          <div className="guide-copy">
            <p>
              Protein is a group of molecules built from amino acids. The
              National Academies describes proteins as structural and
              functional components of cells.
              <Citation source={1} /> Dietary fiber, in the FDA label context,
              is a defined category of nondigestible carbohydrates and lignin.
              <Citation source={3} /> Those definitions describe two different
              things.
            </p>
            <p>
              Some foods can contribute both. Beans, peas, lentils, nuts,
              seeds, and soy appear in current federal guidance as plant protein
              foods.
              <Citation source={4} /> Because they are plants, some can also
              contain intrinsic fiber under FDA&apos;s definition. The actual
              grams depend on the food, preparation, and serving, so this guide
              does not treat those foods as nutritionally interchangeable.
              <Citation source={3} />
            </p>
            <aside className="key-point" aria-label="Key point">
              <strong>Ask two questions.</strong> What in this meal may
              contribute protein? What may contribute fiber? One answer does
              not automatically supply the other.
            </aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What the references can tell us</h2>
          <div className="guide-copy">
            <p>
              Nutrition numbers can look contradictory when their labels are
              removed. The sources below use three different systems: Dietary
              Reference Intakes from the National Academies, Daily Values for
              U.S. labels from FDA, and current federal dietary policy. They are
              not synonyms.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Protein RDA</dt>
                <dd>
                  For healthy adults, the National Academies Recommended
                  Dietary Allowance is 0.8 grams per kilogram of body weight per
                  day. An RDA is intended to cover the requirement of nearly all
                  healthy people in a defined group. It is not a label Daily
                  Value and is not an individualized assessment.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Current protein policy goal</dt>
                <dd>
                  The Dietary Guidelines for Americans, 2025–2030 separately
                  states a protein goal of 1.2 to 1.6 grams per kilogram per day,
                  adjusted as needed for individual calorie requirements. That
                  is current federal policy language, not a renamed National
                  Academies RDA.
                  <Citation source={4} />
                </dd>
              </div>
              <div>
                <dt>Protein Daily Value</dt>
                <dd>
                  FDA&apos;s Daily Value for protein is 50 grams for nutrition
                  labeling. Percent Daily Value shows how much a serving
                  contributes to that label reference. Joy Health does not use
                  it as a personal prescription.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Fiber Adequate Intake</dt>
                <dd>
                  The National Academies set the total-fiber Adequate Intake
                  using 14 grams per 1,000 kilocalories, which produces
                  age- and sex-specific reference amounts. An AI is used when
                  evidence is not sufficient to establish an Estimated Average
                  Requirement and an RDA. This guide does not turn that formula
                  into a personal calculation.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Fiber Daily Value</dt>
                <dd>
                  FDA&apos;s Daily Value for dietary fiber is 28 grams for
                  nutrition labeling. That single label reference is not the
                  same thing as the age- and sex-specific Adequate Intakes.
                  <Citation source={2} />
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
                <h3>Start with the food, not a nutrient score.</h3>
                <p>
                  Name what is in the meal. Current policy lists animal and
                  plant protein foods, while FDA gives vegetables, fruits,
                  whole grains, cereal bran, and flours as examples with
                  intrinsic fiber.
                  <Citation source={3} />
                  <Citation source={4} />
                </p>
              </li>
              <li>
                <h3>Keep the two searches separate.</h3>
                <p>
                  A protein food may contribute little fiber. A fiber source may
                  contribute little protein. Foods such as beans or lentils can
                  contribute both, but that overlap is a property to notice,
                  not a required pairing.
                </p>
              </li>
              <li>
                <h3>Check the serving basis on packaged foods.</h3>
                <p>
                  Protein and Dietary Fiber are listed in grams on the
                  Nutrition Facts panel. Read the serving size first, then use
                  the grams and any displayed percent Daily Value for that
                  serving.
                  <Citation source={2} /> See the complete Joy Health guide to
                  <Link href="/nutrition/reading-food-labels">
                    {" "}reading a Nutrition Facts label
                  </Link>
                  .
                </p>
              </li>
              <li>
                <h3>Name the reference before using a number.</h3>
                <p>
                  Ask whether a number is an RDA, an AI, an FDA Daily Value, or
                  a federal policy goal. Do not add them together or assume
                  that they answer the same question.
                </p>
              </li>
            </ol>

            <div className="worked-example">
              <p className="eyebrow">A narrow comparison</p>
              <p>
                Imagine a packaged food lists 10 grams of protein and 7 grams
                of dietary fiber per serving. Against FDA&apos;s label references,
                those amounts equal 20% of the 50-gram protein Daily Value and
                25% of the 28-gram fiber Daily Value. That arithmetic describes
                one labeled serving. It does not show that the food supplies
                20% or 25% of a particular person&apos;s requirement, and it does
                not make the two nutrients equivalent.
                <Citation source={2} />
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>
                This guide explains reference systems but does not select among
                them for an individual or calculate an intake goal.
              </li>
              <li>
                The National Academies RDA and AI apply to healthy populations
                within their stated life-stage groups. The current federal
                protein goal is a separate policy statement.
                <Citation source={1} />
                <Citation source={4} />
              </li>
              <li>
                FDA&apos;s dietary-fiber category includes intrinsic plant fibers
                and selected isolated or synthetic fibers. That shared label
                category does not mean all fiber types have identical effects.
                <Citation source={3} />
              </li>
              <li>
                Food examples identify possible sources, not equivalent
                amounts, digestibility, amino-acid profiles, or health effects.
              </li>
              <li>
                Bodybuilding, protein powders, weight change, kidney disease,
                gastrointestinal treatment, pregnancy, and individualized
                nutrition are outside this guide.
              </li>
            </ul>
            <p>
              If a medical condition, prescribed diet, digestive concern, or
              life stage changes your needs, use qualified professional
              guidance for decisions that depend on your circumstances.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              All four sources were read on August 22, 2026. The National
              Academies report defines DRIs, FDA defines label terms and Daily
              Values, and the Dietary Guidelines states current federal policy.
              No health-outcome claim from these sources is adopted here.
            </p>
            <ol className="source-list">
              <li id="source-1">
                <a href="https://nap.nationalacademies.org/catalog/11537/dietary-reference-intakes-the-essential-guide-to-nutrient-requirements">
                  Dietary Reference Intakes: The Essential Guide to Nutrient
                  Requirements
                </a>
                <p>
                  Institute of Medicine of the National Academies, 2006. Used
                  for protein and fiber definitions, the adult protein RDA, the
                  total-fiber AI basis, and DRI vocabulary. Limitation: a
                  consensus summary of the 2005 macronutrient report, not a
                  current federal policy goal or an individual assessment.
                </p>
              </li>
              <li id="source-2">
                <a href="https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels">
                  Daily Value on the Nutrition and Supplement Facts Labels
                </a>
                <p>
                  U.S. Food and Drug Administration. Used for the 50-gram
                  protein Daily Value, 28-gram dietary-fiber Daily Value, and
                  percent Daily Value meaning. Limitation: label references are
                  not individualized requirements.
                </p>
              </li>
              <li id="source-3">
                <a href="https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/questions-and-answers-dietary-fiber">
                  Questions and Answers on Dietary Fiber
                </a>
                <p>
                  U.S. Food and Drug Administration. Used for the regulatory
                  dietary-fiber definition and intrinsic plant-fiber examples.
                  Limitation: a shared label category does not establish
                  identical effects for every fiber type or food.
                </p>
              </li>
              <li id="source-4">
                <a href="https://cdn.realfood.gov/DGA.pdf">
                  Dietary Guidelines for Americans, 2025–2030
                </a>
                <p>
                  U.S. Department of Health and Human Services and U.S.
                  Department of Agriculture. Used for current protein-source
                  categories and its separately labeled protein goal.
                  Limitation: federal population policy, not a DRI, label rule,
                  or personalized prescription.
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
              Protein and fiber have separate claim maps in the source record
              for this page. The reading sequence and examples are Joy Health
              interpretation. No external clinical reviewer participated.
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
