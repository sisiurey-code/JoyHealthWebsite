/**
 * Stack builder data for `/usana`, computed at prerender from the same label
 * records and upper limits as the overlap table.
 */
import { amountAgainstLimit, dailyAmount } from "./label-math";
import { UPPER_LIMITS, type LimitedNutrient, type UpperLimit } from "./nutrient-limits";
import {
  labelServings,
  METER_FLOOR,
  stackTotals,
  type StackIncludes,
  type StackLine,
  type StackNutrient,
  type StackProduct,
} from "./stack-math";
import { INGREDIENT_NAMES, PRODUCT_LABELS, type ProductLabel } from "./supplement-labels";
import { SUPPLEMENT_PRODUCTS } from "./supplements";
import { responsiveProductSources, USANA_PRODUCT_IMAGES, type ProductKey } from "./usana";

/** Products that already repeat another product on the shelf; see /supplements/healthpak. */
export const STACK_INCLUDES: StackIncludes = {
  healthpak: {
    cellsentials: "CellSentials' vitamins and minerals",
    magnecal: "part of a MagneCal D serving",
  },
};

/** The stack the prerendered page shows: CellSentials and MagneCal D at their label directions. */
export const DEFAULT_STACK: readonly ProductKey[] = ["cellsentials", "magnecal"];

/** Nutrients with a numeric adult UL that at least one product contains. */
export function stackNutrients(): StackNutrient[] {
  return (Object.keys(UPPER_LIMITS) as LimitedNutrient[]).flatMap((key) => {
    const limit: UpperLimit = UPPER_LIMITS[key];
    if (limit.value === null) return [];
    if (!SUPPLEMENT_PRODUCTS.some((product) => dailyAmount(product.key, key))) return [];
    return [{
      key,
      name: INGREDIENT_NAMES[key],
      ul: limit.value,
      ...(limit.value51Plus !== undefined ? { ul51: limit.value51Plus } : {}),
      unit: limit.unit,
      counts: limit.counts,
      sourceUrl: limit.source.url,
    }];
  });
}

export function stackProducts(nutrients = stackNutrients()): StackProduct[] {
  return SUPPLEMENT_PRODUCTS.map((product) => {
    const label: ProductLabel = PRODUCT_LABELS[product.key];
    const maxServings = label.servingsPerDay?.[1] ?? 1;
    const perServing: Partial<Record<LimitedNutrient, number>> = {};
    for (const nutrient of nutrients) {
      const daily = dailyAmount(product.key, nutrient.key);
      if (daily) {
        perServing[nutrient.key] =
          amountAgainstLimit(daily, UPPER_LIMITS[nutrient.key] as UpperLimit) / maxServings;
      }
    }
    const image = USANA_PRODUCT_IMAGES[product.key].product;
    return {
      key: product.key,
      slug: product.path.slice(product.path.lastIndexOf("/") + 1),
      name: product.name,
      path: product.path,
      image: {
        src: image.src,
        srcSet: responsiveProductSources(image),
        alt: image.alt,
        width: image.width,
        height: image.height,
      },
      servings: label.servingsPerDay ?? null,
      perServing,
    };
  });
}

export type StackFinding = Readonly<{
  products: readonly StackProduct[];
  /** For a pair, the product that already repeats part of the other, and what it repeats. */
  repeats?: Readonly<{ by: StackProduct; what: string }>;
  lines: readonly StackLine[];
}>;

/**
 * What the labels add up to at their directions. `alone` lists each product
 * that exceeds an adult UL by itself. `combined` lists only pairs that add an
 * excess neither product reaches alone, or that double-count a product, since
 * every other pair just inherits a single product's excess.
 */
export function stackFindings(products = stackProducts()) {
  const nutrients = stackNutrients();
  const overAt = (pair: readonly StackProduct[]) =>
    stackTotals(
      products,
      nutrients,
      Object.fromEntries(pair.map((product) => [product.key, labelServings(product)])),
    ).filter((line) => line.over);
  const alone = new Map(products.map((product) => [product.key, overAt([product])]));

  const combined: StackFinding[] = [];
  products.forEach((a, index) => {
    for (const b of products.slice(index + 1)) {
      const inherited = new Set(
        [...alone.get(a.key)!, ...alone.get(b.key)!].map((line) => line.nutrient.key),
      );
      const lines = overAt([a, b]).filter((line) => !inherited.has(line.nutrient.key));
      const what = STACK_INCLUDES[a.key]?.[b.key] ?? STACK_INCLUDES[b.key]?.[a.key];
      const repeats = what ? { by: STACK_INCLUDES[a.key]?.[b.key] ? a : b, what } : undefined;
      if (lines.length || repeats) combined.push({ products: [a, b], repeats, lines });
    }
  });

  return {
    alone: products
      .filter((product) => alone.get(product.key)!.length)
      .map((product): StackFinding => ({ products: [product], lines: alone.get(product.key)! })),
    combined,
  };
}

/** Default servings: each product in `DEFAULT_STACK` at its label directions. */
export function defaultServings(products = stackProducts()) {
  return Object.fromEntries(
    DEFAULT_STACK.map((key) => [key, labelServings(products.find((product) => product.key === key)!)]),
  );
}

/**
 * Upper-limit sources in the order the prerendered section cites them: the
 * default stack's meters, then the findings. Pages number sources by first
 * appearance, so this order is the numbering.
 */
export function stackSourceUrls(
  products = stackProducts(),
  nutrients = stackNutrients(),
  findings = stackFindings(products),
) {
  const meters = stackTotals(products, nutrients, defaultServings(products)).filter(
    (line) => line.total / line.nutrient.ul >= METER_FLOOR,
  );
  return [...meters, ...[...findings.alone, ...findings.combined].flatMap(({ lines }) => lines)].map(
    ({ nutrient }) => nutrient.sourceUrl,
  );
}
