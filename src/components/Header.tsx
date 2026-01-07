import Link from "next/link";
import { getCategories, getCategoryLabel } from "@/lib/articles";

export function Header() {
  const categories = getCategories();

  return (
    <header className="bg-white shadow-sm">
      <div className="container flex flex-wrap items-center justify-between py-4">
        <div>
          <Link href="/" className="text-2xl font-semibold text-brand">
            Tạp chí HōcAI
          </Link>
          <p className="text-sm text-slate-500">
            Góc nhìn sâu sắc về cách xây dựng trải nghiệm AI lấy con người làm trung tâm
          </p>
        </div>
        <nav aria-label="Điều hướng chính" className="mt-4 flex gap-4 text-sm font-medium sm:mt-0">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/${category}`}
              className="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-brand"
            >
              {getCategoryLabel(category)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
