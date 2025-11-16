import Link from "next/link";
import { getCategories, getCategoryLabel } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export function Header() {
  const categories = getCategories().sort((a, b) =>
    getCategoryLabel(a).localeCompare(getCategoryLabel(b), "vi")
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex flex-wrap items-center justify-between py-4">
        <div>
          <Link href="/" className="text-2xl font-semibold text-brand">
            {siteConfig.name}
          </Link>
          <p className="text-sm text-slate-500">
            {siteConfig.description}
          </p>
        </div>
        <nav aria-label="Điều hướng chính" className="mt-4 flex flex-wrap gap-3 text-sm font-medium sm:mt-0">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/${category}`}
              className="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-brand"
            >
              {getCategoryLabel(category)}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-md border border-brand px-3 py-2 text-brand transition hover:bg-brand hover:text-white"
          >
            Quản trị SEO
          </Link>
        </nav>
      </div>
    </header>
  );
}
