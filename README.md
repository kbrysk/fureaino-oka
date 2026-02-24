This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 地域データの収集ワークフロー（無料AI利用）

全国4,000市区町村の「空き家補助金」「粗大ゴミ」データを、**外部API課金なし**で収集するためのCLIです。ブラウザの無料版AI（ChatGPT / Claude 等）にコピペするプロンプトを生成し、AIが出力したJSONを既存データにマージします。

### 前提

- データ本体は `app/lib/data/municipalities.json` で管理しています。
- `scripts/manage-data.mjs` は Node.js 標準の `fs` / `path` のみ使用（追加npmパッケージ不要）。

### 手順（AIへのコピペ〜マージまで）

1. **プロンプト生成**
   ```bash
   node scripts/manage-data.mjs prompt "北海道" "札幌市, 函館市, 旭川市"
   ```
   - 都道府県と市区町村リスト（カンマ区切り）を指定します。
   - ターミナルに Markdown プロンプトが出力され、同時に `scripts/generated-prompt.md` に保存されます。

2. **無料AIへコピペ**
   - `scripts/generated-prompt.md` の内容をすべてコピーし、ブラウザの ChatGPT や Claude などに貼り付けて送信します。
   - 「自治体公式を検索し、MunicipalityData 型に合うJSON配列だけを出力する」指示が含まれています。

3. **AIの出力を保存**
   - AIが返した **JSON配列だけ**（マークダウンのコードブロック含みでも可）をコピーし、`scripts/temp.json` に保存します。

4. **既存データへマージ**
   ```bash
   node scripts/manage-data.mjs merge scripts/temp.json
   ```
   - `temp.json` を読み、`app/lib/data/municipalities.json` とマージします。
   - 同一の `prefId` + `cityId` は **上書き**、新規は **追加** されます。

5. **動作確認**
   - `npm run dev` で起動し、該当の地域補助金ページ（例: `/area/hokkaido/sapporo/subsidy`）で表示を確認してください。

### コマンド一覧

| コマンド | 説明 |
|----------|------|
| `node scripts/manage-data.mjs prompt "都道府県" "市区町村1, 市区町村2, ..."` | 無料AI用のMarkdownプロンプトを生成（`scripts/generated-prompt.md` にも出力） |
| `node scripts/manage-data.mjs merge <path-to-temp.json>` | AIが出力したJSONを `municipalities.json` にマージ |

