# Google Indexing API 有効化＆権限付与 手順

> 2026-06-01 状況:
> ✅ Indexing API 有効化済（プロジェクト `seizenseiri-497212`）
> ❌ Search Console のサイト所有権 にサービスアカウント未追加 → 「Permission denied. Failed to verify the URL ownership.」エラー
>
> あと **Search Console での権限付与1ステップ** で完了です。

---

## 🚨 残り1ステップ：Search Console で所有者追加（3分）

### ① Search Console を開く

👉 https://search.google.com/search-console

### ② 「fureaino-oka.com」プロパティを選択

### ③ 左下「設定」→「ユーザーと権限」

### ④ 右上「ユーザーを追加」をクリック

### ⑤ 以下を入力

| 項目 | 値 |
|---|---|
| メールアドレス | **`analytics-reader@seizenseiri-497212.iam.gserviceaccount.com`** |
| 権限 | **オーナー（所有者）** ※必ず「オーナー」を選択。「フル」では足りない |

### ⑥ 「追加」をクリック

完了したらお知らせください。即座に `npm run index:run` を再実行し、**100記事 + 96補助金LP = 200URLをGoogleへ即時通知**します。

---

## なぜ「所有者」権限が必要か

Indexing API は「あなたが所有しているサイトの URL のみ」通知を受け付けます。Search Console での **所有者権限の付与** が、サービスアカウントが API 経由でそのドメインを更新する正当性の証明になります。

「フル」「制限付き」では不可。**必ず「オーナー」** を選択してください。

---

## 完了後の効果

| 状態 | 通常 | Indexing API 有効後 |
|---|---|---|
| 新規記事のクロール | 数日〜数週間 | **数時間〜2日** |
| インデックス登録 | 〜2週間 | **〜3日** |
| GSC「Search Performance」反映 | 〜1ヶ月 | **〜1週間** |

**100記事を週末に一気投入した直後の状況で、Indexing API は最大の効果を発揮します。**

---

## 補足：Indexing API の制限事項

Google は公式には Indexing API を「Job Posting / Live Streaming Events」の用途に限定していますが、**実運用上は一般Webページに対しても通る**ケースが多数報告されています。

万一「サービス利用が承認されない」というメールが届いた場合の代替策：

1. **Search Console での個別URL登録**（手動）
   - URL検査ツールで「インデックス登録をリクエスト」（1日10件程度の制限）

2. **sitemap.xml の即時通知**（実装済）
   - GSC「サイトマップ」セクションで `/sitemap.xml` を再送信

3. **記事URLをXで投稿**（自然なクロール誘導）
   - X (@fureaino_oka) 経由で記事URLが拡散 → Googlebot が訪れる確度UP

---

## 関連ファイル

- `scripts/google-indexing-api.ts` — 実行スクリプト
- `scripts/lib/collect-sitemap-urls.ts` — URL収集ロジック（2026-06-01 記事最優先化）
- `credentials/google-indexing-key.json` — サービスアカウント認証（gitignore済）
- `logs/indexing-status.json` — 送信履歴
- `logs/indexing-status.json.bak-20260601` — 1回目エラー時のバックアップ
- `logs/indexing-status.json.bak2-20260601` — 2回目エラー時のバックアップ
- `logs/indexing-report.csv` — 監査用送信ログ

---

## 次回からの定常運用

権限付与完了後は、以下を **毎週月曜の朝** に実行する運用を推奨：

```bash
npm run index:run
```

- 1日200件のクォータ内で、優先度（記事 > 補助金LP > その他）順に自動送信
- 30日以上前に送信したURLは自動で再送信対象に
- 送信ログは `logs/indexing-report.csv` に蓄積（M&A時の活動エビデンスとして有用）
