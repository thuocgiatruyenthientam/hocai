export const siteConfig = {
  name: "HōcAI Chăm Sóc Thận",
  description:
    "Cẩm nang chuyên sâu về bệnh thận và xương khớp bằng tiếng Việt, cập nhật khuyến nghị điều trị và phòng ngừa chuẩn y khoa.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://hocai.site",
  language: "vi-VN",
  social: {
    twitter: "@hocai",
  },
};

export function absoluteUrl(path: string): string {
  const cleanedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanedPath, siteConfig.url).toString();
}
