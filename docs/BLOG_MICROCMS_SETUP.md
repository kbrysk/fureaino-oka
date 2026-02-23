# 記事（microCMS）セットアップ — `/articles` 統合

## 1. パッケージ

以下は済みです。

- `microcms-js-sdk`
- `html-react-parser`

## 2. 環境変数

`.env.local` に追加してください。

```env
MICROCMS_SERVICE_DOMAIN=あなたのサービスID
MICROCMS_API_KEY=あなたのAPIキー（閲覧用で可）
```

- サービスID: microCMS 管理画面の「API設定」→ サービスドメイン（`.microcms.io` の前の部分）
- APIキー: 同じく「APIキー」（記事の取得のみなら閲覧用で可）

## 3. microCMS 側の API 設計

- **ブログ API 名**: `blog`（変更する場合は `app/lib/microcms.ts` の `BLOG_LIST_ENDPOINT` / `BLOG_CONTENT_ENDPOINT` を変更）
- **ブログ推奨フィールド**:
  - `id`（自動）
  - `title`（テキスト）
  - `description`（テキスト・任意・SEO用）
  - `body`（リッチエディタ / HTML）
  - `publishedAt`（日付）
  - `revisedAt`（日付・任意）
  - `thumbnail`（画像・任意）
  - `ogpImage`（画像・任意・OGP用。未設定時は thumbnail を使用）
  - `category`（コンテンツ参照・単一・`categories` API を参照）
  - `tags`（コンテンツ参照・複数・`tags` API を参照・任意）

- **カテゴリ API 名**: `categories`（`CATEGORIES_ENDPOINT`）
  - フィールド: `id`, `name`

- **タグ API 名**: `tags`（`TAGS_ENDPOINT`）
  - フィールド: `id`, `name`

一覧・カテゴリ・タグページでは `getBlogList` の `filters` で `category[equals]${categoryId}` や `tags[contains]${tagId}` により絞り込みます。型は `app/lib/microcms-types.ts` で定義しています。

## 4. 本文の「フクロウ」記法

本文 HTML 内に次の形式で記述すると、ふくろうの吹き出しコンポーネントに置換されます。

```
【フクロウ: うんうん、その通りです】
```

正規表現: `【フクロウ:\s*([^】]+)】`。括弧は全角・半角どちらでも可。

## 5. 広告枠

- **一覧**: 3番目と7番目のスロットにインフィード広告用プレースホルダーを配置（`app/articles/page.tsx` の `INFEED_AD_POSITIONS`）
- **詳細**: 各 h2 の直前に記事内広告用プレースホルダーを自動挿入（`app/components/articles/ArticleBodyContentMicroCms.tsx`）

本番ではプレースホルダーを AdSense のコードに差し替えてください。
