# Nhà thuốc Nam Thiên Tâm

Website giới thiệu cây thuốc nam và bài thuốc gia truyền của dân tộc Chăm, tập trung vào các chủ đề: sỏi thận, viêm cầu thận, suy thận, viêm tiết niệu, làm đẹp da, viêm khớp, thoái hóa khớp và gout. Dự án xây dựng bằng Python/Flask với giao diện màu xanh lá cây chủ đạo, tối ưu SEO và có trang quản trị dễ dùng.

## Tính năng chính
- Trang chủ hiển thị giới thiệu, danh sách chủ đề và 4 tin tức mới nhất.
- Trang chi tiết từng chủ đề với tóm tắt và các bước/bài thuốc gợi ý.
- Trang tin tức tự động tổng hợp 10 bài viết chất lượng, cho phép thêm/xóa qua quản trị.
- Trang quản trị (đăng nhập bằng mật khẩu) để thêm, cập nhật, xóa chủ đề và tin tức.
- Dữ liệu chủ đề và tin tức lưu trong MariaDB (tự tạo bảng `topics` và `news_items` khi khởi động lần đầu).

## Cài đặt
**Cài đặt nhanh (đã khớp môi trường Setup Python App 3.11.11):**
```bash
chmod +x install.sh
bash install.sh   # hoặc ./install.sh nếu có quyền thực thi
```
> Lưu ý: đừng chạy nhầm `pip install install.sh` hoặc đưa file này vào danh sách yêu cầu của pip; pip sẽ coi dòng `set -euo pipefail` là gói và báo lỗi như "Invalid requirement: set -e". Hãy thực thi script bằng Bash.

Script sẽ tạo môi trường ảo tại `/home/h51ecb951c/virtualenv/hocai.site/3.11` (hoặc dùng lại nếu đã có), cài gói và ghi file `.env` với thông tin miền `hocai.site`, tài khoản quản trị (`admin` / `phat2009`) và kết nối MariaDB mặc định.
Nếu máy chủ có nhiều phiên bản Python, đặt biến `PYTHON_BIN=python3.11` trước khi chạy để khớp "Setup Python App 3.11.11" (script tự động fallback sang python3.11 nếu `python3` không tồn tại). Khi đăng nhập SSH, kích hoạt sẵn môi trường ảo và chuyển thư mục bằng:
```bash
source /home/h51ecb951c/virtualenv/hocai.site/3.11/bin/activate && cd /home/h51ecb951c/domains/hocai.site
```

**Cài đặt thủ công:**
1. Tạo môi trường ảo và cài đặt phụ thuộc (đường dẫn khớp máy chủ đã cấu hình):
   ```bash
   python3.11 -m venv /home/h51ecb951c/virtualenv/hocai.site/3.11
   source /home/h51ecb951c/virtualenv/hocai.site/3.11/bin/activate
   pip install -r requirements.txt
   ```
2. Cấu hình kết nối MariaDB (mặc định dùng thông tin máy chủ nội bộ):
   - Host: `localhost` (Unix socket)
   - User: `h51ecb951c_hocai`
   - Password: `phat2009`
   - Database: `h51ecb951c_hocai`
   - Charset: `utf8mb4`

   Chỉnh sửa chuỗi kết nối trong `app.py` nếu máy chủ của bạn khác thông tin trên.

3. Chạy ứng dụng:
   ```bash
   flask --app app run --host 0.0.0.0 --port 5000
   ```

## Triển khai lên máy chủ (hocai.site)
Kịch bản `deploy.sh` hỗ trợ upload mã nguồn và khởi chạy Gunicorn sau LiteSpeed/Apache/nginx. Yêu cầu có SSH vào máy chủ.

