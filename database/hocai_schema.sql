-- HōcAI Journal MySQL schema
-- Môi trường: DA PMA SignOn
-- Database: h51ecb951c_hocai
-- Người dùng: h51ecb951c_hocai / phat2009

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `h51ecb951c_hocai`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `h51ecb951c_hocai`;

-- Bảo đảm người dùng tồn tại (chạy bằng tài khoản có quyền CREATE USER)
CREATE USER IF NOT EXISTS 'h51ecb951c_hocai'@'%'
  IDENTIFIED BY 'phat2009';
GRANT ALL PRIVILEGES ON `h51ecb951c_hocai`.* TO 'h51ecb951c_hocai'@'%';
FLUSH PRIVILEGES;

-- Bảng danh mục bài viết
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng tác giả
CREATE TABLE IF NOT EXISTS authors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(160) NULL,
  bio TEXT NULL,
  avatar_url VARCHAR(255) NULL,
  social_url VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_author_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng tag chuẩn hóa
CREATE TABLE IF NOT EXISTS tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  label VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng bài viết chính
CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  author_id INT UNSIGNED NOT NULL,
  slug VARCHAR(160) NOT NULL,
  title VARCHAR(200) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  published_at DATETIME NOT NULL,
  hero_image VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_articles_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
  UNIQUE KEY unique_article_slug (slug),
  INDEX idx_articles_published (published_at DESC),
  FULLTEXT KEY ft_articles_content (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng mapping tag - bài viết
CREATE TABLE IF NOT EXISTS article_tags (
  article_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  CONSTRAINT fk_article_tags_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  CONSTRAINT fk_article_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng theo dõi phiên bản bài viết
CREATE TABLE IF NOT EXISTS article_revisions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  article_id INT UNSIGNED NOT NULL,
  version SMALLINT UNSIGNED NOT NULL,
  diff_summary TEXT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_article_revisions_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_article_version (article_id, version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed dữ liệu danh mục
INSERT INTO categories (slug, name, description) VALUES
  ('ai-trends', 'Xu hướng AI', 'Phân tích thị trường và công nghệ AI mới nhất.'),
  ('engineering', 'Kỹ thuật', 'Thực tiễn kỹ thuật và triển khai hệ thống AI.'),
  ('product', 'Sản phẩm', 'Quy trình xây dựng và tối ưu sản phẩm AI.');

-- Seed dữ liệu tác giả
INSERT INTO authors (name, role, bio, social_url) VALUES
  ('Mira Valdez', 'Trưởng bộ phận Nghiên cứu Ứng dụng', 'Lãnh đạo nhóm nghiên cứu AI ứng dụng với kinh nghiệm triển khai mô hình đa phương thức.', 'https://example.com/mira'),
  ('Anders Chen', 'Kỹ sư trưởng', 'Tập trung vào kiến trúc hạ tầng và tối ưu hóa suy luận thiết bị biên.', 'https://example.com/anders'),
  ('Priya Raman', 'Giám đốc Sản phẩm', 'Định hướng chiến lược sản phẩm cho các nền tảng trợ lý AI.', 'https://example.com/priya');

-- Seed dữ liệu tag
INSERT INTO tags (slug, label) VALUES
  ('da-phuong-thuc', 'đa phương thức'),
  ('san-xuat', 'sản xuất'),
  ('giam-sat', 'giám sát'),
  ('thiet-bi-bien', 'thiết bị biên'),
  ('suy-luan', 'suy luận'),
  ('trien-khai', 'triển khai'),
  ('phan-hoi', 'phản hồi'),
  ('trai-nghiem-nguoi-dung', 'trải nghiệm người dùng'),
  ('lap-cai-tien', 'lặp cải tiến');

-- Seed dữ liệu bài viết
INSERT INTO articles (category_id, author_id, slug, title, excerpt, content, status, published_at, hero_image)
VALUES
  ((SELECT id FROM categories WHERE slug = 'ai-trends'),
   (SELECT id FROM authors WHERE name = 'Mira Valdez'),
   'multimodal-models-in-production',
   'Đưa mô hình đa phương thức vào sản xuất',
   'Hướng dẫn thực tiễn để đánh giá, triển khai và giám sát hệ thống AI đa phương thức.',
   '<p>Các mô hình AI đa phương thức kết hợp văn bản, hình ảnh và âm thanh để mở ra những trải nghiệm mới...</p>',
   'published',
   '2024-04-02 08:00:00',
   NULL),
  ((SELECT id FROM categories WHERE slug = 'engineering'),
   (SELECT id FROM authors WHERE name = 'Anders Chen'),
   'edge-inference-checklist',
   'Danh sách kiểm tra suy luận trên thiết bị biên cho kỹ sư',
   'Những quyết định kiến trúc then chốt để cung cấp trải nghiệm suy luận AI nhanh và ổn định.',
   '<p>Suy luận trên thiết bị biên cải thiện độ phản hồi và quyền riêng tư...</p>',
   'published',
   '2024-03-18 10:30:00',
   NULL),
  ((SELECT id FROM categories WHERE slug = 'product'),
   (SELECT id FROM authors WHERE name = 'Priya Raman'),
   'designing-ai-feedback-loops',
   'Thiết kế vòng phản hồi cho sản phẩm AI',
   'Cách các đội sản phẩm thu thập, phân loại và vận hành phản hồi người dùng để cải thiện trợ lý AI.',
   '<p>Vòng phản hồi là yếu tố cốt lõi của chất lượng sản phẩm AI...</p>',
   'published',
   '2024-02-22 15:15:00',
   NULL);

-- Gắn tag cho bài viết
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a
JOIN tags t ON (
  (a.slug = 'multimodal-models-in-production' AND t.slug IN ('da-phuong-thuc','san-xuat','giam-sat')) OR
  (a.slug = 'edge-inference-checklist' AND t.slug IN ('thiet-bi-bien','suy-luan','trien-khai')) OR
  (a.slug = 'designing-ai-feedback-loops' AND t.slug IN ('phan-hoi','trai-nghiem-nguoi-dung','lap-cai-tien'))
);

SET FOREIGN_KEY_CHECKS = 1;
