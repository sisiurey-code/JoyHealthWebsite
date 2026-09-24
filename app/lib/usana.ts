export const USANA_STOREFRONT_URL = "https://sissi.usana.com/";

export type ProductImage = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
}>;

export type ProductImages = Readonly<{
  product: ProductImage;
  facts: ProductImage;
}>;

const responsiveWidths = [320, 640, 960] as const;

/**
 * Builds the srcset for a product or label image from the WebP variants that
 * `npm run images:generate` writes to `public/images/responsive/usana`.
 */
export function responsiveProductSources(image: ProductImage) {
  const basename = image.src.slice(
    image.src.lastIndexOf("/") + 1,
    image.src.lastIndexOf("."),
  );
  return [
    ...new Set([
      ...responsiveWidths.filter((width) => width <= image.width),
      image.width,
    ]),
  ]
    .sort((left, right) => left - right)
    .map(
      (width) =>
        `/images/responsive/usana/${basename}-${width}.webp ${width}w`,
    )
    .join(", ");
}

export const USANA_PRODUCT_IMAGES = {
  cellsentials: {
    product: {
      src: "/images/usana/cellsentials-product.png",
      alt: "CellSentials Core Minerals and Vita Antioxidant bottles",
      width: 1204,
      height: 1200,
    },
    facts: {
      src: "/images/usana/cellsentials-label.png",
      alt: "Supplement Facts labels for CellSentials Vita Antioxidant and Core Minerals",
      width: 2088,
      height: 1044,
    },
  },
  healthpak: {
    product: {
      src: "/images/usana/healthpak-product.png",
      alt: "HealthPak box",
      width: 1206,
      height: 1200,
    },
    facts: {
      src: "/images/usana/healthpak-label.png",
      alt: "Supplement Facts label for HealthPak",
      width: 1392,
      height: 1392,
    },
  },
  procosa: {
    product: {
      src: "/images/usana/procosa-product.png",
      alt: "Procosa bottle",
      width: 1102,
      height: 1102,
    },
    facts: {
      src: "/images/usana/procosa-label.png",
      alt: "Supplement Facts label for Procosa",
      width: 1000,
      height: 935,
    },
  },
  biomega: {
    product: {
      src: "/images/usana/biomega-product.png",
      alt: "BiOmega bottle",
      width: 1000,
      height: 1000,
    },
    facts: {
      src: "/images/usana/biomega-label.png",
      alt: "Supplement Facts label for BiOmega",
      width: 1000,
      height: 956,
    },
  },
  magnecal: {
    product: {
      src: "/images/usana/magnecal-d-product.png",
      alt: "MagneCal D bottle",
      width: 1072,
      height: 1074,
    },
    facts: {
      src: "/images/usana/magnecal-d-label.png",
      alt: "Supplement Facts label for MagneCal D",
      width: 493,
      height: 401,
    },
  },
  coquinone: {
    product: {
      src: "/images/usana/coquinone-product.png",
      alt: "CoQuinone 30 bottle",
      width: 1042,
      height: 1042,
    },
    facts: {
      src: "/images/usana/coquinone-label.png",
      alt: "Supplement Facts label for CoQuinone 30",
      width: 498,
      height: 450,
    },
  },
  clearProtein: {
    product: {
      src: "/images/usana/clear-protein-creatine-product.png",
      alt: "Clear Protein and Creatine green apple pouch",
      width: 734,
      height: 1010,
    },
    facts: {
      src: "/images/usana/clear-protein-creatine-label.png",
      alt: "Supplement Facts label for Clear Protein and Creatine green apple mix",
      width: 488,
      height: 1000,
    },
  },
  coreAminos: {
    product: {
      src: "/images/usana/core-aminos-product.png",
      alt: "Core Aminos tub",
      width: 850,
      height: 844,
    },
    facts: {
      src: "/images/usana/core-aminos-label.png",
      alt: "Supplement Facts label for Core Aminos",
      width: 850,
      height: 794,
    },
  },
} as const satisfies Record<string, ProductImages>;

export type ProductKey = keyof typeof USANA_PRODUCT_IMAGES;

/** Products shown on the product shelf, in editorial order. */
export const PRODUCT_SHELF = [
  { key: "cellsentials", name: "CellSentials", role: "Daily multivitamin and minerals" },
  { key: "biomega", name: "BiOmega", role: "Omega-3 fish oil" },
  { key: "coquinone", name: "CoQuinone 30", role: "Coenzyme Q10" },
  { key: "clearProtein", name: "Clear Protein + Creatine", role: "Protein, creatine, electrolytes" },
] as const satisfies readonly Readonly<{
  key: ProductKey;
  name: string;
  role: string;
}>[];

export const USANA_BRAND_NAME = "USANA Health Sciences";

/**
 * The products shown on `/usana`, in page order. Descriptions restate the
 * visible card copy; keep them in step with `UsanaProductCards`.
 */
export const USANA_PRODUCT_CATALOG = [
  {
    key: "cellsentials",
    name: "CellSentials",
    description:
      "Core Minerals and Vita-Antioxidant, the flagship daily nutrition system, with a company-reported 2026 ConsumerLab seal for label accuracy, purity, and potency.",
  },
  {
    key: "healthpak",
    name: "HealthPak",
    description:
      "Daily packets that package CellSentials with MagneCal D and the CellSentials Booster.",
  },
  {
    key: "procosa",
    name: "Procosa",
    description:
      "A targeted combination built around vegetarian glucosamine, vitamin C, and curcumin.",
  },
  {
    key: "biomega",
    name: "BiOmega",
    description:
      "A fish-oil product providing concentrated omega-3 fatty acids plus vitamin D, named in the current NSF/ANSI 173 listing.",
  },
  {
    key: "magnecal",
    name: "MagneCal D",
    description:
      "Calcium, magnesium, vitamin D, and boron in one formula, with company-reported ConsumerLab testing.",
  },
  {
    key: "coquinone",
    name: "CoQuinone 30",
    description:
      "Coenzyme Q10 and alpha-lipoic acid on a short U.S. label that also identifies soy and gelatin.",
  },
  {
    key: "clearProtein",
    name: "Clear Protein + Creatine Mix",
    description:
      "A 50-calorie serving combining 10 grams of clear whey protein isolate, 5 grams of creatine monohydrate, and more than 600 milligrams of electrolytes.",
  },
  {
    key: "coreAminos",
    name: "Core Aminos",
    description:
      "A lemonade-flavored drink mix combining essential amino acids with HMB, introduced in 2025.",
  },
] as const satisfies readonly {
  key: keyof typeof USANA_PRODUCT_IMAGES;
  name: string;
  description: string;
}[];
