import type { Source } from "../components/source-list";
import { PRODUCT_LABELS } from "./supplement-labels";
import type { ProductKey } from "./usana";

/** Sources shared by the `/supplements/*` pages. Every entry was read September 23, 2026. */

export function labelSource(key: ProductKey): Source {
  const { labelSource: source } = PRODUCT_LABELS[key] as { labelSource?: { url: string; title: string } };
  if (!source) throw new Error(`No published label for ${key}`);
  return {
    title: source.title,
    url: source.url,
    publisher: "USANA Health Sciences",
    note: "The manufacturer's current U.S. label, used to check every transcribed row, the directions, and the allergen statement. A record of what the label says, not evidence that the product works. Read September 23, 2026.",
  };
}

export const NSF_LISTING: Source = {
  title: "NSF Official Listings: USANA Health Sciences finished products under NSF/ANSI 173, Dietary Supplements",
  url: "https://info.nsf.org/Certified/Dietary/Listings.asp?CompanyName=usana&StandardExt=FP",
  publisher: "NSF",
  note: "Independent certification record naming the Salt Lake City facility, 11 USANA finished products, and the manufacturer's recommended daily serving for each. A listing covers the named products, not the whole catalog. Read September 23, 2026.",
};

export const ODS_EXERCISE: Source = {
  title: "Dietary Supplements for Exercise and Athletic Performance: Fact Sheet for Health Professionals",
  url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
  publisher: "NIH Office of Dietary Supplements",
  note: "Used for what third-party certification checks, and for creatine, protein, and HMB safety notes. Read September 23, 2026.",
};

export const ODS_CONSUMER: Source = {
  title: "Dietary Supplements: What You Need to Know",
  url: "https://ods.od.nih.gov/factsheets/WYNTK-Consumer/",
  publisher: "NIH Office of Dietary Supplements",
  note: "Used for how fortified foods and multiple supplements add up. Read September 23, 2026.",
};

export const FDA_MIXING: Source = {
  title: "Mixing Medications and Dietary Supplements Can Endanger Your Health",
  url: "https://www.fda.gov/consumers/consumer-updates/mixing-medications-and-dietary-supplements-can-endanger-your-health",
  publisher: "U.S. Food and Drug Administration",
  note: "Consumer update used for interactions and stopping supplements before surgery. Read September 23, 2026.",
};

export function odsSheet(name: string, slug: string, use: string): Source {
  return {
    title: `${name}: Fact Sheet for Health Professionals`,
    url: `https://ods.od.nih.gov/factsheets/${slug}-HealthProfessional/`,
    publisher: "NIH Office of Dietary Supplements",
    note: `${use} Read September 23, 2026.`,
  };
}

export function nccihPage(title: string, slug: string, use: string): Source {
  return {
    title,
    url: `https://www.nccih.nih.gov/health/${slug}`,
    publisher: "NIH National Center for Complementary and Integrative Health",
    note: `${use} Read September 23, 2026.`,
  };
}

export const USANA_CELLSENTIALS_CONSUMERLAB: Source = {
  title: "Tested, Trusted, Approved: USANA CellSentials Earns ConsumerLab.com Seal of Approval for Purity and Potency",
  url: "https://ir.usana.com/news-events/press-releases/detail/820/tested-trusted-approved-usana-cellsentials-earns",
  publisher: "USANA Health Sciences, March 24, 2026",
  note: "Company announcement of the ConsumerLab.com seal and the reported testing scope. ConsumerLab's own report was not available to us. Read September 23, 2026.",
};

export const USANA_MAGNECAL_CONSUMERLAB: Source = {
  title: "Proven Power for Strong Bone Support: USANA's MagneCal D Earns ConsumerLab.com Seal of Approval",
  url: "https://ir.usana.com/news-events/press-releases/detail/805/proven-power-for-strong-bone-support--usanas-magnecal-d",
  publisher: "USANA Health Sciences, November 11, 2025",
  note: "Company announcement of the ConsumerLab.com seal and the reported checks for claimed amounts and disintegration. ConsumerLab's own report was not available to us. Read September 23, 2026.",
};

export const USANA_CLEAR_PROTEIN_LAUNCH: Source = {
  title: "USANA Introduces 3-in-1 Protein, Creatine, and Electrolyte Drink Mix",
  url: "https://ir.usana.com/news-events/press-releases/detail/841/usana-introduces-3-in-1-protein-creatine-and-electrolyte",
  publisher: "USANA Health Sciences, August 17, 2026",
  note: "Launch announcement used for the creatine amount, which the label does not state, and for flavors, formats, and mixing directions. A company statement, not independent testing. Read September 23, 2026.",
};

export const FDA_QUESTIONS: Source = {
  title: "Questions and Answers on Dietary Supplements",
  url: "https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements",
  publisher: "U.S. Food and Drug Administration",
  note: "Used for premarket approval and the advice to talk with a health professional because supplements can interact with medicines. Read September 23, 2026.",
};

export const UL_DEFINITION: Source = {
  title:
    "Dietary Reference Intakes for Vitamin A, Vitamin K, Arsenic, Boron, Chromium, Copper, Iodine, Iron, Manganese, Molybdenum, Nickel, Silicon, Vanadium, and Zinc, Chapter 1",
  url: "https://nap.nationalacademies.org/read/10026/chapter/3",
  publisher: "Institute of Medicine (National Academies Press), 2001",
  note: "Used for what a Tolerable Upper Intake Level means and that it is not a recommended intake. Read September 23, 2026.",
};
