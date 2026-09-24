import type { IsoDate, Publication } from "./publications";
import type { ProductKey } from "./usana";

export type SupplementProduct = Publication &
  Readonly<{
    key: ProductKey;
    /** Product name as the manufacturer prints it. */
    name: string;
    /** Visible H1; the title adds the brand for search. */
    heading: string;
    /** One line for cards, related links, and the hub. */
    summary: string;
    datePublished: IsoDate;
  }>;

/**
 * One page per product on the shelf, under a brand-neutral path so the
 * product set can change without moving URLs. Order follows `/usana`.
 */
export const SUPPLEMENT_PRODUCTS = [
  {
    key: "cellsentials",
    name: "CellSentials",
    path: "/supplements/cellsentials",
    title: "USANA CellSentials: full label and daily amounts",
    heading: "CellSentials: the full label, and what a day of it adds up to",
    description:
      "CellSentials is two tablets each of Vita Antioxidant and Core Minerals, twice a day. Every label row as text, daily totals against upper limits, and its NSF listing.",
    summary:
      "The two-bottle daily system as text, with daily totals, the niacin upper limit, and its NSF listing.",
    datePublished: "2026-09-24",
  },
  {
    key: "healthpak",
    name: "HealthPak",
    path: "/supplements/healthpak",
    title: "USANA HealthPak: what's in a packet vs. CellSentials",
    heading: "HealthPak: what's in each packet, and how it differs from CellSentials",
    description:
      "HealthPak combines CellSentials, MagneCal D, and a booster complex in two daily packets. The current label as text, daily totals against upper limits, and NSF listing.",
    summary:
      "The current packet label as text, the magnesium and niacin totals at two packets a day, and how it overlaps CellSentials.",
    datePublished: "2026-09-24",
  },
  {
    key: "procosa",
    name: "Procosa",
    path: "/supplements/procosa",
    title: "USANA Procosa: glucosamine, curcumin, and the label",
    heading: "Procosa: glucosamine, curcumin, and the full label",
    description:
      "Three Procosa tablets provide 1,500 mg vegetarian glucosamine and 247 mg Meriva curcumin, plus vitamin C and manganese. The label as text and what to check first.",
    summary:
      "Glucosamine and curcumin amounts as text, with the liver and warfarin cautions from NIH.",
    datePublished: "2026-09-24",
  },
  {
    key: "biomega",
    name: "BiOmega",
    path: "/supplements/biomega",
    title: "USANA BiOmega: EPA, DHA, and vitamin D per serving",
    heading: "BiOmega: EPA, DHA, and vitamin D per serving",
    description:
      "Two BiOmega capsules provide 1,200 mg of omega-3s, including 640 mg EPA and 460 mg DHA, plus 5 µg vitamin D3. The label as text, NSF listing, and what to check first.",
    summary:
      "The fish-oil label as text: EPA, DHA, and vitamin D per serving, the fish allergen line, and its NSF listing.",
    datePublished: "2026-09-24",
  },
  {
    key: "magnecal",
    name: "MagneCal D",
    path: "/supplements/magnecal-d",
    title: "USANA MagneCal D: magnesium and calcium per day",
    heading: "MagneCal D: calcium, magnesium, and vitamin D per day",
    description:
      "At the label's two tablets twice daily, MagneCal D provides 520 mg calcium, 520 mg magnesium, and 25 µg vitamin D3. How that compares with the upper limits.",
    summary:
      "Daily calcium, magnesium, and vitamin D at the label directions, and why the magnesium total matters.",
    datePublished: "2026-09-24",
  },
  {
    key: "coquinone",
    name: "CoQuinone 30",
    path: "/supplements/coquinone-30",
    title: "USANA CoQuinone 30: CoQ10 and alpha-lipoic acid",
    heading: "CoQuinone 30: CoQ10 and alpha-lipoic acid per capsule",
    description:
      "Each CoQuinone 30 capsule provides 30 mg coenzyme Q10 and 13 mg alpha-lipoic acid, and the label declares soy. The short label as text, overlap, and interaction notes.",
    summary:
      "A two-ingredient label as text, its overlap with CellSentials, and the warfarin and insulin notes for CoQ10.",
    datePublished: "2026-09-24",
  },
  {
    key: "clearProtein",
    name: "Clear Protein + Creatine Mix",
    path: "/supplements/clear-protein-creatine",
    title: "USANA Clear Protein + Creatine: label and creatine",
    heading: "Clear Protein + Creatine Mix: the label, the creatine, and the electrolytes",
    description:
      "A 50-calorie serving with 10 g of protein from whey isolate; USANA says each serving has 5 g creatine. The Nutrition Facts panel as text, and what it leaves out.",
    summary:
      "The Nutrition Facts panel as text, where the creatine amount comes from, and the milk allergen line.",
    datePublished: "2026-09-24",
  },
  {
    key: "coreAminos",
    name: "Core Aminos",
    path: "/supplements/core-aminos",
    title: "USANA Core Aminos: amino acids and HMB per scoop",
    heading: "Core Aminos: essential amino acids and HMB per scoop",
    description:
      "One scoop of Core Aminos lists nine essential amino acids, including 2,000 mg leucine, plus 1,500 mg calcium HMB. The label as text and a %DV printing error.",
    summary:
      "The amino acid and HMB amounts as text, the calcium line's %DV error, and what is known about HMB.",
    datePublished: "2026-09-24",
  },
] as const satisfies readonly SupplementProduct[];

export type SupplementSlugKey = (typeof SUPPLEMENT_PRODUCTS)[number]["key"];

export function getSupplement<K extends SupplementSlugKey>(key: K) {
  const product = SUPPLEMENT_PRODUCTS.find((entry) => entry.key === key);
  if (!product) throw new Error(`Unknown supplement page: ${key}`);
  return product as Extract<(typeof SUPPLEMENT_PRODUCTS)[number], { key: K }>;
}
