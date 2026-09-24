import type { IngredientKey } from "./supplement-labels";

export type IntakeSource = Readonly<{ title: string; url: string; publisher: string }>;

/**
 * Adult Tolerable Upper Intake Levels (ULs) from the National Academies, as
 * reported by the NIH Office of Dietary Supplements. `counts` says which
 * intake the UL covers, because several apply to supplements only. A `null`
 * value means the source states that no UL was set. All sources read
 * September 23, 2026.
 */
export type UpperLimit = Readonly<{
  label: string;
  value: number | null;
  /** Lower value for adults 51 and older, when it differs. */
  value51Plus?: number;
  unit: "µg" | "mg";
  counts: string;
  source: IntakeSource;
}>;

const ods = (name: string, slug: string): IntakeSource => ({
  title: `${name}: Fact Sheet for Health Professionals`,
  url: `https://ods.od.nih.gov/factsheets/${slug}-HealthProfessional/`,
  publisher: "NIH Office of Dietary Supplements",
});

const iomTraceElements: IntakeSource = {
  title:
    "Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc, Chapter 13",
  url: "https://nap.nationalacademies.org/read/10026/chapter/15",
  publisher: "Institute of Medicine (National Academies Press), 2001",
};

export const UPPER_LIMITS = {
  vitaminA: { label: "Vitamin A", value: 3000, unit: "µg", counts: "Preformed vitamin A (retinol and retinyl esters) only; beta carotene is not counted", source: ods("Vitamin A and Carotenoids", "VitaminA") },
  vitaminC: { label: "Vitamin C", value: 2000, unit: "mg", counts: "Food and supplements", source: ods("Vitamin C", "VitaminC") },
  vitaminD: { label: "Vitamin D", value: 100, unit: "µg", counts: "Daily intake; ODS notes that toxicity almost always comes from supplements", source: ods("Vitamin D", "VitaminD") },
  vitaminE: { label: "Vitamin E", value: 1000, unit: "mg", counts: "Supplemental alpha-tocopherol only", source: ods("Vitamin E", "VitaminE") },
  vitaminK: { label: "Vitamin K", value: null, unit: "µg", counts: "No UL set", source: ods("Vitamin K", "VitaminK") },
  thiamin: { label: "Thiamin", value: null, unit: "mg", counts: "No UL set", source: ods("Thiamin", "Thiamin") },
  riboflavin: { label: "Riboflavin", value: null, unit: "mg", counts: "No UL set", source: ods("Riboflavin", "Riboflavin") },
  niacin: { label: "Niacin", value: 35, unit: "mg", counts: "Supplemental niacin only, both forms; based on skin flushing", source: ods("Niacin", "Niacin") },
  vitaminB6: { label: "Vitamin B6", value: 100, unit: "mg", counts: "Food and supplements", source: ods("Vitamin B6", "VitaminB6") },
  folate: { label: "Folate", value: 1000, unit: "µg", counts: "Folic acid from supplements and fortified foods only", source: ods("Folate", "Folate") },
  vitaminB12: { label: "Vitamin B12", value: null, unit: "µg", counts: "No UL set", source: ods("Vitamin B12", "VitaminB12") },
  biotin: { label: "Biotin", value: null, unit: "µg", counts: "No UL set", source: ods("Biotin", "Biotin") },
  pantothenicAcid: { label: "Pantothenic acid", value: null, unit: "mg", counts: "No UL set", source: ods("Pantothenic Acid", "PantothenicAcid") },
  choline: { label: "Choline", value: 3500, unit: "mg", counts: "Food and supplements", source: ods("Choline", "Choline") },
  calcium: { label: "Calcium", value: 2500, value51Plus: 2000, unit: "mg", counts: "Daily intake; food alone rarely reaches it", source: ods("Calcium", "Calcium") },
  iodine: { label: "Iodine", value: 1100, unit: "µg", counts: "Food and supplements", source: ods("Iodine", "Iodine") },
  magnesium: { label: "Magnesium", value: 350, unit: "mg", counts: "Supplements and medications only; magnesium in food is not counted", source: ods("Magnesium", "Magnesium") },
  zinc: { label: "Zinc", value: 40, unit: "mg", counts: "Food and supplements", source: ods("Zinc", "Zinc") },
  selenium: { label: "Selenium", value: 400, unit: "µg", counts: "Food and supplements", source: ods("Selenium", "Selenium") },
  copper: { label: "Copper", value: 10, unit: "mg", counts: "Food and supplements", source: ods("Copper", "Copper") },
  manganese: { label: "Manganese", value: 11, unit: "mg", counts: "Food, water, and supplements", source: ods("Manganese", "Manganese") },
  chromium: { label: "Chromium", value: null, unit: "µg", counts: "No UL set", source: ods("Chromium", "Chromium") },
  molybdenum: { label: "Molybdenum", value: 2000, unit: "µg", counts: "All sources", source: ods("Molybdenum", "Molybdenum") },
  boron: { label: "Boron", value: 20, unit: "mg", counts: "Daily intake", source: ods("Boron", "Boron") },
  silicon: { label: "Silicon", value: null, unit: "mg", counts: "No UL set (too little data)", source: iomTraceElements },
  vanadium: { label: "Vanadium", value: 1.8, unit: "mg", counts: "Food, water, and supplements; adults only", source: iomTraceElements },
} as const satisfies Partial<Record<IngredientKey, UpperLimit>>;

export type LimitedNutrient = keyof typeof UPPER_LIMITS;

export function upperLimitFor(key: IngredientKey): UpperLimit | undefined {
  return (UPPER_LIMITS as Partial<Record<IngredientKey, UpperLimit>>)[key];
}
