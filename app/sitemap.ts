import type { MetadataRoute } from "next";
import { INDEXABLE_PUBLICATIONS } from "./lib/publications";
import { absoluteUrl } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PUBLICATIONS.map((publication) => {
    const lastModified =
      ("dateModified" in publication && publication.dateModified) ||
      ("datePublished" in publication && publication.datePublished) ||
      undefined;

    return {
      url: absoluteUrl(publication.path),
      ...(lastModified ? { lastModified } : {}),
    };
  });
}
