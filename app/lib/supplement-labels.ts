/**
 * Supplement Facts transcribed as text from each product's current U.S.
 * label. Rows, amounts, and %DV are exactly as printed; `key` is Joy Health's
 * stable ingredient identifier for comparing products, and `ulAmount` is the
 * part of a row that counts toward a Tolerable Upper Intake Level when that
 * differs from the printed amount (preformed vitamin A, folic acid). The
 * transcription was checked against USANA's label PDFs on September 23, 2026;
 * see `docs/SUPPLEMENT_LABELS.md` before editing.
 */
import type { ProductKey } from "./usana";

export type IngredientKey =
  | "vitaminA" | "vitaminC" | "vitaminD" | "vitaminE" | "vitaminK" | "thiamin"
  | "riboflavin" | "niacin" | "vitaminB6" | "folate" | "vitaminB12" | "biotin"
  | "pantothenicAcid" | "choline" | "calcium" | "iodine" | "magnesium" | "zinc"
  | "selenium" | "copper" | "manganese" | "chromium" | "molybdenum" | "boron"
  | "silicon" | "vanadium" | "potassium" | "sodium" | "iron" | "alphaLipoicAcid"
  | "coq10" | "curcumin" | "greenTeaExtract" | "quercetin" | "resveratrol" | "rutin"
  | "hesperidin" | "olivol" | "pqq" | "inositol" | "lutein" | "lycopene" | "nac"
  | "mixedTocopherols" | "glucosamine" | "omega3" | "epa" | "dha" | "protein" | "hmb"
  | "ultraTraceMinerals";

export type LabelRow = Readonly<{
  name: string;
  form?: string;
  /** Amount exactly as printed, without the unit. Empty for sub-headings. */
  amount: string;
  unit: string;
  dv?: string;
  indent?: number;
  heading?: boolean;
  key?: IngredientKey;
  ulAmount?: number;
  ulUnit?: string;
}>;

export type LabelPanel = Readonly<{
  name?: string;
  kind: "Supplement Facts" | "Nutrition Facts";
  servingSize: string;
  servingsPerContainer: string;
  calories?: string;
  rows: readonly LabelRow[];
  footnotes: readonly string[];
}>;

export type ProductLabel = Readonly<{
  panels: readonly LabelPanel[];
  otherIngredients: readonly Readonly<{ panel?: string; text: string }>[];
  contains?: string;
  /** Manufacturer directions as printed on the label. */
  directions?: string;
  /** Servings per day under those directions, as [minimum, maximum]. */
  servingsPerDay?: readonly [number, number];
  /** The official label the transcription was checked against, when one is published. */
  labelSource?: Readonly<{ url: string; title: string }>;
}>;

export const LABEL_TRANSCRIBED_ON = "2026-09-23";

