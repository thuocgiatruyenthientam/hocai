# Thuốc Nam Django Web

Ứng dụng web đơn giản để quản lý và giới thiệu bài thuốc Nam sử dụng Python/Django với cơ sở dữ liệu MySQL.

## Yêu cầu

- Python 3.11+
- MySQL/MariaDB (hoặc SQLite cho môi trường phát triển nhanh)
- Driver MySQL thuần Python PyMySQL (không cần biên dịch, tránh lỗi build wheel `mysqlclient`)

## Cài đặt

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Cấu hình cơ sở dữ liệu

Ứng dụng mặc định dùng MySQL với thông số của hocai.site (có thể override bằng biến môi trường). Sao chép file cấu hình mẫu:

```bash
cp .env.example .env
```

Các giá trị mặc định (đã khớp với máy chủ MariaDB 10.5.28 trên hocai.site):

```bash
export MYSQL_NAME=h51ecb951c_hocai
export MYSQL_USER=h51ecb951c_hocai
export MYSQL_PASSWORD=phat2009
export MYSQL_HOST=localhost  # MariaDB chạy local qua UNIX socket
export MYSQL_PORT=3306
```

Để chạy thử nhanh bằng SQLite, thiết lập:

```bash
export USE_SQLITE=true
```

## Khởi chạy

```bash
python thuocnam/manage.py migrate
python thuocnam/manage.py createsuperuser  # tạo tài khoản quản trị (tuỳ chọn)
python thuocnam/manage.py runserver
```

Mở trình duyệt tại `http://127.0.0.1:8000/` để xem danh sách thuốc và `http://127.0.0.1:8000/admin/` để quản trị dữ liệu.

## Triển khai lên máy chủ hocai.site

Python sản xuất trên máy chủ hocai.site được chạy qua virtualenv mặc định:

```bash
source /home/h51ecb951c/virtualenv/domains/hocai.site/thuocnam/3.11/bin/activate
cd /home/h51ecb951c/domains/hocai.site/thuocnam
```

Script `scripts/deploy_hocai_site.sh` sẽ tự động:

- Cài đặt MySQL, Python build deps, LiteSpeed Web Server (OpenLiteSpeed) và Gunicorn.
- Tạo database/user MySQL và file `.env` chứa biến môi trường.
- Thiết lập virtualenv, chạy migrate/collectstatic, và cấu hình service Gunicorn + reverse proxy LiteSpeed.

Script sử dụng PyMySQL nên không cần gói phát triển `libmysqlclient-dev` trên máy chủ, giúp tránh lỗi build wheel khi cài đặt phụ thuộc.

Mặc định script sẽ triển khai với domain `hocai.site` cùng đường dẫn/virtualenv sẵn có và thông tin MySQL:

- Database: `h51ecb951c_hocai`
- User: `h51ecb951c_hocai`
- Password: `phat2009`
 - PROJECT_ROOT: `/home/h51ecb951c/domains/hocai.site/thuocnam`
 - PYTHON_BIN: `/home/h51ecb951c/virtualenv/domains/hocai.site/thuocnam/3.11/bin/python`

LiteSpeed Web Server được cấu hình tại `/usr/local/lsws/conf/httpd_config.conf` và vhost `thuocnam` trong
`/usr/local/lsws/conf/vhosts/thuocnam/vhconf.conf`. Nếu máy chủ đã có listener port 80, hãy đảm bảo
không bị trùng lặp hoặc chỉnh lại map domain trong LiteSpeed.

Chạy ví dụ (trên máy chủ Ubuntu/Debian, với quyền root):

```bash
git clone https://example.com/hocai.git /tmp/hocai
cd /tmp/hocai
DOMAIN=hocai.site PROJECT_ROOT=/opt/hocai ./scripts/deploy_hocai_site.sh
```

Biến môi trường hỗ trợ: `DOMAIN`, `PROJECT_ROOT`, `APP_USER`, `MYSQL_NAME`, `MYSQL_USER`, `MYSQL_PASSWORD`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `GUNICORN_WORKERS`, `SOURCE_DIR`.

## Kiểm thử

```bash
python thuocnam/manage.py test
```
