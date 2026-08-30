import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "./components/json-ld";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SITE_URL } from "./lib/seo";

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
                A warm field guide for everyday health
              </p>
              <h1 id="hero-title">
                Nutrition guides and resources for your journey.
              </h1>
              <p className="hero-copy">
                Practical guidance for meals, hydration, nutrition labels, and supplements,
                with sources, tradeoffs, and limits always in view.
              </p>
              <div className="hero-actions">
                <Link className="primary-link" href="/nutrition#guides-title">
                  Browse all 6 guides <span aria-hidden="true">→</span>
                </Link>
                <Link className="text-link" href="/standards">
                  How we research
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

            <figure className="hero-visual">
              <div className="hero-media">
                {/* Vinext currently emits one 640px source for next/image here, without a srcset. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/joy-health-morning.webp"
                  alt="Hands adding citrus to a bowl beside water and an open notebook in morning light"
                  width="1672"
                  height="941"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <figcaption className="photo-note">
                <span aria-hidden="true">[•]</span>
                <p>
                  <strong>No miracles. Grounded guidance.</strong> Cure-alls don&apos;t exist, but everyone can take steps to protect their joy.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="brand-feature" aria-labelledby="brand-feature-title">
          <div className="brand-feature-inner content-shell">
            <div className="brand-feature-copy">
              <p className="eyebrow">Featured partner · USANA</p>
              <h2 id="brand-feature-title">
                Superb quality you can inspect. Innovation you can trace.
              </h2>
              <p>
                Look inside USANA&apos;s manufacturing model, quality controls, independent product
                listings, and research investment, with the meaning and limits
                of each signal kept clear.
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
              <p>Nutritionals · Foods · Skincare</p>
              <strong>USANA</strong>
              <div className="brand-feature-catalog">
                <p>
                  <strong>Discount:</strong> 10% off USANA products when you shop through this link.
                </p>
                <a href="https://sissi.usana.com/" rel="sponsored">
                  Shop the catalog <span aria-hidden="true">↗</span>
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
              <p className="eyebrow">How we work</p>
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
