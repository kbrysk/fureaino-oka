# GSC クロール統計に基づく最適化（実施内容）

`fureaino-oka.com` / `www.fureaino-oka.com` の GSC データ（ホストエラー、JS 消費 62%、www 混在、robots.txt 不在 7% 等）を踏まえたインフラ・フロント・運用の変更まとめ。

---

## Phase 1: トリアージ・即時止血

### 1. ホスト正規化・エラー抑制

- **vercel.json**  
  - `fureaino-oka.com` → `https://www.fureaino-oka.com` へ 301 正規化。  
  - 両ホストの混在をやめ、クロールバジェットを正規ホストに集約。
- **next.config.ts**  
  - `index.html` 付き URL の 301 は従来どおり。  
  - `typescript` / `eslint` のビルド時チェックでホストエラー要因を検出しやすくする設定を追加。

**ラッコサーバー等で Nginx を使う場合**（Vercel 以外）は、サーバー側で次のいずれかを設定する想定です。

- 正規ホストを `www` にする例（現在の CANONICAL_BASE に合わせる場合）:

```nginx
# ノンワイルド → www へ 301
server {
  listen 80;
  listen [::]:80;
  server_name fureaino-oka.com;
  return 301 https://www.fureaino-oka.com$request_uri;
}
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name fureaino-oka.com;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
  return 301 https://www.fureaino-oka.com$request_uri;
}
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name www.fureaino-oka.com;
  # ... 本番の root / proxy_pass 等
}
```

- 正規ホストをノンワイルドにする例:
  - `server_name www.fureaino-oka.com; return 301 https://fureaino-oka.com$request_uri;`

（本番の正規ドメインは `app/lib/site-url.ts` の `CANONICAL_BASE` および環境変数 `NEXT_PUBLIC_BASE_URL` に合わせること。）

### 2. robots.txt

- **app/robots.ts**  
  - `Allow: /`、`Disallow: /api/`, `/settings`, `/contact/thanks`, `/senryu/submit`。  
  - `Sitemap` と `Host` で正規 URL を明示し、検出目的のクロールを sitemap に誘導。

### 3. sitemap.xml

- 既存の **app/sitemap.ts**（`generateSitemaps` による Sitemap Index）をそのまま利用。  
- 正規ベースは `getCanonicalBase()`（`www.fureaino-oka.com`）で統一。

---

## Phase 2: レンダリング・アーキテクチャ

### 1. サードパーティの遅延読み込み

- **app/layout.tsx**  
  - **GTM**: `<script>` 直書きをやめ、`next/script` の `strategy="afterInteractive"` で読み込み。  
  - **AdSense**: `next/script` の `strategy="lazyOnload"` で読み込み。  
- 効果: 初期 HTML とメインスレッドの負荷を減らし、WRS が JS に費やすリソースを抑制。

### 2. 重要コンテンツ・JSON-LD

- 重要コンテンツは既にサーバーコンポーネントで出力。  
- JSON-LD（EeatJsonLd・BreadcrumbList）は body 内で初期 HTML に含まれるため、クローラーが JS 実行前に取得可能。

---

## Phase 3: ログ解析・CI

### 1. Googlebot ログ解析

- **scripts/analyze-googlebot-logs.py**  
  - Nginx / Apache のアクセスログから Googlebot のみを抽出し、  
    パス別・拡張子別・ステータス別の集計と、JS 関連 URL の上位を出力。
- **scripts/analyze-googlebot-logs.sh**  
  - 上記の簡易 Bash 版（Nginx combined 想定）。

使い方の例:

```bash
# Nginx
python scripts/analyze-googlebot-logs.py /var/log/nginx/access.log

# Apache
python scripts/analyze-googlebot-logs.py /var/log/apache2/access.log --format apache

# 標準入力
cat access.log | python scripts/analyze-googlebot-logs.py --stdin
```

ここで「.js が多い」「/api/ がヒットしている」といった傾向を確認し、robots や next/script の見直しに利用する。

### 2. Lighthouse CI

- **.github/workflows/lighthouse-ci.yml**  
  - `main` / `master` への push、または PR で、ビルド後にローカルサーバーを立ち上げ、Lighthouse CI を実行。  
- **.lighthouserc.json**  
  - 対象: `/`, `/dispose`, `/area`。  
  - カテゴリ: performance, seo, best-practices。  
  - 閾値: SEO は 0.9 以上を必須、performance / best-practices は警告レベルでスコアを監視。

デプロイ後の品質悪化を防ぐための継続的なチェックとして利用する。

---

## 運用時の注意

1. **正規ドメイン**  
   - Vercel の Domains で「メイン」を 1 つに固定し、`NEXT_PUBLIC_SITE_URL`（または `NEXT_PUBLIC_BASE_URL`）と `app/lib/site-url.ts` を一致させる。
2. **robots**  
   - `/api/` 以外にブロックしたいパスを増やした場合は、`app/robots.ts` の `disallow` に追加する。
3. **ログ**  
   - 本番の Nginx/Apache でログが有効であれば、定期的に `analyze-googlebot-logs.py` を回し、無駄なクロールの有無を確認する。

以上が、GSC クロール統計に基づく今回の最適化の実施内容です。
