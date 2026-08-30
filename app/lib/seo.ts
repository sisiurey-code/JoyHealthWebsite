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
