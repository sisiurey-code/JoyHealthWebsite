/**
 * Stack arithmetic shared by the prerendered `/usana` page and the stack
 * builder in the browser. It imports types only, so the client bundle carries
 * no label records; `app/lib/stack.ts` builds the data at prerender.
 */
import type { LimitedNutrient } from "./nutrient-limits";
import type { ProductKey } from "./usana";

export type StackProduct = Readonly<{
  key: ProductKey;
  /** Slug of the product page; used in shareable `?stack=` links. */
  slug: string;
  name: string;
  path: string;
  image: Readonly<{ src: string; srcSet: string; alt: string; width: number; height: number }>;
  /** Servings a day under the label directions, or null when the label states none. */
  servings: readonly [number, number] | null;
  /** Amount per serving, in the limit's unit, counting only what the limit counts. */
  perServing: Readonly<Partial<Record<LimitedNutrient, number>>>;
}>;

export type StackNutrient = Readonly<{
  key: LimitedNutrient;
  name: string;
  ul: number;
  ul51?: number;
  unit: string;
  counts: string;
  sourceUrl: string;
}>;

export type StackLine = Readonly<{
  nutrient: StackNutrient;
  total: number;
  parts: readonly Readonly<{ key: ProductKey; amount: number }>[];
  over: boolean;
}>;

export type Servings = Readonly<Partial<Record<ProductKey, number>>>;

/**
 * What one product already repeats of another, as the reader sees it: e.g.
 * HealthPak repeats "part of a MagneCal D serving". Wording follows the
 * product pages, which explain the label comparison behind it.
 */
export type StackIncludes = Readonly<Partial<Record<ProductKey, Readonly<Partial<Record<ProductKey, string>>>>>>;

/** Meters are drawn for nutrients at or above this share of their UL; the rest are named. */
export const METER_FLOOR = 0.5;

/** Daily totals for a stack, highest share of the upper limit first. */
export function stackTotals(
  products: readonly StackProduct[],
  nutrients: readonly StackNutrient[],
  servings: Servings,
): StackLine[] {
  return nutrients
    .map((nutrient) => {
      const parts = products.flatMap((product) => {
        const count = servings[product.key] ?? 0;
        const per = product.perServing[nutrient.key];
        return count > 0 && per ? [{ key: product.key, amount: per * count }] : [];
      });
      const total = parts.reduce((sum, part) => sum + part.amount, 0);
      return { nutrient, total, parts, over: total > nutrient.ul };
    })
    .filter((line) => line.total > 0)
    .sort((a, b) => b.total / b.nutrient.ul - a.total / a.nutrient.ul);
}

/** Servings a day at the upper end of the label directions; one when the label states none. */
export function labelServings(product: StackProduct) {
  return product.servings?.[1] ?? 1;
}

/** A name or note as it reads mid-sentence: "Vitamin D" becomes "vitamin D". */
export function inSentence(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function formatStackAmount(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: value < 10 ? 2 : 0 });
}
