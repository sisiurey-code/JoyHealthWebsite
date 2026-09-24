/**
 * Topics each page is about, linked to Wikidata and English Wikipedia so
 * search and answer engines can match a page to the entity it discusses
 * rather than to a string. Every identifier was resolved against the
 * Wikidata API on September 24, 2026 (label and enwiki sitelink checked).
 * Add an entity to a page only when the visible page discusses it.
 */
export const ENTITIES = {
  creatine: { name: "Creatine", wikidata: "Q223600", wikipedia: "Creatine" },
  dietarySupplement: { name: "Dietary supplement", wikidata: "Q645858", wikipedia: "Dietary_supplement" },
  multivitamin: { name: "Multivitamin", wikidata: "Q172395", wikipedia: "Multivitamin" },
  magnesium: { name: "Magnesium", wikidata: "Q660", wikipedia: "Magnesium" },
  calcium: { name: "Calcium", wikidata: "Q706", wikipedia: "Calcium" },
  vitaminD: { name: "Vitamin D", wikidata: "Q175621", wikipedia: "Vitamin_D" },
  niacin: { name: "Vitamin B3", wikidata: "Q30715691", wikipedia: "Vitamin_B3" },
  omega3: { name: "Omega-3 fatty acid", wikidata: "Q191756", wikipedia: "Omega%E2%88%923_fatty_acid" },
  epa: { name: "Eicosapentaenoic acid", wikidata: "Q409990", wikipedia: "Eicosapentaenoic_acid" },
  dha: { name: "Docosahexaenoic acid", wikidata: "Q423345", wikipedia: "Docosahexaenoic_acid" },
  coq10: { name: "Coenzyme Q10", wikidata: "Q321285", wikipedia: "Coenzyme_Q10" },
  lipoicAcid: { name: "Lipoic acid", wikidata: "Q312229", wikipedia: "Lipoic_acid" },
  glucosamine: { name: "Glucosamine", wikidata: "Q327506", wikipedia: "Glucosamine" },
  curcumin: { name: "Curcumin", wikidata: "Q312266", wikipedia: "Curcumin" },
  wheyProtein: { name: "Whey protein", wikidata: "Q424430", wikipedia: "Whey_protein" },
  essentialAminoAcid: { name: "Essential amino acid", wikidata: "Q245282", wikipedia: "Essential_amino_acid" },
  leucine: { name: "Leucine", wikidata: "Q483745", wikipedia: "Leucine" },
  hmb: { name: "β-Hydroxy β-methylbutyric acid", wikidata: "Q223081", wikipedia: "%CE%92-Hydroxy_%CE%B2-methylbutyric_acid" },
  protein: { name: "Protein", wikidata: "Q8054", wikipedia: "Protein" },
  dietaryFiber: { name: "Dietary fiber", wikidata: "Q215210", wikipedia: "Dietary_fiber" },
  carbohydrate: { name: "Carbohydrate", wikidata: "Q11358", wikipedia: "Carbohydrate" },
  fat: { name: "Fat", wikidata: "Q127980", wikipedia: "Fat" },
  saturatedFat: { name: "Saturated fat", wikidata: "Q970537", wikipedia: "Saturated_fat" },
  addedSugar: { name: "Added sugar", wikidata: "Q17011065", wikipedia: "Added_sugar" },
  nutritionFactsLabel: { name: "Nutrition facts label", wikidata: "Q1531970", wikipedia: "Nutrition_facts_label" },
  referenceDailyIntake: { name: "Reference Daily Intake", wikidata: "Q2366307", wikipedia: "Reference_Daily_Intake" },
  dietaryReferenceIntake: { name: "Dietary Reference Intake", wikidata: "Q1412867", wikipedia: "Dietary_Reference_Intake" },
  drinkingWater: { name: "Drinking water", wikidata: "Q7892", wikipedia: "Drinking_water" },
  sportsDrink: { name: "Sports drink", wikidata: "Q949948", wikipedia: "Sports_drink" },
  fda: { name: "U.S. Food and Drug Administration", wikidata: "Q204711", wikipedia: "Food_and_Drug_Administration" },
  nsf: { name: "NSF International", wikidata: "Q6955296", wikipedia: "National_Sanitation_Foundation" },
  usana: { name: "USANA Health Sciences", wikidata: "Q2502355", wikipedia: "USANA_Health_Sciences" },
} as const satisfies Record<string, Readonly<{ name: string; wikidata: string; wikipedia: string }>>;

export type EntityKey = keyof typeof ENTITIES;

export type PageTopics = Readonly<{
  about: readonly EntityKey[];
  mentions?: readonly EntityKey[];
}>;

/** `sameAs` URLs for an entity: Wikidata first, then English Wikipedia. */
export function entitySameAs(key: EntityKey) {
  const entity = ENTITIES[key];
  return [
    `https://www.wikidata.org/wiki/${entity.wikidata}`,
    `https://en.wikipedia.org/wiki/${entity.wikipedia}`,
  ];
}

/** A schema.org `Thing` reference for `about` and `mentions`. */
export function entityThing(key: EntityKey) {
  return { "@type": "Thing", name: ENTITIES[key].name, sameAs: entitySameAs(key) };
}

/**
 * What each page is about and which other entities it discusses at length,
 * keyed by publication key. Checked against the rendered text of each page.
 */
export const PAGE_TOPICS: Readonly<Record<string, PageTopics>> = {
  usana: { about: ["usana"], mentions: ["dietarySupplement", "nsf"] },
  "building-balanced-meals": { about: [], mentions: ["protein", "dietaryFiber", "carbohydrate", "fat"] },
  "protein-and-fiber": { about: ["protein", "dietaryFiber"], mentions: ["referenceDailyIntake", "dietaryReferenceIntake", "nutritionFactsLabel"] },
  "reading-food-labels": { about: ["nutritionFactsLabel"], mentions: ["referenceDailyIntake", "addedSugar", "fda"] },
  "carbohydrates-and-fats": { about: ["carbohydrate", "fat"], mentions: ["dietaryFiber", "saturatedFat", "addedSugar", "nutritionFactsLabel"] },
  hydration: { about: ["drinkingWater"], mentions: ["dietaryReferenceIntake"] },
  "supplement-evidence-and-safety": { about: ["dietarySupplement"], mentions: ["fda"] },
  "electrolyte-drinks": { about: ["sportsDrink"], mentions: ["drinkingWater"] },
  creatine: { about: ["creatine"], mentions: ["dietarySupplement"] },
  cellsentials: { about: ["multivitamin"], mentions: ["magnesium", "calcium", "vitaminD", "niacin", "nsf"] },
  healthpak: { about: ["multivitamin"], mentions: ["magnesium", "calcium", "niacin", "lipoicAcid", "curcumin", "nsf"] },
  procosa: { about: ["glucosamine", "curcumin"], mentions: ["nsf"] },
  biomega: { about: ["omega3"], mentions: ["epa", "dha", "vitaminD", "nsf"] },
  magnecal: { about: ["magnesium", "calcium", "vitaminD"], mentions: ["nsf"] },
  coquinone: { about: ["coq10"], mentions: ["lipoicAcid", "nsf"] },
  clearProtein: { about: ["wheyProtein", "creatine"], mentions: ["protein"] },
  coreAminos: { about: ["essentialAminoAcid"], mentions: ["leucine", "hmb", "calcium", "nsf"] },
};
