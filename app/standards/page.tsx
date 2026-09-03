import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { PUBLICATIONS } from "../lib/publications";
import { SITE_OG_IMAGE } from "../lib/seo";

const { description, title } = PUBLICATIONS.standards;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/standards" },
  openGraph: {
    type: "website",
    siteName: "Joy Health",
    url: "/standards",
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

const standards = [
  {
    title: "How we weigh evidence",
    copy: "We prefer primary research, systematic reviews, and guidance from accountable public-health institutions. We describe limitations, conflicts, and uncertainty instead of flattening them into a verdict.",
  },
  {
    title: "How we cite sources",
    copy: "Health guides identify their sources and distinguish what a source says from our interpretation. Material updates receive a new review date; changing a date alone does not make an article current.",
  },
  {
    title: "Who writes and reviews",
    copy: "Joy Health is an educational publisher, not a medical practice. We do not assert clinical authority, and we identify qualified reviewers by name and credentials only when they actually participated.",
  },
  {
    title: "How we recommend products",
    copy: "Products are compared using stated criteria, practical tradeoffs, and the available evidence. Payment or commission never buys an undisclosed recommendation or a better conclusion.",
  },
  {
    title: "Where disclosures appear",
    copy: "If a link or relationship may financially benefit Joy Health, the disclosure appears with the recommendation. It is never hidden on a separate legal page.",
  },
  {
    title: "How we correct errors",
    copy: "Substantive errors are corrected promptly. When a correction changes the meaning of a guide, we note what changed rather than silently rewriting the record.",
  },
];

export default function StandardsPage() {
  return (
    <div className="page-shell policy-shell">
      <SiteHeader active="standards" />
      <main className="site-shell" id="main-content">
        <section className="policy-intro">
          <p className="eyebrow">Editorial policy</p>
          <h1>Editorial and recommendation standards</h1>
          <p>
            These rules apply to every guide and product recommendation we
            publish.
          </p>
        </section>
        <div className="policy-grid">
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
            <p className="eyebrow">In practice</p>
            <h2>Every guide lists the sources it used.</h2>
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
