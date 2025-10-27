import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 text-center py-24">
      <h1 className="text-4xl font-semibold text-slate-900">Không tìm thấy trang</h1>
      <p className="text-slate-600">
        Chúng tôi không thể tìm thấy trang bạn yêu cầu. Hãy khám phá những phân tích mới nhất của {siteConfig.name} thay thế.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
      >
        Quay lại trang chủ
      </Link>
    </section>
  );
}
