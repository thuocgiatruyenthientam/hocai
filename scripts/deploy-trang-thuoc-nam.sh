#!/usr/bin/env bash
# Build Next.js ở chế độ standalone rồi đóng gói/đẩy lên DirectAdmin (cổng 2222).
# Yêu cầu: ssh/scp/rsync và tài khoản hosting có quyền SSH/SFTP.
set -euo pipefail

APP_NAME=${APP_NAME:-trang-thuoc-nam}
DA_HOST=${DA_HOST:-cda004.secureweb.vn}
DA_PORT=${DA_PORT:-2222}
DA_USER=${DA_USER:-}
DA_TARGET=${DA_TARGET:-~/domains/${APP_NAME}/public_html/node}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://trang-thuoc-nam.vn}
ARCHIVE=${ARCHIVE:-release-${APP_NAME}.tar.gz}

if [[ -z "${DA_USER}" ]]; then
  echo "[LỖI] Cần đặt biến môi trường DA_USER cho tài khoản hosting." >&2
  exit 1
fi

# 1) Build sản phẩm ở chế độ production.
echo "[1/4] Cài đặt dependency và build Next.js..."
npm install
NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" npm run build

# 2) Gom file deploy vào thư mục tạm.
echo "[2/4] Đóng gói build standalone và asset tĩnh..."
STAGE_DIR=$(mktemp -d)
rsync -a .next/standalone/ "$STAGE_DIR/"
rsync -a .next/static/ "$STAGE_DIR/.next/static/"
rsync -a public/ "$STAGE_DIR/public/"

cat > "$STAGE_DIR/start.sh" <<'START'
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export NODE_ENV=production
export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-3000}
export NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://trang-thuoc-nam.vn}
exec node server.js
START
chmod +x "$STAGE_DIR/start.sh"

tar -czf "$ARCHIVE" -C "$STAGE_DIR" .
rm -rf "$STAGE_DIR"

echo "[3/4] Upload qua SSH/SFTP tới $DA_HOST:$DA_PORT..."
ssh -p "$DA_PORT" "$DA_USER@$DA_HOST" "mkdir -p $DA_TARGET"
scp -P "$DA_PORT" "$ARCHIVE" "$DA_USER@$DA_HOST:$DA_TARGET/"
rm -f "$ARCHIVE"

echo "[4/4] Giải nén và set quyền chạy start.sh trên hosting..."
ssh -p "$DA_PORT" "$DA_USER@$DA_HOST" "cd $DA_TARGET && tar -xzf $ARCHIVE && chmod +x start.sh"

echo "Hoàn tất. Đăng nhập SSH và chạy '$DA_TARGET/start.sh' (hoặc thêm vào PM2/systemd) để khởi động trang $APP_NAME."
