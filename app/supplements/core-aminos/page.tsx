import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import { labelSource, NSF_LISTING, ODS_EXERCISE } from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("coreAminos");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("coreAminos"),
  {
    title: "Daily Value on the Nutrition and Supplement Facts Labels",
    url: "https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels",
    publisher: "U.S. Food and Drug Administration",
    note: "Used for the current calcium Daily Value of 1,300 mg. Content current as of March 5, 2024; read September 23, 2026.",
  },
  ODS_EXERCISE,
  NSF_LISTING,
] as const;

export default function CoreAminosPage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          One scoop of Core Aminos lists nine essential amino acids totaling
          5,050 mg, led by 2,000 mg of leucine, plus 1,500 mg of calcium
          beta-hydroxy beta-methylbutyrate, known as calcium HMB. The label
          says how to mix a scoop but not how many to take in a day.
          <Citation source={1} />
        </>
      }
      labelNotes={
        <>
          <p>
            The calcium line has a percentage error. It lists 290 mg of calcium
            as 29% of the Daily Value, but the Daily Value FDA uses for calcium
            is 1,300 mg, which makes 290 mg about 22%. 29% is what 290 mg would
            be against a 1,000 mg reference.
            <Citation source={1} /><Citation source={2} />
          </p>
          <p>
            The calcium amount is also hard to account for. NIH notes that
            calcium HMB is about 13% calcium by weight, which puts 1,500 mg of
            it near 200 mg of calcium rather than 290 mg, and the label lists
            no other calcium source.
            <Citation source={1} /><Citation source={3} /> We could not
            reconcile the figure; only USANA can explain it.
          </p>
        </>
      }
      dailyIntro={
        <p>
          Calcium is the only ingredient here with an adult upper limit, and
          one scoop is far below it. Because the label gives no number of
          scoops per day, the table is per scoop.
        </p>
      }
      testing={
        <p>
          We found no independent test record for Core Aminos. It is not among
          the USANA products on NSF&apos;s NSF/ANSI 173 listing as of September
          23, 2026.
          <Citation source={4} /> That is the absence of a record, not evidence
          of a problem with the product.
        </p>
      }
      checks={
        <>
          <li>
            <strong>HMB over months.</strong> NIH says 3 g of HMB a day appears
            safe for short-term use in adults, but there is no expert consensus
            on its value or safety over several months or longer, and it has not
            been studied in adolescents.
            <Citation source={3} />
          </li>
          <li>
            <strong>Amino acid amounts.</strong> A scoop has 4 g of the three
            branched-chain amino acids (leucine, isoleucine, and valine). NIH
            reports that up to 20 g a day of branched-chain amino acid
            supplements in divided doses appears safe.
            <Citation source={1} /><Citation source={3} />
          </li>
          <li>
            <strong>Sports products in general.</strong> NIH notes that
            supplements used for exercise can have side effects and interact
            with medicines, and that many combine ingredients that have not
            been tested together.
            <Citation source={3} />
          </li>
          <li>
            <strong>Protein from food.</strong> Essential amino acids also come
            from protein foods; the{" "}
            <Link href="/nutrition/protein-and-fiber">protein and fiber guide</Link>{" "}
            covers food sources and reference amounts.
          </li>
        </>
      }
      relatedGuides={["protein-and-fiber", "supplement-evidence-and-safety"]}
    />
  );
}
