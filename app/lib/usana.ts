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
      width: 850,
      height: 860,
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
      width: 409,
      height: 1000,
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
