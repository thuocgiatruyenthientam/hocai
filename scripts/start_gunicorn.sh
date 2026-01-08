#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=${PROJECT_ROOT:-/domains/hocai.site/thuocnam}
ENV_FILE=${ENV_FILE:-$PROJECT_ROOT/.env}
GUNICORN_WORKERS=${GUNICORN_WORKERS:-3}

cd "$PROJECT_ROOT"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Không tìm thấy $ENV_FILE. Vui lòng tạo file .env trước."
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [[ -f "$PROJECT_ROOT/gunicorn.sock" ]]; then
  rm -f "$PROJECT_ROOT/gunicorn.sock"
fi

mkdir -p "$PROJECT_ROOT/logs"

exec "$PROJECT_ROOT/.venv/bin/gunicorn" \
  --access-logfile "$PROJECT_ROOT/logs/access.log" \
  --error-logfile "$PROJECT_ROOT/logs/error.log" \
  --workers "$GUNICORN_WORKERS" \
  --bind "unix:$PROJECT_ROOT/gunicorn.sock" \
  thuocnam.wsgi:application
