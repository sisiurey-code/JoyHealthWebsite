import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import {
  labelSource,
  NSF_LISTING,
  odsSheet,
  USANA_MAGNECAL_CONSUMERLAB,
} from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("magnecal");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("magnecal"),
  NSF_LISTING,
  {
    title: "MagneCal D product data (the How to Use text on USANA's product page)",
    url: "https://api.usana.com/cart/productGroup/byProduct/120.010103",
    publisher: "USANA Health Sciences",
    note: "The data behind USANA's MagneCal D product page, used only for its directions, which differ from the printed label. Read September 23, 2026.",
  },
  USANA_MAGNECAL_CONSUMERLAB,
  odsSheet("Magnesium", "Magnesium", "Used for the supplemental magnesium upper limit, effects of high doses, forms that often cause diarrhea, kidney function, spacing from medicines, adult RDAs, U.S. intakes, and food sources. RDAs, U.S. intake data, and food sources re-read September 24, 2026."),
  odsSheet("Calcium", "Calcium", "Used for kidney stones, cardiovascular questions, and spacing calcium carbonate from levothyroxine."),
  odsSheet("Vitamin D", "VitaminD", "Used for combining vitamin D with calcium supplements and with thiazide diuretics."),
] as const;

export default function MagneCalDPage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          The MagneCal D label says to take two tablets twice a day, which
          provides 520 mg of calcium, 520 mg of magnesium, 25 µg of vitamin
          D3, and 1.32 mg of boron a day.
          <Citation source={1} /> That magnesium total is 170 mg above 350 mg,
          the adult upper limit for magnesium from supplements.
          <Citation source={5} />
        </>
      }
      labelNotes={
        <>
          <p>
            The directions differ by source. The printed label says two tablets
            twice daily, and NSF&apos;s listing gives a recommended daily
            serving of 4 tablets.
            <Citation source={1} /><Citation source={2} /> USANA&apos;s product
            page says two tablets a day, which would halve every daily amount
            below and put magnesium at 260 mg.
            <Citation source={3} /> We use the printed label.
          </p>
          <p>
            The calcium and magnesium come from citrate and carbonate forms.
            <Citation source={1} /> NIH lists magnesium carbonate among the
            forms most often reported to cause diarrhea.
            <Citation source={5} />
          </p>
        </>
      }
      dailyIntro={
        <>
          <p>
            At four tablets a day, magnesium is 520 mg. The adult upper limit of
            350 mg counts only magnesium from supplements and medications, which
            is why it sits below the recommended total intake for many adults;
            food does not change the comparison. NIH notes that high doses of
            supplemental magnesium often cause diarrhea, sometimes with nausea
            and abdominal cramping, and that the risk of toxicity rises with
            impaired kidney function.
            <Citation source={5} /> Calcium, at 520 mg, and vitamin D, at 25 µg,
            are under their upper limits on their own, though both add to what
            food and other supplements provide.
          </p>
          <p>
            Many people in the United States eat less magnesium than the
            recommended 400 to 420 mg a day for men and 310 to 320 mg for women.
            Green leafy
            vegetables, legumes, nuts, seeds, and whole grains are good sources,
            and magnesium from food does not pose a risk in healthy people
            because the kidneys eliminate the excess.
            <Citation source={5} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> the label&apos;s four
            tablets a day are the manufacturer&apos;s direction, not a minimum,
            and USANA&apos;s own product page says two.
            <Citation source={3} /> Two tablets provide 260 mg of magnesium and
            260 mg of calcium, under the 350 mg limit for supplemental
            magnesium. For someone whose diet already supplies much of their
            magnesium, the smaller amount is a reasonable option. A doctor,
            pharmacist, or registered dietitian can help match a supplement to
            what a diet already provides.
          </p>
        </>
      }
      testing={
        <>
          <p>
            Yes. MagneCal D is certified to NSF/ANSI 173: NSF&apos;s official listing for USANA&apos;s
            Salt Lake City facility names MagneCal™ D under NSF/ANSI 173, with
            a recommended daily serving of 4 tablets.
            <Citation source={2} /> USANA also announced in November 2025 that
            MagneCal D earned the ConsumerLab.com Seal of Approval after
            testing showed it delivered its claimed calcium, magnesium, vitamin
            D, and boron and disintegrated properly. That is the company&apos;s
            account; ConsumerLab&apos;s report was not available to us.
            <Citation source={4} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> both checks ask whether
            the tablets match their label. They do not change the magnesium
            arithmetic above.
          </p>
        </>
      }
      checks={
        <>
          <li>
            <strong>Kidney disease.</strong> The risk of magnesium toxicity
            rises with impaired kidney function.
            <Citation source={5} />
          </li>
          <li>
            <strong>Medicines that bind minerals.</strong> NIH notes that
            spacing magnesium-containing supplements at least 2 hours from oral
            bisphosphonates can minimize an interaction, and that tetracycline
            and quinolone antibiotics should be taken at least 2 hours before
            or 4 to 6 hours after them.
            <Citation source={5} /> Levothyroxine&apos;s label says to avoid
            taking it within 4 hours of calcium carbonate supplements.
            <Citation source={6} />
          </li>
          <li>
            <strong>Water pills.</strong> NIH notes that thiazide diuretics
            combined with vitamin D supplements might lead to high blood
            calcium, especially in older adults and people with reduced kidney
            function.
            <Citation source={7} />
          </li>
          <li>
            <strong>Calcium supplements.</strong> NIH notes that higher intakes
            of supplemental calcium might increase the risk of kidney stones,
            and that some research suggests calcium supplements could raise
            cardiovascular risk.
            <Citation source={6} />
          </li>
          <li>
            <strong>Doubling up.</strong>{" "}
            Taking MagneCal D with{" "}
            <Link href="/supplements/cellsentials">CellSentials</Link> at both
            labels&apos; directions adds up to 746 mg of supplemental magnesium
            a day. By our reading of the labels, each{" "}
            <Link href="/supplements/healthpak">HealthPak</Link> packet already
            holds the equivalent of one MagneCal D tablet, so taking both adds
            to the magnesium total too.
          </li>
        </>
      }
      relatedGuides={["supplement-evidence-and-safety", "reading-food-labels"]}
    />
  );
}
