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
} from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("healthpak");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("healthpak"),
  NSF_LISTING,
  odsSheet("Magnesium", "Magnesium", "Used for the supplemental magnesium upper limit, effects of high doses, kidney function, spacing from medicines, adult RDAs, U.S. intakes, and food sources. RDAs, U.S. intake data, and food sources re-read September 24, 2026."),
  odsSheet("Niacin", "Niacin", "Used for the niacin upper limit, its basis in skin flushing, adult RDAs, and U.S. intakes from food. RDAs, U.S. intake data, and food sources re-read September 24, 2026."),
  odsSheet("Calcium", "Calcium", "Used for spacing calcium carbonate from levothyroxine."),
  odsSheet("Vitamin K", "VitaminK", "Used for the warfarin interaction."),
  odsSheet("Vitamin A and Carotenoids", "VitaminA", "Used for the pregnancy caution and counting preformed vitamin A."),
  ODS_CONSUMER,
  nccihPage("Green Tea", "green-tea", "Used for liver injury reports with green tea extracts."),
  nccihPage("Turmeric", "turmeric", "Used for liver injury reports with highly bioavailable curcumin formulations."),
] as const;

export default function HealthPakPage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          Each HealthPak packet lists vitamins A through K and the B vitamins,
          243 mg each of calcium and magnesium, trace minerals, and a complex
          with 125 mg of alpha-lipoic acid and 90 mg of quercetin. The label
          says to take one packet in the morning and one in the evening.
          <Citation source={1} /> At two packets a day it provides 486 mg of
          magnesium and 40 mg of niacin, both above the adult upper limits for
          those nutrients from supplements.
          <Citation source={3} /><Citation source={4} />
        </>
      }
      labelNotes={
        <>
          <p>
            Comparing the labels, almost every vitamin and mineral row in a
            packet equals one serving of{" "}
            <Link href="/supplements/cellsentials">CellSentials</Link> plus one{" "}
            <Link href="/supplements/magnecal-d">MagneCal D</Link> tablet, which
            is half a MagneCal D serving. Silicon is the exception, at 4.25 mg
            against CellSentials&apos; 2 mg. The complex adds more alpha-lipoic
            acid (125 mg) and quercetin (90 mg) than CellSentials, plus a
            Pterocarpus marsupium extract.
            <Citation source={1} /> This comparison is Joy Health&apos;s
            reading of the two labels.
          </p>
          <p>
            The current label, item 100.010105, is the one transcribed here and
            shown in the photo. Compared with the previous label, item
            100.010104, which Joy Health read from an earlier label photo, it
            raises alpha-lipoic
            acid from 63 to 125 mg and quercetin from 78 to 90 mg, lowers the
            Meriva curcumin complex from 58 to 36 mg, drops astaxanthin, and
            adds 50 mg of Pterocarpus marsupium extract. The vitamins,
            minerals, and directions did not change.
            <Citation source={1} />
          </p>
        </>
      }
      dailyIntro={
        <>
          <p>
            Two packets a day provide 486 mg of magnesium, 136 mg above the
            adult upper limit of 350 mg. That limit counts only magnesium from
            supplements and medications, not food, so the comparison holds
            whatever you eat. NIH notes that high doses of magnesium from
            supplements often cause diarrhea, sometimes with nausea and
            abdominal cramping, and that the risk of magnesium toxicity rises
            when kidney function is impaired.
            <Citation source={3} />
          </p>
          <p>
            Niacin comes to 40 mg a day against a 35 mg upper limit for
            supplemental niacin that is based on skin flushing, which NIH
            describes as unpleasant rather than toxic.
            <Citation source={4} /> The{" "}
            <Link href="/supplements/cellsentials">CellSentials page</Link>{" "}
            explains why the label alone cannot tell you how likely that
            flushing is.
          </p>
          <p>
            Food changes the picture differently for the two nutrients. Most
            U.S. adults already get more niacin from food than the recommended
            16 mg NE a day for men or 14 mg NE for women; only 1% fall below the
            Estimated Average Requirement from food alone.
            <Citation source={4} /> Magnesium is the reverse: many people in
            the United States consume less than the recommended 400 to 420 mg a
            day for men or 310 to 320 mg for women. Neither upper limit counts
            what food provides, and magnesium from food does not pose a risk in
            healthy people because the kidneys eliminate the excess.
            <Citation source={3} /><Citation source={4} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> the label&apos;s
            directions are the manufacturer&apos;s, not a minimum. One packet a
            day instead of two provides 20 mg of niacin and 243 mg of
            magnesium, both under their limits, and halves everything else in
            the packet. That is a reasonable option for someone whose diet
            already supplies niacin and much of their magnesium, from foods
            such as green leafy vegetables, legumes, nuts, seeds, and whole
            grains.
            <Citation source={3} /> A doctor, pharmacist, or registered
            dietitian can help match a supplement to what a diet already
            provides.
          </p>
        </>
      }
      testing={
        <>
          <p>
            Yes. HealthPak is certified to NSF/ANSI 173: NSF&apos;s official listing for USANA&apos;s
            Salt Lake City facility names Healthpak™ under NSF/ANSI 173, with a
            recommended daily serving of 2 packets.
            <Citation source={2} />
          </p>
          <p className="usana-interpretation">
            <strong>Joy Health interpretation:</strong> USANA&apos;s
            ConsumerLab.com announcements name CellSentials and MagneCal D, not
            HealthPak, so we do not carry those results over to the packets.
          </p>
        </>
      }
      checks={
        <>
          <li>
            <strong>Doubling up.</strong> HealthPak already repeats
            CellSentials&apos; vitamins and minerals and part of a MagneCal D
            serving, so adding either product raises every total above. NIH
            notes that fortified foods and several supplements can add up to
            more than you think.
            <Citation source={8} />
          </li>
          <li>
            <strong>Kidney disease.</strong> The risk of magnesium toxicity
            rises with impaired kidney function.
            <Citation source={3} />
          </li>
          <li>
            <strong>Medicines that bind minerals.</strong> NIH notes that
            spacing magnesium-containing supplements at least 2 hours from oral
            bisphosphonates can minimize an interaction, and that tetracycline
            and quinolone antibiotics should be taken at least 2 hours before
            or 4 to 6 hours after them.
            <Citation source={3} /> Levothyroxine&apos;s label says to avoid
            taking it within 4 hours of calcium carbonate supplements, and
            HealthPak&apos;s calcium includes calcium carbonate.
            <Citation source={1} /><Citation source={5} />
          </li>
          <li>
            <strong>Warfarin.</strong> HealthPak provides 540 µg of vitamin K a
            day, and NIH notes that people taking warfarin need a consistent
            vitamin K intake.
            <Citation source={6} />
          </li>
          <li>
            <strong>Pregnancy.</strong> HealthPak provides 3,608 µg RAE of
            vitamin A a day, of which 1,032 µg is preformed. NIH advises people
            who are or might be pregnant against high-dose vitamin A
            supplements, above 3,000 µg RAE a day, counting the preformed
            share of a mixed label.
            <Citation source={7} />
          </li>
          <li>
            <strong>Liver.</strong> The complex includes green tea extract and
            Meriva, a bioavailable curcumin complex. NIH reports uncommon cases
            of liver injury with green tea extracts and with highly
            bioavailable curcumin products.
            <Citation source={9} /><Citation source={10} />
          </li>
        </>
      }
      relatedGuides={["supplement-evidence-and-safety", "reading-food-labels"]}
    />
  );
}
