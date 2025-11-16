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
  "soi-than": "Sỏi thận",
  "suy-than": "Suy thận",
  "viem-cau-than": "Viêm cầu thận",
  "dau-khop": "Đau khớp",
};

const baseArticles: Article[] = [
  {
    category: "soi-than",
    slug: "che-do-an-giam-soi-calci",
    title: "Chế độ ăn giúp giảm nguy cơ tái phát sỏi calci",
    excerpt:
      "Bác sĩ dinh dưỡng hướng dẫn cách cân bằng canxi, oxalat và nước uống để người bệnh sỏi thận tránh tái phát.",
    content:
      "<p>Đa số sỏi thận tại Việt Nam là sỏi calci oxalat. Thay vì kiêng hoàn toàn canxi, người bệnh cần bổ sung từ thực phẩm tự nhiên, hạn chế thức ăn chế biến sẵn và tăng cường rau quả ít oxalat. Uống đủ 2–2,5 lít nước/ngày giúp pha loãng nước tiểu, đồng thời chia nhỏ lượng đạm động vật để giảm axit uric.</p><p>Các chuyên gia khuyến nghị kết hợp vận động nhẹ, kiểm soát cân nặng và tái khám đo siêu âm, xét nghiệm nước tiểu 24h để điều chỉnh kế hoạch dinh dưỡng.</p>",
    publishedAt: "2024-05-12T08:00:00.000Z",
    author: {
      name: "BSCKI. Nguyễn Lệ Hằng",
      role: "Chuyên gia Dinh dưỡng Thận",
    },
    tags: ["sỏi thận", "dinh dưỡng", "oxalat"],
  },
  {
    category: "suy-than",
    slug: "quan-ly-huyet-ap-cho-benh-nhan-ckd",
    title: "Quản lý huyết áp cho bệnh nhân suy thận mạn",
    excerpt:
      "Bộ nguyên tắc kết hợp thuốc, ăn nhạt và theo dõi huyết áp tại nhà giúp làm chậm tiến triển bệnh thận mạn.",
    content:
      "<p>Huyết áp mục tiêu cho người suy thận mạn thường dưới 130/80 mmHg. Ngoài thuốc ức chế men chuyển hoặc chẹn thụ thể, bác sĩ nhấn mạnh việc giảm muối còn 5g/ngày, hạn chế rượu bia và luyện tập đều đặn. Bệnh nhân nên ghi nhật ký đo huyết áp sáng – tối, trình bác sĩ trong mỗi lần tái khám để điều chỉnh liều.</p><p>Khi kết hợp với xét nghiệm eGFR 3–6 tháng/lần, kế hoạch này chứng minh khả năng giảm biến chứng tim mạch và trì hoãn chạy thận.</p>",
    publishedAt: "2024-04-28T10:00:00.000Z",
    author: {
      name: "TS.BS. Lê Tấn Huy",
      role: "Chuyên khoa Thận – Tiết niệu",
    },
    tags: ["suy thận", "huyết áp", "CKD"],
  },
  {
    category: "viem-cau-than",
    slug: "nhan-dien-som-viem-cau-than",
    title: "Nhận diện sớm viêm cầu thận sau nhiễm khuẩn",
    excerpt:
      "Các dấu hiệu cảnh báo sau viêm họng, nhiễm da và xét nghiệm cần làm để tránh biến chứng suy thận cấp.",
    content:
      "<p>Viêm cầu thận hậu nhiễm thường xảy ra 1–3 tuần sau khi nhiễm liên cầu. Người bệnh đột ngột phù mặt, tiểu ít, nước tiểu sẫm màu và tăng huyết áp. Bác sĩ chỉ định xét nghiệm ASO, bổ thể C3 và sinh hóa máu để đánh giá mức độ tổn thương.</p><p>Điều trị tập trung vào nghỉ ngơi, kiểm soát huyết áp, lợi tiểu và sử dụng kháng sinh nếu còn ổ nhiễm khuẩn. Tái khám đúng hẹn giúp phát hiện chuyển mạn tính.</p>",
    publishedAt: "2024-04-10T09:30:00.000Z",
    author: {
      name: "BS. Vũ Minh Tâm",
      role: "Khoa Nội Thận",
    },
    tags: ["viêm cầu thận", "phù", "biến chứng"],
  },
  {
    category: "dau-khop",
    slug: "chan-doan-dau-khop-goi-nguoi-trung-nien",
    title: "Chẩn đoán đau khớp gối ở người trung niên",
    excerpt:
      "Lộ trình thăm khám lâm sàng, cận lâm sàng và tiêu chí phân biệt viêm khớp dạng thấp với thoái hóa khớp.",
    content:
      "<p>Đối tượng trên 40 tuổi thường gặp đau khớp gối do thoái hóa, béo phì hoặc viêm khớp dạng thấp. Bác sĩ đánh giá dáng đi, biên độ gập duỗi, dấu hiệu chèn ép dây chằng rồi chỉ định X-quang, MRI hoặc xét nghiệm RF, anti-CCP khi nghi ngờ tự miễn.</p><p>Kế hoạch điều trị kết hợp giảm cân, vật lý trị liệu và thuốc chống viêm không steroid ngắn hạn. Khi đau kéo dài, tiêm acid hyaluronic hoặc PRP có thể được cân nhắc.</p>",
    publishedAt: "2024-03-30T07:45:00.000Z",
    author: {
      name: "ThS.BS. Đặng Thùy Ninh",
      role: "Chuyên gia Cơ xương khớp",
    },
    tags: ["đau khớp", "khớp gối", "thoái hóa"],
  },
  {
    category: "soi-than",
    slug: "quy-trinh-tam-soat-soi-tai-kham",
    title: "Quy trình tầm soát sỏi thận trong mỗi lần tái khám",
    excerpt:
      "Checklist siêu âm, xét nghiệm nước tiểu và đánh giá triệu chứng giúp bác sĩ phát hiện sớm sỏi tái phát.",
    content:
      "<p>Khi bệnh nhân từng tán sỏi hoặc phẫu thuật, tái khám định kỳ là bắt buộc. Quy trình gồm siêu âm bụng để đo kích thước sỏi, chụp CT liều thấp khi cần độ chính xác cao và xét nghiệm nước tiểu 24h để theo dõi citrate, oxalat, canxi.</p><p>Song song, bác sĩ đánh giá mức độ đau, nhiễm trùng tiết niệu và tuân thủ uống nước. Nếu sỏi nhỏ hơn 5mm, tiếp tục điều chỉnh lối sống; sỏi lớn hơn 10mm có thể cân nhắc tán sỏi ngoài cơ thể hoặc nội soi ngược dòng.</p>",
    publishedAt: "2024-03-12T11:20:00.000Z",
    author: {
      name: "BSCKII. Trần Ngọc Ý",
      role: "Phó trưởng khoa Ngoại Thận",
    },
    tags: ["sỏi thận", "tái khám", "siêu âm"],
  },
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
