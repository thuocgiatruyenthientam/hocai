import { getAllArticles } from "@/lib/articles";

const baseUrl = "https://example.com";

export function GET() {
  const items = getAllArticles()
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((article) => {
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${baseUrl}/${article.category}/${article.slug}</link>
          <guid>${baseUrl}/${article.category}/${article.slug}</guid>
          <description><![CDATA[${article.excerpt}]]></description>
          <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
        </item>
      `;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Tạp chí HōcAI</title>
        <link>${baseUrl}</link>
        <description>Bản tin chiến lược hàng tuần về cách xây dựng sản phẩm AI nhân văn từ đội ngũ HōcAI.</description>
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
