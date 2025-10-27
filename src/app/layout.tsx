import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tạp chí HōcAI",
    template: "%s | Tạp chí HōcAI",
  },
  description:
    "Bản tin chiến lược hàng tuần về cách xây dựng sản phẩm AI nhân văn từ đội ngũ HōcAI.",
  keywords: ["AI", "chiến lược sản phẩm", "nghiên cứu", "HōcAI"],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Tạp chí HōcAI",
    description:
      "Bản tin chiến lược hàng tuần về cách xây dựng sản phẩm AI nhân văn từ đội ngũ HōcAI.",
    siteName: "Tạp chí HōcAI",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hocai",
    creator: "@hocai",
    title: "Tạp chí HōcAI",
    description:
      "Bản tin chiến lược hàng tuần về cách xây dựng sản phẩm AI nhân văn từ đội ngũ HōcAI.",
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/rss`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="container py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
