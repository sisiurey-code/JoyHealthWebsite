import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

const description =
  "A source-linked look at USANA product quality, manufacturing, third-party listings, and product innovation, with the limits of each signal kept clear.";

export const metadata: Metadata = {
  title: "USANA quality and product innovation",
  description,
  alternates: { canonical: "/usana" },
  openGraph: {
    type: "website",
    url: "/usana",
    siteName: "Joy Health",
    title: "USANA quality and product innovation | Joy Health",
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
    title: "USANA quality and product innovation | Joy Health",
    description,
    images: ["/og.png"],
  },
};

export default function UsanaPage() {
  return (
    <div className="page-shell usana-shell">
      <SiteHeader active="usana" />

      <main id="main-content">
        <section className="usana-hero" aria-labelledby="usana-title">
          <div className="usana-hero-inner content-shell">
            <div className="usana-hero-copy">
              <p className="eyebrow">USANA · Quality and innovation</p>
              <h1 id="usana-title">Look past the bottle. See how the product is built.</h1>
              <p>
                USANA reports substantial in-house manufacturing and continued
                investment in new formulations, while NSF independently lists
                a defined set of finished products. Those are meaningful quality
                signals. They are not shortcuts around reading the exact label
                or evaluating the evidence for a specific use.
              </p>
              <div className="usana-hero-actions">
                <a className="usana-catalog-link" href="#catalog">
                  Explore the catalog <span aria-hidden="true">↓</span>
                </a>
                <Link href="/nutrition/supplement-evidence-and-safety">
                  Read the supplement guide
                </Link>
              </div>
            </div>

            <div className="usana-word-display" aria-label="USANA">
              <span>Product systems</span>
              <strong>USANA</strong>
              <p>Control · Verification · Development</p>
            </div>
          </div>
        </section>

        <section className="usana-signal-band" aria-label="USANA evidence signals">
          <dl className="content-shell">
            <div>
              <dt>67%</dt>
              <dd>
                of product sales tied to products whose manufacturing,
                production, and quality control USANA reports operating in-house
                <a className="citation" href="#usana-source-1" aria-label="Source 1">
                  [1]
                </a>
              </dd>
            </div>
            <div>
              <dt>12</dt>
              <dd>
                finished products in the current NSF/ANSI 173 official listing
                <a className="citation" href="#usana-source-2" aria-label="Source 2">
                  [2]
                </a>
              </dd>
            </div>
            <div>
              <dt>$10.7M</dt>
              <dd>
                invested in research and development in 2025, according to
                USANA&apos;s sustainability reporting
                <a className="citation" href="#usana-source-3" aria-label="Source 3">
                  [3]
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="usana-quality content-shell" id="quality" aria-labelledby="quality-title">
          <header className="usana-section-heading">
            <p className="eyebrow">Quality, made concrete</p>
            <h2 id="quality-title">Three signals worth separating.</h2>
            <p>
              Quality is not one badge. These signals answer different
              questions about control, verification, and organizational
              commitment.
            </p>
          </header>

          <div className="usana-quality-grid">
            <article>
              <span aria-hidden="true">01</span>
              <h3>Manufacturing control</h3>
              <p>
                USANA says it conducts manufacturing, production, and quality
                control for roughly two-thirds of its nutritional products at
                its Salt Lake City facility. Keeping those operations in-house
                can make process ownership and corrective action more direct.
                <a className="citation" href="#usana-source-1" aria-label="Source 1">
                  [1]
                </a>
              </p>
              <p className="usana-interpretation">
                <strong>Joy Health interpretation:</strong> In-house control is
                a useful operational signal, not proof that every product is
                superior or appropriate for every person.
              </p>
            </article>

            <article>
              <span aria-hidden="true">02</span>
              <h3>Finished-product verification</h3>
              <p>
                NSF&apos;s official listing identifies 12 USANA finished products
                under NSF/ANSI 173, including CellSentials Core Minerals,
                CellSentials Vita-Antioxidant, BiOmega, and MagneCal D.
                <a className="citation" href="#usana-source-2" aria-label="Source 2">
                  [2]
                </a>
              </p>
              <p className="usana-interpretation">
                <strong>Joy Health interpretation:</strong> A listing applies to
                the named products and certification scope. It should not be
                generalized to every item in the catalog.
              </p>
            </article>

            <article>
              <span aria-hidden="true">03</span>
              <h3>Quality systems investment</h3>
              <p>
                USANA reports that every employee required to receive current
                good manufacturing practices training was current in 2025. The
                same report states that 15 new products launched that year.
                <a className="citation" href="#usana-source-3" aria-label="Source 3">
                  [3]
                </a>
              </p>
              <p className="usana-interpretation">
                <strong>Joy Health interpretation:</strong> Training and launches
                indicate organizational activity. The figures are
                company-reported and do not establish a clinical outcome.
              </p>
            </article>
          </div>
        </section>

        <section className="usana-innovation" aria-labelledby="innovation-title">
          <div className="usana-innovation-inner content-shell">
            <div>
              <p className="eyebrow">Innovation in motion</p>
              <h2 id="innovation-title">A portfolio that keeps changing.</h2>
            </div>
            <div className="usana-innovation-copy">
              <p>
                USANA&apos;s 2025 reporting describes research spanning human
                nutrition, cellular biology, biochemistry, genetics, the
                microbiome, natural-product chemistry, and clinical research.
                Its stated work includes new products, reformulations, and
                adaptations for different regulatory markets.
                <a className="citation" href="#usana-source-1" aria-label="Source 1">
                  [1]
                </a>
              </p>
              <div className="usana-innovation-example">
                <p className="eyebrow">One documented example</p>
                <h3>CellSentials was reformulated in 2025.</h3>
                <p>
                  A company announcement records the addition of PQQ to the
                  InCelligence Complex and the launch of Core Aminos and
                  Circulate+ alongside other portfolio updates.
                  <a className="citation" href="#usana-source-4" aria-label="Source 4">
                    [4]
                  </a>
                </p>
              </div>
              <p className="usana-interpretation">
                <strong>What innovation means here:</strong> These are documented
                formulation and portfolio changes. A newer ingredient, a
                proprietary complex, or a patent does not by itself demonstrate
                better health outcomes than an alternative.
              </p>
            </div>
          </div>
        </section>

        <section className="usana-limits content-shell" aria-labelledby="limits-title">
          <div>
            <p className="eyebrow">The boundary</p>
            <h2 id="limits-title">Quality is not the same question as efficacy.</h2>
          </div>
          <div>
            <p>
              FDA requires dietary-supplement manufacturers to follow current
              good manufacturing practices, but it does not approve dietary
              supplements before marketing. FDA also advises discussing
              supplement use with a doctor, pharmacist, or other health
              professional because products can interact with medicines or
              other supplements.
              <a className="citation" href="#usana-source-5" aria-label="Source 5">
                [5]
              </a>
            </p>
            <ul>
              <li>Verify the exact product and current label.</li>
              <li>Match the ingredient, form, amount, and intended use to the evidence.</li>
              <li>Keep personal safety and medication questions separate from brand quality.</li>
            </ul>
          </div>
        </section>

        <section className="usana-catalog content-shell" id="catalog" aria-labelledby="catalog-title">
          <div>
            <p className="eyebrow">See the products</p>
            <h2 id="catalog-title">Explore the catalog with the evidence in view.</h2>
            <p>
              Open the USANA storefront to inspect the exact formula, serving
              size, Supplement Facts, other ingredients, price, and current
              availability.
            </p>
          </div>
          <div className="usana-catalog-action">
            <p>
              <strong>Affiliate disclosure:</strong> Joy Health may earn a
              commission if you buy through this link. Compensation does not
              change the evidence standards or the order of products.
            </p>
            <a href="https://sissi.usana.com/" rel="sponsored">
              Shop the USANA catalog <span aria-hidden="true">↗</span>
            </a>
            <small>You&apos;ll leave Joy Health for sissi.usana.com.</small>
          </div>
        </section>

        <section className="usana-sources content-shell" aria-labelledby="usana-sources-title">
          <header>
            <p className="eyebrow">Source trail</p>
            <h2 id="usana-sources-title">What Joy Health read.</h2>
            <p>
              Reviewed August 29, 2026. Company statements are labeled as such;
              the NSF listing and FDA guidance serve different evidence roles.
            </p>
          </header>
          <ol className="source-list usana-source-list">
            <li id="usana-source-1">
              <a href="https://ir.usana.com/company-information">
                USANA Health Sciences, Company Information
              </a>
              <p>
                Company-reported manufacturing share, R&amp;D scope, scientific
                disciplines, and product-development approach. Read August 29,
                2026.
              </p>
            </li>
            <li id="usana-source-2">
              <a href="https://info.nsf.org/Certified/Dietary/Listings.asp?CompanyName=usana&amp;StandardExt=FP">
                NSF Official Listings, USANA finished products under NSF/ANSI 173
              </a>
              <p>
                Independent listing record naming the facility, certification
                standard, and 12 finished products. Listing current August 27,
                2026; read August 29, 2026.
              </p>
            </li>
            <li id="usana-source-3">
              <a href="https://ir.usana.com/sustainability">
                USANA Health Sciences, 2025 Sustainability Highlights
              </a>
              <p>
                Company-reported R&amp;D investment, product launches, and GMP
                training completion. Read August 29, 2026.
              </p>
            </li>
            <li id="usana-source-4">
              <a href="https://ir.usana.com/news-events/press-releases/detail/795/usana-expands-its-nutritionals-line-with-powerful-new">
                USANA Health Sciences, 2025 Nutritionals Portfolio Announcement
              </a>
              <p>
                Company announcement documenting named formulation changes and
                product launches. It is not independent efficacy evidence. Read
                August 29, 2026.
              </p>
            </li>
            <li id="usana-source-5">
              <a href="https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements">
                U.S. Food and Drug Administration, Questions and Answers on Dietary Supplements
              </a>
              <p>
                Regulatory context for manufacturing practices, premarket
                approval, labeling, and consumer safety. Read August 29, 2026.
              </p>
            </li>
          </ol>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
