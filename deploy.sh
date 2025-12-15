#!/usr/bin/env bash
set -euo pipefail

# Simple deployment helper for hocai.site
# Required env variables (can be exported before running):
#   SSH_HOST (default: cda004.secureweb.vn)
#   SSH_PORT (default: 2222)
#   SSH_USER (default: root)
#   REMOTE_DIR (default: /home/h51ecb951c/domains/hocai.site/var/www/hocai)
#   VENV_DIR (default: /home/h51ecb951c/virtualenv/hocai.site/var/www/hocai/3.11)
#   APP_PORT (default: 8000)
#   SERVICE_NAME (default: hocai-site)
#   SECRET_KEY, ADMIN_PASSWORD, DATABASE_URL, SERVER_NAME (optional overrides)

SSH_HOST=${SSH_HOST:-cda004.secureweb.vn}
SSH_PORT=${SSH_PORT:-2222}
SSH_USER=${SSH_USER:-root}
REMOTE_DIR=${REMOTE_DIR:-/home/h51ecb951c/domains/hocai.site/var/www/hocai}
APP_PORT=${APP_PORT:-8000}
SERVICE_NAME=${SERVICE_NAME:-hocai-site}
PYTHON_BIN=${PYTHON_BIN:-python3}
VENV_DIR=${VENV_DIR:-/home/h51ecb951c/virtualenv/hocai.site/var/www/hocai/3.11}

printf "Deploying to %s@%s:%s via port %s (service: %s)\n" "$SSH_USER" "$SSH_HOST" "$REMOTE_DIR" "$SSH_PORT" "$SERVICE_NAME"

# Ensure remote target directory tree exists before syncing
ssh -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" "mkdir -p '${REMOTE_DIR}'"

# Sync source (excluding virtualenv, git metadata, caches)
rsync -az --delete \
  --exclude '.venv' \
  --exclude '__pycache__' \
  --exclude '.git' \
  -e "ssh -p ${SSH_PORT}" \
  ./ "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}"

ssh -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" bash <<EOF_REMOTE
set -euo pipefail
mkdir -p "${REMOTE_DIR}"
cd "${REMOTE_DIR}"

# Setup Python env and dependencies
mkdir -p "${VENV_DIR%/*}"
if [ ! -d "$VENV_DIR" ]; then
  ${PYTHON_BIN} -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install -r requirements.txt

# Write runtime environment variables for Flask/Gunicorn
cat > .env <<ENVFILE
SECRET_KEY=${SECRET_KEY:-thi-en-tam-secret-key}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-phat2009}
DATABASE_URL=${DATABASE_URL:-mysql+pymysql://h51ecb951c_hocai:phat2009@localhost/h51ecb951c_hocai?charset=utf8mb4}
SERVER_NAME=${SERVER_NAME:-hocai.site}
PREFERRED_URL_SCHEME=https
ENVFILE

# Initialize database tables if missing
set -a
source .env
set +a
python - <<'PYCODE'
from app import app, setup_database
with app.app_context():
    setup_database()
PYCODE

# Configure systemd service for Gunicorn
cat >/etc/systemd/system/${SERVICE_NAME}.service <<SERVICE
[Unit]
Description=Gunicorn service for hocai.site
After=network.target

[Service]
WorkingDirectory=${REMOTE_DIR}
EnvironmentFile=${REMOTE_DIR}/.env
ExecStart=${VENV_DIR}/bin/gunicorn --workers 2 --threads 2 --bind 127.0.0.1:${APP_PORT} app:app
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable --now ${SERVICE_NAME}.service
EOF_REMOTE
