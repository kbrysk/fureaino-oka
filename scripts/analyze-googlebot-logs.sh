#!/usr/bin/env bash
# Googlebot アクセスログの簡易集計（Nginx combined 形式想定）。
# 用法: ./scripts/analyze-googlebot-logs.sh /var/log/nginx/access.log
# または: cat access.log | ./scripts/analyze-googlebot-logs.sh

set -e

LOG="${1:--}"

if [ "$LOG" = "-" ]; then
  INPUT="cat"
else
  [ -f "$LOG" ] || { echo "File not found: $LOG"; exit 1; }
  INPUT="cat $LOG"
fi

echo "=== Googlebot ヒット数 ==="
$INPUT | grep -iE "Googlebot|AdsBot-Google|Mediapartners-Google" | wc -l

echo ""
echo "=== パス別 上位 30（Googlebot のみ）==="
$INPUT | grep -iE "Googlebot|AdsBot-Google|Mediapartners-Google" | \
  sed -nE 's/.*" (GET|POST) ([^ ?]+).*/\2/p' | sort | uniq -c | sort -rn | head -30

echo ""
echo "=== .js リクエスト数（Googlebot）==="
$INPUT | grep -iE "Googlebot|AdsBot-Google|Mediapartners-Google" | grep -c "\.js" || true
