import type { Metadata } from "next";
import { seoAuditModules, seoPrinciples, seoTools } from "@/lib/admin";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

const pageTitle = "Bảng điều khiển quản trị SEO";
const pageDescription =
  "Giao diện quản trị chuẩn Google.com.vn giúp đội Thuốc Nam Thiên Tân theo dõi kỹ thuật, nội dung và dữ liệu có cấu trúc trong một nơi.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: absoluteUrl("/admin"),
  },
  keywords: [
    "quản trị SEO",
    "Google Search Central",
    "google.com.vn",
    "Core Web Vitals",
    "schema.org",
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    url: absoluteUrl("/admin"),
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Trang chủ",
      item: siteConfig.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: pageTitle,
      item: absoluteUrl("/admin"),
    },
  ],
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  description: pageDescription,
  url: absoluteUrl("/admin"),
  inLanguage: siteConfig.language,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function AdminSeoPage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Quy trình quản trị SEO toàn diện",
    description:
      "Các bước đảm bảo trang Thuốc Nam Thiên Tân đạt chuẩn Google Search Central cho người dùng google.com.vn.",
    step: seoAuditModules.map((module, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: module.title,
      itemListElement: module.checklist.map((task) => ({
        "@type": "HowToDirection",
        text: task,
      })),
    })),
    tool: seoTools.map((tool) => ({
      "@type": "HowToTool",
      name: tool.name,
    })),
  };

  return (
    <section className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <header className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Chuẩn Google Search Central</p>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{pageTitle}</h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">{pageDescription}</p>
        <p className="mx-auto max-w-2xl text-sm text-slate-500">
          Quy trình bám sát <a className="text-brand underline" href="https://www.google.com.vn/search/howsearchworks">
            hướng dẫn tìm kiếm của Google
          </a>{" "}
          để đảm bảo nội dung tiếng Việt thân thiện với người dùng và máy tìm kiếm.
        </p>
      </header>

      <section aria-label="Các trụ cột kiểm toán SEO" className="grid gap-6 md:grid-cols-3">
        {seoAuditModules.map((module) => (
          <article
            key={module.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <header className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">{module.frequency}</p>
              <h2 className="text-xl font-semibold text-slate-900">{module.title}</h2>
            </header>
            <p className="text-sm text-slate-600">{module.description}</p>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Mục tiêu</h3>
              <p className="text-sm text-slate-600">{module.objective}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">KPI theo dõi</h3>
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
                {module.kpis.map((kpi) => (
                  <li key={kpi}>{kpi}</li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <h3 className="text-sm font-semibold text-slate-800">Checklist</h3>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-slate-600">
                {module.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <h2 className="text-lg font-semibold text-emerald-900">Nguyên tắc thiết kế giao diện quản trị</h2>
        <p className="mt-2">
          Những nguyên tắc này phản ánh mong đợi của Google dành cho website hỗ trợ tiếng Việt trên miền google.com.vn.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {seoPrinciples.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900">Bộ công cụ bắt buộc</h2>
          <p className="text-sm text-slate-600">Liên kết nhanh giúp đội vận hành theo dõi mọi tín hiệu SEO cốt lõi.</p>
        </header>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Công cụ
                </th>
                <th scope="col" className="px-4 py-3">
                  Công dụng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seoTools.map((tool) => (
                <tr key={tool.name}>
                  <td className="px-4 py-4 font-medium text-brand">
                    <a href={tool.url} className="underline" target="_blank" rel="noreferrer">
                      {tool.name}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{tool.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
