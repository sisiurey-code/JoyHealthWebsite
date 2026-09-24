import { buildLabelCsv } from "../../lib/label-dataset";

export const dynamic = "force-static";

/** Every printed label row as CSV; described at `/usana#label-data`. */
export function GET() {
  return new Response(buildLabelCsv(), {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
