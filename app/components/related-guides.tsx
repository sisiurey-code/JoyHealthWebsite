import Link from "next/link";
import { getRelatedGuides, type NutritionGuide } from "../lib/publications";

type RelatedGuidesProps = Readonly<{
  guide: Pick<NutritionGuide, "key">;
}>;

/**
 * Contextual links to the guides that most directly continue this one. The
 * adjacency lives in `RELATED_GUIDE_KEYS` so every guide has real inbound
 * links from its editorial neighbours, not only from the index pages.
 */
export function RelatedGuides({ guide }: RelatedGuidesProps) {
  const related = getRelatedGuides(guide);

  return (
    <nav className="related-guides" aria-labelledby="related-guides-title">
      <div>
        <p className="eyebrow">Keep reading</p>
        <h2 id="related-guides-title">Related guides</h2>
      </div>
      <ul>
        {related.map((entry) => (
          <li key={entry.path}>
            <p className="guide-topic">{entry.topic}</p>
            <h3>
              <Link href={entry.path}>{entry.title}</Link>
            </h3>
            <p>{entry.summary}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
}
