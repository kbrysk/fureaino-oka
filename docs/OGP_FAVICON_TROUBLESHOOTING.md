# OGP・ファビコンが取得できない場合の原因と対策

## 想定される原因

1. **メタタグが絶対URLでない**
   - 相対URL（`/opengraph-image`）のままでは、SNSクローラーやOGP確認ツールが解決に失敗することがある。
   - **対策**: `og:image`・`og:url`・ファビコンの `href` はすべて絶対URL（`https://www.fureaino-oka.com/...`）で出力する。

2. **ビルド時の origin が本番ドメインと異なる**
   - Vercel などで `VERCEL_URL` がプレビューURLになっていると、メタデータの URL が本番とずれる。
   - **対策**: メタデータ用の origin は `NEXT_PUBLIC_SITE_URL` またはフォールバックで常に `https://www.fureaino-oka.com` を使う。

3. **Next.js の metadata のみに依存している**
   - ファイル規約や metadata のマージ順で、一部ツールがタグを認識しない可能性がある。
   - **対策**: `<head>` 内に `<meta property="og:image">` や `<link rel="icon">` を明示的に記述する。

4. **動的 OGP 画像ルートの失敗**
   - Vercel 等のサーバーレスでは `public/` への `readFile` が ENOENT になることがあり、`/opengraph-image` が 500 や空になる。
   - **対策**: 動的ルートを使わず、**静的画像**を使う。`scripts/generate-ogp-image.mjs` で `public/opengraph-image.png` を生成し、`og:image` の URL を `/opengraph-image.png` にしている。

5. **ファビコンがファイル規約だけに依存**
   - `app/icon.png` は Next.js が `/icon` として提供するが、キャッシュや環境で効かないことがある。
   - **対策**: `<link rel="icon" href="絶対URL/icon">` を head に明示的に追加する。

## 本番で推奨する環境変数

- `NEXT_PUBLIC_SITE_URL=https://www.fureaino-oka.com`  
  （末尾スラッシュなし）

## 確認方法

- ブラウザで https://www.fureaino-oka.com/ を開き、開発者ツールの「要素」で `<head>` 内の `og:image`・`link rel="icon"` を確認する。
- 「ページのソースを表示」で、上記メタ・link が絶対URLで含まれているか確認する。
- OGP確認ツールで再度URLを入力し、デプロイ反映後・キャッシュクリア後に確認する。
