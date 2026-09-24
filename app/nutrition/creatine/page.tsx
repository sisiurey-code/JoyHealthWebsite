import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { GuideBreadcrumbs } from "../../components/guide-breadcrumbs";
import { GuideContents } from "../../components/guide-contents";
import { JsonLd } from "../../components/json-ld";
import { RelatedGuides } from "../../components/related-guides";
import { SourceList, type Source } from "../../components/source-list";
import { CREATINE_GUIDE, formatEditorialDate } from "../../lib/publications";
import {
  buildArticleJsonLd,
  buildGuideBreadcrumbJsonLd,
  buildGuideMetadata,
} from "../../lib/seo";
import { USANA_CLEAR_PROTEIN_LAUNCH } from "../../lib/supplement-sources";

const guide = CREATINE_GUIDE;
const { title } = guide;

export const metadata: Metadata = buildGuideMetadata(guide);

const breadcrumbJsonLd = buildGuideBreadcrumbJsonLd(guide);

const sources: readonly Source[] = [
  {
    title: "Dietary Supplements for Exercise and Athletic Performance: Fact Sheet for Health Professionals",
    url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
    publisher: "NIH Office of Dietary Supplements, updated April 1, 2024",
    note: "Full creatine section read. Used for how the body makes creatine, food sources, study doses, forms, weight gain, performance, and third-party certification. Limitation: its statement on several years of safe use rests partly on older and retrospective studies.",
  },
  {
    title: "Effects of resistance training combined with creatine supplementation on muscle strength, physical function, and muscle mass in older adults: a systematic review and three-level meta-analysis",
    url: "https://doi.org/10.3389/fnut.2026.1919884",
    publisher: "Yao L, Yang D, Gao J. Frontiers in Nutrition, 2026",
    note: "Full text read. Used for strength, muscle mass, and physical function in adults 60 and older. The authors declare no conflicts. Limitations: 11 trials, six at high risk of bias, all in healthy older adults.",
  },
  {
    title: "A 2-yr Randomized Controlled Trial on Creatine Supplementation during Exercise for Postmenopausal Bone Health",
    url: "https://doi.org/10.1249/MSS.0000000000003202",
    publisher: "Chilibeck PD et al., Medicine & Science in Sports & Exercise, 2023",
    note: "Full text read. Used for bone density and kidney-related adverse events over two years. Publicly funded; one author discloses an AlzChem advisory role. The authors report low compliance and high attrition.",
  },
  {
    title: "A short review of the most common safety concerns regarding creatine ingestion",
    url: "https://doi.org/10.3389/fnut.2025.1682746",
    publisher: "Longobardi I, Solis MY, Roschel H, Gualano B. Frontiers in Nutrition, 2025",
    note: "Full text read. Used for kidney function and the creatinine test caveat, stomach upset, cramps and dehydration, and the evidence gaps in kidney disease and pregnancy. Conflicts: creatine maker AlzChem paid the publication fee, and two authors disclose AlzChem grants or advisory roles. A narrative review.",
  },
  {
    title: "International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine",
    url: "https://doi.org/10.1186/s12970-017-0173-z",
    publisher: "Kreider RB et al., Journal of the International Society of Sports Nutrition, 2017",
    note: "Full text read. Used for how much creatine comes from diet and where the body stores it. Conflicts: prepared with support from the Council for Responsible Nutrition, a supplement-industry trade association, and several authors disclose ties to companies that sell creatine. A narrative review, not a systematic one.",
  },
  {
    title: "Muscle creatine loading in men",
    url: "https://pubmed.ncbi.nlm.nih.gov/8828669/",
    publisher: "Hultman E et al., Journal of Applied Physiology, 1996",
    note: "Abstract only. Used for loading compared with 3 g a day, and for how stores fall after stopping. Limitation: 31 men.",
  },
  {
    title: "Influence of age, sex, and type of exercise on the efficacy of creatine supplementation on lean body mass: a systematic review and meta-analysis of randomized clinical trials",
    url: "https://pubmed.ncbi.nlm.nih.gov/35986981/",
    publisher: "Delpino FM et al., Nutrition, 2022",
    note: "Abstract only. Used for lean mass with and without exercise, and by sex. Two co-authors disclose creatine-industry ties elsewhere. Lean mass includes body water.",
  },
  {
    title: "Creatine monohydrate for lean mass, strength, and bone density in postmenopausal women: a systematic review and meta-analysis",
    url: "https://doi.org/10.1080/15502783.2026.2668435",
    publisher: "Naddafha S, Antonio J, Kreider RB, Stout JR. Journal of the International Society of Sports Nutrition, 2026",
    note: "Full text read. Used for lean mass and strength in postmenopausal women. Conflicts: one author chairs an AlzChem-supported advisory board, and AlzChem paid part of the publication fee. Seven trials; the review was not prospectively registered.",
  },
  {
    title: "Creatine and improvement in cognitive function: evaluation of a health claim pursuant to Article 13(5) of Regulation (EC) No 1924/2006",
    url: "https://doi.org/10.2903/j.efsa.2024.9100",
    publisher: "EFSA Panel on Nutrition, Novel Foods and Food Allergens, EFSA Journal, 2024",
    note: "Full text read. Used for the regulator's conclusion on memory and thinking. The claim under review was submitted by AlzChem.",
  },
  {
    title: "Creatine supplementation for treating symptoms of depression: a systematic review and meta-analysis",
    url: "https://pubmed.ncbi.nlm.nih.gov/41189312/",
    publisher: "Eckert I, Lima J, Dariva AA. British Journal of Nutrition, 2025",
    note: "Abstract only. Used for the size and certainty of effects on depression symptoms. Conflict statements were not visible to us.",
  },
  USANA_CLEAR_PROTEIN_LAUNCH,
  {
    title: "Three weeks of creatine monohydrate supplementation affects dihydrotestosterone to testosterone ratio in college-aged rugby players",
    url: "https://pubmed.ncbi.nlm.nih.gov/19741313/",
    publisher: "van der Merwe J, Brooks NE, Myburgh KH. Clinical Journal of Sport Medicine, 2009",
    note: "Abstract only. The study behind the hair-loss concern: 20 men enrolled, and hair was not measured.",
  },
  {
    title: "Does creatine cause hair loss? A 12-week randomized controlled trial",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12020143/",
    publisher: "Lak M et al., Journal of the International Society of Sports Nutrition, 2025",
    note: "Full text read. Used for hair outcomes: 38 men completed 12 weeks. Several authors disclose advisory or consulting roles with supplement companies.",
  },
  {
    title: "Creatine: What It Does, Benefits, Supplements & Safety",
    url: "https://my.clevelandclinic.org/health/treatments/17674-creatine",
    publisher: "Cleveland Clinic, last updated April 26, 2023",
    note: "Used only for the groups in which it says evidence of safety is insufficient. Some of its other statements conflict with trial evidence, so we did not rely on them.",
  },
  {
    title: "FDA 101: Dietary Supplements",
    url: "https://www.fda.gov/consumers/consumer-updates/fda-101-dietary-supplements",
    publisher: "U.S. Food and Drug Administration",
    note: "Used for premarket approval and the advice to talk with a health care professional before taking a supplement.",
  },
  {
    title: "Agency Response Letter, GRAS Notice No. GRN 000931 (creatine monohydrate)",
    url: "https://www.fda.gov/media/144598/download",
    publisher: "U.S. Food and Drug Administration, 2020",
    note: "Full text read. Used for the scope of FDA's response to AlzChem's notice about one company's ingredient in foods at 1 g of creatine per serving.",
  },
];

