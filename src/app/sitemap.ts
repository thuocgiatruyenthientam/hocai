import type { MetadataRoute } from "next";
import { getAllArticles, getCategories } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryEntries = getCategories().map((category) => ({
    url: absoluteUrl(`/${category}`),
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleEntries = getAllArticles().map((article) => ({
    url: absoluteUrl(`/${article.category}/${article.slug}`),
    lastModified: article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/hosting"),
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
