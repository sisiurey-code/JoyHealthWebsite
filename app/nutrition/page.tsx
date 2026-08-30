import type { Metadata } from "next";
import Link from "next/link";

const description =
  "An evidence-aware nutrition library organized around food labels, nutrients, meals, hydration, and supplements.";

export const metadata: Metadata = {
  title: "Nutrition essentials",
  description,
  alternates: { canonical: "/nutrition" },
  openGraph: {
    type: "website",
    url: "/nutrition",
    siteName: "Joy Health",
    title: "Nutrition essentials | Joy Health",
    description,
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Joy Health, healthy living made clearer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutrition essentials | Joy Health",
    description,
    images: ["/og.png"],
  },
};

const guides = [
  {
    topic: "Building balanced meals",
    title: "How to build a balanced meal without rigid rules",
    description:
      "A flexible way to notice what a meal already contains and decide whether one practical addition would be useful.",
    href: "/nutrition/building-balanced-meals",
  },
  {
    topic: "Protein and fiber",
    title: "Protein and fiber: two different jobs in a meal",
    description:
      "Separate definitions, food sources, label values, and reference systems for two nutrients that should not become one score.",
    href: "/nutrition/protein-and-fiber",
  },
  {
    topic: "Reading food labels",
    title: "How to read a Nutrition Facts label",
    description:
      "A repeatable way to interpret the serving basis, percent Daily Value, ingredients, and allergen information on FDA-regulated packaged foods in the United States.",
    href: "/nutrition/reading-food-labels",
  },
  {
    topic: "Carbohydrates and fats",
    title: "Carbohydrates and fats: types, sources, and tradeoffs",
    description:
      "Open the umbrella terms, read their label subcategories, and keep the replacement food or nutrient in view.",
    href: "/nutrition/carbohydrates-and-fats",
  },
  {
    topic: "Hydration",
    title: "Hydration: what counts and why needs vary",
    description:
      "Distinguish total water from plain water and read adult reference values with their derivation and limits attached.",
    href: "/nutrition/hydration",
  },
  {
    topic: "Supplement evidence and safety",
    title: "How to evaluate supplement evidence and safety",
    description:
      "Separate what a label declares from marketing claims, supporting evidence, product identity, and personal safety.",
    href: "/nutrition/supplement-evidence-and-safety",
  },
  {
    topic: "Electrolyte drinks",
    title: "Electrolyte drinks: read the label, then match the context",
    description:
      "Carry the hydration and supplement-reading skills into powders, sports drinks, and mixed-purpose active-nutrition products.",
    href: "/nutrition/electrolyte-drinks",
  },
];

export default function NutritionPage() {
  return (
    <main>
      <section className="library-intro" aria-labelledby="nutrition-title">
        <div>
          <p className="eyebrow">Nutrition essentials</p>
          <h1 id="nutrition-title">A clearer way into nutrition.</h1>
        </div>
        <div className="library-intro-copy">
          <p className="library-lede">
            Build a working vocabulary for food, nutrients, labels, hydration,
            and supplements. Joy Health links a guide here only after its scope,
            sources, and limits are complete.
          </p>
          <dl className="library-ledger" aria-label="Library facts">
            <div>
              <dt>7</dt>
              <dd>completed guides</dd>
            </div>
            <div>
              <dt>Every one</dt>
              <dd>includes sources and limits</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="available-guides" aria-labelledby="guides-title">
        <div className="section-kicker">
          <div>
            <p className="eyebrow">Available now</p>
            <h2 id="guides-title">Seven practical places to begin.</h2>
          </div>
          <p>
            Follow the suggested order or jump directly to the question in
            front of you. Each guide stands on its own.
          </p>
        </div>
        <ol className="guide-index">
          {guides.map((guide, index) => (
            <li key={guide.href}>
              <p className="guide-number" aria-hidden="true">
                0{index + 1}
              </p>
              <div>
                <p className="guide-topic">{guide.topic}</p>
                <h3>
                  <Link href={guide.href}>{guide.title}</Link>
                </h3>
                <p>{guide.description}</p>
              </div>
              <Link
                className="guide-action"
                href={guide.href}
                aria-label={`Read ${guide.title}`}
              >
                Read the guide <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="library-path" aria-labelledby="library-path-title">
        <div>
          <p className="eyebrow">A suggested path</p>
          <h2 id="library-path-title">From everyday meals to harder claims.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Begin with the meal</h3>
              <p>
                Start with familiar food and a flexible framework, not a score
                or a perfect plate.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Learn the reference systems</h3>
              <p>
                Keep nutrients, label values, population guidance, and personal
                needs from collapsing into one number.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Evaluate bigger claims</h3>
              <p>
                Bring the same source, scope, and safety questions to hydration
                advice, supplement marketing, and products that combine several
                jobs in one serving.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="library-standards" aria-labelledby="library-standards-title">
        <div>
          <p className="eyebrow">The publishing rule</p>
          <h2 id="library-standards-title">No guide without its evidence trail.</h2>
        </div>
        <div>
          <p>
            Every material health claim must map to a source we actually read.
            We keep interpretation separate, state meaningful limits, and do
            not change a review date without substantive work.
          </p>
          <Link className="standards-link" href="/standards">
            Read our standards <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
