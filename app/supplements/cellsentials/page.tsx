import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import {
  labelSource,
  nccihPage,
  NSF_LISTING,
  ODS_CONSUMER,
  odsSheet,
  USANA_CELLSENTIALS_CONSUMERLAB,
} from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("cellsentials");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("cellsentials"),
  NSF_LISTING,
  USANA_CELLSENTIALS_CONSUMERLAB,
  odsSheet("Niacin", "Niacin", "Used for the niacin upper limit, its basis in skin flushing, how niacinamide differs, adult RDAs, and U.S. intakes from food. RDAs, U.S. intake data, and food sources re-read September 24, 2026."),
  odsSheet("Vitamin B6", "VitaminB6", "Used for the U.S. upper limit and the lower 2023 European limit."),
  odsSheet("Vitamin A and Carotenoids", "VitaminA", "Used for which vitamin A counts toward the upper limit and the pregnancy caution."),
  odsSheet("Vitamin K", "VitaminK", "Used for the warfarin interaction."),
  odsSheet("Biotin", "Biotin", "Used for lab-test interference."),
  odsSheet("Vitamin E", "VitaminE", "Used for the caution about antioxidant supplements during cancer treatment."),
  nccihPage("Green Tea", "green-tea", "Used for liver injury reports with green tea extracts."),
  nccihPage("Turmeric", "turmeric", "Used for liver injury reports with highly bioavailable curcumin formulations."),
  ODS_CONSUMER,
  odsSheet("Folate", "Folate", "Used for the folic acid upper limit."),
] as const;

export default function CellSentialsPage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          CellSentials is two products taken together, Vita Antioxidant and
          Core Minerals, and the label says to take two tablets of each twice
          a day, so a day is double the amounts per serving.
          <Citation source={1} /> At that amount it provides 40 mg of niacin,
          5 mg above the adult upper limit for niacin from supplements. No
          other nutrient on the label passes its upper limit on its own.
          <Citation source={4} /> Both bottles are on NSF&apos;s certification
          listing for dietary supplements.
          <Citation source={2} />
        </>
      }
      labelNotes={
        <>
          <p>
            Two rows need a closer read. Vitamin A&apos;s 1,804 µg RAE is 25%
            preformed vitamin A (516 µg of retinyl acetate) and 75% beta
            carotene and mixed carotenoids, and only the preformed part counts
            toward vitamin A&apos;s upper limit.
            <Citation source={1} /><Citation source={6} /> Folate&apos;s 500
            µg DFE comes from 300 µg of folic acid, which is what the folate
            upper limit counts.
            <Citation source={13} />
          </p>
          <p>
            Earlier CellSentials label images carried a &ldquo;Contains
            soy&rdquo; badge. The current label USANA publishes carries no soy
            statement, and its lecithin is sunflower lecithin.
            <Citation source={1} /> If soy matters to you, check the package
            you receive.
          </p>
        </>
      }
      dailyIntro={
        <>
          <p>
            Two servings of each bottle a day put niacin at 40 mg. The upper
            limit, 35 mg, applies to both forms of niacin in supplements,
            niacin and niacinamide, and is based on skin flushing.
            <Citation source={4} /> NIH describes that flushing as unpleasant
            rather than toxic and notes that niacinamide does not cause it. The
            label lists niacin &ldquo;as niacin and niacinamide&rdquo; without
            the split, so the label alone cannot tell you how likely flushing
            is.
            <Citation source={1} /><Citation source={4} />
          </p>
          <p>
            Most U.S. adults already get more niacin from food than they need.
            The recommended amount is 16 mg NE a day for men and 14 mg NE for
            women. In national survey data, average intake from foods and
            beverages alone was 31.4 mg for men and 21.3 mg for women, and only
            1% of adults fell below the Estimated Average Requirement from
            food. The upper limit counts only supplemental niacin, and NIH
            reports no adverse effects from niacin that occurs naturally in
            food.
            <Citation source={4} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> the label&apos;s
            directions are the manufacturer&apos;s, not a minimum. For someone
            whose diet already covers niacin, taking less is a reasonable
            option: one serving of each bottle a day instead of two provides
            20 mg of niacin, under the 35 mg limit, and halves every other
            amount in the table below. A doctor, pharmacist, or registered
            dietitian can help match a supplement to what a diet already
            provides.
          </p>
          <p>
            Vitamin B6 comes to 32 mg a day. That is under the U.S. upper limit
            of 100 mg but above the 12 mg adult limit that the European Food
            Safety Authority set in 2023, which NIH also reports.
            <Citation source={5} />
          </p>
        </>
      }
      testing={
        <>
          <p>
            Yes. Both halves are certified to NSF/ANSI 173: NSF&apos;s official listing for
            USANA&apos;s Salt Lake City facility names CellSentials
            Vita-Antioxidant and CellSentials Core Minerals under NSF/ANSI 173,
            each with a recommended daily serving of 4 tablets.
            <Citation source={2} /> USANA also announced in March 2026 that
            CellSentials earned the ConsumerLab.com Seal of Approval after
            testing for potency, purity, and label accuracy. That is the
            company&apos;s description; ConsumerLab&apos;s own report was not
            available to us.
            <Citation source={3} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> both checks ask whether
            the tablets match their label and meet contaminant limits. Neither
            tells you whether a multivitamin is worth taking; the{" "}
            <Link href="/nutrition/supplement-evidence-and-safety">supplement evidence guide</Link>{" "}
            covers how to weigh that.
          </p>
        </>
      }
      checks={
        <>
          <li>
            <strong>Warfarin.</strong> CellSentials provides 540 µg of vitamin
            K a day. NIH notes that vitamin K can interact seriously with
            warfarin, and that people taking it need a consistent vitamin K
            intake.
            <Citation source={7} />
          </li>
          <li>
            <strong>Pregnancy.</strong> NIH advises people who are or might be
            pregnant not to take high doses of vitamin A supplements, above
            3,000 µg RAE a day, and says to use the preformed share of a mixed
            label when comparing with that limit. CellSentials provides 3,608
            µg RAE of vitamin A a day, of which 1,032 µg is preformed.
            <Citation source={6} />
          </li>
          <li>
            <strong>Blood tests.</strong> CellSentials has 300 µg of biotin a
            day. NIH warns that biotin above recommended intakes can cause
            falsely high or low results on some lab tests; the thyroid-test
            interference it describes followed a single 10 mg dose. Mention
            your supplements when you have blood drawn.
            <Citation source={8} />
          </li>
          <li>
            <strong>Cancer treatment.</strong> NIH notes that oncologists
            generally advise against antioxidant supplements during
            chemotherapy or radiotherapy.
            <Citation source={9} />
          </li>
          <li>
            <strong>Liver.</strong> Each serving includes 35 mg of green tea
            extract and 36 mg of Meriva, a bioavailable curcumin complex. NIH
            reports uncommon cases of liver injury with green tea extracts and
            with highly bioavailable curcumin products.
            <Citation source={10} /><Citation source={11} />
          </li>
          <li>
            <strong>Doubling up.</strong>{" "}
            <Link href="/supplements/healthpak">HealthPak</Link> repeats
            CellSentials&apos; vitamins and minerals, so taking both doubles
            the amounts above. NIH notes that fortified foods and several
            supplements can add up to more than you think.
            <Citation source={12} />
          </li>
        </>
      }
      relatedGuides={["supplement-evidence-and-safety", "reading-food-labels"]}
    />
  );
}
