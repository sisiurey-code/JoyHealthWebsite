import Link from "next/link";
import type { ReactNode } from "react";
import { formatStackAmount, inSentence, type StackLine } from "../lib/stack-math";
import type { StackFinding } from "../lib/stack";

type StackFindingsProps = Readonly<{
  alone: readonly StackFinding[];
  combined: readonly StackFinding[];
  /** Renders the citation for an upper limit's source on the host page. */
  cite: (url: string) => ReactNode;
}>;

function Amounts({ lines, cite }: Readonly<{ lines: readonly StackLine[]; cite: StackFindingsProps["cite"] }>) {
  return lines.map(({ nutrient, total }, index) => (
    <span key={nutrient.key}>
      {index ? "; " : ""}
      {inSentence(nutrient.name)} comes to {formatStackAmount(total)} {nutrient.unit} a day, against a{" "}
      {formatStackAmount(nutrient.ul)} {nutrient.unit} limit ({inSentence(nutrient.counts)})
      {cite(nutrient.sourceUrl)}
    </span>
  ));
}

/**
 * The stack builder's fixed results, as sentences: each product that exceeds
 * an adult UL at its label directions, then each pair that adds something
 * neither product reaches alone.
 */
export function StackFindings({ alone, combined, cite }: StackFindingsProps) {
  return (
    <div className="stack-findings">
      <div>
        <h3 id="stack-alone">Above an upper limit on its own</h3>
        <ul>
          {alone.map(({ products: [product], lines }) => (
            <li key={product.key}>
              <strong>
                <Link href={product.path}>{product.name}</Link>
              </strong>
              , at its label directions:{" "}
              <Amounts lines={lines} cite={cite} />.
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 id="stack-combined">What combining adds</h3>
        <ul>
          {combined.map(({ products: [a, b], repeats, lines }) => (
            <li key={`${a.key}-${b.key}`}>
              <strong>
                <Link href={a.path}>{a.name}</Link> + <Link href={b.path}>{b.name}</Link>
              </strong>
              {repeats ? `: ${repeats.by.name} already repeats ${repeats.what}, so taking both counts that twice.` : ":"}
              {lines.length ? (
                <>
                  {" "}Together, <Amounts lines={lines} cite={cite} />.
                </>
              ) : null}
            </li>
          ))}
        </ul>
        <p>
          Every other pair goes above a limit only where one of its products
          already does on its own.
        </p>
      </div>
    </div>
  );
}
