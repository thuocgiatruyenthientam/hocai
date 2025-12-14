#!/usr/bin/env bash
set -e
set -o pipefail || true

: "${SSH_HOST:=hocai.site}"
: "${SSH_USER:=root}"
: "${REMOTE_DIR:=/var/www/hocai}"
: "${APP_PORT:=8000}"
: "${SERVICE_NAME:=hocai-site}"
: "${PYTHON_BIN:=python3}"

printf "Deploying to %s@%s:%s (service: %s)\n" "$SSH_USER" "$SSH_HOST" "$REMOTE_DIR" "$SERVICE_NAME"

rsync -az --delete \
  --exclude '.venv' \
  --exclude '__pycache__' \
  --exclude '.git' \
  ./ "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}"

# Run remote commands via bash to ensure features like 'set -o pipefail' are available
ssh "${SSH_USER}@${SSH_HOST}" 'bash -s' <<'EOF_REMOTE'
set -e
set -o pipefail || true

REMOTE_DIR="'${REMOTE_DIR}'"
PYTHON_BIN="'${PYTHON_BIN}'"
APP_PORT="'${APP_PORT}'"
SERVICE_NAME="'${SERVICE_NAME}'"

cd "${REMOTE_DIR}"

# Ensure virtualenv
if [ ! -d ".venv" ]; then
  "${PYTHON_BIN}" -m venv .venv
fi
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

# Create .env from defaults if missing (do NOT overwrite an existing .env)
if [ ! -f .env ]; then
  cat > .env <<ENVFILE
SECRET_KEY=${SECRET_KEY:-replace_with_random_secret}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-REPLACE_ME_CHANGE_PASSWORD}
DATABASE_URL=${DATABASE_URL:-mysql+pymysql://USER:PASSWORD@localhost/DBNAME?charset=utf8mb4}
SERVER_NAME=${SERVER_NAME:-hocai.site}
PREFERRED_URL_SCHEME=https
ENVFILE
fi

# Load environment and initialize DB
set -a
[ -f .env ] && source .env
set +a

python - <<'PYCODE'
from app import app, setup_database
with app.app_context():
    setup_database()
PYCODE

# Configure systemd service (overwrite if changed)
cat >/etc/systemd/system/${SERVICE_NAME}.service <<SERVICE
[Unit]
Description=Gunicorn service for hocai.site
After=network.target

[Service]
WorkingDirectory=${REMOTE_DIR}
EnvironmentFile=${REMOTE_DIR}/.env
ExecStart=${REMOTE_DIR}/.venv/bin/gunicorn --workers 2 --threads 2 --bind 127.0.0.1:${APP_PORT} app:app
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable --now ${SERVICE_NAME}.service
EOF_REMOTE
