import type { Metadata } from "next";
import { entitySameAs, entityThing, PAGE_TOPICS } from "./entities";
import type { NutritionGuide, Publication } from "./publications";
import { PRODUCT_LABELS, type ProductLabel } from "./supplement-labels";
import type { SupplementProduct } from "./supplements";
import { USANA_BRAND_NAME, USANA_PRODUCT_IMAGES } from "./usana";

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

export const FEED_PATH = "/feed.xml";

/**
 * Canonical plus machine-readable alternates: the page's Markdown twin (written
 * after the build by `scripts/build-agent-files.mjs`) and the site feed.
 */
function pageAlternates(path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(path),
    types: {
      "text/markdown": absoluteUrl(path === "/" ? "/index.md" : `${path}.md`),
      "application/rss+xml": absoluteUrl(FEED_PATH),
    },
  };
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

export const WEBSITE_ID = `${SITE_URL}/#website`;

type CitedSource = Readonly<{ title: string; url: string }>;

/** The page's visible "Sources" list as schema.org `citation` entries. */
function citations(sources: readonly CitedSource[]) {
  return sources.map(({ title, url }) => ({ "@type": "CreativeWork", name: title, url }));
}

/** `about` and `mentions` for a page, from its entry in `PAGE_TOPICS`. */
export function topicJsonLd(key: string) {
  const topics = PAGE_TOPICS[key];
  if (!topics) return {};
  return {
    ...(topics.about.length ? { about: topics.about.map(entityThing) } : {}),
    ...(topics.mentions?.length ? { mentions: topics.mentions.map(entityThing) } : {}),
  };
}

export function buildArticleJsonLd(
  guide: Pick<
    NutritionGuide,
    "key" | "path" | "title" | "description" | "datePublished" | "dateModified"
  >,
  /** Pass when the page's sources are data, so `citation` matches the visible list. */
  sources?: readonly CitedSource[],
) {
  const canonicalUrl = absoluteUrl(guide.path);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: canonicalUrl,
    isPartOf: { "@id": WEBSITE_ID },
    headline: guide.title,
    description: guide.description,
    articleSection: "Nutrition",
    author: organizationReference,
    publisher: organizationReference,
    datePublished: guide.datePublished,
    // Only emitted after a substantive review; never refreshed for cosmetic edits.
    ...(guide.dateModified ? { dateModified: guide.dateModified } : {}),
    inLanguage: "en-US",
    ...topicJsonLd(guide.key),
    ...(sources?.length ? { citation: citations(sources) } : {}),
  };
}

/**
 * A `/supplements/*` page as a WebPage about one DietarySupplement. The
 * supplement node carries only what the visible label shows: ingredients per
 * serving and the printed directions. No offers or ratings: the page states
 * neither prices nor review scores.
 */
export function buildSupplementJsonLd(
  product: Pick<SupplementProduct, "key" | "path" | "name" | "title" | "description" | "datePublished">,
  sources: readonly CitedSource[],
) {
  const canonicalUrl = absoluteUrl(product.path);
  const label: ProductLabel = PRODUCT_LABELS[product.key];
  const image = absoluteUrl(USANA_PRODUCT_IMAGES[product.key].product.src);
  // A Nutrition Facts panel's calories, fats, and sodium are not active
  // ingredients; from a food-format label keep only the tracked nutrients.
  const activeIngredient = label.panels.flatMap((panel) =>
    panel.rows
      .filter((row) => !row.heading && row.amount && (panel.kind === "Supplement Facts" || row.key))
      .map((row) => `${row.name} ${row.amount} ${row.unit} per ${panel.servingSize}${panel.name ? ` (${panel.name})` : ""}`),
  );
  const topics = PAGE_TOPICS[product.key] ?? { about: [] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: product.title,
        description: product.description,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en-US",
        author: organizationReference,
        publisher: organizationReference,
        datePublished: product.datePublished,
        primaryImageOfPage: { "@type": "ImageObject", url: image },
        about: { "@id": `${canonicalUrl}#supplement` },
        mentions: [...topics.about, ...(topics.mentions ?? [])].map(entityThing),
        citation: citations(sources),
      },
      {
        "@type": "DietarySupplement",
        "@id": `${canonicalUrl}#supplement`,
        name: product.name,
        description: product.description,
        image,
        brand: { "@type": "Brand", name: USANA_BRAND_NAME },
        manufacturer: { "@type": "Organization", name: USANA_BRAND_NAME, sameAs: entitySameAs("usana") },
        activeIngredient,
        ...(label.directions
          ? { recommendedIntake: { "@type": "RecommendedDoseSchedule", description: label.directions } }
          : {}),
        subjectOf: { "@id": `${canonicalUrl}#webpage` },
      },
    ],
  };
}

type ItemListEntry = Readonly<{
  name: string;
  path: string;
}>;

/** ItemList of internal pages for a visible index such as `/nutrition`. */
export function buildPageListJsonLd(name: string, items: readonly ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

type ProductEntry = Readonly<{
  name: string;
  description: string;
  imagePath: string;
  /** The product's own page on this site, when it has one. */
  path?: string;
}>;

/**
 * ItemList of Product entries for a visible product comparison. No offers or
 * ratings are emitted: the page states neither prices nor review scores.
 */
export function buildProductListJsonLd(
  name: string,
  brand: string,
  products: readonly ProductEntry[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: absoluteUrl(product.imagePath),
        ...(product.path ? { url: absoluteUrl(product.path) } : {}),
        brand: { "@type": "Brand", name: brand },
      },
    })),
  };
}

/** Metadata for non-article pages, derived from the sitemap's publication record. */
export function buildPageMetadata(page: Publication): Metadata {
  const title = page.title.endsWith(` | ${SITE_NAME}`)
    ? page.title
    : `${page.title} | ${SITE_NAME}`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: pageAlternates(page.path),
    openGraph: {
      type: "website",
      url: absoluteUrl(page.path),
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description: page.description,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: [absoluteUrl(SITE_OG_IMAGE.url)],
    },
  };
}

/**
 * Page metadata shared by every nutrition guide. Guides deliberately ship no
 * social image: the site-wide photo is decorative and says nothing about the
 * article, which the editorial rules treat as metadata padding.
 */
export function buildGuideMetadata(
  guide: Pick<NutritionGuide, "path" | "title" | "description" | "datePublished" | "dateModified">,
): Metadata {
  const { title, description } = guide;
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: pageAlternates(guide.path),
    openGraph: {
      type: "article",
      url: absoluteUrl(guide.path),
      locale: "en_US",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      publishedTime: guide.datePublished,
      ...(guide.dateModified ? { modifiedTime: guide.dateModified } : {}),
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

/**
 * Metadata for a `/supplements/*` page. Unlike the guides' decorative site
 * photo, the product photo depicts the page's subject, so it is the social
 * image.
 */
export function buildSupplementMetadata(
  product: Pick<SupplementProduct, "key" | "path" | "title" | "description" | "datePublished">,
): Metadata {
  const title = `${product.title} | ${SITE_NAME}`;
  const { description } = product;
  const image = USANA_PRODUCT_IMAGES[product.key].product;
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(product.path),
    openGraph: {
      type: "article",
      url: absoluteUrl(product.path),
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      publishedTime: product.datePublished,
      images: [{ url: absoluteUrl(image.src), width: image.width, height: image.height, alt: image.alt }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [absoluteUrl(image.src)],
    },
  };
}
