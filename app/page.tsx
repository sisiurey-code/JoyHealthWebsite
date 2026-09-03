import type { Metadata } from "next";
import Link from "next/link";
import { HeroCarousel } from "./components/hero-carousel";
import { JsonLd } from "./components/json-ld";
import { ProductShelf } from "./components/product-shelf";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import {
  BALANCED_MEALS_GUIDE,
  NUTRITION_GUIDES,
  PUBLICATIONS,
  READING_FOOD_LABELS_GUIDE,
  SUPPLEMENT_EVIDENCE_GUIDE,
} from "./lib/publications";
import { SITE_URL } from "./lib/seo";
import { countWord } from "./lib/text";
import { USANA_PRODUCT_COUNT, USANA_STOREFRONT_URL } from "./lib/usana";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Joy Health",
  alternateName: "joyhealth.cc",
  description: PUBLICATIONS.home.description,
  inLanguage: "en-US",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Joy Health",
  alternateName: "joyhealth.cc",
  url: `${SITE_URL}/`,
  description:
    "Joy Health publishes plain-language nutrition guides and supplement comparisons for general readers.",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon.svg`,
    width: 512,
    height: 512,
  },
};

const featuredGuides = [
  BALANCED_MEALS_GUIDE,
  READING_FOOD_LABELS_GUIDE,
  SUPPLEMENT_EVIDENCE_GUIDE,
] as const;

const method = [
  {
    title: "Scope the question",
    copy: "Define what the guide can answer before reading beyond the evidence.",
  },
  {
    title: "Read the sources",
    copy: "Trace material health claims to research and accountable institutions.",
  },
  {
    title: "Separate the roles",
    copy: "Keep source findings distinct from Joy Health interpretation.",
  },
  {
    title: "Name the limits",
    copy: "State uncertainty, exclusions, tradeoffs, and meaningful conflicts.",
  },
];

export default function Home() {
  return (
    <div className="home-shell">
      <SiteHeader />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid content-shell">
            <div className="hero-content">
              <p className="hero-kicker">
                <span aria-hidden="true">01</span>
                Food, supplements, and better questions
              </p>
              <h1 id="hero-title">
                Healthy living, made clearer.
              </h1>
              <p className="hero-copy">
                Practical nutrition guidance, a short list of supplements worth
                understanding, and the evidence needed to judge both.
              </p>
              <div className="hero-actions">
                <Link className="primary-link" href="/nutrition#guides-title">
                  {`Browse ${NUTRITION_GUIDES.length} practical guides`}{" "}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link className="text-link" href="/usana#products">
                  Compare the supplements
                </Link>
              </div>
              <aside
                className="guide-promise"
                aria-label="What every Joy Health guide includes"
              >
                <p className="eyebrow">Every guide includes</p>
                <ul>
                  <li>Useful context</li>
                  <li>Linked sources</li>
                  <li>Limits and tradeoffs</li>
                </ul>
              </aside>
            </div>

            <HeroCarousel />
          </div>
        </section>

        <section
          className="home-guides content-shell"
          aria-labelledby="home-guides-title"
        >
          <header className="home-guides-heading">
            <div>
              <p className="eyebrow section-kicker-numbered">
                <span aria-hidden="true">02</span>
                Start with a question
              </p>
              <h2 id="home-guides-title">
                Answers you can check for yourself.
              </h2>
            </div>
            <p>
              Each guide names its scope, links the sources it read, and states
              what the evidence cannot settle. Start with the meal, then the
              label, then the bigger claims.
            </p>
          </header>
          <ol className="home-guide-list">
            {featuredGuides.map((guide) => (
              <li key={guide.path}>
                <p className="guide-topic">{guide.topic}</p>
                <h3>
                  <Link href={guide.path}>{guide.title}</Link>
                </h3>
                <p>{guide.summary}</p>
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
          <div className="home-guides-footer">
            <p>{`${NUTRITION_GUIDES.length} guides, all complete before they are linked.`}</p>
            <Link className="text-link" href="/nutrition#guides-title">
              See every guide
            </Link>
          </div>
        </section>

        <section className="product-feature" aria-labelledby="product-feature-title">
          <div className="product-feature-inner content-shell">
            <div className="product-feature-copy">
              <p className="eyebrow section-kicker-numbered">
                <span aria-hidden="true">03</span>
                Supplements, compared
              </p>
              <h2 id="product-feature-title">
                A short list of products worth understanding.
              </h2>
              <p>
                {`${countWord(USANA_PRODUCT_COUNT, { capitalize: true })} highlighted formulas, each shown with its current Supplement Facts label, its stated purpose, and where it overlaps with the others. The evidence and the caveats sit beside the product they describe, not on a separate page.`}
              </p>
              <div className="product-feature-actions">
                <Link className="primary-link" href="/usana#products">
                  Compare the products <span aria-hidden="true">→</span>
                </Link>
                <Link className="brand-evidence-link" href="/usana#quality">
                  See the quality evidence
                </Link>
              </div>
            </div>

            <div className="product-feature-display">
              <ProductShelf />
              <div className="product-feature-catalog">
                <p>
                  <strong>Affiliate disclosure:</strong> these are USANA
                  products, and Joy Health may earn a commission when you shop
                  through this link. The price and our evidence standards do
                  not change.
                </p>
                <a href={USANA_STOREFRONT_URL} rel="sponsored">
                  See current products and prices <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="method-band"
          id="standards"
          aria-labelledby="standards-title"
        >
          <div className="method-inner content-shell">
            <header className="method-heading">
              <p className="eyebrow section-kicker-numbered">
                <span aria-hidden="true">04</span>
                How we work
              </p>
              <h2 id="standards-title">Curious, cheerful, and careful.</h2>
              <p>
                We synthesize research, provide sources, and separate evidence
                from interpretation. Joy Health provides general education,
                not medical advice, diagnosis, or treatment.
              </p>
            </header>
            <ol className="method-list">
              {method.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="method-footer">
              <p>Trust is part of the product.</p>
              <Link className="standards-link" href="/standards">
                Read our editorial standards <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
    </div>
  );
}
