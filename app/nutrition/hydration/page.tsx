import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { GuideBreadcrumbs } from "../../components/guide-breadcrumbs";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import {
  formatEditorialDate,
  HYDRATION_GUIDE,
} from "../../lib/publications";
import {
  buildArticleJsonLd,
  buildGuideBreadcrumbJsonLd,
  buildGuideMetadata,
} from "../../lib/seo";

const guide = HYDRATION_GUIDE;
const { title } = guide;

export const metadata: Metadata = buildGuideMetadata(guide);

const articleJsonLd = buildArticleJsonLd(guide);

const breadcrumbJsonLd = buildGuideBreadcrumbJsonLd(guide);

export default function HydrationGuide() {
  return (
    <main id="main-content">
      <article className="guide-article">
        <header className="guide-intro">
          <GuideBreadcrumbs guide={guide} />
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            Total water includes more than glasses of plain water. This guide
            explains the adult reference values, what they count, and why they
            are not precise requirements for every person or day.
          </p>
          <div className="guide-meta" role="group" aria-label="Article details"><p>Prepared by <strong>Joy Health</strong></p><p><time dateTime={guide.datePublished}>{`Published ${formatEditorialDate(guide.datePublished)}`}</time></p></div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">How much water should you drink? First define total water</h2>
          <div className="guide-copy">
            <p>
              The National Academies uses <em>total water</em> to include
              drinking water, water in other beverages, and moisture in foods.
              <Citation source={1} /> A bottle count includes only one part of
              that total unless it deliberately accounts for the other sources.
            </p>
            <p>
              The adult numbers are Adequate Intakes, or AIs. They were set from
              observed median U.S. intakes because the evidence did not support
              an Estimated Average Requirement and RDA. The report also says a
              wide range of intakes can be compatible with normal hydration.
              <Citation source={1} />
            </p>
            <aside className="key-point" aria-label="Key point"><strong>Ask what the number counts.</strong> Total water, beverage water, and plain drinking water are not interchangeable terms.</aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What the reference can tell us</h2>
          <div className="guide-copy">
            <p>
              The water DRI is a population reference for apparently healthy
              U.S. and Canadian people. Its values describe total water and are
              best read alongside how they were derived and what they leave out.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Total-water AI</dt>
                <dd>
                  The adult AI is 3.7 liters per day for men and 2.7 liters per
                  day for women. These totals include beverages and food and
                  were based on median intakes, not a measured requirement for
                  each individual.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Beverage estimate</dt>
                <dd>
                  Among adults ages 19 to 30 in the source data, beverages
                  supplied about 3.0 liters for men and 2.2 liters for women,
                  roughly 81 percent of total water. These are components of
                  the total-water reference, not extra amounts to add.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Food contribution</dt>
                <dd>
                  Food moisture supplied about 19 percent of total water in the
                  report&apos;s source data. The proportion varies with what a
                  person eats, so 19 percent is context, not a rule for every
                  meal or day.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Variation</dt>
                <dd>
                  The National Academies notes day-to-day variation with
                  activity and climate. CDC says recommendations also vary with
                  age, sex, pregnancy, and breastfeeding status.
                  <Citation source={1} /><Citation source={2} />
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
                <h3>Identify the reference type.</h3>
                <p>Read 3.7 and 2.7 liters as total-water AIs for adult population groups, not exact requirements or plain-water prescriptions.<Citation source={1} /></p>
              </li>
              <li>
                <h3>Count all stated sources.</h3>
                <p>Plain water, other beverages, and moisture in food contribute to total water. Do not add the beverage estimate on top of the total-water AI.<Citation source={1} /></p>
              </li>
              <li>
                <h3>Notice the context.</h3>
                <p>Ordinary conditions, activity, climate, age, sex, and life stage affect how useful a population reference is for a particular situation.<Citation source={1} /><Citation source={2} /></p>
              </li>
              <li>
                <h3>Stop where the guide stops.</h3>
                <p>Heat, prolonged exercise, vomiting or diarrhea, pregnancy or lactation, older age, and fluid-restricted conditions require context this guide does not compress into a formula.</p>
              </li>
            </ol>
            <div className="worked-example">
              <p className="eyebrow">A reference, not a jug size</p>
              <p>
                A 2.7-liter total-water AI does not mean 2.7 liters of plain
                water must be consumed in addition to coffee, tea, milk, soup,
                fruit, or other foods and beverages. All water-containing
                sources belong to the total. How much comes from each source
                varies.
                <Citation source={1} />
              </p>
            </div>
            <p>
              Comparing plain water with a sports drink or powder? Continue with
              the guide to <Link href="/nutrition/electrolyte-drinks">electrolytes versus water</Link>,
              which separates hydration, exercise losses, fuel, and extra active ingredients.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>The AIs come from older, self-reported intake data and are not measured individual requirements.</li>
              <li>The male and female categories are the source report&apos;s categories and do not capture every body size, physiology, or circumstance.</li>
              <li>The guide does not diagnose dehydration from urine color, thirst, headache, or any single sign.</li>
              <li>It does not provide exercise, heat, illness, pregnancy, lactation, or fluid-restriction instructions.</li>
            </ul>
            <p>Seek qualified care for persistent symptoms, illness, medication-related questions, or conditions that alter fluid or electrolyte needs. Use urgent help for emergencies.</p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>Both sources were read on August 28, 2026. The National Academies supplies the reference values and derivation; CDC supplies current variability context. Neither provides an individualized assessment.</p>
            <ol className="source-list">
              <li id="source-1"><a href="https://www.nationalacademies.org/read/10925/chapter/6">Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate, Chapter 4: Water</a><p>Institute of Medicine, 2005. Used for total-water definitions, AIs, source proportions, variability, and limitations. The values were based on older self-reported median intakes, and the report states that industry contributors helped fund the broader DRI project while conclusions remained those of the authoring panel.</p></li>
              <li id="source-2"><a href="https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html">About Water and Healthier Drinks</a><p>Centers for Disease Control and Prevention. Used only for current factors that vary daily recommendations. Limitation: general consumer guidance, not a clinical formula.</p></li>
            </ol>
          </div>
        </section>

        <section className="guide-provenance" aria-labelledby="about-title"><div><p className="eyebrow">About this guide</p><h2 id="about-title">Prepared by Joy Health</h2></div><div><p>Joy Health is an educational publisher, not a medical practice. The reference-reading sequence is Joy Health interpretation checked against the claim-source record. No external clinical reviewer participated.</p><Link href="/standards">Read our editorial standards</Link></div></section>
        <aside className="medical-note" aria-label="Medical information notice"><strong>Medical information notice:</strong> Joy Health offers general education, not medical advice, diagnosis, or treatment. Seek qualified care for personal medical questions and urgent help for emergencies.</aside>
      </article>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
