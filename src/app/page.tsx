import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 600;

export default function HomePage() {
  const articles = getAllArticles();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: siteConfig.name,
    description: siteConfig.description,
    about: "Trí tuệ nhân tạo và chiến lược sản phẩm",
    hasPart: articles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      url: absoluteUrl(`/${article.category}/${article.slug}`),
    })),
  };

  return (
    <section className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Chiến lược tinh gọn cho sản phẩm AI thấu hiểu con người
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Khám phá các nghiên cứu và ghi chú sản phẩm mới nhất của chúng tôi về việc xây dựng trải nghiệm AI
          thúc đẩy mức độ chấp nhận và hiệu quả kinh doanh có thể đo lường.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