export const PRODUCT_LABELS = {
  cellsentials: {
    panels: [
      {
        name: "Vita Antioxidant",
        kind: "Supplement Facts",
        servingSize: "2 tablets",
        servingsPerContainer: "56",
        rows: [
          { name: "Vitamin A", form: "as 25% [516 mcg] Retinyl Acetate and 75% [2700 mcg] as Beta Carotene, Mixed Carotenoids", amount: "1804", unit: "µg RAE", dv: "200%", key: "vitaminA", ulAmount: 516, ulUnit: "µg" },
          { name: "Vitamin C", form: "as Poly C Blend: Potassium, Calcium, Magnesium, and Zinc Ascorbates", amount: "200", unit: "mg", dv: "222%", key: "vitaminC" },
          { name: "Vitamin D3", form: "as Cholecalciferol", amount: "25", unit: "µg", dv: "125%", key: "vitaminD" },
          { name: "Vitamin E", form: "as D-alpha-Tocopheryl Succinate", amount: "67", unit: "mg", dv: "447%", key: "vitaminE" },
          { name: "Vitamin K", form: "as K1 [Phytonadione] 240 µg, and K2 MK-7 [Menaquinone] 30 µg", amount: "270", unit: "µg", dv: "225%", key: "vitaminK" },
          { name: "Thiamine (Vitamin B1)", amount: "15", unit: "mg", dv: "1250%", key: "thiamin" },
          { name: "Riboflavin (Vitamin B2)", amount: "15", unit: "mg", dv: "1154%", key: "riboflavin" },
          { name: "Niacin", form: "as Niacin and Niacinamide", amount: "20", unit: "mg NE", dv: "125%", key: "niacin", ulAmount: 20, ulUnit: "mg" },
          { name: "Vitamin B6", form: "as Pyridoxine HCl", amount: "16", unit: "mg", dv: "941%", key: "vitaminB6" },
          { name: "Folate", form: "as 300 µg Folic Acid", amount: "500", unit: "µg DFE", dv: "125%", key: "folate", ulAmount: 300, ulUnit: "µg" },
          { name: "Vitamin B12", form: "as Cyanocobalamin", amount: "100", unit: "µg", dv: "4167%", key: "vitaminB12" },
          { name: "Biotin", amount: "150", unit: "µg", dv: "500%", key: "biotin" },
          { name: "Pantothenic Acid", form: "as D-Calcium Pantothenate", amount: "45", unit: "mg", dv: "900%", key: "pantothenicAcid" },
          { name: "Choline", form: "as Choline Bitartrate", amount: "51", unit: "mg", dv: "9%", key: "choline" },
          { name: "Mixed Tocopherols", form: "D-gamma, D-delta, D-beta Tocopherol", amount: "40", unit: "mg", dv: "†", key: "mixedTocopherols" },
          { name: "InCelligence Complex", amount: "", unit: "", heading: true },
          { name: "Alpha Lipoic Acid", amount: "50", unit: "mg", dv: "†", indent: 1, key: "alphaLipoicAcid" },
          { name: "Meriva® Bioavailable Curcumin Complex", form: "Curcuma longa L., root", amount: "36", unit: "mg", dv: "†", indent: 1, key: "curcumin" },
          { name: "Green Tea Extract", form: "Camellia sinensis hunt., leaves", amount: "35", unit: "mg", dv: "†", indent: 1, key: "greenTeaExtract" },
          { name: "Quercetin Dihydrate", amount: "30", unit: "mg", dv: "†", indent: 1, key: "quercetin" },
          { name: "Rutin", amount: "20", unit: "mg", dv: "†", indent: 1, key: "rutin" },
          { name: "Hesperidin", form: "Citrus spp. L., fruit", amount: "20", unit: "mg", dv: "†", indent: 1, key: "hesperidin" },
          { name: "Resveratrol", amount: "20", unit: "mg", dv: "†", indent: 1, key: "resveratrol" },
          { name: "Olivol", form: "Olive Fruit Extract, Olea europaea L., fruit", amount: "15", unit: "mg", dv: "†", indent: 1, key: "olivol" },
          { name: "PQQ", form: "Pyrroloquinoline Quinone Disodium Salt", amount: "5", unit: "mg", dv: "†", indent: 1, key: "pqq" },
          { name: "Inositol", amount: "64", unit: "mg", dv: "†", key: "inositol" },
          { name: "Coenzyme Q10", amount: "6", unit: "mg", dv: "†", key: "coq10" },
          { name: "Lutein", form: "Tagetes erecta L., flower", amount: "300", unit: "µg", dv: "†", key: "lutein" },
          { name: "Lycopene", amount: "500", unit: "µg", dv: "†", key: "lycopene" },
        ],
        footnotes: ["†Daily Value (DV) not established."],
      },
      {
        name: "Core Minerals",
        kind: "Supplement Facts",
        servingSize: "2 tablets",
        servingsPerContainer: "56",
        rows: [
          { name: "Vitamin C", form: "as Magnesium Ascorbate and Calcium Ascorbate", amount: "300", unit: "mg", dv: "333%", key: "vitaminC" },
          { name: "Calcium", form: "as Calcium Citrate and Calcium Ascorbate", amount: "113", unit: "mg", dv: "9%", key: "calcium" },
          { name: "Iodine", form: "as Potassium Iodide", amount: "250", unit: "µg", dv: "167%", key: "iodine" },
          { name: "Magnesium", form: "as Magnesium Citrate and Magnesium Ascorbate", amount: "113", unit: "mg", dv: "27%", key: "magnesium" },
          { name: "Zinc", form: "as Zinc Citrate", amount: "10", unit: "mg", dv: "91%", key: "zinc" },
          { name: "Selenium", form: "as L-Selenomethionine and Sodium Selenite", amount: "100", unit: "µg", dv: "182%", key: "selenium" },
          { name: "Copper", form: "as Copper Gluconate", amount: "1", unit: "mg", dv: "111%", key: "copper" },
          { name: "Manganese", form: "as Manganese Gluconate", amount: "1", unit: "mg", dv: "43%", key: "manganese" },
          { name: "Chromium", form: "as Chromium Polynicotinate", amount: "150", unit: "µg", dv: "429%", key: "chromium" },
          { name: "Molybdenum", form: "as Molybdenum Citrate", amount: "25", unit: "µg", dv: "56%", key: "molybdenum" },
          { name: "Boron", form: "as Boron Citrate", amount: "1.5", unit: "mg", dv: "†", key: "boron" },
          { name: "Silicon", form: "as Calcium Silicate", amount: "2", unit: "mg", dv: "†", key: "silicon" },
          { name: "Vanadium", form: "as Vanadium Citrate", amount: "20", unit: "µg", dv: "†", key: "vanadium" },
          { name: "Ultra Trace Minerals", amount: "1.5", unit: "mg", dv: "†", key: "ultraTraceMinerals" },
          { name: "N-Acetyl L-Cysteine", amount: "80", unit: "mg", dv: "†", key: "nac" },
        ],
        footnotes: ["†Daily Value (DV) not established."],
      },
    ],
    otherIngredients: [
      { panel: "Vita Antioxidant", text: "Microcrystalline Cellulose, Pregelatinized Starch, Croscarmellose Sodium, Silicon Dioxide, Magnesium Stearate, Organic Maltodextrin, Vanilla Flavor, Organic Sunflower Lecithin, Organic Sunflower Oil, Organic Guar Gum." },
      { panel: "Core Minerals", text: "Microcrystalline Cellulose, Modified Cellulose, Croscarmellose Sodium, Ascorbyl Palmitate, Organic Maltodextrin, Pregelatinized Starch, Silicon Dioxide, Vanilla Extract, Organic Sunflower Lecithin, Organic Sunflower Oil, Organic Guar Gum." },
    ],
    directions: "Take two (2) tablets of each (Vita Antioxidant and Core Minerals) twice daily, preferably with food.",
    servingsPerDay: [2, 2],
    labelSource: { url: "https://www.usana.com/content/96fa0533-caa8-4a03-ba18-9945b41987e4.pdf", title: "USANA, U.S. CellSentials Supplement Facts (Vita Antioxidant and Core Minerals)" },
  },
  healthpak: {
    panels: [
      {
        kind: "Supplement Facts",
        servingSize: "1 packet",
        servingsPerContainer: "56",
        rows: [
          { name: "Vitamin A", form: "as 25% [516 mcg] Retinyl Acetate and 75% [2700 mcg] as Beta Carotene, Mixed Carotenoids", amount: "1804", unit: "µg RAE", dv: "200%", key: "vitaminA", ulAmount: 516, ulUnit: "µg" },
          { name: "Vitamin C", form: "as Magnesium, Calcium, Potassium, and Zinc Ascorbates", amount: "500", unit: "mg", dv: "556%", key: "vitaminC" },
          { name: "Vitamin D3", form: "as Cholecalciferol", amount: "31", unit: "µg", dv: "155%", key: "vitaminD" },
          { name: "Vitamin E", form: "as D-Alpha Tocopheryl Succinate", amount: "67", unit: "mg", dv: "447%", key: "vitaminE" },
          { name: "Vitamin K", form: "as K1 [Phytonadione] 240 µg, and K2 [MK-7 Menaquinone] 30 µg", amount: "270", unit: "µg", dv: "225%", key: "vitaminK" },
          { name: "Thiamin (Vitamin B1)", amount: "15", unit: "mg", dv: "1250%", key: "thiamin" },
          { name: "Riboflavin (Vitamin B2)", amount: "15", unit: "mg", dv: "1154%", key: "riboflavin" },
          { name: "Niacin", form: "as Niacin and Niacinamide", amount: "20", unit: "mg NE", dv: "125%", key: "niacin", ulAmount: 20, ulUnit: "mg" },
          { name: "Vitamin B6", form: "as Pyridoxine HCl", amount: "16", unit: "mg", dv: "941%", key: "vitaminB6" },
          { name: "Folate", form: "as 300 µg Folic Acid", amount: "500", unit: "µg DFE", dv: "125%", key: "folate", ulAmount: 300, ulUnit: "µg" },
          { name: "Vitamin B12", form: "as Cyanocobalamin", amount: "100", unit: "µg", dv: "4167%", key: "vitaminB12" },
          { name: "Biotin", amount: "150", unit: "µg", dv: "500%", key: "biotin" },
          { name: "Pantothenic Acid", form: "as D-Calcium Pantothenate", amount: "45", unit: "mg", dv: "900%", key: "pantothenicAcid" },
          { name: "Choline", form: "as Choline Bitartrate", amount: "51", unit: "mg", dv: "9%", key: "choline" },
          { name: "Calcium", form: "as Calcium Citrate, Carbonate, and Ascorbate", amount: "243", unit: "mg", dv: "19%", key: "calcium" },
          { name: "Iodine", form: "as Potassium Iodide", amount: "250", unit: "µg", dv: "167%", key: "iodine" },
          { name: "Magnesium", form: "as Magnesium Citrate, Carbonate, and Ascorbate", amount: "243", unit: "mg", dv: "58%", key: "magnesium" },
          { name: "Zinc", form: "as Zinc Citrate", amount: "10", unit: "mg", dv: "91%", key: "zinc" },
          { name: "Selenium", form: "as L-Selenomethionine and Sodium Selenite", amount: "100", unit: "µg", dv: "182%", key: "selenium" },
          { name: "Copper", form: "as Copper Gluconate", amount: "1", unit: "mg", dv: "111%", key: "copper" },
          { name: "Manganese", form: "as Manganese Gluconate", amount: "1", unit: "mg", dv: "43%", key: "manganese" },
          { name: "Chromium", form: "as Chromium Polynicotinate", amount: "150", unit: "µg", dv: "429%", key: "chromium" },
          { name: "Molybdenum", form: "as Molybdenum Citrate", amount: "25", unit: "µg", dv: "56%", key: "molybdenum" },
          { name: "Mixed Tocopherols", form: "D-Gamma, D-Delta, D-Beta Tocopherol", amount: "40", unit: "mg", dv: "†", key: "mixedTocopherols" },
          { name: "Inositol", amount: "64", unit: "mg", dv: "†", key: "inositol" },
          { name: "N-Acetyl L-Cysteine", amount: "80", unit: "mg", dv: "†", key: "nac" },
          { name: "Coenzyme Q10", amount: "6", unit: "mg", dv: "†", key: "coq10" },
          { name: "Lutein", amount: "300", unit: "µg", dv: "†", key: "lutein" },
          { name: "Lycopene", amount: "500", unit: "µg", dv: "†", key: "lycopene" },
          { name: "Silicon", form: "as Calcium Silicate", amount: "4.25", unit: "mg", dv: "†", key: "silicon" },
          { name: "Boron", form: "as Boron Citrate", amount: "1.83", unit: "mg", dv: "†", key: "boron" },
          { name: "Vanadium", form: "as Vanadium Citrate", amount: "20", unit: "µg", dv: "†", key: "vanadium" },
          { name: "Ultra Trace Minerals", amount: "1.5", unit: "mg", dv: "†", key: "ultraTraceMinerals" },
          { name: "InCelligence Complex and CellSentials Booster", amount: "", unit: "", heading: true },
          { name: "Alpha-Lipoic Acid", amount: "125", unit: "mg", dv: "†", indent: 1, key: "alphaLipoicAcid" },
          { name: "Quercetin Dihydrate", amount: "90", unit: "mg", dv: "†", indent: 1, key: "quercetin" },
          { name: "Meriva® Bioavailable Curcumin Complex", form: "Curcuma longa L., Root", amount: "36", unit: "mg", dv: "†", indent: 1, key: "curcumin" },
          { name: "Green Tea Extract", form: "Camellia sinensis hunt., Leaves", amount: "35", unit: "mg", dv: "†", indent: 1, key: "greenTeaExtract" },
          { name: "Olivol", form: "Olive Fruit Extract, Olea europaea L., Fruit", amount: "25", unit: "mg", dv: "†", indent: 1, key: "olivol" },
          { name: "Resveratrol", amount: "20", unit: "mg", dv: "†", indent: 1, key: "resveratrol" },
          { name: "Rutin", amount: "20", unit: "mg", dv: "†", indent: 1, key: "rutin" },
          { name: "Hesperidin", form: "Citrus spp. L., Fruit", amount: "20", unit: "mg", dv: "†", indent: 1, key: "hesperidin" },
          { name: "PQQ", form: "Pyrroloquinoline Quinone Disodium Salt", amount: "5", unit: "mg", dv: "†", indent: 1, key: "pqq" },
          { name: "Pterocarpus Marsupium Extract", form: "containing Pterostilbene (Pterocarpus marsupium, Wood)", amount: "50", unit: "mg", dv: "†", indent: 1 },
        ],
        footnotes: ["†Daily Value (DV) not established."],
      },
    ],
    otherIngredients: [
      { text: "Microcrystalline Cellulose, Modified Starch, Croscarmellose Sodium, Silicon Dioxide, Hydroxypropyl Cellulose, Magnesium Stearate, Ascorbyl Palmitate, Organic Maltodextrin, Vanilla Extract, Organic Sunflower Lecithin, Organic Sunflower Oil, Organic Guar Gum." },
    ],
    directions: "Take one (1) packet in the morning and one (1) packet in the evening, preferably with food.",
    servingsPerDay: [2, 2],
    labelSource: { url: "https://www.usana.com/content/1ea37216-2e6e-44a4-9a26-75be72809b6d.pdf", title: "USANA, U.S. HealthPak Supplement Facts (item 100.010105)" },
  },
  procosa: {
    panels: [
      {
        kind: "Supplement Facts",
        servingSize: "3 tablets",
        servingsPerContainer: "28",
        rows: [
          { name: "Vitamin C", form: "as Calcium Ascorbate", amount: "225", unit: "mg", dv: "250%", key: "vitaminC" },
          { name: "Magnesium", form: "as Magnesium Sulfate", amount: "44", unit: "mg", dv: "10%", key: "magnesium" },
          { name: "Manganese", form: "as Manganese Gluconate", amount: "5", unit: "mg", dv: "217%", key: "manganese" },
          { name: "Potassium", form: "as Potassium Sulfate", amount: "94", unit: "mg", dv: "2%", key: "potassium" },
          { name: "InCelligence Joint-Support Complex", amount: "", unit: "", heading: true },
          { name: "Glucosamine HCL", form: "Vegetarian", amount: "1500", unit: "mg", dv: "†", indent: 1, key: "glucosamine" },
          { name: "Meriva® Bioavailable Curcumin Complex", form: "Curcuma longa L., root", amount: "247", unit: "mg", dv: "†", indent: 1, key: "curcumin" },
        ],
        footnotes: ["†Daily Value (DV) not established."],
      },
    ],
    otherIngredients: [
      { text: "Microcrystalline Cellulose, Croscarmellose Sodium, Modified Cellulose, Ascorbyl Palmitate, Organic Maltodextrin, Calcium Silicate, Organic Sunflower Lecithin, Organic Palm Olein, Organic Guar Gum." },
    ],
    directions: "Adults take three (3) tablets daily, preferably with food.",
    servingsPerDay: [1, 1],
    labelSource: { url: "https://www.usana.com/content/3539b488-f6bb-4469-98cf-fd8acba25d25.pdf", title: "USANA, U.S. Procosa Supplement Facts" },
  },
  biomega: {
    panels: [
      {
        kind: "Supplement Facts",
        servingSize: "2 capsules",
        servingsPerContainer: "28",
        rows: [
          { name: "Vitamin D3", form: "as Cholecalciferol", amount: "5", unit: "µg", dv: "25%", key: "vitaminD" },
          { name: "Fish Oil Concentrate", form: "Marine Triglycerides", amount: "2000", unit: "mg", dv: "†" },
          { name: "Total Omega-3 Fatty Acids", amount: "1200", unit: "mg", dv: "†", indent: 1, key: "omega3" },
          { name: "EPA", form: "Eicosapentaenoic Acid", amount: "640", unit: "mg", dv: "†", indent: 2, key: "epa" },
          { name: "DHA", form: "Docosahexaenoic Acid", amount: "460", unit: "mg", dv: "†", indent: 2, key: "dha" },
        ],
        footnotes: ["†Daily Value (DV) not established."],
      },
    ],
    otherIngredients: [
      { text: "Fish Gelatin, Glycerin, Lemon Oil, Purified Water, Mixed Natural Tocopherols." },
    ],
    contains: "Fish (anchovy, mackerel, sardine, tilapia)",
    directions: "Take two (2) capsules daily, preferably with food.",
    servingsPerDay: [1, 1],
    labelSource: { url: "https://www.usana.com/content/5fad4402-a289-4b7e-8b6b-deaeef6aac82.pdf", title: "USANA, U.S. BiOmega Supplement Facts" },
  },
  magnecal: {
    panels: [
      {
        kind: "Supplement Facts",
        servingSize: "2 tablets",
        servingsPerContainer: "56",
        rows: [
          { name: "Vitamin D3", form: "as Cholecalciferol", amount: "12.5", unit: "µg", dv: "63%", key: "vitaminD" },
          { name: "Calcium", form: "as Calcium Citrate and Calcium Carbonate", amount: "260", unit: "mg", dv: "20%", key: "calcium" },
          { name: "Magnesium", form: "as Magnesium Citrate and Magnesium Carbonate", amount: "260", unit: "mg", dv: "62%", key: "magnesium" },
          { name: "Boron", form: "as Boron Citrate", amount: "0.66", unit: "mg", dv: "†", key: "boron" },
        ],
        footnotes: ["†Daily Value (DV) not established"],
      },
    ],
    otherIngredients: [
      { text: "Microcrystalline Cellulose, Ascorbyl Palmitate, Organic Maltodextrin, Calcium Silicate, Croscarmellose Sodium, Organic Sunflower Lecithin, Organic Palm Olein, Organic Guar Gum." },
    ],
    directions: "Adults take two (2) tablets twice daily, preferably with food.",
    servingsPerDay: [2, 2],
    labelSource: { url: "https://www.usana.com/content/a2b24fc6-1a35-4447-a919-d6137aa48f75.pdf", title: "USANA, U.S. MagneCal D Supplement Facts" },
  },
  coquinone: {
    panels: [
      {
        kind: "Supplement Facts",
        servingSize: "1 capsule",
        servingsPerContainer: "56",
        rows: [
          { name: "Coenzyme Q10", amount: "30", unit: "mg", dv: "†", key: "coq10" },
          { name: "Alpha-Lipoic Acid", amount: "13", unit: "mg", dv: "†", key: "alphaLipoicAcid" },
        ],
        footnotes: ["† Daily Value (DV) not established."],
      },
    ],
    otherIngredients: [
      { text: "Medium Chain Triglycerides, Gelatin, Glycerin Monooleate, Soy Lecithin, Glycerin, Purified Water, Annatto Seed Extract (Color), Titanium Dioxide." },
    ],
    contains: "Soy",
    directions: "Take one (1) or two (2) capsules daily, preferably with food.",
    servingsPerDay: [1, 2],
    labelSource: { url: "https://www.usana.com/content/82b184dd-a31d-4438-8e45-28553f2fac51.pdf", title: "USANA, U.S. CoQuinone 30 Supplement Facts" },
  },
  clearProtein: {
    panels: [
      {
        kind: "Nutrition Facts",
        servingSize: "3 rounded scoops (21 g)",
        servingsPerContainer: "20",
        calories: "50",
        rows: [
          { name: "Total Fat", amount: "0", unit: "g", dv: "0%" },
          { name: "Saturated Fat", amount: "0", unit: "g", dv: "0%", indent: 1 },
          { name: "Trans Fat", amount: "0", unit: "g", indent: 1 },
          { name: "Cholesterol", amount: "<5", unit: "mg", dv: "1%" },
          { name: "Sodium", amount: "240", unit: "mg", dv: "10%", key: "sodium" },
          { name: "Total Carbohydrate", amount: "1", unit: "g", dv: "0%" },
          { name: "Dietary Fiber", amount: "0", unit: "g", dv: "0%", indent: 1 },
          { name: "Total Sugars", amount: "0", unit: "g", indent: 1 },
          { name: "Includes 0 g of Added Sugars", amount: "0", unit: "g", dv: "0%", indent: 2 },
          { name: "Sugar Alcohol", amount: "0", unit: "g", indent: 1 },
          { name: "Protein", amount: "10", unit: "g", dv: "20%", key: "protein" },
          { name: "Vitamin D", amount: "0", unit: "µg", dv: "0%", key: "vitaminD" },
          { name: "Calcium", amount: "160", unit: "mg", dv: "12%", key: "calcium" },
          { name: "Iron", amount: "0.1", unit: "mg", dv: "1%", key: "iron" },
          { name: "Potassium", amount: "200", unit: "mg", dv: "4%", key: "potassium" },
          { name: "Magnesium", amount: "25", unit: "mg", dv: "6%", key: "magnesium" },
        ],
        footnotes: ["*The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice."],
      },
    ],
    otherIngredients: [
      { text: "Whey Protein Isolate, Creatine Monohydrate, Calcium Citrate Malate, Potassium Citrate, Sodium Citrate, Natural Flavors, Citric Acid, Malic Acid, Sea Salt, Magnesium Citrate, Stevia Leaf Extract (Reb A, Reb M), Canola Oil." },
    ],
    contains: "Milk",
  },
  coreAminos: {
    panels: [
      {
        kind: "Supplement Facts",
        servingSize: "1 scoop (10.2 g)",
        servingsPerContainer: "28",
        calories: "12",
        rows: [
          { name: "Total Carbohydrates", amount: "2", unit: "g", dv: "<1%" },
          { name: "Total Sugar", amount: "0", unit: "g", indent: 1 },
          { name: "Includes 0 g of Added Sugars", amount: "0", unit: "g", indent: 2 },
          { name: "L-Phenylalanine", form: "Amino Acid", amount: "150", unit: "mg", dv: "†" },
          { name: "L-Valine", form: "Amino Acid", amount: "1000", unit: "mg", dv: "†" },
          { name: "L-Threonine", form: "Amino Acid", amount: "250", unit: "mg", dv: "†" },
          { name: "L-Tryptophan", form: "Amino Acid", amount: "100", unit: "mg", dv: "†" },
          { name: "L-Methionine", form: "Amino Acid", amount: "100", unit: "mg", dv: "†" },
          { name: "L-Leucine", form: "Amino Acid", amount: "2000", unit: "mg", dv: "†" },
          { name: "L-Isoleucine", form: "Amino Acid", amount: "1000", unit: "mg", dv: "†" },
          { name: "L-Lysine", form: "As L-Lysine Hydrochloride", amount: "300", unit: "mg", dv: "†" },
          { name: "L-Histidine", form: "Amino Acid", amount: "150", unit: "mg", dv: "†" },
          { name: "Calcium Beta-Hydroxy Beta-Methylbutyrate", form: "HMB-Ca", amount: "1500", unit: "mg", dv: "†", indent: 1, key: "hmb" },
          { name: "Calcium", amount: "290", unit: "mg", dv: "29%", indent: 1, key: "calcium" },
        ],
        footnotes: ["†Daily value (DV) not established."],
      },
    ],
    otherIngredients: [
      { text: "Natural Flavors, Citric Acid, Malic Acid, L-Lysine Hydrochloride, Stevia (Stevia rebaudiana), Color Added (Turmeric)." },
    ],
    directions: "Add one (1) scoop to 8–10 oz. water (or to taste), mix thoroughly, and enjoy.",
    labelSource: { url: "https://www.usana.com/content/c5673432-7ffc-49e7-aac5-efc467237b2d.pdf", title: "USANA, U.S. Core Aminos (Lemonade) Supplement Facts" },
  },
} as const satisfies Record<ProductKey, ProductLabel>;

