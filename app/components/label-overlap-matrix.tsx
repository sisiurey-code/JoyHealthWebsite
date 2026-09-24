import Link from "next/link";
import type { ReactNode } from "react";
import {
  dailyAmount,
  exceedsUpperLimit,
  formatAmount,
  formatRange,
} from "../lib/label-math";
import { UPPER_LIMITS, type LimitedNutrient, type UpperLimit } from "../lib/nutrient-limits";
import { INGREDIENT_NAMES } from "../lib/supplement-labels";
import { SUPPLEMENT_PRODUCTS } from "../lib/supplements";

/** HealthPak repeats CellSentials' vitamins and minerals, so overlap between just those two is not news. */
const SAME_BASE = new Set(["cellsentials", "healthpak"]);

/**
 * Nutrients with an adult UL that appear in more than one product family, or
 * that any single product exceeds at its label directions.
 */
export function overlapMatrixRows() {
  return (Object.keys(UPPER_LIMITS) as LimitedNutrient[]).flatMap((key) => {
    const limit: UpperLimit = UPPER_LIMITS[key];
    const cells = SUPPLEMENT_PRODUCTS.map((product) => ({
      product,
      daily: dailyAmount(product.key, key),
    }));
    const present = cells.filter(({ daily }) => daily);
    const exceeded = present.some(({ daily }) => exceedsUpperLimit(daily, limit));
    const spansFamilies = present.some(({ product }) => !SAME_BASE.has(product.key));
    if (limit.value === null || (!exceeded && (present.length < 2 || !spansFamilies))) return [];
    return [{ key, limit, cells }];
  });
}

/** Every product that has at least one amount in the matrix, in shelf order. */
function matrixProducts(rows: ReturnType<typeof overlapMatrixRows>) {
  return SUPPLEMENT_PRODUCTS.filter((product) =>
    rows.some(({ cells }) => cells.some((cell) => cell.product.key === product.key && cell.daily)),
  );
}

type LabelOverlapMatrixProps = Readonly<{
  /** Renders the citation for an upper limit's source on the host page. */
  cite: (url: string) => ReactNode;
}>;

export function LabelOverlapMatrix({ cite }: LabelOverlapMatrixProps) {
  const rows = overlapMatrixRows();
  const products = matrixProducts(rows);

  return (
    <div className="facts-table-wrap">
      <table className="facts-table daily-table overlap-matrix">
        <caption>
          Daily amounts at each label&apos;s directions, with adult upper limits
          <span className="visually-hidden">. </span>
          <span>
            Products without a stated number of servings a day show one serving,
            marked &ldquo;per serving.&rdquo; A dash means the product does not
            contain the nutrient.
          </span>
        </caption>
        <thead>
          <tr>
            <th scope="col">Nutrient</th>
            {products.map((product) => (
              <th scope="col" key={product.key}>
                <Link href={product.path}>{product.name}</Link>
              </th>
            ))}
            <th scope="col">Adult UL</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, limit, cells }) => (
            <tr key={key}>
              <th scope="row">{INGREDIENT_NAMES[key]}</th>
              {products.map((product) => {
                const daily = cells.find((cell) => cell.product.key === product.key)?.daily;
                const over = exceedsUpperLimit(daily, limit);
                return (
                  <td key={product.key} className={over ? "is-over-limit" : undefined}>
                    {daily
                      ? `${formatRange(daily.min, daily.max, daily.unit)}${daily.perServingOnly ? " per serving" : ""}`
                      : "–"}
                    {over ? <strong className="over-limit">Above the UL</strong> : null}
                  </td>
                );
              })}
              <td>
                {formatAmount(limit.value!)} {limit.unit}
                {limit.value51Plus !== undefined
                  ? ` (${formatAmount(limit.value51Plus)} ${limit.unit} from age 51)`
                  : ""}
                {cite(limit.source.url)}
                <small>{limit.counts}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
