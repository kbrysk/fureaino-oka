# Google Indexing API 設定ガイド

844の地域ノードと176の補助金LPを Google に最速で認識させるため、Indexing API の認証を以下の3ステップで行います。

---

## 1. Google Cloud Console で API 有効化とサービスアカウント作成

1. [Google Cloud Console](https://console.cloud.google.com/) を開き、対象プロジェクトを選択（または新規作成）。
2. **「APIとサービス」→「ライブラリ」** で「**Indexing API**」を検索し、**有効にする**。
3. **「APIとサービス」→「認証情報」** を開く。
4. **「認証情報を作成」→「サービスアカウント」** を選択。
5. サービスアカウント名（例: `indexing-api-runner`）を入力し、**作成して続行**。
6. ロールは未設定のままで **続行** → **完了**。
7. 作成したサービスアカウントをクリックし、**「キー」** タブ → **「鍵を追加」→「新しい鍵を作成」**。
8. **JSON** を選び **作成**。JSON ファイルがダウンロードされます。

---

## 2. Search Console でサービスアカウントを所有者として追加

1. [Google Search Console](https://search.google.com/search-console) を開く。
2. 対象の**プロパティ**（サイト）を選択。
3. 左メニュー **「設定」**（歯車アイコン）を開く。
4. **「ユーザーと権限」** で **「ユーザーを追加」** をクリック。
5. **追加するユーザー** に、手順1で作成したサービスアカウントの**メールアドレス**を入力。  
   （形式: `xxxxx@プロジェクトID.iam.gserviceaccount.com`。JSON 内の `client_email` で確認可能。）
6. 権限は **「所有者」** を選択し、**追加** する。

> **重要**: Indexing API で URL を送信できるのは、そのプロパティの Search Console で**所有者**になっているアカウントのみです。

---

## 3. プロジェクト内に JSON キーを配置

1. プロジェクトルートに **`credentials`** フォルダを作成（存在しない場合）。
2. 手順1でダウンロードした JSON ファイルを、次のファイル名で保存する。  
   **パス**: `credentials/google-indexing-key.json`
3. このファイルは `.gitignore` で除外されているため、リポジトリにはコミットされません。本番環境や CI で使う場合は、環境に応じて安全に配置してください。

---

## 実行方法

- **Dry Run（送信せずに送信予定件数と優先度のサマリーを表示）**  
  ```bash
  npm run index:run -- --dry-run
  ```
- **本番送信（1日200件まで）**  
  ```bash
  npm run index:run
  ```

送信履歴は `logs/indexing-status.json` と `logs/indexing-report.csv` に保存され、M&A 時の資産エビデンスとして利用できます。
