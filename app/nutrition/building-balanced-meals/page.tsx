import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { GuideBreadcrumbs } from "../../components/guide-breadcrumbs";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import {
  BALANCED_MEALS_GUIDE,
  formatEditorialDate,
} from "../../lib/publications";
import {
  buildArticleJsonLd,
  buildGuideBreadcrumbJsonLd,
  buildGuideMetadata,
} from "../../lib/seo";

const guide = BALANCED_MEALS_GUIDE;
const { title } = guide;

export const metadata: Metadata = buildGuideMetadata(guide);

const articleJsonLd = buildArticleJsonLd(guide);

const breadcrumbJsonLd = buildGuideBreadcrumbJsonLd(guide);

export default function BalancedMealsGuide() {
  return (
    <main id="main-content">
      <article className="guide-article">
        <header className="guide-intro">
          <GuideBreadcrumbs guide={guide} />
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            There is no Joy Health score for a perfect plate. This guide offers
            a flexible way to notice what a meal already contains and decide
            whether one practical addition would help. It does not prescribe
            portions, calories, or an ideal meal shape.
          </p>
          <div className="guide-meta" role="group" aria-label="Article details">
            <p>
              Prepared by <strong>Joy Health</strong>
            </p>
            <p>
              <time dateTime={guide.datePublished}>
                {`Published ${formatEditorialDate(guide.datePublished)}`}
              </time>
            </p>
          </div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">What makes a balanced meal?</h2>
          <div className="guide-copy">
            <p>
              Joy Health uses <em>balanced meal</em> as practical shorthand for
              a meal that combines more than one useful food role and still
              leaves room for the foods, appetite, access, culture, and
              preferences in front of you. It is not a federal definition or a
              universal formula.
            </p>
            <p>
              The advisory scientific report defines a dietary pattern by the
              usual quantities and frequencies of foods and beverages over a
              period or life stage. It also notes that patterns can be examined
              at an eating occasion, such as breakfast or a snack.
              <Citation source={2} /> Joy Health interprets that distinction to
              mean a single meal can contribute to a broader pattern without
              having to reproduce the whole pattern perfectly.
            </p>
            <aside className="key-point" aria-label="Key point">
              <strong>Begin with what is already there.</strong> A bowl, stew,
              sandwich, plate, or shared set of dishes can all be the starting
              point. Mixed dishes count; foods do not need separate
              compartments.
            </aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What the evidence can tell us</h2>
          <div className="guide-copy">
            <p>
              The current federal policy names broad categories including
              protein foods, dairy, vegetables, fruits, fats, and whole grains.
              It also says calorie needs vary with individual characteristics
              and activity.
              <Citation source={1} /> That is population guidance, not a
              personalized plate prescription.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Patterns, not perfection</dt>
                <dd>
                  The advisory report describes dietary patterns across time
                  and says they are influenced by factors including food
                  availability, cooking methods, socioeconomic conditions,
                  population norms, preferences, and cultural foodways.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Categories, not compartments</dt>
                <dd>
                  Federal policy identifies food categories, but it does not
                  establish Joy Health&apos;s framework or require every category
                  to appear in a separately divided plate at every meal.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Models, not personal outcomes</dt>
                <dd>
                  Food pattern modeling illustrates how changing types or
                  amounts of foods in an existing pattern might affect whether
                  modeled nutrient needs are met.
                  <Citation source={3} /> It is not a clinical trial and does
                  not prove that this guide&apos;s meal-building method changes a
                  person&apos;s health.
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
                <h3>Name what is already in the meal.</h3>
                <p>
                  Start with the actual food, not an idealized diagram. Notice
                  the broad categories present, including ingredients inside a
                  mixed dish. There is no need to take the dish apart.
                </p>
              </li>
              <li>
                <h3>Look for combination and variety.</h3>
                <p>
                  Ask whether the meal draws from more than one category named
                  in current guidance, such as a protein food, vegetables or
                  fruit, a grain or other starchy food, dairy, or a source of
                  fat. Not every meal needs every category.
                  <Citation source={1} />
                </p>
              </li>
              <li>
                <h3>Choose one useful change, if any.</h3>
                <p>
                  If an addition fits your appetite, access, budget, and taste,
                  choose the easiest one. If the meal already works for the
                  occasion, leave it alone. This is Joy Health interpretation,
                  not a clinical rule.
                </p>
              </li>
              <li>
                <h3>Return to the longer view.</h3>
                <p>
                  Consider variety across meals and days rather than turning
                  one eating occasion into a pass or fail test. Dietary-pattern
                  research looks beyond one isolated plate.
                  <Citation source={2} />
                </p>
              </li>
            </ol>

            <div className="worked-example">
              <p className="eyebrow">Different structures can work</p>
              <p>
                Rice and beans with salsa and avocado; lentil soup with bread
                and fruit; yogurt or a fortified alternative with oats, berries,
                and nuts; and a noodle bowl with tofu or chicken and vegetables
                do not share one plate shape. Each combines familiar foods in a
                different structure. These examples illustrate the framework;
                they are not personalized portions or claims of nutritional
                equivalence.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Limits and open questions</h2>
          <div className="guide-copy">
            <ul className="limit-list">
              <li>
                <em>Balanced</em> has no single meaning in this guide beyond the
                modest Joy Health definition above. It is not a nutrient score
                or guarantee of a health outcome.
              </li>
              <li>
                Federal policy is population guidance. It explicitly notes
                that needs vary, and this guide does not turn its categories or
                serving goals into personal targets.
                <Citation source={1} />
              </li>
              <li>
                The advisory report informed the federal process, but it is not
                the final 2025–2030 policy. This guide keeps those evidence
                roles separate.
                <Citation source={1} />
                <Citation source={2} />
              </li>
              <li>
                Food pattern models use structured assumptions and modeled
                nutrient goals. They do not reproduce every real meal, access
                constraint, preference, or individual response.
                <Citation source={3} />
              </li>
              <li>
                This guide excludes therapeutic diets, weight-loss plans,
                pregnancy, children, eating-disorder treatment, and athletic
                fueling.
              </li>
            </ul>
            <p>
              If a medical condition, allergy, prescribed diet, or recovery
              plan shapes what you eat, use qualified professional guidance
              for decisions that depend on your circumstances.
            </p>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              All three sources were read on August 22, 2026. The current policy,
              the earlier advisory scientific report, and food pattern modeling
              have different roles. No health-outcome claim from these sources
              is adopted in this guide.
            </p>
            <ol className="source-list">
              <li id="source-1">
                <a href="https://cdn.realfood.gov/DGA.pdf">
                  Dietary Guidelines for Americans, 2025–2030
                </a>
                <p>
                  U.S. Department of Health and Human Services and U.S.
                  Department of Agriculture. Used for current policy categories
                  and its statement that individual calorie needs vary.
                  Limitation: a brief population policy document, not an
                  individualized plan or the test of this framework.
                </p>
              </li>
              <li id="source-2">
                <a href="https://www.dietaryguidelines.gov/sites/default/files/2024-12/Part%20D_Ch%202_Dietary%20Patterns_FINAL_508.pdf">
                  Scientific Report of the 2025 Dietary Guidelines Advisory
                  Committee, Part D, Chapter 2: Dietary Patterns
                </a>
                <p>
                  Used for the definition and influences of dietary patterns.
                  Limitation: an advisory report submitted before the final
                  policy. Its health-outcome reviews are outside this guide&apos;s
                  claim set.
                </p>
              </li>
              <li id="source-3">
                <a href="https://www.dietaryguidelines.gov/2025-advisory-committee-report/food-pattern-modeling">
                  Food Pattern Modeling for the 2025 Advisory Committee Report
                </a>
                <p>
                  DietaryGuidelines.gov. Used to describe the modeling method,
                  its protocols, and its questions. Limitation: models can
                  illustrate nutrient implications but do not prescribe an
                  individual meal or prove a health outcome.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="guide-provenance" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About this guide</p>
            <h2 id="about-title">Prepared by Joy Health</h2>
          </div>
          <div>
            <p>
              Joy Health is an educational publisher, not a medical practice.
              The practical framework and examples are Joy Health
              interpretation, checked against the claim-source record created
              for this page. No external clinical reviewer participated.
            </p>
            <Link href="/standards">Read our editorial standards</Link>
          </div>
        </section>

        <aside className="medical-note" aria-label="Medical information notice">
          <strong>Medical information notice:</strong> Joy Health offers general
          education, not medical advice, diagnosis, or treatment. Seek qualified
          care for personal medical questions and urgent help for emergencies.
        </aside>
      </article>

      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
