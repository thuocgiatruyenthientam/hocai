# hocai

Nâng cấp thuocgiatruyen.org để chạy trên Python 3.12 và Django 5.x, sẵn sàng cho triển khai hiện đại.

## Yêu cầu môi trường

- Python >= 3.12
- MySQL 8.x (khuyến nghị)

## Cài đặt nhanh

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Cấu hình MySQL cho Django

Ví dụ cấu hình trong `settings.py`:

```python
import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("MYSQL_DATABASE", "thuocgiatruyen"),
        "USER": os.getenv("MYSQL_USER", "root"),
        "PASSWORD": os.getenv("MYSQL_PASSWORD", ""),
        "HOST": os.getenv("MYSQL_HOST", "127.0.0.1"),
        "PORT": os.getenv("MYSQL_PORT", "3306"),
        "OPTIONS": {
            "charset": "utf8mb4",
            "use_unicode": True,
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
        },
        "CONN_MAX_AGE": 60,
    }
}
```

## Chạy song song dữ liệu trong 03 ngày

Script `scripts/parallel_data_migration.py` hiện được thiết kế cho PostgreSQL. Nếu chuyển sang
MySQL, nên triển khai song song dữ liệu bằng migration trong Django hoặc job ETL chuyên biệt.

## Cấu hình hiệu năng đề xuất

Các tệp cấu hình mẫu dưới đây giúp tối ưu tốc độ phản hồi cho môi trường production:

- `deploy/gunicorn.conf.py`: cấu hình worker/threads, preload, giới hạn request.
- `deploy/nginx.conf`: bật gzip, cache static/media, tối ưu proxy.

### Gunicorn

```bash
gunicorn -c deploy/gunicorn.conf.py your_project.wsgi:application
```

### Nginx

Sao chép nội dung `deploy/nginx.conf` vào cấu hình máy chủ và điều chỉnh đường dẫn
`/var/www/thuocgiatruyen` cho phù hợp.
