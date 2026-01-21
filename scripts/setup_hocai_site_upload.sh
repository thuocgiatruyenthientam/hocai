#!/usr/bin/env bash
set -euo pipefail

# Thiết lập nhanh khi đã có Python trên hocai.site (không cài đặt hệ thống).
# Chỉ cần upload source lên PROJECT_ROOT rồi chạy script này.

PROJECT_ROOT=${PROJECT_ROOT:-/domains/hocai.site/thuocnam}
PYTHON_BIN=${PYTHON_BIN:-/home/h51ecb951c/virtualenv/domains/hocai.site/thuocnam/3.11/bin/python}
ENV_FILE=${ENV_FILE:-$PROJECT_ROOT/.env}
REQUIREMENTS_FILE=${REQUIREMENTS_FILE:-$PROJECT_ROOT/requirements.txt}

cd "$PROJECT_ROOT"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Không tìm thấy $ENV_FILE. Sao chép từ .env.example và chỉnh lại thông số."
  exit 1
fi

if [[ ! -f "$REQUIREMENTS_FILE" ]]; then
  echo "Không tìm thấy requirements.txt tại $REQUIREMENTS_FILE."
  echo "Hãy upload đầy đủ file requirements.txt hoặc đặt REQUIREMENTS_FILE trỏ tới đúng đường dẫn."
  exit 1
fi

if [[ ! -d "$PROJECT_ROOT/.venv" ]]; then
  "$PYTHON_BIN" -m venv "$PROJECT_ROOT/.venv"
fi

"$PROJECT_ROOT/.venv/bin/pip" install --upgrade pip
"$PROJECT_ROOT/.venv/bin/pip" install -r "$REQUIREMENTS_FILE"

set -a
source "$ENV_FILE"
set +a

"$PROJECT_ROOT/.venv/bin/python" thuocnam/manage.py migrate --noinput
"$PROJECT_ROOT/.venv/bin/python" thuocnam/manage.py collectstatic --noinput

echo "Hoàn tất. Chạy scripts/start_gunicorn.sh để khởi động Gunicorn."
