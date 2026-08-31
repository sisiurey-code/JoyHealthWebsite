import type { NutritionGuide } from "./publications";

export const SITE_URL = "https://joyhealth.cc";

type BreadcrumbItem = Readonly<{
  name: string;
  path: string;
}>;

function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function buildBreadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export function buildArticleJsonLd(
  guide: Pick<
    NutritionGuide,
    "path" | "title" | "description" | "datePublished"
  >,
) {
  const canonicalUrl = absoluteUrl(guide.path);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: canonicalUrl,
    headline: guide.title,
    description: guide.description,
    author: {
      "@type": "Organization",
      name: "Joy Health",
      url: `${SITE_URL}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "Joy Health",
      url: `${SITE_URL}/`,
    },
    datePublished: guide.datePublished,
    inLanguage: "en-US",
  };
}
