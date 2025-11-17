export const siteConfig = {
  name: "Thuốc Nam Thiên Tâm - thuốc từ cây cỏ thiên nhiên, bài thuốc truyền thống của dân tộc Chăm",
  description:
    "Kiến thức chuyên sâu về dược liệu dân tộc Chăm, kết hợp liệu trình y học hiện đại cho sỏi thận, suy thận, viêm cầu thận và đau khớp.",
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
