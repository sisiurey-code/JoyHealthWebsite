"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { LimitedNutrient } from "../lib/nutrient-limits";
import {
  formatStackAmount,
  inSentence,
  labelServings,
  METER_FLOOR,
  stackTotals,
  type Servings,
  type StackIncludes,
  type StackLine,
  type StackNutrient,
  type StackProduct,
} from "../lib/stack-math";
import type { ProductKey } from "../lib/usana";

type StackBuilderProps = Readonly<{
  products: readonly StackProduct[];
  nutrients: readonly StackNutrient[];
  includes: StackIncludes;
  defaultStack: readonly ProductKey[];
  /** The host page's source number for each nutrient's upper limit. */
  citations: Readonly<Partial<Record<LimitedNutrient, number>>>;
}>;

const COLORS = ["#2f6b4f", "#ee915d", "#d9a62e", "#5f9ec4", "#a3471f", "#8c6bb1", "#4d8a68", "#c46b8c"];
const MAX_SERVINGS = 4;

/** Reads `?stack=slug*servings.slug*servings`; unknown slugs are ignored. */
function parseStack(value: string | null, products: readonly StackProduct[]): Servings | null {
  if (!value) return null;
  const servings: Partial<Record<ProductKey, number>> = {};
  for (const item of value.split(".")) {
    const [slug, count] = item.split("*");
    const product = products.find((entry) => entry.slug === slug);
    if (!product) continue;
    const parsed = Number.parseInt(count ?? "", 10);
    servings[product.key] = Number.isFinite(parsed)
      ? Math.min(Math.max(parsed, 1), MAX_SERVINGS)
      : labelServings(product);
  }
  return Object.keys(servings).length ? servings : null;
}

function directions(product: StackProduct) {
  if (!product.servings) return "No daily amount on the label; counted per serving";
  const [min, max] = product.servings;
  return `Label: ${min === max ? min : `${min}–${max}`} a day`;
}

function summary(lines: readonly StackLine[], chosen: readonly StackProduct[]) {
  if (!chosen.length) return "Pick a product to start.";
  const names = chosen.map((product) => product.name).join(" + ");
  const over = lines.filter((line) => line.over);
  if (!over.length) {
    const over51 = lines.filter(({ nutrient, total }) => nutrient.ul51 !== undefined && total > nutrient.ul51);
    return `${names}: from these products alone, every nutrient stays under its adult upper limit${
      over51.length ? `, though ${over51.map(({ nutrient }) => inSentence(nutrient.name)).join(" and ")} goes above the lower limit from age 51` : ""
    }.`;
  }
  const list = over
    .map(({ nutrient, total }) =>
      `${inSentence(nutrient.name)} ${formatStackAmount(total)} ${nutrient.unit} against ${formatStackAmount(nutrient.ul)} ${nutrient.unit}`,
    )
    .join("; ");
  const count = over.length === 1 ? "one nutrient goes" : `${over.length} nutrients go`;
  return `${names}: ${count} above the adult upper limit. ${list.charAt(0).toUpperCase()}${list.slice(1)}.`;
}

/**
 * Adds up the products a reader picks against adult upper limits. The
 * prerendered HTML shows the default stack's real totals, so readers without
 * JavaScript and crawlers get a worked example; the shelf itself opts out of
 * the Markdown twin. Any stack is linkable through `?stack=`, while the page's
 * canonical URL stays `/usana`.
 */
