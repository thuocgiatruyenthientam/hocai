import type { MetadataRoute } from "next";
import { getAllArticles, getCategories } from "@/lib/articles";

const baseUrl = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryEntries = getCategories().map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleEntries = getAllArticles().map((article) => ({
    url: `${baseUrl}/${article.category}/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
