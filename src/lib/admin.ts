export type SeoAuditModule = {
  id: string;
  title: string;
  description: string;
  objective: string;
  kpis: string[];
  checklist: string[];
  frequency: string;
};

export const seoAuditModules: SeoAuditModule[] = [
  {
    id: "technical-health",
    title: "Sức khỏe kỹ thuật",
    description:
      "Đảm bảo Googlebot có thể thu thập dữ liệu (crawl) và lập chỉ mục mọi phần tử quan trọng của nền tảng Thuốc Nam Thiên Tâm.",
    objective:
      "Kiểm soát Core Web Vitals, trạng thái máy chủ và sơ đồ trang theo chuẩn tài liệu Google Search Central.",
    kpis: [
      "CWV tốt trên 90% phiên người dùng",
      "Không có lỗi thu thập dữ liệu (crawl errors)",
      "Sitemap cập nhật trong 24h sau mỗi lần build",
    ],
    checklist: [
      "Chạy PageSpeed Insights và báo cáo Core Web Vitals hàng tuần.",
      "Kiểm tra Search Console > Page Indexing để phát hiện URL bị chặn.",
      "Tự động ping https://www.google.com.vn/ping?sitemap= khi sitemap thay đổi.",
    ],
    frequency: "Hàng tuần",
  },
  {
    id: "content-experience",
    title: "Trải nghiệm nội dung",
    description:
      "Theo dõi tín hiệu EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) cho từng bài viết và danh mục.",
    objective:
      "Đảm bảo mọi bài viết tuân thủ hướng dẫn chất lượng tìm kiếm của Google và hiển thị rõ người viết.",
    kpis: [
      "Tỷ lệ CTR tự nhiên (organic CTR) tăng ≥ 15%/quý",
      "Mỗi bài có schema Article + tác giả rõ ràng",
      "Không có nội dung trùng lặp giữa danh mục",
    ],
    checklist: [
      "Soát lại tiêu đề/meta theo từ khóa ưu tiên tại google.com.vn.",
      "Chèn schema Article + BreadcrumbList bằng JSON-LD.",
      "Đảm bảo đoạn mở đầu chứa từ khóa và giá trị rõ ràng cho người dùng Việt Nam.",
    ],
    frequency: "Hàng sprint",
  },
  {
    id: "entity-knowledge",
    title: "Nhận diện thương hiệu & thực thể",
    description:
      "Duy trì tính thống nhất của dữ liệu có cấu trúc để Google hiểu rõ tổ chức Thuốc Nam Thiên Tâm và các lương y/bác sĩ.",
    objective:
      "Cung cấp dữ liệu Organization, Person, WebSite đồng nhất giữa trang chủ, RSS và trang quản trị.",
    kpis: [
      "Logo hiển thị chuẩn trong kết quả tìm kiếm", 
      "Google Knowledge Panel cập nhật thông tin mới trong 30 ngày",
      "Không có lỗi Rich Results trong Search Console",
    ],
    checklist: [
      "Cập nhật JSON-LD Organization khi thay đổi thương hiệu.",
      "Giữ đồng nhất URL canonical tại NEXT_PUBLIC_SITE_URL.",
      "Chạy Rich Results Test sau mỗi thay đổi lớn.",
    ],
    frequency: "Hàng tháng",
  },
];

export type SeoTool = {
  name: string;
  purpose: string;
  url: string;
};

export const seoTools: SeoTool[] = [
  {
    name: "Google Search Console",
    purpose: "Giám sát chỉ mục, Core Web Vitals và lỗi trải nghiệm trên google.com.vn.",
    url: "https://search.google.com/search-console",
  },
  {
    name: "PageSpeed Insights",
    purpose: "Đo tốc độ tải và đưa ra khuyến nghị tối ưu hiệu năng.",
    url: "https://pagespeed.web.dev",
  },
  {
    name: "Rich Results Test",
    purpose: "Kiểm tra dữ liệu có cấu trúc Article/HowTo và snippet quản trị.",
    url: "https://search.google.com/test/rich-results",
  },
  {
    name: "Google Analytics 4",
    purpose: "Theo dõi lưu lượng và đo lường mục tiêu SEO liên quan đến nội dung quản trị.",
    url: "https://analytics.google.com",
  },
];

export const seoPrinciples: string[] = [
  "Tập trung vào ý định người dùng Việt Nam và khả năng truy cập trên thiết bị di động.",
  "Sử dụng dữ liệu có cấu trúc chuẩn schema.org để Google hiểu rõ các đối tượng chính.",
  "Tối ưu Core Web Vitals, tốc độ phản hồi máy chủ và ưu tiên nội dung hữu ích.",
  "Luôn cập nhật sitemap, RSS và robots.txt khi thay đổi cấu trúc nội dung.",
];