const articleJsonLd = buildArticleJsonLd(guide, sources);

export default function CreatineGuide() {
  return (
    <main id="main-content">
      <article className="guide-article">
        <header className="guide-intro">
          <GuideBreadcrumbs guide={guide} />
          <p className="eyebrow">Nutrition guide</p>
          <h1>{title}</h1>
          <p className="guide-dek">
            For healthy adults, creatine monohydrate has a steady safety record
            in trials lasting up to about two years, and its best-supported
            benefit is modest: a little more strength gain when it is paired
            with resistance training, including for older adults.
            <Citation source={1} /><Citation source={2} /><Citation source={3} />{" "}
            Studies show no harm to the kidneys in healthy people, though
            creatine can raise a common kidney blood test, and early weight gain is mostly
            water.
            <Citation source={4} /><Citation source={1} /> Claims about memory,
            mood, and bone are much less settled. This guide separates those
            findings; it does not tell you whether to take creatine.
          </p>
          <div className="guide-meta" role="group" aria-label="Article details"><p>Prepared by <strong>Joy Health</strong></p><p><time dateTime={guide.datePublished}>{`Published ${formatEditorialDate(guide.datePublished)}`}</time></p></div>
        </header>

        <GuideContents />

        <section className="guide-section" aria-labelledby="meaning-title">
          <h2 id="meaning-title">What is creatine, and where does it come from?</h2>
          <div className="guide-copy">
            <p>
              Creatine is a compound the body makes and also gets from food.
              The liver and kidneys make about 1 g a day from three amino
              acids, and animal foods such as beef, pork, and salmon supply
              more. It helps muscles regenerate energy for short, hard efforts.
              <Citation source={1} /> About 95% of the body&apos;s creatine is
              stored in skeletal muscle.
              <Citation source={5} />
            </p>
            <p>
              On a typical mixed diet, about half the creatine the body needs
              comes from food, and muscle stores sit at roughly 60 to 80% of
              their maximum.
              <Citation source={5} /> Supplements raise those stores further:
              in one early study, muscle creatine rose about 20%.
              <Citation source={6} /> Vegetarians tend to start with lower
              stores and may respond more.
              <Citation source={1} />
            </p>
            <aside className="key-point" aria-label="Key point"><strong>Food supplies grams, not a study dose.</strong> A typical diet provides about 1 to 2 g of creatine a day; studies of supplements use 3 g a day or more.<Citation source={5} /><Citation source={1} /></aside>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="evidence-title">
          <h2 id="evidence-title">What does creatine do? What trials show, and what they don&apos;t</h2>
          <div className="guide-copy">
            <p>
              The findings below run from best supported to least. Many
              creatine researchers disclose ties to creatine makers, so we lean
              on independent reviews where they exist and note the ties where
              they don&apos;t.
            </p>
            <dl className="label-terms">
              <div>
                <dt>Short, hard efforts</dt>
                <dd>
                  NIH says creatine improves performance in repeated short
                  bursts of high-intensity activity, such as sprinting and
                  weight lifting, and is of little value for endurance sports.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Strength with training</dt>
                <dd>
                  In adults 60 and older, a 2026 meta-analysis of 11 trials,
                  by authors with no declared conflicts, found that creatine
                  plus resistance training improved strength more than
                  training alone. The effect was small, and the authors rated
                  the certainty moderate.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Muscle, with and without exercise</dt>
                <dd>
                  A 2022 meta-analysis of 35 trials found about 1.1 kg more
                  lean mass when creatine was combined with resistance
                  training, and essentially none without exercise (0.03 kg).
                  <Citation source={7} /> Lean mass includes water, so these
                  gains may overstate new muscle.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Muscle mass after 60</dt>
                <dd>
                  The 2026 analysis did not find a statistically significant
                  effect on muscle mass or physical function in people 60 and
                  older, with low and very low certainty.
                  <Citation source={2} />
                </dd>
              </div>
              <div>
                <dt>Women</dt>
                <dd>
                  A 2026 review of postmenopausal women found small gains in
                  lean mass (0.37 kg) and leg-press strength (7.5 kg) when at
                  least 5 g a day was paired with resistance training; its
                  authors disclose ties to a creatine maker.
                  <Citation source={8} /> Earlier pooled data found smaller
                  lean-mass gains in women than in men.
                  <Citation source={7} />
                </dd>
              </div>
              <div>
                <dt>Memory and thinking</dt>
                <dd>
                  The European Food Safety Authority reviewed the evidence in
                  2024, at a creatine maker&apos;s request, and concluded that a
                  cause-and-effect link to better cognitive function has not
                  been established.
                  <Citation source={9} />
                </dd>
              </div>
              <div>
                <dt>Mood</dt>
                <dd>
                  A 2025 meta-analysis of 11 trials in depression found an
                  average effect below the threshold considered clinically
                  important, with very low certainty.
                  <Citation source={10} /> Creatine is not a substitute for
                  depression treatment.
                </dd>
              </div>
              <div>
                <dt>Bone</dt>
                <dd>
                  In a 2-year trial of 237 postmenopausal women, creatine with
                  exercise did not change bone mineral density.
                  <Citation source={3} />
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="use-title">
          <h2 id="use-title">How creatine is taken in studies, and how to read a creatine label</h2>
          <div className="guide-copy">
            <p>
              Studies use two patterns. One loads 20 g a day, split into four
              5 g doses, for 5 to 7 days, then continues at 3 to 5 g a day.
              <Citation source={1} /> The other skips loading: 3 g a day raised
              muscle creatine by about as much over 28 days as loading did in 6
              days, and stores returned to normal about a month after
              stopping.
              <Citation source={6} /> Creatine monohydrate is the most studied
              form, and NIH says other, usually more expensive forms have not
              been shown to work better.
              <Citation source={1} /> Large single doses can upset the stomach;
              one review suggests single doses of 5 g or less.
              <Citation source={4} />
            </p>
            <ol className="reading-steps">
              <li>
                <h3>Find the form.</h3>
                <p>Look for creatine monohydrate by name.<Citation source={1} /></p>
              </li>
              <li>
                <h3>Find the amount per serving.</h3>
                <p>A Supplement Facts panel lists creatine with an amount. A product sold as a food carries a Nutrition Facts panel instead, which may name creatine only in the ingredient list.</p>
              </li>
              <li>
                <h3>Check what else the serving carries.</h3>
                <p>Protein, electrolytes, caffeine, and sweeteners change what a product is for. The <Link href="/nutrition/electrolyte-drinks">electrolyte drinks guide</Link> walks through that comparison.</p>
              </li>
              <li>
                <h3>Look for testing of that exact product.</h3>
                <p>NIH notes that independent certification gives some assurance that a product contains its labeled amounts, and that products sold for bodybuilding are among those most often adulterated.<Citation source={1} /></p>
              </li>
            </ol>
            <div className="worked-example">
              <p className="eyebrow">Worked example: the number is not on the label</p>
              <p>
                USANA&apos;s Clear Protein + Creatine Mix, one of the products
                on this site, carries a Nutrition Facts panel. It lists
                creatine monohydrate second among its ingredients but gives no
                amount; USANA&apos;s announcement says each serving has 5 g.
                <Citation source={11} /> That falls within the 3 to 5 g daily
                range used in studies, but you have to leave the label to
                learn it. The full panel is on the{" "}
                <Link href="/supplements/clear-protein-creatine">Clear Protein + Creatine page</Link>.
              </p>
              <p>
                <strong>Disclosure:</strong> Joy Health earns a commission on
                purchases made through its USANA storefront links, so read
                this as a label exercise, not a ranking.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="limits-title">
          <h2 id="limits-title">Is creatine safe? Kidneys, water weight, and who should check first</h2>
          <div className="guide-copy">
            <dl className="label-terms">
              <div>
                <dt>Kidneys</dt>
                <dd>
                  In healthy people, studies consistently show no harm to
                  kidney function.
                  <Citation source={4} /> One catch matters for blood tests:
                  the body turns creatine into creatinine, so supplements can
                  raise blood creatinine and make kidney function look worse on
                  the usual test without any injury.
                  <Citation source={1} /><Citation source={4} /> In the 2-year
                  trial, a few high-creatinine and low-eGFR results appeared
                  only in the creatine group, yet total kidney-related adverse
                  events were similar to placebo.
                  <Citation source={3} /> If you take creatine, tell whoever
                  orders your blood work; markers such as cystatin C do not
                  depend on creatinine.
                  <Citation source={4} />
                </dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>
                  Expect about 1 to 2 kg of weight gain in the first month,
                  largely from water retention.
                  <Citation source={1} />
                </dd>
              </div>
              <div>
                <dt>Stomach, cramps, dehydration</dt>
                <dd>
                  Stomach upset is uncommon and tied to large single doses.
                  Controlled studies do not support claims that creatine
                  causes dehydration or muscle cramps.
                  <Citation source={4} />
                </dd>
              </div>
              <div>
                <dt>Hair loss</dt>
                <dd>
                  The worry traces to one small 2009 study of rugby players
                  that found a rise in the hormone DHT; it did not measure
                  hair.
                  <Citation source={12} /> A 12-week trial in 38 men that did
                  measure hair found no change, though it was short and its
                  authors have supplement-industry ties.
                  <Citation source={13} />
                </dd>
              </div>
              <div>
                <dt>Who should check first</dt>
                <dd>
                  Evidence is lacking for people with kidney disease and during
                  pregnancy. A 2025 safety review advises close monitoring for
                  anyone with reduced kidney function and says creatine should
                  not be recommended in pregnancy outside research.
                  <Citation source={4} /> Cleveland Clinic adds breastfeeding,
                  diabetes, and liver disease to the groups where evidence is
                  insufficient, and says creatine may raise the risk of mania
                  in bipolar disorder.
                  <Citation source={14} /> FDA advises talking with a health
                  care professional before taking any supplement, especially
                  alongside medicines.
                  <Citation source={15} />
                </dd>
              </div>
              <div>
                <dt>Regulation</dt>
                <dd>
                  FDA does not approve supplements for safety or effectiveness
                  before they are sold.
                  <Citation source={15} /> Its 2020 letter on creatine
                  monohydrate answered one manufacturer&apos;s notice about
                  using 1 g per serving in foods and drinks, and states that it
                  is not an affirmation that creatine is generally recognized
                  as safe.
                  <Citation source={16} />
                </dd>
              </div>
            </dl>
            <ul className="limit-list">
              <li>The longest controlled trials in healthy adults run about two years, so rare or longer-term harms are harder to rule out.<Citation source={3} /></li>
              <li>This guide does not set a dose for you or say whether you should take creatine.</li>
              <li>It does not cover people under 18, athletes under drug-testing rules, or medical uses of creatine.</li>
              <li>It reports conflicts of interest but cannot correct for them.</li>
            </ul>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="sources-title">
          <h2 id="sources-title">Sources we read</h2>
          <div className="guide-copy">
            <p>
              All sources were read on September 23, 2026; several are
              abstracts only, as marked. Many creatine researchers disclose
              ties to creatine manufacturers, including AlzChem, or to the
              International Society of Sports Nutrition, which accepts industry
              sponsorship. We note those ties on each source.
            </p>
            <SourceList sources={sources} />
          </div>
        </section>

        <RelatedGuides guide={guide} />

        <section className="guide-provenance" aria-labelledby="about-title"><div><p className="eyebrow">About this guide</p><h2 id="about-title">Prepared by Joy Health</h2></div><div><p>Joy Health is an educational publisher, not a medical practice. The ordering of findings by strength of evidence is Joy Health interpretation checked against the claim-source record. No external clinical reviewer participated.</p><Link href="/standards">Read our editorial standards</Link></div></section>
        <aside className="medical-note" aria-label="Medical information notice"><strong>Medical information notice:</strong> Joy Health offers general education, not medical advice, diagnosis, or treatment. Seek qualified care for personal medical questions and urgent help for emergencies.</aside>
      </article>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </main>
  );
}
