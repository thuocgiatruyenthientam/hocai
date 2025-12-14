# Nhà thuốc Nam Thiên Tâm

Website giới thiệu cây thuốc nam và bài thuốc gia truyền... (keeps general project description)

## Cấu hình
Không lưu thông tin nhạy cảm trong mã nguồn. Tạo file `.env` (không commit) dựa trên `.env.example` và set các biến môi trường sau trước khi chạy ứng dụng:

- SECRET_KEY=replace_with_random_secret
- ADMIN_PASSWORD=your_admin_password
- DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST/DBNAME?charset=utf8mb4
- SERVER_NAME=hocai.site

Thay đổi mật khẩu/mất quyền truy cập: nếu thông tin đăng nhập hoặc mật khẩu CSDL đã bị lộ, hãy thay đổi ngay (rotate) mật khẩu và khóa các khóa đã lộ.

## Triển khai (tóm tắt)
Sử dụng `deploy.sh` để đồng bộ mã nguồn và khởi tạo service Gunicorn; `deploy.sh` đã được viết để không yêu cầu ghi trực tiếp mật khẩu trong mã nguồn và sẽ tạo `.env` trên server nếu không tồn tại.
