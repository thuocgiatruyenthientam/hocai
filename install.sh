#!/usr/bin/env bash
set -euo pipefail

# Basic installer for deploying the hocai.site Flask app on a LiteSpeed-compatible host.
# It provisions a Python virtual environment, installs dependencies, and writes
# environment defaults for domain and admin access.

APP_DIR=${APP_DIR:-"$HOME/hocai"}
PYTHON_BIN=${PYTHON_BIN:-python3}
VENV_DIR="$APP_DIR/.venv"
ENV_FILE="$APP_DIR/.env"

mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Create virtual environment if missing
if [ ! -d "$VENV_DIR" ]; then
  echo "[+] Creating virtualenv at $VENV_DIR"
  $PYTHON_BIN -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

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
