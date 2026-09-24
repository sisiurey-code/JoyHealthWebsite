import Link from "next/link";
import {
  amountAgainstLimit,
  convert,
  dailyAmount,
  exceedsUpperLimit,
  formatAmount,
  formatRange,
  ingredientKeys,
  type DailyAmount,
} from "../lib/label-math";
import { upperLimitFor, type UpperLimit } from "../lib/nutrient-limits";
import { INGREDIENT_NAMES, type IngredientKey } from "../lib/supplement-labels";
import { SUPPLEMENT_PRODUCTS } from "../lib/supplements";
import type { ProductKey } from "../lib/usana";
import { Citation } from "./citation";

const COUNTED_AS: Partial<Record<IngredientKey, string>> = {
  vitaminA: "preformed",
  folate: "as folic acid",
};

function describeDaily(key: IngredientKey, daily: DailyAmount, limit: UpperLimit | undefined) {
  const total = formatRange(daily.min, daily.max, daily.unit);
  const counted =
    limit && daily.ulMin !== undefined && daily.ulMax !== undefined &&
    daily.ulMax !== convert(daily.max, daily.unit, limit.unit)
      ? ` (${formatRange(daily.ulMin, daily.ulMax, limit.unit)} ${COUNTED_AS[key] ?? "counted"})`
      : "";
  return `${total}${counted}${daily.perServingOnly ? " per serving" : ""}`;
}

/** Ingredients with an adult UL, or that also appear in another product on the site. */
export function dailyTableRows(productKey: ProductKey) {
  return ingredientKeys(productKey).flatMap((key) => {
    const daily = dailyAmount(productKey, key);
    const limit = upperLimitFor(key);
    const others = SUPPLEMENT_PRODUCTS.flatMap((other) => {
      const amount = other.key === productKey ? undefined : dailyAmount(other.key, key);
      return amount ? [{ other, amount }] : [];
    });
    if (!daily || (!limit && !others.length)) return [];
    return [{ key, daily, limit, others }];
  });
}

type DailyAmountsTableProps = Readonly<{
  productKey: ProductKey;
  /** Maps a source URL to its number in the page's source list. */
  citeFor: (url: string) => number;
}>;

/**
 * Daily amounts at the label directions for every ingredient that has an
 * adult UL or also appears in another product on the site. Everything here is
 * computed from `PRODUCT_LABELS` and `UPPER_LIMITS`, so the table cannot
 * drift from the transcribed labels.
 */
export function DailyAmountsTable({ productKey, citeFor }: DailyAmountsTableProps) {
  const product = SUPPLEMENT_PRODUCTS.find(({ key }) => key === productKey)!;
  const rows = dailyTableRows(productKey);
  if (!rows.length) return null;
  const perServingOnly = rows[0].daily.perServingOnly;

  return (
    <div className="facts-table-wrap">
      <table className="facts-table daily-table">
        <caption>
          {product.name} {perServingOnly ? "per serving" : "per day at the label directions"},
          other products on this site, and adult upper limits
        </caption>
        <thead>
          <tr>
            <th scope="col">Ingredient</th>
            <th scope="col">{product.name} {perServingOnly ? "per serving" : "per day"}</th>
            <th scope="col">Also in, per day</th>
            <th scope="col">Adult UL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, daily, limit, others }) => {
            const over = exceedsUpperLimit(daily, limit);
            return (
              <tr key={key} className={over ? "is-over-limit" : undefined}>
                <th scope="row">{INGREDIENT_NAMES[key]}</th>
                <td>
                  {describeDaily(key, daily, limit)}
                  {over && limit ? (
                    <strong className="over-limit">
                      Above the {formatAmount(limit.value!)} {limit.unit} UL by{" "}
                      {formatAmount(amountAgainstLimit(daily, limit) - limit.value!)} {limit.unit}
                    </strong>
                  ) : null}
                </td>
                <td>
                  {others.length ? (
                    <ul className="overlap-list">
                      {others.map(({ other, amount }) => (
                        <li key={other.key}>
                          <Link href={other.path}>{other.name}</Link>{" "}
                          {describeDaily(key, amount, limit)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  )}
                </td>
                <td>
                  {limit ? (
                    <>
                      {limit.value === null
                        ? "None set"
                        : `${formatAmount(limit.value)} ${limit.unit}`}
                      {"value51Plus" in limit && limit.value51Plus !== undefined
                        ? ` (${formatAmount(limit.value51Plus)} ${limit.unit} from age 51)`
                        : ""}
                      <Citation source={citeFor(limit.source.url)} />
                      <small>{limit.counts}</small>
                    </>
                  ) : (
                    "No UL"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
