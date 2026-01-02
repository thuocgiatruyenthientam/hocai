# Thuốc Nam Django Web

Ứng dụng web đơn giản để quản lý và giới thiệu bài thuốc Nam sử dụng Python/Django với cơ sở dữ liệu PostgreSQL.

## Yêu cầu

- Python 3.11+
- PostgreSQL 13+ (hoặc SQLite cho môi trường phát triển nhanh)

## Cài đặt

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Cấu hình cơ sở dữ liệu

Ứng dụng ưu tiên PostgreSQL thông qua các biến môi trường:

```bash
export POSTGRES_NAME=thuocnam
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=yourpassword
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
```

Nếu không đặt `POSTGRES_NAME`, ứng dụng sẽ tự động dùng SQLite (`db.sqlite3`) cho mục đích thử nghiệm.

## Khởi chạy

```bash
python thuocnam/manage.py migrate
python thuocnam/manage.py createsuperuser  # tạo tài khoản quản trị (tuỳ chọn)
python thuocnam/manage.py runserver
```

Mở trình duyệt tại `http://127.0.0.1:8000/` để xem danh sách thuốc và `http://127.0.0.1:8000/admin/` để quản trị dữ liệu.

## Triển khai lên máy chủ hocai.site

Script `scripts/deploy_hocai_site.sh` sẽ tự động:

- Cài đặt PostgreSQL, Python build deps, Nginx và Gunicorn.
- Tạo database/user PostgreSQL và file `.env` chứa biến môi trường.
- Thiết lập virtualenv, chạy migrate/collectstatic, và cấu hình service Gunicorn + reverse proxy Nginx.

Chạy ví dụ (trên máy chủ Ubuntu/Debian, với quyền root):

```bash
git clone https://example.com/hocai.git /tmp/hocai
cd /tmp/hocai
DOMAIN=hocai.site PROJECT_ROOT=/opt/hocai ./scripts/deploy_hocai_site.sh
```

Biến môi trường hỗ trợ: `DOMAIN`, `PROJECT_ROOT`, `APP_USER`, `POSTGRES_NAME`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `GUNICORN_WORKERS`, `SOURCE_DIR`.

## Kiểm thử

```bash
python thuocnam/manage.py test
```
