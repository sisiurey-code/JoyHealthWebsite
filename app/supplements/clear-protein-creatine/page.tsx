import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import {
  NSF_LISTING,
  ODS_EXERCISE,
  USANA_CLEAR_PROTEIN_LAUNCH,
} from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("clearProtein");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [USANA_CLEAR_PROTEIN_LAUNCH, ODS_EXERCISE, NSF_LISTING] as const;

export default function ClearProteinCreatinePage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          Each 50-calorie serving of Clear Protein + Creatine Mix provides 10 g
          of protein from whey protein isolate, according to its Nutrition
          Facts panel, and 5 g of creatine monohydrate, according to
          USANA&apos;s launch announcement. The panel itself does not state the
          creatine amount.
          <Citation source={1} />
        </>
      }
      labelNotes={
        <>
          <p>
            This product carries a Nutrition Facts panel, the label format for
            foods, rather than a Supplement Facts panel. The panel lists
            nutrients such as protein, sodium, and potassium. Creatine
            monohydrate appears only in the ingredient list, second after whey
            protein isolate, with no amount; the 5 g figure comes from
            USANA&apos;s announcement.
            <Citation source={1} />
          </p>
          <p>
            The four minerals on the panel add up to 625 mg, which fits the
            announcement&apos;s &ldquo;more than 600 mg of electrolytes.&rdquo;
            The announcement also says to mix a serving with 8 to 10 ounces of
            water and lists two flavors, Twisted Citrus and Green Apple, in
            20-serving bags and 14-packet boxes.
            <Citation source={1} />
          </p>
        </>
      }
      dailyIntro={
        <p>
          The label does not say how many servings to take in a day, so the
          table is per serving. For what research says about taking 5 g of
          creatine a day, including water weight and kidney blood tests, read
          our <Link href="/nutrition/creatine">creatine guide</Link>.
        </p>
      }
      testing={
        <>
          <p>
            We found no independent test record for this product. It is not
            among the USANA products on NSF&apos;s NSF/ANSI 173 listing as of
            September 23, 2026.
            <Citation source={3} /> USANA&apos;s announcement says it is made
            in an FDA-registered, GMP-certified facility, which describes the
            manufacturing site rather than a test of this product.
            <Citation source={1} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> independent testing
            matters more than usual in this category. NIH notes that products
            marketed as bodybuilding supplements are among those most often
            adulterated with undeclared ingredients.
            <Citation source={2} />
          </p>
        </>
      }
      checks={
        <>
          <li>
            <strong>Milk allergy.</strong> The panel says the product contains
            milk, from whey protein isolate.
          </li>
          <li>
            <strong>Creatine.</strong> NIH notes that creatine often leads to
            weight gain from water retention.
            <Citation source={2} /> Our{" "}
            <Link href="/nutrition/creatine">creatine guide</Link> covers kidney
            blood tests, pregnancy, and who should ask a clinician first.
          </li>
          <li>
            <strong>Protein.</strong> No upper limit is set for protein, but
            the Food and Nutrition Board advises caution about high intakes
            from foods and supplements together because data on their effects
            are limited.
            <Citation source={2} />
          </li>
          <li>
            <strong>Sodium.</strong> Each serving has 240 mg of sodium, 10% of
            the Daily Value, which matters if you are limiting salt.
          </li>
        </>
      }
      relatedGuides={["creatine", "electrolyte-drinks", "protein-and-fiber"]}
    />
  );
}
