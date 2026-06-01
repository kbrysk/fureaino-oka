# Indexing API 毎日自動実行 セットアップ

> 2026-06-01: 100記事の即時インデックス促進のため、毎朝9:05に自動実行する仕組みを構築。
>
> Claude Codeセッションが開いている場合は Claude のCronで自動実行。
> Claudeを開いていない場合に備えて、Windowsタスクスケジューラ用のbatファイルも用意。

---

## 🎯 明日朝9時の確実な実行のための2重保険

### 保険①: Claude Code Cron（このセッション内）
- Job ID: `2f440f3f`
- 発火時刻: **2026-06-02 09:05**
- 動作条件: 明日朝9時にClaude Codeを開いている
- 動作内容: dry-run → 本実行 → 結果報告

### 保険②: Windowsタスクスケジューラ + batファイル
- Claudeを開いていない場合のフォールバック
- セットアップ手順は下記

---

## 🔧 Windowsタスクスケジューラ登録手順（3分・初回のみ）

### Step 1: タスクスケジューラを開く

1. Windowsキー → 「タスクスケジューラ」と入力 → 起動

### Step 2: 基本タスクの作成

1. 右側「**基本タスクの作成**」をクリック
2. **名前**: `Indexing API Daily`
3. **説明**: `ふれあいの丘 - Google Indexing API 自動実行（記事・補助金LP）`
4. 「次へ」

### Step 3: トリガー設定

1. 「**毎日**」を選択
2. 「次へ」
3. 開始: **明日（2026-06-02）09:05:00**
4. 「**毎日**」「1日ごと」のまま
5. 「次へ」

### Step 4: 操作設定

1. 「**プログラムの開始**」を選択
2. 「次へ」
3. **プログラム/スクリプト**:
   ```
   C:\Users\Ryosuke\Desktop\seizenseiri\scripts\run-indexing-api.bat
   ```
4. **開始（オプション）**:
   ```
   C:\Users\Ryosuke\Desktop\seizenseiri
   ```
   （重要：これがないと npm が見つからない場合がある）
5. 「次へ」

### Step 5: 完了

1. 「**[完了] をクリックしたとき、このタスクの [プロパティ] ダイアログを開く**」にチェック
2. 「完了」
3. プロパティダイアログで：
   - 「**ユーザーがログオンしているかどうかにかかわらず実行する**」を選択
   - 「**最上位の特権で実行する**」にチェック
   - 「**条件**」タブ → 「コンピューターを AC 電源で使用している場合のみ...」のチェックを**外す**（バッテリ駆動でも実行）
4. 「OK」
5. パスワード入力

### 動作確認

タスクスケジューラのリストで `Indexing API Daily` を右クリック → 「**実行する**」で即時テスト実行可能。
ログは `logs/indexing-cron-YYYYMMDD.log` に書き出される。

---

## 📊 ログの見方

毎日のログは以下に蓄積：
```
C:\Users\Ryosuke\Desktop\seizenseiri\logs\indexing-cron-YYYYMMDD.log
```

成功例：
```
[本実行] 200URLを送信します...
完了
  成功: 198 件、エラー: 2 件
本日 SUCCESS:198 / ERROR:2
```

エラー例（クォータ超過）：
```
[エラー詳細]
  → Quota exceeded ...
```

---

## ⚠️ 注意事項

### Indexing API のクォータ
- **200件/日（プロジェクト全体）**
- リセット時刻: **日本時間 9:00**（UTC 0時）
- 9:05実行は、リセット直後を狙う設計

### 重複送信の防止
- スクリプトは `logs/indexing-status.json` で送信履歴を管理
- 30日以内に成功送信したURLはスキップ
- ERRORは翌日自動的に再送対象

### 認証トークンの寿命
- OAuth リフレッシュトークン: `credentials/google-indexing-oauth-token.json`
- 通常は1年程度有効
- 失効したら `npm run index:run:oauth` を手動実行 → 自動的にブラウザ認証フロー起動

### 7日後の見直し
- 100記事の初期インデックス送信が完了したら、毎日実行は不要
- **6月8日頃にタスクスケジューラを停止 or 週1回に変更**を推奨
- 通常運用は「新規記事公開時に手動で `npm run index:run:oauth`」で十分

---

## 🚨 トラブルシューティング

### 「npm が見つからない」エラー
タスクスケジューラの「開始（オプション）」が空 → 上記手順 Step 4-4 を再確認

### 「.env.local がない」エラー
`C:\Users\Ryosuke\Desktop\seizenseiri\.env.local` に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が存在することを確認

### 「Permission denied」が大量に出る
Search Console での所有権が切れた可能性 → okubo.ryosuke@kogera.co.jp で再ログイン

### 「Quota exceeded」が即発生
- 同日に別ツールがIndexing API叩いた可能性
- 翌日まで待つ

---

## 関連ファイル

- `scripts/run-indexing-api.bat` — Windowsバッチ実行用
- `scripts/google-indexing-api-oauth.ts` — 本体スクリプト（OAuth版）
- `scripts/lib/collect-sitemap-urls.ts` — URL収集（記事Top優先）
- `credentials/google-indexing-oauth-client.json` — OAuthクライアント設定
- `credentials/google-indexing-oauth-token.json` — リフレッシュトークン
- `logs/indexing-status.json` — 送信履歴
- `logs/indexing-report.csv` — 監査用ログ
- `logs/indexing-cron-YYYYMMDD.log` — タスクスケジューラ実行ログ
