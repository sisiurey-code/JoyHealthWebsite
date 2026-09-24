import { SUPPLEMENT_PRODUCTS } from "./supplements";

export type IsoDate = `${number}-${number}-${number}`;
type PublicPath = `/${string}`;

export type Publication = Readonly<{
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
    summary: string;
    datePublished: IsoDate;
  }>;

export const PUBLICATIONS = {
  home: {
    key: "home",
    path: "/",
    title: "Healthy living, made clearer | Joy Health",
    description:
      "Accessible guides to food labels, hydration, protein and fiber, and supplements. We cite every source and say when the evidence is uncertain.",
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
    title: "USANA supplements compared: labels, testing, limits",
    description:
      "CellSentials, HealthPak, BiOmega, MagneCal D, CoQuinone, and more compared by Supplement Facts label, plus which USANA quality claims are independently verified.",
    dateModified: "2026-09-24",
  },
  nutrition: {
    key: "nutrition",
    path: "/nutrition",
    title: "Nutrition guides: meals, labels, and supplements",
    description:
      "Accessible guides to meals, food labels, protein and fiber, carbohydrates and fats, hydration, electrolyte drinks, and supplements. Sources included.",
    // Advanced when the creatine guide was added to the index.
    dateModified: "2026-09-24",
  },
} as const satisfies Record<string, Publication>;

export const NUTRITION_GUIDES = [
  {
    key: "building-balanced-meals",
    topic: "Building balanced meals",
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
    path: "/nutrition/protein-and-fiber",
    title: "Protein and fiber: sources and recommended amounts",
    description:
      "Which foods contribute protein, fiber, or both, how each appears on a Nutrition Facts label, and what the RDA, Adequate Intake, and Daily Value numbers mean.",
    summary:
      "Separate definitions, food sources, label values, and reference systems for two nutrients that should not become one score.",
    datePublished: "2026-08-28",
  },
  {
    key: "reading-food-labels",
    topic: "Reading food labels",
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
    path: "/nutrition/carbohydrates-and-fats",
    title: "Carbohydrates and fats: what the label terms mean",
    description:
      "Total Carbohydrate, Dietary Fiber, Added Sugars, Saturated Fat, Trans Fat: what each label term means, which foods supply them, and why the replacement matters.",
    summary:
      "Open the umbrella terms, read their label subcategories, and keep the replacement food or nutrient in view.",
    datePublished: "2026-08-28",
  },
  {
    key: "hydration",
    topic: "Hydration",
    path: "/nutrition/hydration",
    title: "How much water should you drink each day?",
    description:
      "The 2.7- and 3.7-liter adult reference values count plain water, other beverages, and food. Learn what total water means and why needs vary.",
    summary:
      "Distinguish total water from plain water, and read the adult reference values alongside how they were derived and what they leave out.",
    datePublished: "2026-08-28",
  },
  {
    key: "supplement-evidence-and-safety",
    topic: "Supplement evidence and safety",
    path: "/nutrition/supplement-evidence-and-safety",
    title: "Are supplements FDA approved? Evidence and safety",
    description:
      "FDA does not approve supplements before sale. Learn how to read a Supplement Facts label, what a quality seal proves, and how to match evidence to a claim.",
    summary:
      "Separate what a label declares from marketing claims, supporting evidence, product identity, and personal safety.",
    datePublished: "2026-08-28",
  },
  {
    key: "electrolyte-drinks",
    topic: "Electrolyte drinks",
    path: "/nutrition/electrolyte-drinks",
    title: "Electrolytes vs. water: when do you need them?",
    description:
      "Learn when plain water may cover the job, when electrolyte context changes, and how to compare sodium, potassium, carbohydrate, and serving size.",
    summary:
      "Carry the hydration and supplement-reading skills into powders, sports drinks, and mixed-purpose active-nutrition products.",
    datePublished: "2026-08-29",
  },
  {
    key: "creatine",
    topic: "Creatine",
    path: "/nutrition/creatine",
    title: "Is creatine safe, and who benefits from it?",
    description:
      "Creatine with strength training adds a small strength gain, including in older adults. What trials show on kidneys, water weight, hair, women, and memory.",
    summary:
      "Separate the well-supported strength finding from the preliminary claims, and read the safety record, including the kidney-test caveat, in context.",
    datePublished: "2026-09-24",
  },
] as const satisfies readonly NutritionGuide[];

type GuideKey = (typeof NUTRITION_GUIDES)[number]["key"];
type GuideByKey<K extends GuideKey> = Extract<
  (typeof NUTRITION_GUIDES)[number],
  { key: K }
>;

/** Looks a guide up by its stable key, so reordering the list is safe. */
export function getGuide<K extends GuideKey>(key: K): GuideByKey<K> {
  const guide = NUTRITION_GUIDES.find((entry) => entry.key === key);
  if (!guide) {
    throw new Error(`Unknown nutrition guide: ${key}`);
  }
  return guide as GuideByKey<K>;
}

export const BALANCED_MEALS_GUIDE = getGuide("building-balanced-meals");
export const PROTEIN_AND_FIBER_GUIDE = getGuide("protein-and-fiber");
export const READING_FOOD_LABELS_GUIDE = getGuide("reading-food-labels");
export const CARBOHYDRATES_AND_FATS_GUIDE = getGuide("carbohydrates-and-fats");
export const HYDRATION_GUIDE = getGuide("hydration");
export const SUPPLEMENT_EVIDENCE_GUIDE = getGuide("supplement-evidence-and-safety");
export const ELECTROLYTE_DRINKS_GUIDE = getGuide("electrolyte-drinks");
export const CREATINE_GUIDE = getGuide("creatine");

/**
 * Editorial adjacency between guides. Each list is ordered by how directly the
 * neighbouring guide continues the reader's question; it drives the visible
 * "Related guides" block, so keep every entry a real editorial neighbour.
 */
const RELATED_GUIDE_KEYS = {
  "building-balanced-meals": ["protein-and-fiber", "carbohydrates-and-fats", "reading-food-labels"],
  "protein-and-fiber": ["building-balanced-meals", "carbohydrates-and-fats", "reading-food-labels"],
  "reading-food-labels": ["carbohydrates-and-fats", "protein-and-fiber", "supplement-evidence-and-safety"],
  "carbohydrates-and-fats": ["reading-food-labels", "protein-and-fiber", "building-balanced-meals"],
  hydration: ["electrolyte-drinks", "building-balanced-meals", "reading-food-labels"],
  "supplement-evidence-and-safety": ["reading-food-labels", "creatine", "electrolyte-drinks"],
  "electrolyte-drinks": ["hydration", "supplement-evidence-and-safety", "creatine"],
  creatine: ["supplement-evidence-and-safety", "protein-and-fiber", "electrolyte-drinks"],
} as const satisfies Record<GuideKey, readonly GuideKey[]>;

export function getRelatedGuides(guide: Pick<NutritionGuide, "key">) {
  const keys: readonly GuideKey[] = RELATED_GUIDE_KEYS[guide.key as GuideKey];
  return keys.map((key) => getGuide(key));
}

export const INDEXABLE_PUBLICATIONS = [
  PUBLICATIONS.home,
  PUBLICATIONS.standards,
  PUBLICATIONS.usana,
  PUBLICATIONS.nutrition,
  ...NUTRITION_GUIDES,
  ...SUPPLEMENT_PRODUCTS,
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
