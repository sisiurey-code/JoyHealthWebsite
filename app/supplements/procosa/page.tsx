import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import {
  labelSource,
  nccihPage,
  NSF_LISTING,
  odsSheet,
} from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("procosa");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("procosa"),
  NSF_LISTING,
  nccihPage(
    "Glucosamine and Chondroitin for Osteoarthritis: What You Need To Know",
    "glucosamine-and-chondroitin-for-osteoarthritis-what-you-need-to-know",
    "Used for blood glucose, warfarin, and pregnancy notes. Limitation: it covers glucosamine generally and does not distinguish vegetarian sources.",
  ),
  nccihPage("Turmeric", "turmeric", "Used for liver injury reports with highly bioavailable curcumin formulations and the pregnancy caution."),
  odsSheet("Manganese", "Manganese", "Used for the manganese upper limit and liver disease."),
] as const;

export default function ProcosaPage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          Three Procosa tablets, the daily amount on the label, provide 1,500
          mg of vegetarian glucosamine hydrochloride and 247 mg of Meriva
          curcumin complex, plus 225 mg of vitamin C, 44 mg of magnesium, 5 mg
          of manganese, and 94 mg of potassium.
          <Citation source={1} /> Procosa is on NSF&apos;s certification
          listing for dietary supplements.
          <Citation source={2} />
        </>
      }
      labelNotes={
        <p>
          Glucosamine and the curcumin complex sit inside what the label calls
          the InCelligence Joint-Support Complex, and neither has a Daily
          Value. The label names the curcumin ingredient &ldquo;Meriva
          Bioavailable Curcumin Complex.&rdquo;
          <Citation source={1} />
        </p>
      }
      dailyIntro={
        <p>
          Manganese is the Procosa nutrient closest to an upper limit, at 5 mg
          a day against 11 mg.{" "}
          <Link href="/supplements/cellsentials">CellSentials</Link> and{" "}
          <Link href="/supplements/healthpak">HealthPak</Link> each add 2 mg a
          day, which brings a combination to 7 mg before food. NIH notes that
          people with chronic liver disease are more susceptible to excess
          manganese.
          <Citation source={5} />
        </p>
      }
      testing={
        <>
          <p>
            Yes. Procosa is certified to NSF/ANSI 173: NSF&apos;s official listing for USANA&apos;s
            Salt Lake City facility names PROCOSA™ under NSF/ANSI 173, with a
            recommended daily serving of 3 tablets.
            <Citation source={2} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> the listing is about
            whether the tablets match their label. Whether glucosamine or
            curcumin helps joints is a separate evidence question; the{" "}
            <Link href="/nutrition/supplement-evidence-and-safety">supplement evidence guide</Link>{" "}
            explains how to check a claim like that.
          </p>
        </>
      }
      checks={
        <>
          <li>
            <strong>Warfarin.</strong> NIH notes that glucosamine and
            chondroitin have been associated with an increased risk of
            bleeding in people taking warfarin.
            <Citation source={3} />
          </li>
          <li>
            <strong>Blood sugar.</strong> Glucosamine may raise blood glucose
            in some people, NIH reports.
            <Citation source={3} />
          </li>
          <li>
            <strong>Liver.</strong> NIH reports liver damage in some people who
            took highly bioavailable curcumin formulations, and people with
            chronic liver disease are more susceptible to excess manganese.
            <Citation source={4} /><Citation source={5} />
          </li>
          <li>
            <strong>Pregnancy and breastfeeding.</strong> NIH says turmeric
            supplements during pregnancy may be unsafe, and that little is
            known about glucosamine during pregnancy or breastfeeding.
            <Citation source={3} /><Citation source={4} />
          </li>
        </>
      }
      relatedGuides={["supplement-evidence-and-safety", "reading-food-labels"]}
    />
  );
}
