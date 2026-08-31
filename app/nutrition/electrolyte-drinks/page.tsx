import type { Metadata } from "next";
import Link from "next/link";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import {
  ELECTROLYTE_DRINKS_GUIDE,
  formatEditorialDate,
} from "../../lib/publications";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "../../lib/seo";

const guide = ELECTROLYTE_DRINKS_GUIDE;
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
  { name: guide.breadcrumbLabel, path: guide.path },
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

export default function ElectrolyteDrinksGuide() {
  return (
    <main>
      <article className="guide-article">
        <header className="guide-intro">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/nutrition">Nutrition</Link></li>
              <li aria-current="page">Electrolyte drinks</li>
            </ol>
          </nav>
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            An electrolyte label can describe a simple mineral drink or a much
            busier product with carbohydrate, protein, creatine, caffeine, or
            other ingredients. Start with the job you need the product to do,
            then check whether the serving actually matches it.
          </p>
          <div className="guide-meta" aria-label="Article details">
            <p>Prepared by <strong>Joy Health</strong></p>
            <p>
              <time dateTime={guide.datePublished}>
                {`Published ${formatEditorialDate(guide.datePublished)}`}
              </time>
            </p>
          </div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">Electrolytes vs. water: the context decides</h2>
          <div className="guide-copy">
            <p>
              Electrolytes are electrically charged minerals. Sodium helps
              regulate extracellular fluid volume; potassium is concentrated
              inside cells and participates in fluid balance, nerve
              transmission, and muscle contraction.
              <Citation source={2} /> A product can contain both without being
              necessary for every walk, desk day, or glass of water.
            </p>
            <p>
              For physically active people, the context changes with exercise
              duration and intensity, environmental conditions, sweat rate,
              acclimatization, body size, clothing, and opportunities to drink.
              The National Athletic Trainers&apos; Association says those
              differences make universal replacement instructions impossible.
              <Citation source={1} />
            </p>
            <p>
              Start with the Joy Health guide to <Link href="/nutrition/hydration">how much water
              counts as total water</Link> when the question is ordinary daily hydration rather
              than a product or exercise decision.
            </p>
            <aside className="key-point" aria-label="Key point">
              <strong>“Contains electrolytes” names ingredients, not a need.</strong>{" "}
              The label still has to answer how much, per what serving, alongside
              which other ingredients, and for what situation.
            </aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What the references can tell us</h2>
          <div className="guide-copy">
            <p>
              A label and an exercise position statement answer different
              questions. The label describes the serving. The position
              statement helps explain why the same drink can be useful in one
              setting and unnecessary or excessive in another.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Serving basis</dt>
                <dd>
                  Nutrition information is usually stated per serving, while a
                  container or packet can hold more than one. Compare products
                  only after putting them on the same serving basis.
                  <Citation source={3} />
                </dd>
              </div>
              <div>
                <dt>Sodium</dt>
                <dd>
                  Sodium content can matter during substantial sweat loss, but
                  the Nutrition Facts Daily Value is a whole-day reference, not
                  a personalized sweat-replacement target. FDA lists 2,300
                  milligrams as 100 percent Daily Value.
                  <Citation source={1} /><Citation source={3} />
                </dd>
              </div>
              <div>
                <dt>Potassium</dt>
                <dd>
                  Potassium appears in many foods and some supplements. Kidney
                  disease and medications that alter potassium excretion can
                  make added potassium unsafe, so a higher number is not always
                  a better number.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Carbohydrate</dt>
                <dd>
                  Carbohydrate can supply fuel during demanding or prolonged
                  activity, which is a different job from replacing fluid. The
                  joint sports-nutrition position paper ties fueling strategies
                  to the event, training load, timing, and individual tolerance.
                  <Citation source={4} />
                </dd>
              </div>
              <div>
                <dt>Extra actives</dt>
                <dd>
                  Protein, creatine, caffeine, vitamins, or botanical ingredients
                  turn a hydration product into a mixed-purpose product. Evaluate
                  every active ingredient, serving, and safety question rather
                  than letting “electrolyte” stand in for the whole formula.
                  <Citation source={5} />
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
                <h3>Name the job first.</h3>
                <p>
                  Decide whether you are choosing an everyday beverage, replacing
                  meaningful exercise losses, adding fuel, or buying a product
                  for another active ingredient. Those are not the same task.
                </p>
              </li>
              <li>
                <h3>Normalize the serving.</h3>
                <p>
                  Check scoops, packets, fluid ounces, servings per container,
                  and whether the amounts shown match the amount you would
                  actually mix or drink.
                  <Citation source={3} />
                </p>
              </li>
              <li>
                <h3>Read every active line.</h3>
                <p>
                  Record sodium, potassium, carbohydrate or added sugars, then
                  note protein, creatine, caffeine, vitamins, and other actives.
                  The product&apos;s real complexity is the entire panel.
                </p>
              </li>
              <li>
                <h3>Match the situation without forcing a formula.</h3>
                <p>
                  Longer, harder, hotter, or high-sweat activity raises different
                  questions from a short routine session. Individual sweat loss
                  varies widely, and both too little and too much fluid can be
                  harmful.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Check whether the simpler option wins.</h3>
                <p>
                  Water plus ordinary meals may already cover the job. A combined
                  product earns its price when its specific ingredients and
                  convenience fit the real use, not simply because the front
                  label sounds more complete.
                </p>
              </li>
            </ol>

            <div className="worked-example">
              <p className="eyebrow">One label, several jobs</p>
              <p>
                Imagine a powder with sodium, potassium, carbohydrate, protein,
                and creatine. Calling it an “electrolyte drink” hides most of the
                decision. It is also a fuel and supplement product. Compare its
                full serving with what you already eat, drink, and take, then
                decide whether combining those jobs is useful or merely adds
                cost and overlap.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>This guide does not calculate a personal sweat rate or prescribe fluid, sodium, potassium, carbohydrate, or supplement amounts.</li>
              <li>It does not cover vomiting, diarrhea, oral rehydration therapy, heat illness, or other clinical treatment.</li>
              <li>Kidney, heart, endocrine, and fluid-restricted conditions can change electrolyte safety.</li>
              <li>Medication use can alter potassium or sodium handling and requires qualified review.</li>
              <li>Formulas, flavors, serving sizes, and labels can change. Read the package you are actually considering.</li>
            </ul>
            <p>
              Seek qualified care for persistent symptoms, illness, medication
              questions, or a condition that changes fluid or electrolyte
              needs. Use urgent help for confusion, collapse, severe weakness,
              seizures, or another emergency.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              Sources were read on August 29, 2026. The exercise statements
              provide context, FDA explains label interpretation and regulation,
              and NIH supplies potassium physiology and safety. None provides
              an individualized plan.
            </p>
            <ol className="source-list">
              <li id="source-1">
                <a href="https://www.nata.org/sites/default/files/2025-08/fluid_replacement_for_the_physically_active.pdf">
                  National Athletic Trainers&apos; Association Position Statement: Fluid Replacement for the Physically Active
                </a>
                <p>
                  McDermott BP et al., Journal of Athletic Training, 2017. Used
                  for variability, fluid-overload risk, sweat-loss context, and
                  the limited role of carbohydrate-electrolyte beverages during
                  intense or long-duration activity. Important limitation:
                  several authors disclosed consulting, speaking, advisory, or
                  research relationships with Gatorade, Danone, PepsiCo, and
                  other commercial organizations.
                </p>
              </li>
              <li id="source-2">
                <a href="https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/">
                  NIH Office of Dietary Supplements, Potassium Fact Sheet for Health Professionals
                </a>
                <p>
                  Used for potassium&apos;s physiological roles, food sources,
                  kidney handling, and medication-related safety. It is a broad
                  nutrient review, not sports-drink guidance.
                </p>
              </li>
              <li id="source-3">
                <a href="https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label">
                  U.S. Food and Drug Administration, How to Understand and Use the Nutrition Facts Label
                </a>
                <p>
                  Used for serving-size interpretation, percent Daily Value,
                  sodium, potassium, and added-sugar context. Daily Values are
                  label references, not exercise prescriptions.
                </p>
              </li>
              <li id="source-4">
                <a href="https://www.sciencedirect.com/science/article/pii/S221226721501802X">
                  Position of the Academy of Nutrition and Dietetics, Dietitians of Canada, and the American College of Sports Medicine: Nutrition and Athletic Performance
                </a>
                <p>
                  Thomas DT, Erdman KA, Burke LM, 2016. Used only for the role of
                  event context, timing, tolerance, and carbohydrate in sports
                  fueling. It is a professional position paper, not a product
                  comparison.
                </p>
              </li>
              <li id="source-5">
                <a href="https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements">
                  U.S. Food and Drug Administration, Questions and Answers on Dietary Supplements
                </a>
                <p>
                  Used for the distinction between supplement labeling and
                  premarket approval, plus general interaction and safety
                  context.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="guide-provenance" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About this guide</p>
            <h2 id="about-title">Prepared by Joy Health</h2>
          </div>
          <div>
            <p>
              Joy Health is an educational publisher, not a medical practice.
              The label-reading sequence is Joy Health interpretation checked
              against the claim-source record. No external clinical reviewer
              participated.
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
