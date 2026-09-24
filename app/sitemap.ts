import type { MetadataRoute } from "next";
import {
  formatEditorialDate,
  INDEXABLE_PUBLICATIONS,
} from "./lib/publications";
import { absoluteUrl } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const locations = new Set<string>();
  return INDEXABLE_PUBLICATIONS.map((publication) => {
    // Fail the build rather than publish a duplicate or noncanonical URL.
    if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(publication.path)) {
      throw new Error(`Noncanonical sitemap path: ${publication.path}`);
    }
    const url = absoluteUrl(publication.path);
    if (locations.has(url)) throw new Error(`Duplicate sitemap URL: ${url}`);
    locations.add(url);

    const lastModified =
      ("dateModified" in publication && publication.dateModified) ||
      ("datePublished" in publication && publication.datePublished) ||
      undefined;
    if (lastModified) {
      // Reuse strict calendar validation; builds never manufacture freshness.
      formatEditorialDate(lastModified);
      if (lastModified > new Date().toISOString().slice(0, 10)) {
        throw new Error(`Future sitemap date: ${url}`);
      }
    }
    return { url, ...(lastModified ? { lastModified } : {}) };
  });
}