export function StackBuilder({ products, nutrients, includes, defaultStack, citations }: StackBuilderProps) {
  const [servings, setServings] = useState<Servings>(() =>
    Object.fromEntries(
      defaultStack.map((key) => [key, labelServings(products.find((product) => product.key === key)!)]),
    ),
  );
  const fromUrlRead = useRef(false);

  useEffect(() => {
    const fromUrl = parseStack(new URLSearchParams(window.location.search).get("stack"), products);
    const frame = window.requestAnimationFrame(() => {
      if (fromUrl) setServings(fromUrl);
      fromUrlRead.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [products]);

  useEffect(() => {
    if (!fromUrlRead.current) return;
    const url = new URL(window.location.href);
    const value = products
      .filter((product) => servings[product.key])
      .map((product) => `${product.slug}*${servings[product.key]}`)
      .join(".");
    if (value) url.searchParams.set("stack", value);
    else url.searchParams.delete("stack");
    window.history.replaceState(window.history.state, "", url);
  }, [servings, products]);

  const chosen = products.filter((product) => servings[product.key]);
  const lines = useMemo(() => stackTotals(products, nutrients, servings), [products, nutrients, servings]);
  const colorOf = (key: ProductKey) =>
    COLORS[products.findIndex((product) => product.key === key) % COLORS.length];
  const nameOf = (key: ProductKey) => products.find((product) => product.key === key)!.name;

  const notes = [
    ...chosen.flatMap((product) => {
      const repeated = Object.entries(includes[product.key] ?? {}).flatMap(([key, what]) =>
        servings[key as ProductKey] ? [what] : [],
      );
      return repeated.length
        ? [`${product.name} already repeats ${repeated.join(" and ")}, so taking them together counts that twice.`]
        : [];
    }),
    ...chosen
      .filter((product) => !product.servings)
      .map((product) => `${product.name}'s label gives no number of servings a day, so it is counted per serving.`),
  ];

  function toggle(product: StackProduct) {
    setServings((current) => {
      const next = { ...current };
      if (next[product.key]) delete next[product.key];
      else next[product.key] = labelServings(product);
      return next;
    });
  }

  function setCount(product: StackProduct, count: number) {
    setServings((current) => ({ ...current, [product.key]: Math.min(Math.max(count, 1), MAX_SERVINGS) }));
  }

  const drawn = lines.filter((line) => line.total / line.nutrient.ul >= METER_FLOOR);
  const rest = lines.filter((line) => line.total / line.nutrient.ul < METER_FLOOR);

  return (
    <div className="stack-builder">
      <ul className="stack-shelf" aria-label="Products" data-agent="skip">
        {products.map((product) => {
          const count = servings[product.key];
          return (
            <li
              key={product.key}
              className={count ? "is-on" : undefined}
              style={{ "--swatch": colorOf(product.key) } as CSSProperties}
            >
              <button type="button" aria-pressed={Boolean(count)} onClick={() => toggle(product)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image.src}
                  srcSet={product.image.srcSet}
                  sizes="64px"
                  alt=""
                  width={product.image.width}
                  height={product.image.height}
                  loading="lazy"
                  decoding="async"
                />
                <span>{product.name}</span>
              </button>
              <small>{directions(product)}</small>
              {count ? (
                <span className="stack-stepper" role="group" aria-label={`Servings of ${product.name} a day`}>
                  <button type="button" onClick={() => setCount(product, count - 1)} disabled={count <= 1} aria-label="One fewer serving">
                    −
                  </button>
                  <output>{count} a day</output>
                  <button type="button" onClick={() => setCount(product, count + 1)} disabled={count >= MAX_SERVINGS} aria-label="One more serving">
                    +
                  </button>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="stack-panel">
        <p className="stack-summary" aria-live="polite">
          {summary(lines, chosen)}
        </p>
        {notes.length ? (
          <ul className="stack-notes">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
        <ul className="stack-meters">
          {drawn.map((line) => {
            const scale = Math.max(line.nutrient.ul * 1.25, line.total);
            const over51 = !line.over && line.nutrient.ul51 !== undefined && line.total > line.nutrient.ul51;
            const source = citations[line.nutrient.key];
            return (
              <li key={line.nutrient.key} className={line.over ? "is-over" : undefined}>
                <p className="stack-meter-head">
                  <strong>{line.nutrient.name}</strong>
                  <span>
                    {formatStackAmount(line.total)} {line.nutrient.unit}
                    <small>
                      {" "}of {formatStackAmount(line.nutrient.ul)} {line.nutrient.unit} UL
                      {line.nutrient.ul51 ? ` (${formatStackAmount(line.nutrient.ul51)} from age 51)` : ""}
                    </small>
                  </span>
                  {line.over ? <em>Above the UL</em> : over51 ? <em>Above the UL from age 51</em> : null}
                </p>
                <div className="stack-track" aria-hidden="true">
                  <div className="stack-fill">
                    {line.parts.map((part) => (
                      <span
                        key={part.key}
                        style={{ width: `${(part.amount / scale) * 100}%`, background: colorOf(part.key) }}
                      />
                    ))}
                  </div>
                  <i style={{ left: `${(line.nutrient.ul / scale) * 100}%` }} />
                </div>
                <small className="stack-meter-parts">
                  {line.parts
                    .map((part) => `${nameOf(part.key)} ${formatStackAmount(part.amount)} ${line.nutrient.unit}`)
                    .join(" · ")}
                  . UL counts: {line.nutrient.counts}.
                  {source ? (
                    <a className="citation" href={`#usana-source-${source}`} aria-label={`Source ${source}`}>
                      [{source}]
                    </a>
                  ) : null}
                </small>
              </li>
            );
          })}
        </ul>
        {rest.length ? (
          <div className="stack-meter-rest">
            <p id="stack-rest-title">Also in this stack, under half of their limits</p>
            <ul aria-labelledby="stack-rest-title">
              {rest.map((line) => (
                <li key={line.nutrient.key}>{line.nutrient.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
