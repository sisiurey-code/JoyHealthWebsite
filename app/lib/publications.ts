type IsoDate = `${number}-${number}-${number}`;
type PublicPath = `/${string}`;

type Publication = Readonly<{
  key: string;
  path: PublicPath;
  title: string;
  description: string;
  dateModified?: IsoDate;
  datePublished?: IsoDate;
}>;

export type NutritionGuide = Publication &
  Readonly<{
    topic: string;
    breadcrumbLabel: string;
    summary: string;
    datePublished: IsoDate;
  }>;

export const PUBLICATIONS = {
  home: {
    key: "home",
    path: "/",
    title: "Joy Health | Nutrition guides that show their work",
    description:
      "Practical, evidence-aware guides to meals, nutrients, food labels, hydration, and supplements, with sources, tradeoffs, and limits attached.",
  },
  standards: {
    key: "standards",
    path: "/standards",
    title: "Editorial and recommendation standards",
    description:
      "How Joy Health handles evidence, uncertainty, recommendations, disclosures, corrections, and the limits of general health information.",
  },
  usana: {
    key: "usana",
    path: "/usana",
    title: "Is USANA third-party tested? Quality and manufacturing evidence",
    description:
      "Some USANA finished products appear in an official NSF listing. See which quality signals are independent, which are company-reported, and what neither proves.",
    dateModified: "2026-08-31",
  },
  nutrition: {
    key: "nutrition",
    path: "/nutrition",
    title: "Nutrition guides: meals, labels, hydration, and supplements",
    description:
      "An evidence-aware nutrition library organized around food labels, nutrients, meals, hydration, and supplements.",
    dateModified: "2026-08-28",
  },
} as const satisfies Record<string, Publication>;

export const NUTRITION_GUIDES = [
  {
    key: "building-balanced-meals",
    topic: "Building balanced meals",
    breadcrumbLabel: "Balanced meals",
    path: "/nutrition/building-balanced-meals",
    title: "How to build a balanced meal without rigid rules",
    description:
      "A flexible framework for building everyday meals from familiar foods, with room for culture, budget, access, appetite, and preference.",
    summary:
      "A flexible way to notice what a meal already contains and decide whether one practical addition would be useful.",
    datePublished: "2026-08-28",
  },
  {
    key: "protein-and-fiber",
    topic: "Protein and fiber",
    breadcrumbLabel: "Protein and fiber",
    path: "/nutrition/protein-and-fiber",
    title: "Protein and fiber foods: two different jobs in a meal",
    description:
      "Learn which foods can contribute protein, fiber, or both, how the nutrients appear on labels, and why their reference values are not personal targets.",
    summary:
      "Separate definitions, food sources, label values, and reference systems for two nutrients that should not become one score.",
    datePublished: "2026-08-28",
  },
  {
    key: "reading-food-labels",
    topic: "Reading food labels",
    breadcrumbLabel: "Reading food labels",
    path: "/nutrition/reading-food-labels",
    title: "How to read a Nutrition Facts label",
    description:
      "Learn how to read a U.S. Nutrition Facts label: serving size, the 5% and 20% Daily Value rule, added sugars, ingredients, and allergens.",
    summary:
      "A repeatable way to interpret the serving basis, percent Daily Value, ingredients, and allergen information on FDA-regulated packaged foods in the United States.",
    datePublished: "2026-08-28",
  },
  {
    key: "carbohydrates-and-fats",
    topic: "Carbohydrates and fats",
    breadcrumbLabel: "Carbohydrates and fats",
    path: "/nutrition/carbohydrates-and-fats",
    title: "Carbohydrates and fats: types, sources, and tradeoffs",
    description:
      "A practical guide to carbohydrate and fat categories, Nutrition Facts fields, food sources, and why replacement context matters.",
    summary:
      "Open the umbrella terms, read their label subcategories, and keep the replacement food or nutrient in view.",
    datePublished: "2026-08-28",
  },
  {
    key: "hydration",
    topic: "Hydration",
    breadcrumbLabel: "Hydration",
    path: "/nutrition/hydration",
    title: "How much water should you drink? Total water explained",
    description:
      "The 2.7- and 3.7-liter adult reference values count plain water, other beverages, and food. Learn what total water means and why needs vary.",
    summary:
      "Distinguish total water from plain water and read adult reference values with their derivation and limits attached.",
    datePublished: "2026-08-28",
  },
  {
    key: "supplement-evidence-and-safety",
    topic: "Supplement evidence and safety",
    breadcrumbLabel: "Supplement evidence and safety",
    path: "/nutrition/supplement-evidence-and-safety",
    title: "How to evaluate supplement evidence and safety",
    description:
      "A repeatable U.S. framework separating Supplement Facts, marketing claims, supporting evidence, product identity, and safety.",
    summary:
      "Separate what a label declares from marketing claims, supporting evidence, product identity, and personal safety.",
    datePublished: "2026-08-28",
  },
  {
    key: "electrolyte-drinks",
    topic: "Electrolyte drinks",
    breadcrumbLabel: "Electrolyte drinks",
    path: "/nutrition/electrolyte-drinks",
    title: "Electrolytes vs. water: when do you need an electrolyte drink?",
    description:
      "Learn when plain water may cover the job, when electrolyte context changes, and how to compare sodium, potassium, carbohydrate, and serving size.",
    summary:
      "Carry the hydration and supplement-reading skills into powders, sports drinks, and mixed-purpose active-nutrition products.",
    datePublished: "2026-08-29",
  },
] as const satisfies readonly NutritionGuide[];

export const BALANCED_MEALS_GUIDE = NUTRITION_GUIDES[0];
export const PROTEIN_AND_FIBER_GUIDE = NUTRITION_GUIDES[1];
export const READING_FOOD_LABELS_GUIDE = NUTRITION_GUIDES[2];
export const CARBOHYDRATES_AND_FATS_GUIDE = NUTRITION_GUIDES[3];
export const HYDRATION_GUIDE = NUTRITION_GUIDES[4];
export const SUPPLEMENT_EVIDENCE_GUIDE = NUTRITION_GUIDES[5];
export const ELECTROLYTE_DRINKS_GUIDE = NUTRITION_GUIDES[6];

export const INDEXABLE_PUBLICATIONS = [
  PUBLICATIONS.home,
  PUBLICATIONS.standards,
  PUBLICATIONS.usana,
  PUBLICATIONS.nutrition,
  ...NUTRITION_GUIDES,
] as const satisfies readonly Publication[];

export function formatEditorialDate(isoDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    throw new TypeError(`Invalid editorial date: ${isoDate}`);
  }

  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== isoDate) {
    throw new TypeError(`Invalid editorial date: ${isoDate}`);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
