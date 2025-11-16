# HōcAI Journal Web Stack

This repository hosts a modern [Next.js](https://nextjs.org/) application scaffolded with TypeScript, the App Router, and Tailwind CSS. It includes dynamic category and article routes, SEO metadata, RSS + sitemap feeds, and reusable components for publishing editorial content.

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

### Giao diện quản trị SEO chuẩn Google.com.vn

- Trang `/admin` cung cấp bảng điều khiển quản trị bằng tiếng Việt giúp đội nội dung đối chiếu checklist kỹ thuật, nội dung và entity theo hướng dẫn [Google Search Central](https://www.google.com.vn/search/howsearchworks).
- Metadata của trang này bao gồm canonical URL, Open Graph/Twitter tags và ba đoạn JSON-LD (`WebPage`, `BreadcrumbList`, `HowTo`) để đạt chuẩn Rich Results.
- Phần giao diện hiển thị KPI, checklist hành động và liên kết nhanh đến Search Console, PageSpeed Insights, Rich Results Test và Google Analytics nhằm đảm bảo "full SEO" khi triển khai sản phẩm.

## Deployment

1. Install dependencies with `npm install`.
2. Run `npm run lint` and `npm run test` to ensure code quality.
3. Build the application with `npm run build`.
4. Deploy the generated `.next` output using your hosting provider (e.g., Vercel, Netlify, Render). For static export, configure an appropriate adapter or use Vercel for optimal support.

Environment variables can be added via `.env.local` for per-environment configuration if needed. Set `NEXT_PUBLIC_SITE_URL` to the fully qualified production domain (for example, `https://magazine.hocai.vn`) so sitemap, RSS, robots, and metadata endpoints emit the correct absolute URLs.

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

Cách triển khai nhanh:

1. Đăng nhập vào phpMyAdmin (PMA) trên môi trường DA và tạo database `h51ecb951c_hocai` nếu chưa tồn tại.
2. Import file `database/hocai_schema.sql` thông qua giao diện PMA _hoặc_ dùng CLI:

   ```bash
   mysql -h <may-chu> -u h51ecb951c_hocai -p'hat2009' < database/hocai_schema.sql
   ```

3. Sau khi import, bảng `categories`, `authors`, `articles`, `tags`, `article_tags` và `article_revisions` sẽ sẵn sàng với dữ liệu mẫu để Next.js truy vấn.
4. Cập nhật biến môi trường backend (ví dụ `DATABASE_URL` hoặc `MYSQL_URI`) trỏ tới thông tin đăng nhập trên để ứng dụng sản xuất đọc dữ liệu thực.

> Nếu tài khoản của bạn không có quyền `CREATE USER`, hãy bỏ qua phần đầu file schema (dòng tạo user) hoặc nhờ quản trị cấp quyền trước khi chạy script.
