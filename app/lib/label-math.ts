import { upperLimitFor, type UpperLimit } from "./nutrient-limits";
import {
  PRODUCT_LABELS,
  type IngredientKey,
  type LabelRow,
  type ProductLabel,
} from "./supplement-labels";
import type { ProductKey } from "./usana";

const MG_PER_UNIT = { µg: 0.001, mg: 1, g: 1000 } as const;

/** Milligrams per unit for a printed unit such as "µg RAE" or "mg NE". */
function mgPerUnit(unit: string): number {
  const base = unit.split(" ")[0] as keyof typeof MG_PER_UNIT;
  const scale = MG_PER_UNIT[base];
  if (scale === undefined) throw new Error(`Unknown label unit: ${unit}`);
  return scale;
}

export function convert(amount: number, from: string, to: string) {
  return (amount * mgPerUnit(from)) / mgPerUnit(to);
}

export type DailyAmount = Readonly<{
  /** Printed unit of the first matching row, e.g. "µg RAE". */
  unit: string;
  min: number;
  max: number;
  /** The part counted toward the UL, in the UL's unit, when it differs. */
  ulMin?: number;
  ulMax?: number;
  /** True when the label states no servings per day, so the amount is per serving. */
  perServingOnly: boolean;
}>;

function rowsFor(label: ProductLabel, key: IngredientKey): LabelRow[] {
  return label.panels.flatMap((panel) =>
    // Rows printed as zero (e.g. "Vitamin D 0 µg" on a food label) contribute nothing.
    panel.rows.filter((row) => row.key === key && /^\d+(\.\d+)?$/.test(row.amount) && Number(row.amount) > 0),
  );
}

/** Sum of every row with this key across a label's panels, scaled to a day. */
export function dailyAmount(productKey: ProductKey, key: IngredientKey): DailyAmount | undefined {
  const label: ProductLabel = PRODUCT_LABELS[productKey];
  const rows = rowsFor(label, key);
  if (!rows.length) return undefined;
  const unit = rows[0].unit;
  const perServing = rows.reduce((sum, row) => sum + convert(Number(row.amount), row.unit, unit), 0);
  const [minServings, maxServings] = label.servingsPerDay ?? [1, 1];
  const limit = upperLimitFor(key);
  const counted = rows.some((row) => row.ulAmount !== undefined) && limit
    ? rows.reduce(
        (sum, row) =>
          sum + convert(row.ulAmount ?? Number(row.amount), row.ulUnit ?? row.unit, limit.unit),
        0,
      )
    : undefined;
  return {
    unit,
    min: perServing * minServings,
    max: perServing * maxServings,
    ...(counted !== undefined ? { ulMin: counted * minServings, ulMax: counted * maxServings } : {}),
    perServingOnly: !label.servingsPerDay,
  };
}

/** Upper end of the daily amount in the UL's unit, counting only what the UL covers. */
export function amountAgainstLimit(daily: DailyAmount, limit: UpperLimit) {
  return daily.ulMax ?? convert(daily.max, daily.unit, limit.unit);
}

/** True when this product alone, at its label directions, exceeds the adult UL. */
export function exceedsUpperLimit(daily: DailyAmount | undefined, limit: UpperLimit | undefined) {
  if (!daily || !limit || limit.value === null || daily.perServingOnly) return false;
  return amountAgainstLimit(daily, limit) > limit.value;
}

export function formatAmount(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function formatRange(min: number, max: number, unit: string) {
  return min === max
    ? `${formatAmount(min)} ${unit}`
    : `${formatAmount(min)}–${formatAmount(max)} ${unit}`;
}

/** Ingredient keys in label order, each listed once. */
export function ingredientKeys(productKey: ProductKey): IngredientKey[] {
  const label: ProductLabel = PRODUCT_LABELS[productKey];
  const keys = label.panels.flatMap((panel) =>
    panel.rows.flatMap((row) => (row.key ? [row.key] : [])),
  );
  return [...new Set(keys)];
}
