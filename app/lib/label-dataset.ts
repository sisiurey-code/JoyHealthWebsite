/**
 * The supplement label transcriptions as downloadable data. The JSON and CSV
 * files are generated from the same records that render the product pages,
 * so the download can never disagree with what the pages show.
 */
import { amountAgainstLimit, dailyAmount, exceedsUpperLimit, ingredientKeys } from "./label-math";
import { upperLimitFor } from "./nutrient-limits";
import { absoluteUrl, ORGANIZATION_ID, SITE_NAME } from "./seo";
import { INGREDIENT_NAMES, LABEL_TRANSCRIBED_ON, PRODUCT_LABELS, type ProductLabel } from "./supplement-labels";
import { SUPPLEMENT_PRODUCTS } from "./supplements";
import { USANA_BRAND_NAME } from "./usana";

export const LABEL_DATA_JSON_PATH = "/data/supplement-labels.json";
export const LABEL_DATA_CSV_PATH = "/data/supplement-labels.csv";
/** Joy Health's compilation is CC BY 4.0: reuse freely, credit Joy Health. */
export const LABEL_DATA_LICENSE = "https://creativecommons.org/licenses/by/4.0/";
/** The visible section that describes the dataset. */
export const LABEL_DATA_PAGE_PATH = "/usana#label-data";

const DATASET_NAME = "USANA Supplement Facts labels as text, with daily amounts and adult upper limits";
const DATASET_DESCRIPTION =
  "Every row of the U.S. Supplement Facts or Nutrition Facts label for eight USANA products (CellSentials, HealthPak, Procosa, BiOmega, MagneCal D, CoQuinone 30, Clear Protein + Creatine Mix, and Core Aminos), transcribed exactly as printed and checked against the label PDFs USANA publishes where one exists. For each ingredient it also gives the daily amount at the label's directions and, where one exists, the adult Tolerable Upper Intake Level from the National Academies as reported by the NIH Office of Dietary Supplements, including what that limit counts. Prepared by Joy Health, which earns commissions on USANA purchases made through its storefront links.";

const CAVEATS = [
  "Amounts, units, and % Daily Values are as printed on the label; formulas change, so compare the label on the package.",
  "Clear Protein + Creatine Mix has no published label; its rows come from the package photo, and the label gives no creatine amount.",
  "Daily amounts multiply per-serving amounts by the servings the label's directions call for. When a label states no servings per day, the amount is per serving.",
  "An upper limit is the highest daily intake likely to pose no risk of adverse effects for almost all healthy adults. It is not a recommended intake, and several limits count only supplements.",
  "Known label discrepancies are described on each product page. General education, not medical advice.",
];

const slugOf = (path: string) => path.slice(path.lastIndexOf("/") + 1);

function dailyAmounts(productKey: (typeof SUPPLEMENT_PRODUCTS)[number]["key"]) {
  return ingredientKeys(productKey).flatMap((key) => {
    const daily = dailyAmount(productKey, key);
    if (!daily) return [];
    const limit = upperLimitFor(key);
    return [
      {
        ingredient: key,
        name: INGREDIENT_NAMES[key],
        unit: daily.unit,
        min: daily.min,
        max: daily.max,
        perServingOnly: daily.perServingOnly,
        upperLimit:
          limit && limit.value !== null
            ? {
                value: limit.value,
                ...(limit.value51Plus ? { value51Plus: limit.value51Plus } : {}),
                unit: limit.unit,
                counts: limit.counts,
                amountCounted: amountAgainstLimit(daily, limit),
                exceededAtLabelDirections: exceedsUpperLimit(daily, limit),
                source: limit.source.url,
              }
            : null,
      },
    ];
  });
}

export function buildLabelDataset() {
  return {
    name: DATASET_NAME,
    description: DATASET_DESCRIPTION,
    publisher: SITE_NAME,
    url: absoluteUrl(LABEL_DATA_PAGE_PATH),
    license: LABEL_DATA_LICENSE,
    attribution: `${SITE_NAME} (${absoluteUrl(LABEL_DATA_PAGE_PATH)})`,
    labelsCheckedOn: LABEL_TRANSCRIBED_ON,
    caveats: CAVEATS,
    products: SUPPLEMENT_PRODUCTS.map((product) => {
      const label: ProductLabel = PRODUCT_LABELS[product.key];
      return {
        slug: slugOf(product.path),
        name: product.name,
        brand: USANA_BRAND_NAME,
        page: absoluteUrl(product.path),
        officialLabel: label.labelSource ?? null,
        directions: label.directions ?? null,
        servingsPerDay: label.servingsPerDay ?? null,
        panels: label.panels,
        otherIngredients: label.otherIngredients,
        contains: label.contains ?? null,
        dailyAmounts: dailyAmounts(product.key),
      };
    }),
  };
}

const CSV_COLUMNS = [
  "product_slug", "product_name", "panel", "panel_kind", "serving_size", "row_name",
  "form", "amount", "unit", "percent_daily_value", "ingredient_key", "is_heading",
] as const;

const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** One CSV line per printed label row, in label order. */
export function buildLabelCsv() {
  const lines = [CSV_COLUMNS.join(",")];
  for (const product of SUPPLEMENT_PRODUCTS) {
    const label: ProductLabel = PRODUCT_LABELS[product.key];
    for (const panel of label.panels) {
      for (const row of panel.rows) {
        lines.push(
          [
            slugOf(product.path), product.name, panel.name ?? "", panel.kind, panel.servingSize,
            row.name, row.form ?? "", row.amount, row.unit, row.dv ?? "", row.key ?? "",
            row.heading ? "true" : "false",
          ].map(csvCell).join(","),
        );
      }
    }
  }
  return `${lines.join("\n")}\n`;
}

/** schema.org Dataset for the visible `#label-data` section on `/usana`. */
export function buildLabelDatasetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": absoluteUrl(LABEL_DATA_PAGE_PATH),
    name: DATASET_NAME,
    description: DATASET_DESCRIPTION,
    url: absoluteUrl(LABEL_DATA_PAGE_PATH),
    creator: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
    license: LABEL_DATA_LICENSE,
    dateModified: LABEL_TRANSCRIBED_ON,
    temporalCoverage: LABEL_TRANSCRIBED_ON,
    spatialCoverage: { "@type": "Place", name: "United States" },
    inLanguage: "en-US",
    keywords: [
      "Supplement Facts", "dietary supplements", "Tolerable Upper Intake Level", "USANA",
      "CellSentials", "HealthPak", "MagneCal D", "BiOmega", "Procosa", "CoQuinone 30",
      "Core Aminos", "Clear Protein + Creatine Mix",
    ],
    measurementTechnique:
      "Transcription of printed U.S. Supplement Facts and Nutrition Facts labels, checked row by row against the manufacturer's published label PDFs where one exists; daily amounts computed from the label directions.",
    variableMeasured: [
      "Amount per serving",
      "Percent Daily Value",
      "Daily amount at label directions",
      "Adult Tolerable Upper Intake Level",
    ],
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: absoluteUrl(LABEL_DATA_JSON_PATH) },
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: absoluteUrl(LABEL_DATA_CSV_PATH) },
    ],
  };
}
