import type { Metadata } from "next";
import Link from "next/link";
import { NUTRITION_GUIDES, PUBLICATIONS } from "../lib/publications";
import { SITE_OG_IMAGE } from "../lib/seo";

const { description, title } = PUBLICATIONS.nutrition;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nutrition" },
  openGraph: {
    type: "website",
    url: "/nutrition",
    siteName: "Joy Health",
    title: `${title} | Joy Health`,
    description,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Joy Health`,
    description,
    images: [SITE_OG_IMAGE.url],
  },
};

export default function NutritionPage() {
  return (
    <main id="main-content">
      <section className="library-intro" aria-labelledby="nutrition-title">
        <div>
          <p className="eyebrow">Nutrition essentials</p>
          <h1 id="nutrition-title">Practical nutrition guides for everyday questions.</h1>
        </div>
        <div className="library-intro-copy">
          <p className="library-lede">
            Everyday nutrition, explained from the meal up. A guide is listed
            here only once it is finished and its sources are in place.
          </p>
          <dl className="library-ledger">
            <div>
              <dt>Sources</dt>
              <dd>linked in every guide</dd>
            </div>
            <div>
              <dt>Limits</dt>
              <dd>stated, never hidden</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="available-guides" aria-labelledby="guides-title">
        <div className="section-kicker">
          <div>
            <p className="eyebrow">Available now</p>
            <h2 id="guides-title">The guides, in a sensible order.</h2>
          </div>
          <p>
            Read them in order, or jump straight to the question in front of
            you. Each guide stands on its own.
          </p>
        </div>
        <ol className="guide-index">
          {NUTRITION_GUIDES.map((guide, index) => (
            <li key={guide.path}>
              <p className="guide-number" aria-hidden="true">
                0{index + 1}
              </p>
              <div>
                <p className="guide-topic">{guide.topic}</p>
                <h3>
                  <Link href={guide.path}>{guide.title}</Link>
                </h3>
                <p>{guide.summary}</p>
              </div>
              <Link
                className="guide-action"
                href={guide.path}
                aria-hidden="true"
                tabIndex={-1}
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
          <h2 id="library-path-title">Where to begin.</h2>
        </div>
        <ol>
          <li>
            <span aria-hidden="true">01</span>
            <div>
              <h3>Begin with the meal</h3>
              <p>
                Start with familiar food and a flexible framework, not a score
                or a perfect plate.
              </p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">02</span>
            <div>
              <h3>Learn the reference systems</h3>
              <p>
                Keep nutrients, label values, population guidance, and personal
                needs from collapsing into one number.
              </p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">03</span>
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
          <p className="eyebrow">Before publishing</p>
          <h2 id="library-standards-title">What we check first.</h2>
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
