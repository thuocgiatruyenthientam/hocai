#!/usr/bin/env bash
set -euo pipefail

# LiteSpeed-friendly deployment helper for hocai.site
# Required env variables (can be exported before running):
#   SSH_HOST (default: cda004.secureweb.vn)
#   SSH_PORT (default: 2222)
#   SSH_USER (default: h51ecb951c)
#   REMOTE_DIR (default: /home/h51ecb951c/domains/hocai.site)
#   VENV_DIR (default: /home/h51ecb951c/virtualenv/hocai.site/3.11)
#   APP_PORT (default: 8000)
#   SECRET_KEY, ADMIN_USERNAME, ADMIN_PASSWORD, DATABASE_URL, SERVER_NAME (optional overrides)

SSH_HOST=${SSH_HOST:-cda004.secureweb.vn}
SSH_PORT=${SSH_PORT:-2222}
SSH_USER=${SSH_USER:-h51ecb951c}
REMOTE_DIR=${REMOTE_DIR:-/home/h51ecb951c/domains/hocai.site}
APP_PORT=${APP_PORT:-8000}
PYTHON_BIN=${PYTHON_BIN:-python3}
VENV_DIR=${VENV_DIR:-/home/h51ecb951c/virtualenv/hocai.site/3.11}
ENV_FILE=${ENV_FILE:-${REMOTE_DIR}/.env}
RESTART_FILE=${RESTART_FILE:-${REMOTE_DIR}/tmp/restart.txt}

printf "Deploying to %s@%s:%s via port %s (LiteSpeed mode)\n" "$SSH_USER" "$SSH_HOST" "$REMOTE_DIR" "$SSH_PORT"

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
  "${PYTHON_BIN}" -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"
"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r requirements.txt

# Write runtime environment variables for Flask
cat > "${ENV_FILE}" <<ENVFILE
SECRET_KEY=${SECRET_KEY:-thi-en-tam-secret-key}
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-phat2009}
DATABASE_URL=${DATABASE_URL:-mysql+pymysql://h51ecb951c_hocai:phat2009@localhost/h51ecb951c_hocai?charset=utf8mb4}
SERVER_NAME=${SERVER_NAME:-hocai.site}
PREFERRED_URL_SCHEME=${PREFERRED_URL_SCHEME:-https}
APP_PORT=${APP_PORT}
ENVFILE

# Initialize database tables if missing
set -a
source "${ENV_FILE}"
set +a
"$VENV_DIR/bin/python" - <<'PYCODE'
from app import app, setup_database
with app.app_context():
    setup_database()
PYCODE

# Trigger LiteSpeed/Passenger reload (harmless if unused)
mkdir -p "$(dirname "${RESTART_FILE}")"
touch "${RESTART_FILE}"
EOF_REMOTE
