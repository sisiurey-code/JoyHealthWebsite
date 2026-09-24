import type { LabelPanel } from "../lib/supplement-labels";

type SupplementFactsTableProps = Readonly<{
  panel: LabelPanel;
  productName: string;
}>;

/**
 * A label panel as an accessible table, so the amounts are readable text for
 * people, search engines, and assistants rather than pixels in a photo.
 */
export function SupplementFactsTable({ panel, productName }: SupplementFactsTableProps) {
  return (
    <div className="facts-table-wrap">
      <table className="facts-table">
        <caption>
          {panel.kind}
          {panel.name ? `: ${panel.name}` : ""}, {productName}
          <span className="visually-hidden">. </span>
          <span>
            Serving size {panel.servingSize} · {panel.servingsPerContainer} servings per container
          </span>
        </caption>
        <thead>
          <tr>
            <th scope="col">Ingredient</th>
            <th scope="col">Amount per serving</th>
            <th scope="col">% Daily Value</th>
          </tr>
        </thead>
        <tbody>
          {panel.calories ? (
            <tr>
              <th scope="row">Calories</th>
              <td>{panel.calories}</td>
              <td />
            </tr>
          ) : null}
          {panel.rows.map((row) =>
            row.heading ? (
              <tr className="is-heading" key={row.name}>
                <th scope="colgroup" colSpan={3}>
                  {row.name}
                </th>
              </tr>
            ) : (
              <tr
                className={row.indent ? `is-indented-${row.indent}` : undefined}
                key={`${row.name}-${row.amount}`}
              >
                <th scope="row">
                  {row.name}
                  {row.form ? <span className="facts-form"> ({row.form})</span> : null}
                </th>
                <td>
                  {row.amount} {row.unit}
                </td>
                <td>{row.dv ?? ""}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      {panel.footnotes.length ? (
        <p className="facts-table-notes">{panel.footnotes.join(" ")}</p>
      ) : null}
    </div>
  );
}
