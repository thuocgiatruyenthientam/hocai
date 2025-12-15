#!/usr/bin/env bash
set -euo pipefail

# Basic installer for deploying the hocai.site Flask app on a LiteSpeed-compatible host.
# It provisions a Python virtual environment, installs dependencies, and writes
# environment defaults for domain and admin access.

APP_DIR=${APP_DIR:-"/home/h51ecb951c/domains/hocai.site/var/www/hocai"}
PYTHON_BIN=${PYTHON_BIN:-python3}
VENV_DIR=${VENV_DIR:-"/home/h51ecb951c/virtualenv/hocai.site/var/www/hocai/3.11"}
ENV_FILE="$APP_DIR/.env"

# Provide a graceful fallback if python3.11 is available but python3 points elsewhere
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1 && command -v python3.11 >/dev/null 2>&1; then
  echo "[!] $PYTHON_BIN not found, falling back to python3.11"
  PYTHON_BIN=python3.11
fi

mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -f requirements.txt ]; then
  echo "[!] Không tìm thấy requirements.txt trong $APP_DIR. Hãy tải mã nguồn dự án về thư mục này rồi chạy lại." >&2
  exit 1
fi

# Create virtual environment if missing
if [ ! -d "$VENV_DIR" ]; then
  echo "[+] Creating virtualenv at $VENV_DIR (using $PYTHON_BIN)"
  mkdir -p "$(dirname "$VENV_DIR")"
  $PYTHON_BIN -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# Install Python dependencies
"$PYTHON_BIN" -m pip install --upgrade pip
"$PYTHON_BIN" -m pip install -r requirements.txt

# Write default environment values for hocai.site deployment
cat > "$ENV_FILE" <<'ENVVARS'
# Flask secret key
SECRET_KEY=${SECRET_KEY:-"thi-en-tam-secret-key"}

# Admin credentials
ADMIN_USERNAME=${ADMIN_USERNAME:-"admin"}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-"phat2009"}

# Database connection
DATABASE_URL=${DATABASE_URL:-"mysql+pymysql://h51ecb951c_hocai:phat2009@localhost/h51ecb951c_hocai?charset=utf8mb4"}

# Domain configuration
SERVER_NAME=${SERVER_NAME:-"hocai.site"}
PREFERRED_URL_SCHEME=${PREFERRED_URL_SCHEME:-"https"}
ENVVARS

echo "[+] Environment written to $ENV_FILE"
echo "[✓] Installation complete. Start the app with:"
echo "    source $VENV_DIR/bin/activate && flask --app app run --host 0.0.0.0 --port 8000"
