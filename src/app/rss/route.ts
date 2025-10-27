import { getAllArticles } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function GET() {
  const items = getAllArticles()
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((article) => {
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${absoluteUrl(`/${article.category}/${article.slug}`)}</link>
          <guid>${absoluteUrl(`/${article.category}/${article.slug}`)}</guid>
          <description><![CDATA[${article.excerpt}]]></description>
          <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        </item>
      `;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${siteConfig.name}</title>
        <link>${siteConfig.url}</link>
        <description>${siteConfig.description}</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=UTF-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
