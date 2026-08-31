import type { Metadata } from "next";
import Link from "next/link";
import { HeroCarousel } from "./components/hero-carousel";
import { JsonLd } from "./components/json-ld";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { NUTRITION_GUIDES } from "./lib/publications";
import { SITE_URL } from "./lib/seo";
import { USANA_STOREFRONT_URL } from "./lib/usana";

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
  description:
    "Practical, evidence-aware guides to meals, nutrients, food labels, hydration, and supplements, with sources, tradeoffs, and limits attached.",
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
    "An educational publisher of evidence-aware nutrition guides.",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon.svg`,
    width: 512,
    height: 512,
  },
};

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
                Food, products, and better questions
              </p>
              <h1 id="hero-title">
                Healthy living, made clearer.
              </h1>
              <p className="hero-copy">
                Practical nutrition guidance, premium wellness products, and
                the evidence needed to judge both.
              </p>
              <div className="hero-actions">
                <Link className="primary-link" href="/usana">
                  Explore premium USANA <span aria-hidden="true">→</span>
                </Link>
                <Link className="text-link" href="/nutrition#guides-title">
                  {`Browse ${NUTRITION_GUIDES.length} practical guides`}
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

        <section className="brand-feature" aria-labelledby="brand-feature-title">
          <div className="brand-feature-inner content-shell">
            <div className="brand-feature-copy">
              <p className="eyebrow section-kicker-numbered">
                <span aria-hidden="true">02</span>
                Featured partner · USANA
              </p>
              <h2 id="brand-feature-title">
                Build a better routine with products worth understanding.
              </h2>
              <p>
                See how the flagships differ, what the single-purpose formulas contain,
                and where newer formats fit. Supporting evidence and caveats sit
                beside the products they describe.
              </p>
              <div className="brand-feature-actions">
                <Link className="primary-link" href="/usana">
                  Explore USANA <span aria-hidden="true">→</span>
                </Link>
                <Link className="brand-evidence-link" href="/usana#quality">
                  See the quality evidence
                </Link>
              </div>
            </div>

            <div className="brand-feature-display">
              <p>Nutritionals · Active living · Skincare</p>
              <strong>USANA</strong>
              <div className="brand-feature-catalog">
                <p>
                  <strong>Affiliate disclosure:</strong> Joy Health may earn a
                  commission when you shop through this link. The price and our
                  evidence standards do not change.
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
                <span aria-hidden="true">03</span>
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
