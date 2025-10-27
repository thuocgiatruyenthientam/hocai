export const siteConfig = {
  name: "Tạp chí HōcAI",
  description:
    "Bản tin chiến lược hàng tuần về cách xây dựng sản phẩm AI nhân văn từ đội ngũ HōcAI.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000",
  language: "vi-VN",
  social: {
    twitter: "@hocai",
  },
};

export function absoluteUrl(path: string): string {
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanedPath, siteConfig.url).toString();
}
