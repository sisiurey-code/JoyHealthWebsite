import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Editorial and recommendation standards",
  description:
    "How Joy Health researches, writes, updates, and discloses its educational guides and product recommendations.",
  alternates: { canonical: "/standards" },
  openGraph: {
    type: "website",
    siteName: "Joy Health",
    url: "/standards",
    title: "Editorial and recommendation standards | Joy Health",
    description:
      "How Joy Health researches, writes, updates, and discloses its educational guides and product recommendations.",
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
    title: "Editorial and recommendation standards | Joy Health",
    description:
      "How Joy Health researches, writes, updates, and discloses its educational guides and product recommendations.",
    images: ["/og.png"],
  },
};

const standards = [
  {
    title: "Evidence before certainty",
    copy: "We prefer primary research, systematic reviews, and guidance from accountable public-health institutions. We describe limitations, conflicts, and uncertainty instead of flattening them into a verdict.",
  },
  {
    title: "Traceable sources",
    copy: "Health guides identify their sources and distinguish what a source says from our interpretation. Material updates receive a new review date; changing a date alone does not make an article current.",
  },
  {
    title: "No borrowed credentials",
    copy: "Joy Health is an educational publisher, not a medical practice. We do not assert clinical authority, and we identify qualified reviewers by name and credentials only when they actually participated.",
  },
  {
    title: "Recommendations with reasons",
    copy: "Products are compared using stated criteria, practical tradeoffs, and the available evidence. Payment or commission never buys an undisclosed recommendation or a better conclusion.",
  },
  {
    title: "Disclosures where they matter",
    copy: "If a link or relationship may financially benefit Joy Health, the disclosure appears with the recommendation. It is never hidden on a separate legal page.",
  },
  {
    title: "Corrections stay visible",
    copy: "Substantive errors are corrected promptly. When a correction changes the meaning of a guide, we note what changed rather than silently rewriting the record.",
  },
];

export default function StandardsPage() {
  return (
    <div className="page-shell policy-shell">
      <SiteHeader active="standards" />
      <main className="site-shell" id="main-content">
        <section className="policy-intro">
          <p className="eyebrow">Public editorial charter</p>
          <h1>Editorial and recommendation standards</h1>
          <p>
            Trust is part of the product. These rules apply to every health
            guide and recommendation we publish.
          </p>
        </section>
        <div className="policy-grid" aria-label="Editorial standards">
          {standards.map((standard, index) => (
            <section key={standard.title}>
              <p className="standard-number" aria-hidden="true">
                [0{index + 1}]
              </p>
              <div>
                <h2>{standard.title}</h2>
                <p>{standard.copy}</p>
              </div>
            </section>
          ))}
        </div>
        <div className="policy-close">
          <aside
            className="medical-note"
            aria-label="Medical information notice"
          >
            <strong>Important:</strong> Joy Health offers general education,
            not medical advice, diagnosis, or treatment. Seek qualified care
            for personal medical questions and urgent help for emergencies.
          </aside>
          <div className="policy-close-action">
            <p className="eyebrow">See the standard in practice</p>
            <h2>Every published guide carries its own evidence trail.</h2>
            <Link className="primary-link" href="/nutrition">
              Browse nutrition guides <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
