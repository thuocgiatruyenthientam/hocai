import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Liên hệ chuyên gia",
  description:
    "Kết nối với HōcAI Chăm Sóc Thận để đặt lịch tư vấn sỏi thận, suy thận, viêm cầu thận và đau khớp qua hotline, email hoặc phòng khám.",
  alternates: {
    canonical: absoluteUrl("/lien-he"),
  },
  openGraph: {
    title: "Liên hệ HōcAI Chăm Sóc Thận",
    description:
      "Đặt lịch tư vấn bệnh thận và xương khớp với đội ngũ bác sĩ hợp tác của HōcAI qua điện thoại, email hoặc phòng khám.",
    url: absoluteUrl("/lien-he"),
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary",
    title: "Liên hệ bác sĩ HōcAI",
    description:
      "Nhận tư vấn điều trị sỏi thận, suy thận, viêm cầu thận, đau khớp từ chuyên gia bằng cách gửi biểu mẫu hoặc gọi hotline.",
  },
};

const contactChannels = [
  {
    label: "Hotline cấp tốc",
    value: "1900 636 918",
    description: "Hỗ trợ đặt lịch trong 24h cho bệnh sỏi thận, suy thận và đau khớp nặng.",
  },
  {
    label: "Email chuyên khoa",
    value: "chamsoc@hocai.site",
    description: "Nhận tư vấn kế hoạch dinh dưỡng, xét nghiệm và kết quả tái khám qua email.",
  },
  {
    label: "Phòng khám HōcAI Care",
    value: "Tầng 8, 120 Trần Hưng Đạo, Quận 1, TP.HCM",
    description: "Tiếp nhận bệnh nhân vào 8h00–17h00 (thứ Hai – Bảy). Có dịch vụ lọc máu ban ngày.",
  },
];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: siteConfig.name,
  url: absoluteUrl("/lien-he"),
  medicalSpecialty: ["Nephrology", "Rheumatology"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+84-1900-636-918",
      areaServed: "VN",
      availableLanguage: "Vietnamese",
    },
    {
      "@type": "ContactPoint",
      contactType: "email",
      email: "chamsoc@hocai.site",
      areaServed: "VN",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "120 Trần Hưng Đạo",
    addressLocality: "Quận 1",
    addressRegion: "TP.HCM",
    postalCode: "700000",
    addressCountry: "VN",
  },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brand">Liên hệ</p>
        <h1 className="text-4xl font-semibold text-slate-900">Kết nối với bác sĩ HōcAI</h1>
        <p className="text-slate-600">
          Vui lòng chọn kênh phù hợp để đặt lịch tư vấn về sỏi thận, suy thận, viêm cầu thận hoặc đau khớp. Đội ngũ hỗ trợ sẽ phản
          hồi trong vòng 2 giờ làm việc.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {contactChannels.map((channel) => (
          <article key={channel.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-brand">{channel.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{channel.value}</p>
            <p className="mt-3 text-sm text-slate-600">{channel.description}</p>
          </article>
        ))}
      </div>
      <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Gửi yêu cầu tư vấn">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="name">
            Họ tên
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ví dụ: Nguyễn An"
            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="09xx xxx xxx"
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="topic">
              Chuyên mục quan tâm
            </label>
            <select
              id="topic"
              name="topic"
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="soi-than">Sỏi thận</option>
              <option value="suy-than">Suy thận</option>
              <option value="viem-cau-than">Viêm cầu thận</option>
              <option value="dau-khop">Đau khớp</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="message">
            Triệu chứng chính
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Mô tả thời gian mắc bệnh, thuốc đang dùng và xét nghiệm gần nhất..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Gửi yêu cầu tư vấn
        </button>
        <p className="text-center text-xs text-slate-500">
          Bằng việc gửi biểu mẫu, bạn đồng ý để HōcAI liên hệ qua điện thoại/email trong giờ hành chính.
        </p>
      </form>
    </section>
  );
}