/** Plain names for ingredient keys, used in comparison tables. */
export const INGREDIENT_NAMES = {
  vitaminA: "Vitamin A", vitaminC: "Vitamin C", vitaminD: "Vitamin D", vitaminE: "Vitamin E",
  vitaminK: "Vitamin K", thiamin: "Thiamin", riboflavin: "Riboflavin", niacin: "Niacin",
  vitaminB6: "Vitamin B6", folate: "Folate", vitaminB12: "Vitamin B12", biotin: "Biotin",
  pantothenicAcid: "Pantothenic acid", choline: "Choline", calcium: "Calcium", iodine: "Iodine",
  magnesium: "Magnesium", zinc: "Zinc", selenium: "Selenium", copper: "Copper",
  manganese: "Manganese", chromium: "Chromium", molybdenum: "Molybdenum", boron: "Boron",
  silicon: "Silicon", vanadium: "Vanadium", potassium: "Potassium", sodium: "Sodium",
  iron: "Iron", alphaLipoicAcid: "Alpha-lipoic acid", coq10: "Coenzyme Q10",
  curcumin: "Curcumin complex (Meriva)", greenTeaExtract: "Green tea extract",
  quercetin: "Quercetin", resveratrol: "Resveratrol", rutin: "Rutin", hesperidin: "Hesperidin",
  olivol: "Olive fruit extract (Olivol)", pqq: "PQQ", inositol: "Inositol", lutein: "Lutein",
  lycopene: "Lycopene", nac: "N-acetyl L-cysteine", mixedTocopherols: "Mixed tocopherols",
  glucosamine: "Glucosamine", omega3: "Omega-3 fatty acids", epa: "EPA", dha: "DHA",
  protein: "Protein", hmb: "Calcium HMB", ultraTraceMinerals: "Ultra trace minerals",
} as const satisfies Record<IngredientKey, string>;
