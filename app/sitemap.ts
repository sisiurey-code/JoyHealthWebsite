import type { MetadataRoute } from "next";
import { INDEXABLE_PUBLICATIONS } from "./lib/publications";
import { SITE_URL } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PUBLICATIONS.map((publication) => {
    const lastModified =
      ("dateModified" in publication && publication.dateModified) ||
      ("datePublished" in publication && publication.datePublished) ||
      undefined;

    return {
      url:
        publication.path === "/"
          ? SITE_URL
          : new URL(publication.path, `${SITE_URL}/`).toString(),
      ...(lastModified ? { lastModified } : {}),
    };
  });
}
