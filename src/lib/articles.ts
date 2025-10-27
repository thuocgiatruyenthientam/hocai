export type Article = {
  category: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: {
    name: string;
    role?: string;
  };
  tags: string[];
};

const categoryLabels: Record<string, string> = {
  "ai-trends": "Xu hướng AI",
  engineering: "Kỹ thuật",
  product: "Sản phẩm",
};

const baseArticles: Article[] = [
  {
    category: "ai-trends",
    slug: "multimodal-models-in-production",
    title: "Đưa mô hình đa phương thức vào sản xuất",
    excerpt:
      "Hướng dẫn thực tiễn để đánh giá, triển khai và giám sát hệ thống AI đa phương thức trong các ứng dụng hướng tới khách hàng.",
    content:
      "<p>Các mô hình AI đa phương thức kết hợp văn bản, hình ảnh và âm thanh để mở ra những trải nghiệm mới. Bài viết này phân tích cách đánh giá nhà cung cấp, thiết lập quy trình thử nghiệm và tích hợp giám sát để ra mắt có trách nhiệm.</p>",
    publishedAt: "2024-04-02T08:00:00.000Z",
    author: {
      name: "Mira Valdez",
      role: "Trưởng bộ phận Nghiên cứu Ứng dụng",
    },
    tags: ["đa phương thức", "sản xuất", "giám sát"],
  },
  {
    category: "engineering",
    slug: "edge-inference-checklist",
    title: "Danh sách kiểm tra suy luận trên thiết bị biên cho kỹ sư",
    excerpt:
      "Những quyết định kiến trúc then chốt để cung cấp trải nghiệm suy luận AI nhanh và ổn định trên thiết bị biên.",
    content:
      "<p>Suy luận trên thiết bị biên cải thiện độ phản hồi và quyền riêng tư. Chúng tôi trình bày các giới hạn phần cứng, chiến lược nén mô hình và quy trình CI/CD để triển khai an toàn.</p>",
    publishedAt: "2024-03-18T10:30:00.000Z",
    author: {
      name: "Anders Chen",
      role: "Kỹ sư trưởng",
    },
    tags: ["thiết bị biên", "suy luận", "triển khai"],
  },
  {
    category: "product",
    slug: "designing-ai-feedback-loops",
    title: "Thiết kế vòng phản hồi cho sản phẩm AI",
    excerpt:
      "Cách các đội sản phẩm thu thập, phân loại và vận hành phản hồi người dùng để cải thiện trợ lý AI.",
    content:
      "<p>Vòng phản hồi là yếu tố cốt lõi của chất lượng sản phẩm AI. Tìm hiểu cách triển khai công cụ phản hồi, phân tích dữ liệu định tính và ưu tiên đầu tư lộ trình.</p>",
    publishedAt: "2024-02-22T15:15:00.000Z",
    author: {
      name: "Priya Raman",
      role: "Giám đốc Sản phẩm",
    },
    tags: ["phản hồi", "trải nghiệm người dùng", "lặp cải tiến"],
  }
];

export function getAllArticles(): Article[] {
  return baseArticles;
}

export function getCategories(): string[] {
  return Array.from(new Set(baseArticles.map((article) => article.category)));
}

export function getArticlesByCategory(category: string): Article[] {
  return baseArticles.filter((article) => article.category === category);
}

export function getArticle(category: string, slug: string): Article | undefined {
  return baseArticles.find(
    (article) => article.category === category && article.slug === slug
  );
}

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category.replace(/-/g, " ");
}
