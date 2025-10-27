import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByCategory, getCategories, getCategoryLabel } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

type CategoryPageProps = {
  params: { category: string };
};

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = params.category;
  const articles = getArticlesByCategory(category);

  if (!articles.length) {
    return {};
  }

  const readableCategory = getCategoryLabel(category);
  const pageTitle = `Góc nhìn ${readableCategory}`;
  const description = `Những phân tích ${readableCategory} mới nhất từ đội ngũ biên tập Tạp chí HōcAI.`;
  const canonical = absoluteUrl(`/${category}`);

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.language,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const articles = getArticlesByCategory(category);

  if (!articles.length) {
    notFound();
  }

  const readableCategory = getCategoryLabel(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: readableCategory,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/${article.category}/${article.slug}`),
      name: article.title,
    })),
  };

  return (
    <section className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-brand">Chủ đề</p>
        <h1 className="text-4xl font-semibold text-slate-900">{readableCategory}</h1>
        <p className="text-slate-600">
          Câu chuyện, khung phương pháp và thực tiễn tốt nhất dành cho các đội {readableCategory}.
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