1. Tạo bản ghi DNS A cho `hocai.site` trỏ tới IP máy chủ.
2. Thiết lập biến môi trường (tùy chỉnh khi cần, máy chủ SSH `cda004.secureweb.vn` mở port 2222):
   ```bash
   export SSH_HOST=cda004.secureweb.vn
   export SSH_PORT=2222
   export SSH_USER=root                                # hoặc tài khoản có quyền sudo
   export REMOTE_DIR=/home/h51ecb951c/domains/hocai.site                 # thư mục lưu mã nguồn
   export VENV_DIR=/home/h51ecb951c/virtualenv/hocai.site/3.11
   export PYTHON_BIN=python3.11                        # khớp cấu hình "Setup Python App 3.11.11"
   export DATABASE_URL="mysql+pymysql://h51ecb951c_hocai:phat2009@localhost/h51ecb951c_hocai?charset=utf8mb4"
   export SECRET_KEY="<chuoi-bi-mat>"
    export ADMIN_USERNAME=admin
   export ADMIN_PASSWORD="phat2009"
   export SERVER_NAME=hocai.site
   ```
3. Chạy script triển khai:
   ```bash
   ./deploy.sh
   ```
   Script sẽ đồng bộ mã nguồn bằng `rsync`, cài gói trong môi trường ảo tại `/home/h51ecb951c/virtualenv/hocai.site/3.11`, khởi tạo bảng CSDL và tạo dịch vụ systemd chạy Gunicorn tại `127.0.0.1:8000`.
4. Cấu hình web server (ví dụ LiteSpeed/Apache) reverse proxy `hocai.site` tới `127.0.0.1:8000`, bật HTTPS và HTTP/2 để tận dụng SEO. Với Apache, có thể dùng cấu hình mẫu:
   ```apache
   <VirtualHost *:80>
     ServerName hocai.site
     Redirect permanent / https://hocai.site/
   </VirtualHost>

   <VirtualHost *:443>
     ServerName hocai.site
     ProxyPreserveHost On
     ProxyPass / http://127.0.0.1:8000/
     ProxyPassReverse / http://127.0.0.1:8000/
     SSLEngine on
     SSLCertificateFile /etc/letsencrypt/live/hocai.site/fullchain.pem
     SSLCertificateKeyFile /etc/letsencrypt/live/hocai.site/privkey.pem
   </VirtualHost>
   ```
5. Kiểm tra dịch vụ:
   ```bash
   sudo systemctl status hocai-site.service
   curl -I https://hocai.site
   ```
   Khi cần cập nhật mã, chỉ cần chạy lại `./deploy.sh`.

## Tối ưu hiệu năng trên máy chủ LiteSpeed/PHP 7.4
- `SQLALCHEMY_ENGINE_OPTIONS` đã được tinh chỉnh sẵn với pool nhỏ (5 kết nối, tối đa vượt mức 2) kèm `pool_pre_ping`/`pool_recycle` giúp tái sử dụng kết nối ổn định trên MariaDB 10.5.
- Ẩn dư thừa SSL và bật cache nội bộ cho danh sách chủ đề/tin giúp giảm số truy vấn cho mỗi request, phù hợp môi trường tài nguyên hạn chế.
- Khi triển khai sau LiteSpeed, hãy chạy ứng dụng bằng WSGI (ví dụ `gunicorn --workers 2 --threads 2 app:app`) và để LiteSpeed/LSAPI reverse proxy tới port nội bộ; tránh chạy debug để tiết kiệm bộ nhớ.

## Tài khoản quản trị
- Tài khoản mặc định: `admin`
- Mật khẩu mặc định: `phat2009`
- URL đăng nhập: `/admin/login`

## Tùy chỉnh
- Tùy chỉnh dữ liệu trực tiếp bằng giao diện quản trị hoặc qua MariaDB.
- Thay đổi màu sắc hoặc giao diện trong `static/css/style.css`.

## Ghi chú
Máy chủ cần có kết nối mạng để cài đặt `Flask` từ `pip`. Nếu không thể tải gói, hãy cài đặt thủ công từ nguồn sẵn có hoặc sử dụng môi trường đã có Flask.
