#!/usr/bin/env python3
"""
GSC クロール統計補完: Nginx / Apache アクセスログから Googlebot の挙動を抽出・集計する。
無駄な JS クロールを引き起こしている URL を特定し、robots.txt や next.config の最適化に利用する。

使い方:
  python scripts/analyze-googlebot-logs.py /var/log/nginx/access.log
  python scripts/analyze-googlebot-logs.py /var/log/apache2/access.log --format apache
  cat access.log | python scripts/analyze-googlebot-logs.py --stdin

出力: パス別・拡張子別・ステータス別の集計、上位浪費 URL 一覧。
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

# Googlebot の User-Agent パターン（モバイル・画像・その他含む）
GOOGLEBOT_UA_PATTERN = re.compile(
    r"Googlebot|Googlebot-Image|Googlebot-News|Googlebot-Video|"
    r"AdsBot-Google|Mediapartners-Google|Storebot-Google",
    re.I,
)

# 無駄なクロール候補: 静的アセット・API・パラメータ付き
WASTEFUL_EXTENSIONS = {".js", ".css", ".map", ".woff2", ".woff", ".ico", ".png", ".jpg", ".jpeg", ".webp"}
API_PATH_PREFIX = "/api/"
NEXT_STATIC = "/_next/"


def parse_nginx_combined(line: str) -> dict | None:
    """Nginx combined log: $remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" """
    m = re.match(
        r'^(?P<remote>\S+) \S+ \S+ \[[^\]]+\] "(?P<method>\S+) (?P<uri>\S+) \S+" (?P<status>\d+) \d+ "[^"]*" "(?P<ua>[^"]*)"',
        line,
    )
    if not m:
        return None
    return m.groupdict()


def parse_apache_common(line: str) -> dict | None:
    """Apache Common: %h %l %u %t \"%r\" %>s %b"""
    m = re.match(
        r'^(?P<remote>\S+) \S+ \S+ \[[^\]]+\] "(?P<method>\S+) (?P<uri>\S+) \S+" (?P<status>\d+) \d+',
        line,
    )
    if not m:
        return None
    d = m.groupdict()
    d["ua"] = ""  # common には UA がない場合あり
    return d


def parse_apache_combined(line: str) -> dict | None:
    """Apache Combined: %h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\""""
    m = re.match(
        r'^(?P<remote>\S+) \S+ \S+ \[[^\]]+\] "(?P<method>\S+) (?P<uri>\S+) \S+" (?P<status>\d+) \d+ "[^"]*" "(?P<ua>[^"]*)"',
        line,
    )
    if not m:
        return None
    return m.groupdict()


def path_from_uri(uri: str) -> str:
    try:
        return urlparse(uri).path or "/"
    except Exception:
        return "/"


def ext_from_path(path: str) -> str:
    return (Path(path).suffix or "").lower()


def is_googlebot(ua: str) -> bool:
    return bool(ua and GOOGLEBOT_UA_PATTERN.search(ua))


def main() -> None:
    parser = argparse.ArgumentParser(description="Googlebot アクセスログ解析（GSC クロール最適化用）")
    parser.add_argument("logfile", nargs="?", help="Nginx/Apache アクセスログファイル")
    parser.add_argument("--stdin", action="store_true", help="標準入力から読み込む")
    parser.add_argument("--format", choices=["nginx", "apache", "apache-common"], default="nginx")
    parser.add_argument("--top", type=int, default=50, help="表示する上位 URL 数")
    args = parser.parse_args()

    if args.stdin:
        stream = sys.stdin
    elif args.logfile:
        path = Path(args.logfile)
        if not path.exists():
            print(f"Error: file not found: {path}", file=sys.stderr)
            sys.exit(1)
        stream = path.open(encoding="utf-8", errors="replace")
    else:
        parser.print_help()
        sys.exit(1)

    if args.format == "nginx":
        parse = parse_nginx_combined
    elif args.format == "apache":
        parse = parse_apache_combined
    else:
        parse = parse_apache_common

    by_path: dict[str, int] = defaultdict(int)
    by_ext: dict[str, int] = defaultdict(int)
    by_status: dict[str, int] = defaultdict(int)
    js_urls: dict[str, int] = defaultdict(int)
    total_bot = 0
    total_lines = 0

    for line in stream:
        total_lines += 1
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        row = parse(line)
        if not row:
            continue
        ua = row.get("ua") or ""
        if not is_googlebot(ua):
            continue
        total_bot += 1
        uri = row.get("uri") or ""
        path = path_from_uri(uri)
        status = row.get("status", "")
        by_path[path] += 1
        by_status[status] += 1
        ext = ext_from_path(path)
        if ext:
            by_ext[ext] += 1
        if path.endswith(".js") or ".js?" in path or "/_next/static/" in path and ".js" in path:
            js_urls[path] += 1

    if not args.stdin and args.logfile:
        stream.close()

    # レポート
    print("=== Googlebot アクセス集計 (GSC クロール最適化用) ===\n")
    print(f"総ログ行数: {total_lines}")
    print(f"Googlebot ヒット数: {total_bot}\n")

    print("--- ステータス別 ---")
    for status in sorted(by_status.keys(), key=lambda x: -by_status[x]):
        print(f"  {status}: {by_status[status]}")

    print("\n--- 拡張子別（JS/CSS のクロール割合確認）---")
    for ext in sorted(by_ext.keys(), key=lambda x: -by_ext[x]):
        print(f"  {ext or '(none)'}: {by_ext[ext]}")

    print(f"\n--- パス別 上位 {args.top} ---")
    for path, count in sorted(by_path.items(), key=lambda x: -x[1])[: args.top]:
        print(f"  {count:6d}  {path}")

    if js_urls:
        print(f"\n--- JS 関連 URL 上位 30（無駄なクロール候補）---")
        for path, count in sorted(js_urls.items(), key=lambda x: -x[1])[:30]:
            print(f"  {count:6d}  {path}")

    print("\n--- 推奨 ---")
    print("  - .js が多い場合: next/script 遅延読み込み・SSR/SSG で重要コンテンツを初期HTMLに")
    print("  - /api/ がヒットしている場合: robots.txt で Disallow: /api/ を確認")
    print("  - 4xx/5xx が多いパス: リダイレクトまたは削除でクロールバジェット節約")


if __name__ == "__main__":
    main()
