#!/usr/bin/env bash
set -euo pipefail

# Kịch bản triển khai nhanh Thuốc Nam lên máy chủ hocai.site (Ubuntu/Debian)
# Yêu cầu: chạy với quyền root. Có thể điều chỉnh các biến sau theo nhu cầu:
#   DOMAIN, PROJECT_ROOT, APP_USER, MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD,
#   DJANGO_SECRET_KEY, DJANGO_ALLOWED_HOSTS, GUNICORN_WORKERS, SOURCE_DIR

if [[ $EUID -ne 0 ]]; then
  echo "Vui lòng chạy script với quyền root (sudo)."
  exit 1
fi

DOMAIN=${DOMAIN:-hocai.site}
PROJECT_ROOT=${PROJECT_ROOT:-/home/h51ecb951c/domains/hocai.site/thuocnam}
SOURCE_DIR=${SOURCE_DIR:-$(pwd)}
APP_USER=${APP_USER:-h51ecb951c}
MYSQL_NAME=${MYSQL_NAME:-h51ecb951c_hocai}
MYSQL_USER=${MYSQL_USER:-h51ecb951c__FFkxnc5UnmHTS_P4IGjzIGk17RQZCl5n}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-phat2009}
DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY:-$(openssl rand -hex 32)}
DJANGO_ALLOWED_HOSTS=${DJANGO_ALLOWED_HOSTS:-"$DOMAIN,www.$DOMAIN,localhost,127.0.0.1"}
GUNICORN_WORKERS=${GUNICORN_WORKERS:-3}
PYTHON_BIN=${PYTHON_BIN:-/home/h51ecb951c/virtualenv/domains/hocai.site/thuocnam/3.11/bin/python}

apt-get update
apt-get install -y python3-venv python3-pip python3-dev build-essential mysql-server nginx rsync

# Tạo user chạy ứng dụng nếu chưa có
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  useradd --system --home "$PROJECT_ROOT" --shell /bin/bash "$APP_USER"
fi

install -d "$PROJECT_ROOT"
rsync -a --delete --exclude ".git" --exclude ".venv" "$SOURCE_DIR"/ "$PROJECT_ROOT"/
chown -R "$APP_USER":"$APP_USER" "$PROJECT_ROOT"
cd "$PROJECT_ROOT"

# Tạo database và user MySQL
mysql -u root -e "CREATE DATABASE IF NOT EXISTS \`$MYSQL_NAME\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -u root -e "GRANT ALL PRIVILEGES ON \`$MYSQL_NAME\`.* TO '$MYSQL_USER'@'localhost'; FLUSH PRIVILEGES;"

# Tạo file môi trường
cat > "$PROJECT_ROOT/.env" <<ENVVARS
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=$DJANGO_ALLOWED_HOSTS
MYSQL_NAME=$MYSQL_NAME
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_HOST=localhost
MYSQL_PORT=3306
ENVVARS
chown "$APP_USER":"$APP_USER" "$PROJECT_ROOT/.env"
chmod 640 "$PROJECT_ROOT/.env"

# Thiết lập virtualenv và cài đặt phụ thuộc
sudo -u "$APP_USER" $PYTHON_BIN -m venv "$PROJECT_ROOT/.venv"
"$PROJECT_ROOT/.venv/bin/pip" install --upgrade pip
"$PROJECT_ROOT/.venv/bin/pip" install -r requirements.txt

# Nạp biến môi trường để chạy migrate/collectstatic
set -a
source "$PROJECT_ROOT/.env"
set +a
sudo -u "$APP_USER" "$PROJECT_ROOT/.venv/bin/python" thuocnam/manage.py migrate --noinput
sudo -u "$APP_USER" "$PROJECT_ROOT/.venv/bin/python" thuocnam/manage.py collectstatic --noinput

# Tạo service Gunicorn
cat > /etc/systemd/system/thuocnam.service <<SERVICE
[Unit]
Description=Gunicorn for Thuoc Nam Django
After=network.target

[Service]
User=$APP_USER
Group=www-data
WorkingDirectory=$PROJECT_ROOT
EnvironmentFile=$PROJECT_ROOT/.env
ExecStart=$PROJECT_ROOT/.venv/bin/gunicorn --access-logfile - --workers $GUNICORN_WORKERS --bind unix:$PROJECT_ROOT/gunicorn.sock thuocnam.wsgi:application

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable --now thuocnam.service

# Cấu hình Nginx reverse proxy
cat > /etc/nginx/sites-available/thuocnam.conf <<NGINX
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /static/ {
        alias $PROJECT_ROOT/staticfiles/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:$PROJECT_ROOT/gunicorn.sock;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/thuocnam.conf /etc/nginx/sites-enabled/thuocnam.conf
nginx -t
systemctl restart nginx

echo "Triển khai hoàn tất. Trang sẽ phục vụ tại: http://$DOMAIN"
