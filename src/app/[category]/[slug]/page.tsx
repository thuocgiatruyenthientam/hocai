import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle, getCategoryLabel } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 600;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

type ArticlePageProps = {
  params: {
    category: string;
    slug: string;
  };
};

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getArticle(params.category, params.slug);

  if (!article) {
    return {};
  }

  const canonical = absoluteUrl(`/${params.category}/${params.slug}`);

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      tags: article.tags,
      url: canonical,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticle(params.category, params.slug);

  if (!article) {
    notFound();
  }

  const articleData = article!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleData.title,
    datePublished: articleData.publishedAt,
    author: {
      "@type": "Person",
      name: articleData.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    description: articleData.excerpt,
    articleSection: getCategoryLabel(params.category),
    keywords: articleData.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/${params.category}/${params.slug}`),
    },
  };

  return (
    <article className="prose prose-slate mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="not-prose mb-6 space-y-2">
        <p className="text-xs uppercase tracking-widest text-brand">
          {getCategoryLabel(params.category)}
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">{articleData.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>
            Tác giả <span className="font-medium text-slate-700">{articleData.author.name}</span>
            {articleData.author.role ? ` · ${articleData.author.role}` : null}
          </span>
          <time dateTime={articleData.publishedAt}>
            {new Date(articleData.publishedAt).toLocaleDateString("vi-VN", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </header>
      <section dangerouslySetInnerHTML={{ __html: articleData.content }} />
    </article>
  );
}
