import { buildLabelDataset } from "../../lib/label-dataset";

export const dynamic = "force-static";

/** The label transcriptions and daily amounts as JSON; described at `/usana#label-data`. */
export function GET() {
  return new Response(`${JSON.stringify(buildLabelDataset(), null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
