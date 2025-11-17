import type { Metadata } from "next";
import { hostingDirectories, hostingNotes } from "@/lib/hosting";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

const pageTitle = "Thư mục cần chuẩn bị trên hosting";
const pageDescription =
  "Danh sách thư mục và quyền cần thiết để triển khai Thuốc Nam Thiên Tân trên môi trường hosting hoặc VPS.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: absoluteUrl("/hosting"),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/hosting"),
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
};

export default function HostingDirectoriesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: pageTitle,
    description: pageDescription,
    supply: [
      {
        "@type": "HowToSupply",
        name: "Máy chủ hoặc hosting có hỗ trợ Node.js 18 trở lên",
      },
    ],
    step: hostingDirectories.map((directory) => ({
      "@type": "HowToStep",
      name: directory.path,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: directory.purpose,
        },
        {
          "@type": "HowToTip",
          text: `Chạy: ${directory.command}`,
        },
      ],
    })),
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{pageTitle}</h1>
        <p className="mx-auto max-w-2xl text-slate-600">{pageDescription}</p>
      </header>

      <p className="text-sm text-slate-500">{hostingNotes.intro}</p>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">
                Đường dẫn
              </th>
              <th scope="col" className="px-4 py-3">
                Mục đích
              </th>
              <th scope="col" className="px-4 py-3">
                Lệnh gợi ý
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {hostingDirectories.map((directory) => (
              <tr key={directory.path}>
                <td className="px-4 py-4 font-mono text-xs text-slate-700 sm:text-sm">
                  {directory.path}
                </td>
                <td className="px-4 py-4 text-slate-600">{directory.purpose}</td>
                <td className="px-4 py-4">
                  <code className="rounded bg-slate-900/90 px-2 py-1 font-mono text-xs text-slate-100">
                    {directory.command}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">{hostingNotes.outro}</p>

      <aside className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <h2 className="font-semibold">Gợi ý thêm</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Sử dụng trình quản lý tiến trình như <strong>PM2</strong> hoặc <strong>systemd</strong> để giữ máy chủ Next.js chạy ổn
            định.
          </li>
          <li>
            Cấp quyền ghi cho người dùng deploy với câu lệnh <code>chown -R</code> phù hợp, tránh sử dụng tài khoản root.
          </li>
          <li>
            Thiết lập script CI/CD chạy lần lượt <code>npm install</code>, <code>npm run build</code> và khởi động lại tiến
            trình.
          </li>
        </ul>
      </aside>
    </section>
  );
}
