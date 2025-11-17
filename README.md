# Thuốc Nam Thiên Tân – thuốc từ cây cỏ thiên nhiên

This repository hosts a modern [Next.js](https://nextjs.org/) application scaffolded with TypeScript, the App Router, and Tailwind CSS. Giao diện tiếng Việt xoay quanh thương hiệu **Thuốc Nam Thiên Tân** – bài thuốc truyền thống của dân tộc Chăm – với các chuyên mục Sỏi thận, Suy thận, Viêm cầu thận, Đau khớp cùng trang Liên hệ để kết nối lương y/bác sĩ.

## Prerequisites

- Node.js 18.17 or newer (Next.js 14 requirement)
- npm 9+

## Getting started

Install dependencies:

```bash
npm install
```

Run the local development server at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Available scripts

The project exposes the following npm scripts:

- `npm run dev` – start the Next.js development server.
- `npm run build` – create an optimized production build.
- `npm run start` – run the production server after building.
- `npm run lint` – execute Next.js ESLint configuration.
- `npm run test` – run Vitest in non-watch mode for unit tests.

## Testing & quality

Tailwind CSS powers the responsive layout. Components and routes use semantic HTML and embed schema.org JSON-LD data for SEO. The sitemap, RSS feed, and robots directives are generated via Next.js route handlers so that search engines receive up-to-date metadata for each article.

## Chuyên mục & Liên hệ

- Các chuyên mục **Sỏi thận**, **Suy thận**, **Viêm cầu thận** và **Đau khớp** lấy dữ liệu mô phỏng từ `src/lib/articles.ts`, hiển thị ở trang chủ, trang danh mục (`/[category]`) và trang bài viết (`/[category]/[slug]`).
- Trang **Liên hệ** (`/lien-he`) cung cấp JSON-LD `MedicalOrganization`, thẻ meta đầy đủ cùng biểu mẫu thu thập thông tin triệu chứng để đội ngũ bác sĩ phản hồi.

## Hiệu năng & cấu hình máy chủ chạy nhanh

- `next.config.mjs` bật `swcMinify`, `compress`, tắt `X-Powered-By`, và build ở chế độ `standalone` để có thể deploy gọn trên bất kỳ máy chủ Node.js 18+ nào.
- Tất cả route động (`/`, `/admin`, `/hosting`, `/[category]/[slug]`, sitemap, robots, RSS) khai báo `dynamic = "force-static"` hoặc `revalidate` để Next.js kết xuất trước và cache lại 10 phút/1 giờ tùy trường hợp.
- Các asset dưới `/_next/static` được phục vụ với `Cache-Control: public, max-age=31536000, immutable` giúp CDN/Reverse proxy luôn lấy từ cache. Những route HTML khác dùng `s-maxage=600, stale-while-revalidate` để giảm TTFB.
- `httpAgentOptions.keepAlive = true` giữ kết nối tới backend (nếu có) để hạn chế handshake TCP, trong khi `images.formats` ưu tiên AVIF/WebP cho băng thông thấp.

### Khởi động sản xuất mẫu

```bash
NODE_ENV=production NEXT_PUBLIC_SITE_URL="https://hocai.site" \
  npm run build && PORT=3000 HOST=0.0.0.0 node .next/standalone/server.js
```

Khi chạy trên hosting truyền thống, bạn nên đặt lệnh trên vào PM2 hoặc `systemd` để tiến trình tự khởi động lại khi máy reboot. Nếu dùng Nginx/Apache làm reverse proxy, hãy bật HTTP/2 + gzip/brotli và chuyển tiếp header `Cache-Control` do Next.js phát ra để tận dụng tối đa chiến lược cache đã cấu hình.

### Giao diện quản trị SEO chuẩn Google.com.vn

- Trang `/admin` cung cấp bảng điều khiển quản trị bằng tiếng Việt giúp đội nội dung đối chiếu checklist kỹ thuật, nội dung và entity theo hướng dẫn [Google Search Central](https://www.google.com.vn/search/howsearchworks).
- Metadata của trang này bao gồm canonical URL, Open Graph/Twitter tags và ba đoạn JSON-LD (`WebPage`, `BreadcrumbList`, `HowTo`) để đạt chuẩn Rich Results.
- Phần giao diện hiển thị KPI, checklist hành động và liên kết nhanh đến Search Console, PageSpeed Insights, Rich Results Test và Google Analytics nhằm đảm bảo "full SEO" khi triển khai sản phẩm.

> **Tài khoản quản trị cơ sở dữ liệu:** file `database/hocai_schema.sql` đã seed bảng `admin_users` với tài khoản `thientam` (vai trò `superadmin`). Mật khẩu được lưu dạng băm `SHA2` của chuỗi `phat2009`; khi xây dựng backend xác thực, hãy so khớp bằng `SHA2(?, 256)` để đăng nhập vào bảng điều khiển.

## Deployment

1. Install dependencies with `npm install`.
2. Run `npm run lint` and `npm run test` to ensure code quality.
3. Build the application with `npm run build`.
4. Deploy the generated `.next` output using your hosting provider (e.g., Vercel, Netlify, Render). For static export, configure an appropriate adapter or use Vercel for optimal support.

Environment variables can be added via `.env.local` for per-environment configuration if needed. Set `NEXT_PUBLIC_SITE_URL` to the fully qualified production domain (sử dụng `https://hocai.site` trong môi trường thật) để sitemap, RSS, robots và metadata xuất ra URL tuyệt đối chính xác.

### Thư mục cần tạo trên hosting

Khi triển khai lên VPS hoặc hosting truyền thống, bạn có thể chuẩn bị các thư mục sau để script CI/CD hoạt động ổn định:

| Đường dẫn | Công dụng | Lệnh gợi ý |
| --- | --- | --- |
| `/var/www/hocai` | Thư mục gốc chứa toàn bộ mã nguồn Next.js. | `mkdir -p /var/www/hocai` |
| `/var/www/hocai/.next` | Nơi lưu build production sau `npm run build`. | `mkdir -p /var/www/hocai/.next` |
| `/var/www/hocai/public` | Chứa tài nguyên tĩnh phục vụ trực tiếp. | `mkdir -p /var/www/hocai/public` |
| `/var/www/hocai/storage/logs` | Tách log vận hành để dễ theo dõi. | `mkdir -p /var/www/hocai/storage/logs` |

Bạn cũng có thể tham khảo trang `/hosting` trên ứng dụng để xem bảng tổng hợp này cùng JSON-LD hướng dẫn từng bước.

### Cơ sở dữ liệu MySQL cho DA PMA SignOn

Repository đã kèm sẵn file `database/hocai_schema.sql` mô tả đầy đủ cấu trúc schema và dữ liệu mẫu cho nền tảng MySQL trên máy chủ **DA PMA SignOn**. Các tham số mặc định:

- **Tên database:** `h51ecb951c_hocai`
- **User:** `h51ecb951c_hocai`
- **Password:** `phat2009`
- **Admin dashboard (database user):** `thientam` / `phat2009` (lưu băm SHA-256 trong bảng `admin_users`)

Cách triển khai nhanh:

1. Đăng nhập vào phpMyAdmin (PMA) trên môi trường DA và tạo database `h51ecb951c_hocai` nếu chưa tồn tại.
2. Import file `database/hocai_schema.sql` thông qua giao diện PMA _hoặc_ dùng CLI:

   ```bash
   mysql -h <may-chu> -u h51ecb951c_hocai -p'hat2009' < database/hocai_schema.sql
   ```

3. Sau khi import, bảng `categories`, `authors`, `articles`, `tags`, `article_tags`, `article_revisions` và `admin_users` sẽ sẵn sàng với dữ liệu mẫu (trong đó `admin_users` đã chứa tài khoản `thientam`).
4. Cập nhật biến môi trường backend (ví dụ `DATABASE_URL` hoặc `MYSQL_URI`) trỏ tới thông tin đăng nhập trên để ứng dụng sản xuất đọc dữ liệu thực.

> Nếu tài khoản của bạn không có quyền `CREATE USER`, hãy bỏ qua phần đầu file schema (dòng tạo user) hoặc nhờ quản trị cấp quyền trước khi chạy script.
