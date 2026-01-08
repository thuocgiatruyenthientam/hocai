#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=${PROJECT_ROOT:-/home/h51ecb951c/domains/hocai.site/thuocnam}

if pgrep -f "gunicorn.*thuocnam.wsgi:application" >/dev/null 2>&1; then
  pkill -f "gunicorn.*thuocnam.wsgi:application"
  echo "Đã dừng Gunicorn."
else
  echo "Không tìm thấy tiến trình Gunicorn."
fi

if [[ -f "$PROJECT_ROOT/gunicorn.sock" ]]; then
  rm -f "$PROJECT_ROOT/gunicorn.sock"
fi
