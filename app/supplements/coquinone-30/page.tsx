import type { Metadata } from "next";
import Link from "next/link";
import { Citation } from "../../components/citation";
import { SupplementPage } from "../../components/supplement-page";
import { buildSupplementMetadata } from "../../lib/seo";
import { labelSource, nccihPage, NSF_LISTING } from "../../lib/supplement-sources";
import { getSupplement } from "../../lib/supplements";

const product = getSupplement("coquinone");

export const metadata: Metadata = buildSupplementMetadata(product);

const sources = [
  labelSource("coquinone"),
  {
    title: "CoQuinone 30 product data (USANA's current catalog entry)",
    url: "https://api.usana.com/cart/productGroup/byProduct/123.010102",
    publisher: "USANA Health Sciences",
    note: "The data behind USANA's product page, used for the current item number and the label it links to. Read September 23, 2026.",
  },
  nccihPage("Coenzyme Q10", "coenzyme-q10", "Used for interactions with warfarin, insulin, and some cancer treatments, and for reported side effects. Limitation: last updated January 2019."),
  nccihPage(
    "Type 2 Diabetes and Dietary Supplements: What the Science Says",
    "providers/digest/type-2-diabetes-and-dietary-supplements-science",
    "Clinical digest used for alpha-lipoic acid safety and the note that it may interact with other medications; it names no specific drug.",
  ),
  NSF_LISTING,
] as const;

export default function CoQuinonePage() {
  return (
    <SupplementPage
      product={product}
      sources={sources}
      lede={
        <>
          Each CoQuinone 30 capsule provides 30 mg of coenzyme Q10 and 13 mg
          of alpha-lipoic acid, and the label says to take one or two capsules
          a day, so 30 to 60 mg of CoQ10.
          <Citation source={1} /> The label declares soy, and the capsule
          contains gelatin.
          <Citation source={1} />
        </>
      }
      labelNotes={
        <p>
          Neither ingredient has an established Daily Value, so the label shows
          a dagger instead of a percentage. The label USANA links to carries
          item number 123.010101, while the product it sells today is
          123.010102, so a newer printed label may exist. Check your package
          against this table.
          <Citation source={1} /><Citation source={2} />
        </p>
      }
      dailyIntro={
        <p>
          Neither ingredient has an upper limit, but both also appear in{" "}
          <Link href="/supplements/cellsentials">CellSentials</Link> and{" "}
          <Link href="/supplements/healthpak">HealthPak</Link>. Two capsules a
          day with CellSentials, for example, comes to 72 mg of CoQ10 and 126
          mg of alpha-lipoic acid. The table lists each product&apos;s daily
          amount so you can add up your own combination.
        </p>
      }
      testing={
        <p>
          We found no independent test record for CoQuinone 30. It is not
          among the USANA products on NSF&apos;s NSF/ANSI 173 listing as of
          September 23, 2026.
          <Citation source={5} /> That is the absence of a record, not
          evidence of a problem with the product.
        </p>
      }
      checks={
        <>
          <li>
            <strong>Soy.</strong> The label says the product contains soy.
            <Citation source={1} />
          </li>
          <li>
            <strong>Warfarin and insulin.</strong> NIH notes that CoQ10 may
            interact with the blood thinner warfarin and with insulin.
            <Citation source={3} />
          </li>
          <li>
            <strong>Cancer treatment.</strong> NIH notes that CoQ10 may not be
            compatible with some types of cancer treatment.
            <Citation source={3} />
          </li>
          <li>
            <strong>Side effects.</strong> NIH reports no serious side effects
            of CoQ10, with possible mild insomnia or digestive upset.
            Alpha-lipoic acid may interact with other medications, and high
            doses can upset the stomach.
            <Citation source={3} /><Citation source={4} />
          </li>
        </>
      }
      relatedGuides={["supplement-evidence-and-safety", "reading-food-labels"]}
    />
  );
}
