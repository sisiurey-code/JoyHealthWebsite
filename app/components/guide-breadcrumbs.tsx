import Link from "next/link";
import type { NutritionGuide } from "../lib/publications";

type GuideBreadcrumbsProps = Readonly<{
  guide: Pick<NutritionGuide, "topic">;
}>;

/**
 * Visible breadcrumb trail for a nutrition guide. The labels must match the
 * BreadcrumbList structured data built by `buildGuideBreadcrumbJsonLd`.
 */
export function GuideBreadcrumbs({ guide }: GuideBreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/nutrition">Nutrition</Link>
        </li>
        <li aria-current="page">{guide.topic}</li>
      </ol>
    </nav>
  );
}
