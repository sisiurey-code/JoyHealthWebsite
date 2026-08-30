import type { MetadataRoute } from "next";

const siteUrl = "https://joyhealth.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
    },
    {
      url: `${siteUrl}/standards`,
    },
    {
      url: `${siteUrl}/usana`,
      lastModified: "2026-08-29",
    },
    {
      url: `${siteUrl}/nutrition`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/reading-food-labels`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/building-balanced-meals`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/protein-and-fiber`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/carbohydrates-and-fats`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/hydration`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/supplement-evidence-and-safety`,
      lastModified: "2026-08-28",
    },
    {
      url: `${siteUrl}/nutrition/electrolyte-drinks`,
      lastModified: "2026-08-29",
    },
  ];
}
