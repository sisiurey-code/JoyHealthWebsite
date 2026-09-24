import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import {
  FDA_MIXING,
  labelSource,
  NSF_LISTING,
  ODS_EXERCISE,
  odsSheet,
} from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("biomega");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("biomega"),
  NSF_LISTING,
  odsSheet(
    "Omega-3 Fatty Acids",
    "Omega3FattyAcids",
    "Used for the warfarin and atrial fibrillation findings. Limitation: the atrial fibrillation trials used 4 g a day of prescription products in people with or at high risk of cardiovascular disease.",
  ),
  {
    title: "Response to the Petition for a Health Claim for Eicosapentaenoic Acid and Docosahexaenoic Acid and Reduction of Blood Pressure in the General Population (Docket No. FDA-2014-Q-1146)",
    url: "https://www.fda.gov/media/128043/download",
    publisher: "U.S. Food and Drug Administration, letter to the Global Organization for EPA and DHA Omega-3s, 2019",
    note: "Used for FDA's conclusion that supplements providing no more than 5 g a day of EPA and DHA are safe and lawful when used as labeled. Read September 23, 2026.",
  },
  odsSheet("Vitamin D", "VitaminD", "Used for where vitamin D toxicity comes from."),
  ODS_EXERCISE,
  FDA_MIXING,
] as const;

export default function BiOmegaPage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          Two BiOmega capsules, the daily amount on the label, provide 1,200
          mg of omega-3 fatty acids, including 640 mg of EPA and 460 mg of DHA,
          plus 5 µg of vitamin D3.
          <Citation source={1} /> BiOmega is also one of the USANA products on
          NSF&apos;s certification listing for dietary supplements.
          <Citation source={2} />
        </>
      }
      labelNotes={
        <>
          <p>
            EPA and DHA are listed inside the total omega-3 amount. Together
            they make up 1,100 mg of the 1,200 mg; the label does not name the
            other 100 mg. The fish behind the oil are named in the allergen
            line: anchovy, mackerel, sardine, and tilapia.
            <Citation source={1} />
          </p>
        </>
      }
      dailyIntro={
        <p>
          At two capsules a day, vitamin D is the only BiOmega ingredient with
          an adult Tolerable Upper Intake Level (UL), and 5 µg is small next to
          the 100 µg limit. It does add to the vitamin D in the other products
          below, and NIH notes that vitamin D toxicity almost always comes
          from supplements.
          <Citation source={5} /> Fish oil has no UL. FDA has concluded that
          supplements providing no more than 5 g of EPA and DHA a day, used as
          labeled, are safe and lawful; two capsules provide 1.1 g.
          <Citation source={4} />
        </p>
      }
      testing={
        <>
          <p>
            Yes. BiOmega is certified to NSF/ANSI 173: NSF&apos;s official listing for
            USANA&apos;s Salt Lake City facility names &ldquo;OPTIMIZERS™,
            BiOmega™&rdquo; under NSF/ANSI 173, the dietary supplement
            standard, with a recommended daily serving of 2 gelcaps.
            <Citation source={2} /> NIH describes this kind of third-party
            certification as independent assurance that a product contains the
            labeled amounts of its ingredients.
            <Citation source={6} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> the listing answers a
            quality question about this product. It does not show that fish oil
            will do a particular thing for a particular person; the{" "}
            <Link href="/nutrition/supplement-evidence-and-safety">supplement evidence guide</Link>{" "}
            explains how to match a claim to evidence.
          </p>
        </>
      }
      checks={
        <>
          <li>
            <strong>Fish allergy.</strong> The label says it contains fish:
            anchovy, mackerel, sardine, and tilapia.
            <Citation source={1} />
          </li>
          <li>
            <strong>Blood thinners.</strong> NIH notes that fish oil might
            prolong clotting times when taken with warfarin, though most
            research finds that 3 to 6 g of fish oil a day does not
            significantly change anticoagulant status.
            <Citation source={3} />
          </li>
          <li>
            <strong>Heart rhythm.</strong> Two large trials found that 4 g a
            day of prescription omega-3 products slightly raised the risk of
            atrial fibrillation in people with or at high risk of heart
            disease.
            <Citation source={3} /> Those trials used different products at
            several times this dose, so ask a clinician if you have a heart
            rhythm condition rather than assuming either way.
          </li>
          <li>
            <strong>Surgery.</strong> FDA notes that a clinician may ask you to
            stop supplements two or three weeks before a procedure, in part
            because of bleeding risk.
            <Citation source={7} />
          </li>
          <li>
            <strong>Vitamin D from several products.</strong> Add BiOmega&apos;s
            5 µg to any other vitamin D you take; the table above shows the
            amounts in the other products on this site.
          </li>
        </>
      }
      relatedGuides={["supplement-evidence-and-safety", "reading-food-labels"]}
    />
  );
}
