export type HostingDirectory = {
  /** Đường dẫn tuyệt đối đề xuất trên máy chủ. */
  path: string;
  /** Mục đích chính của thư mục. */
  purpose: string;
  /** Gợi ý lệnh tạo thư mục. */
  command: string;
};

export const hostingDirectories: HostingDirectory[] = [
  {
    path: "/var/www/hocai",
    purpose:
      "Thư mục gốc chứa toàn bộ mã nguồn Next.js, bao gồm package.json, tsconfig và thư mục src.",
    command: "mkdir -p /var/www/hocai",
  },
  {
    path: "/var/www/hocai/.next",
    purpose:
      "Nơi Next.js sinh ra build production sau khi chạy `npm run build`. Cần quyền ghi để deploy script cập nhật.",
    command: "mkdir -p /var/www/hocai/.next",
  },
  {
    path: "/var/www/hocai/public",
    purpose:
      "Lưu trữ tài nguyên tĩnh (ảnh, favicon, robots.txt tuỳ chỉnh) được phục vụ trực tiếp bởi máy chủ.",
    command: "mkdir -p /var/www/hocai/public",
  },
  {
    path: "/var/www/hocai/storage/logs",
    purpose:
      "Tách riêng log của trình chạy (PM2, systemd) để dễ dàng backup và theo dõi trong quá trình vận hành.",
    command: "mkdir -p /var/www/hocai/storage/logs",
  },
];

export const hostingNotes = {
  intro:
    "Các thư mục dưới đây giúp bạn chuẩn hoá cấu trúc khi triển khai HōcAI Journal lên hosting/VPS truyền thống.",
  outro:
    "Tuỳ nền tảng (Vercel, Netlify, Render, VPS tự quản), bạn có thể thay đổi đường dẫn gốc nhưng vẫn nên giữ cấu trúc con tương tự để script CI/CD hoạt động nhất quán.",
};
