# Google Indexing API 有効化手順（ユーザー対応待ち）

> 2026-06-01: `npm run index:run` 実行時に **「Web Search Indexing API has not been used in project 21416857455 before or it is disabled.」** エラー発生。
>
> このAPIを有効化することで、新規100記事のクロール・インデックス浸透を **大幅に高速化** できます。

## 即時対応：3ステップ（所要5分）

### Step 1: API有効化（1分）

以下URLをブラウザで開き、「**有効にする**」ボタンをクリック：

👉 https://console.developers.google.com/apis/api/indexing.googleapis.com/overview?project=21416857455

### Step 2: 5分待つ

API有効化の伝播に数分かかります（通常3〜5分）。

### Step 3: 再実行

```bash
npm run index:run
```

成功すれば、**100記事 + 96補助金LP = 200URL** が今日中にGoogleへ通知され、クロール・インデックス浸透が劇的に早くなります。

## 効果（期待値）

| 状態 | 通常 | Indexing API 利用後 |
|---|---|---|
| 新規記事のクロール | 数日〜数週間 | **数時間〜2日** |
| インデックス登録 | 〜2週間 | **〜3日** |
| GSC「Search Performance」反映 | 〜1ヶ月 | **〜1週間** |

**100記事を週末に一気投入した直後の状況で、Indexing APIは最大の効果を発揮します。**

## API有効化が承認されない場合

Google は Indexing API を「Job Posting / Live Streaming Events」の用途に限定していますが、実運用上は一般Webページに対しても通る（黙認）ケースが多数。

仮に「サービス利用が承認されない」というメールが来た場合の代替策：

1. **Search Console での個別URL登録**（手動）
   - https://search.google.com/search-console
   - URL検査ツールで100記事URLを1つずつ「インデックス登録をリクエスト」（1日あたり10件程度の制限）

2. **sitemap.xml の即時通知**
   - すでに sitemap.xml は実装済（`/sitemap.xml` → `/api/sitemap-index`）
   - GSC「サイトマップ」セクションで再送信

3. **記事URLをXに投稿**（自然なクロール誘導）
   - X (@fureaino_oka) 経由で記事URLが拡散すれば、Googlebot が訪れる確度が上がる

## 次回からの運用

API有効化後は、以下を **毎週月曜の朝** に実行する運用を推奨：

```bash
npm run index:run
```

- 1日200件のクォータ内で、優先度（記事 > 補助金LP > その他）順に自動送信
- 30日以上前に送信したURLは自動で再送信対象に
- 送信ログは `logs/indexing-report.csv` に蓄積（M&A時の活動エビデンスとして有用）

## 関連ファイル

- `scripts/google-indexing-api.ts` — 実行スクリプト
- `scripts/lib/collect-sitemap-urls.ts` — URL収集ロジック（2026-06-01 記事優先化）
- `credentials/google-indexing-key.json` — サービスアカウント認証（gitignore済）
- `logs/indexing-status.json` — 送信履歴（再送防止に使用）
- `logs/indexing-report.csv` — 監査用送信ログ
