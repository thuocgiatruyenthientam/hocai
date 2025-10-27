import Link from "next/link";
import { Article, getCategoryLabel } from "@/lib/articles";

export type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const articleUrl = `/${article.category}/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Tạp chí HōcAI",
    },
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    description: article.excerpt,
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-brand">{getCategoryLabel(article.category)}</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          <Link href={articleUrl}>{article.title}</Link>
        </h2>
      </header>
      <p className="mt-3 text-slate-600">{article.excerpt}</p>
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <div>
          <span className="font-medium text-slate-700">{article.author.name}</span>
          {article.author.role ? ` · ${article.author.role}` : null}
        </div>
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </footer>
    </article>
  );
}
