import type { Metadata } from "next";
import Link from "next/link";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import { buildBreadcrumbJsonLd } from "../../lib/seo";

const title = "How to evaluate supplement evidence and safety";
const description =
  "A repeatable U.S. framework separating Supplement Facts, marketing claims, supporting evidence, product identity, and safety.";
const canonicalUrl =
  "https://joyhealth.cc/nutrition/supplement-evidence-and-safety";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nutrition/supplement-evidence-and-safety" },
  openGraph: {
    type: "article",
    url: "/nutrition/supplement-evidence-and-safety",
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
  {
    name: "Supplement evidence and safety",
    path: "/nutrition/supplement-evidence-and-safety",
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

export default function SupplementEvidenceAndSafetyGuide() {
  return (
    <main>
      <article className="guide-article">
        <header className="guide-intro">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/nutrition">Nutrition</Link></li>
              <li aria-current="page">Supplement evidence and safety</li>
            </ol>
          </nav>
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            A supplement label, a marketing claim, supporting research, product
            identity, and personal safety answer different questions. This
            guide keeps them separate so one reassuring detail does not stand
            in for the whole evaluation.
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
              In the United States, FDA does not approve dietary supplements
              for safety, effectiveness, or labeling before they are sold.
              Companies are responsible for meeting applicable requirements,
              while FDA&apos;s enforcement role is primarily after products enter
              the market.<Citation source={1} /> That regulatory structure does
              not prove a specific product is unsafe, but it does make
              premarket approval the wrong assumption.
            </p>
            <p>
              A useful evaluation therefore asks five separate questions: What
              does the label declare? What is the product&apos;s regulatory status?
              What evidence supports the exact claim? What is known about
              product identity and quality? What safety issues matter in the
              intended situation?
            </p>
            <aside className="key-point" aria-label="Key point">
              <strong>One check cannot answer all five questions.</strong> A
              complete label is not proof of benefit, and a quality seal is not
              proof that a supplement is safe or effective.
            </aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What the sources can tell us</h2>
          <div className="guide-copy">
            <p>
              These sources have distinct roles. FDA describes regulation,
              labeling, and enforcement notices. NIH&apos;s Office of Dietary
              Supplements explains label and quality questions. FTC explains
              the evidence expected for objective advertising claims. None
              evaluates every supplement or replaces individual safety review.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Supplement Facts</dt>
                <dd>
                  The label identifies the serving size, declared dietary
                  ingredients, and their amounts, with other ingredients listed
                  separately. It tells you what the company declares, not
                  whether the product will produce a claimed result.
                  <Citation source={1} /><Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Advertising evidence</dt>
                <dd>
                  FTC guidance says objective health and safety claims need
                  competent and reliable scientific evidence. The exact wording
                  matters: evidence for one ingredient, dose, population, or
                  outcome may not establish a broader claim for another.
                  <Citation source={3} />
                </dd>
              </div>
              <div>
                <dt>Identity and quality</dt>
                <dd>
                  An independent quality seal may address manufacturing,
                  ingredient identity, label accuracy, or contaminants within
                  its stated program. NIH cautions that such a seal does not
                  guarantee safety or effectiveness.<Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Safety context</dt>
                <dd>
                  Supplements can interact with medicines or other supplements
                  and can matter around surgery or health conditions. These
                  questions depend on the actual product and person, not merely
                  the product category.<Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Enforcement notices</dt>
                <dd>
                  FDA&apos;s health-fraud database can identify some products cited
                  in agency actions, but FDA says it represents only a small
                  fraction of potentially hazardous products. Absence from the
                  database is not evidence of safety.<Citation source={4} />
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="use-title">
          <h2 id="use-title">How to use the framework</h2>
          <div className="guide-copy">
            <ol className="reading-steps">
              <li>
                <h3>Capture the exact product and label.</h3>
                <p>
                  Record the dietary ingredient, form, amount per serving,
                  serving size, other ingredients, warnings, and company. Do
                  not reduce a multi-ingredient product to its largest word.
                  <Citation source={1} /><Citation source={2} />
                </p>
              </li>
              <li>
                <h3>Write the exact claim.</h3>
                <p>
                  Separate the product&apos;s explicit claim from the benefit you
                  hope it will provide. Vague words such as “support” do not
                  identify a measurable outcome by themselves.
                  <Citation source={3} />
                </p>
              </li>
              <li>
                <h3>Match the evidence to the claim.</h3>
                <p>
                  Check whether research addresses the relevant ingredient or
                  product, form, dose, population, outcome, comparison, and
                  duration. An association, laboratory result, or study of a
                  different formulation should not silently become proof of the
                  product&apos;s advertising claim.<Citation source={3} />
                </p>
              </li>
              <li>
                <h3>Keep quality separate from efficacy.</h3>
                <p>
                  Read what a certification program actually tests. Confirmation
                  of identity or manufacturing quality does not establish that
                  taking the product improves a health outcome.
                  <Citation source={2} />
                </p>
              </li>
              <li>
                <h3>Screen the intended use for safety.</h3>
                <p>
                  Consider medicines, other supplements, surgery, pregnancy,
                  breastfeeding, allergies, and health conditions with a
                  pharmacist or other qualified professional who can review the
                  exact product.<Citation source={2} />
                </p>
              </li>
              <li>
                <h3>Check notices without treating silence as clearance.</h3>
                <p>
                  Search relevant FDA warnings, recalls, and health-fraud
                  notices, but do not interpret an empty search as an approval
                  or safety finding.<Citation source={4} />
                </p>
              </li>
            </ol>
            <div className="worked-example">
              <p className="eyebrow">A narrow example</p>
              <p>
                A bottle can carry a Supplement Facts panel, use a “supports”
                claim, and display a quality seal. Those three observations may
                describe the label, the advertising, and one quality program.
                They still do not establish the claimed benefit or settle
                safety for a person taking medicines. Each question needs its
                own evidence.<Citation source={2} /><Citation source={3} />
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>This guide does not recommend products, brands, ingredients, doses, or retailers.</li>
              <li>It does not diagnose a deficiency or evaluate treatment for a symptom or condition.</li>
              <li>A compliant-looking label does not establish label accuracy, benefit, or safety.</li>
              <li>A quality seal answers only the questions within that program&apos;s published scope.</li>
              <li>Absence from an FDA warning database is not evidence that a product has been reviewed or cleared.</li>
              <li>General interaction warnings cannot replace review of a person&apos;s medicines, conditions, and intended use.</li>
            </ul>
            <p>
              Seek qualified care for decisions involving medicines, surgery,
              pregnancy or breastfeeding, symptoms, diagnosed conditions, or a
              suspected adverse reaction.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              All four sources were read on August 28, 2026. They provide U.S.
              regulatory, labeling, advertising, quality, and enforcement
              context. They do not establish that a particular supplement is
              effective or safe for a particular person.
            </p>
            <ol className="source-list">
              <li id="source-1">
                <a href="https://www.fda.gov/consumers/consumer-updates/fda-101-dietary-supplements">FDA 101: Dietary Supplements</a>
                <p>U.S. Food and Drug Administration. Used for premarket status, company responsibility, postmarket oversight, and Supplement Facts basics. Limitation: consumer regulatory guidance, not a product evaluation.</p>
              </li>
              <li id="source-2">
                <a href="https://ods.od.nih.gov/HealthInformation/ODS_Frequently_Asked_Questions/">Frequently Asked Questions: Dietary Supplements</a>
                <p>NIH Office of Dietary Supplements. Used for label content, interactions, and limits of quality seals. Limitation: general education and no certification-program endorsement.</p>
              </li>
              <li id="source-3">
                <a href="https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance">Health Products Compliance Guidance</a>
                <p>Federal Trade Commission, 2022. Used for advertising substantiation and evidence-matching principles. Limitation: FTC staff business guidance; it is not a clinical review and does not have the force of law.</p>
              </li>
              <li id="source-4">
                <a href="https://www.fda.gov/consumers/health-fraud-scams/health-fraud-product-database">Health Fraud Product Database</a>
                <p>U.S. Food and Drug Administration. Used for the limits of enforcement-database searches. Limitation: FDA states that the database contains only a small fraction of potentially hazardous products.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="guide-provenance" aria-labelledby="about-title">
          <div><p className="eyebrow">About this guide</p><h2 id="about-title">Prepared by Joy Health</h2></div>
          <div><p>Joy Health is an educational publisher, not a medical practice. The five-question framework is Joy Health interpretation checked against the claim-source record. No external clinical reviewer participated.</p><Link href="/standards">Read our editorial standards</Link></div>
        </section>
        <aside className="medical-note" aria-label="Medical information notice"><strong>Medical information notice:</strong> Joy Health offers general education, not medical advice, diagnosis, or treatment. Seek qualified care for personal medical questions and urgent help for emergencies.</aside>
      </article>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
