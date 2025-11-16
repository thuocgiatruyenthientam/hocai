import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-10 text-slate-200">
      <div className="container flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Bảo lưu mọi quyền.</p>
        <nav aria-label="Điều hướng chân trang" className="flex gap-4">
          <a href="/admin" className="hover:underline">
            Quản trị SEO
          </a>
          <a href="/rss" className="hover:underline">
            Nguồn RSS
          </a>
          <a href="/sitemap.xml" className="hover:underline">
            Sơ đồ trang
          </a>
          <a href="/robots.txt" className="hover:underline">
            Robots.txt
          </a>
          <a href="/hosting" className="hover:underline">
            Hướng dẫn hosting
          </a>
        </nav>
      </div>
    </footer>
  );
}
