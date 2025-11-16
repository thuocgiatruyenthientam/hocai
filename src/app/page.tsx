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
    about: "Sức khỏe thận và xương khớp",
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
          Trung tâm kiến thức về sỏi thận, suy thận và đau khớp
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          HōcAI tuyển chọn bài viết từ bác sĩ chuyên khoa để giúp bạn hiểu bệnh, xây dựng chế độ ăn uống – luyện tập an toàn và
          chuẩn bị cho từng lần tái khám tại các chuyên mục Sỏi thận, Suy thận, Viêm cầu thận và Đau khớp.
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
