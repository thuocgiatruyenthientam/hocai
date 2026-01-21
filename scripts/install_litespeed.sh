#!/usr/bin/env bash
set -euo pipefail

# Cài đặt LiteSpeed Web Server (OpenLiteSpeed) trên Ubuntu/Debian.
# Yêu cầu: chạy với quyền root (sudo).

if [[ $EUID -ne 0 ]]; then
  echo "Vui lòng chạy script với quyền root (sudo)."
  exit 1
fi

apt-get update
apt-get install -y openlitespeed

systemctl enable --now lsws

echo "Đã cài đặt và khởi động LiteSpeed Web Server (OpenLiteSpeed)."
echo "Trang quản trị mặc định: http://<server-ip>:7080 (tài khoản admin thiết lập theo hướng dẫn của OpenLiteSpeed)."
