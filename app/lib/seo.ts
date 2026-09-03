import type { Metadata } from "next";
import type { NutritionGuide } from "./publications";

export const SITE_URL = "https://joyhealth.cc";
export const SITE_NAME = "Joy Health";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Shared social preview image for pages that do not have their own. */
export const SITE_OG_IMAGE = {
  url: "/og.jpg",
  width: 1731,
  height: 909,
  alt: "Joy Health, healthy living made clearer",
} as const;

type BreadcrumbItem = Readonly<{
  name: string;
  path: string;
}>;

export function absoluteUrl(path: string) {
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

/** Breadcrumb data for a guide. Must match the visible `GuideBreadcrumbs`. */
export function buildGuideBreadcrumbJsonLd(
  guide: Pick<NutritionGuide, "path" | "topic">,
) {
  return buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Nutrition", path: "/nutrition" },
    { name: guide.topic, path: guide.path },
  ]);
}

const organizationReference = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
} as const;

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
    author: organizationReference,
    publisher: organizationReference,
    datePublished: guide.datePublished,
    inLanguage: "en-US",
  };
}

/**
 * Page metadata shared by every nutrition guide. Guides deliberately ship no
 * social image: the site-wide photo is decorative and says nothing about the
 * article, which the editorial rules treat as metadata padding.
 */
export function buildGuideMetadata(
  guide: Pick<NutritionGuide, "path" | "title" | "description" | "datePublished">,
): Metadata {
  const { title, description } = guide;
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: guide.path },
    openGraph: {
      type: "article",
      url: guide.path,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      publishedTime: guide.datePublished,
      images: [],
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      images: [],
    },
  };
}
