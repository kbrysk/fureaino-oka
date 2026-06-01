# Indexing API OAuth方式セットアップ（5分）

> Search Console UI がサービスアカウントメール追加を拒否したため、
> OAuth方式（okubo.r.1990@gmail.com で直接認証）に切り替えます。
> 既に Search Console の「オーナー」になっている okubo.r.1990@gmail.com の権限を直接使うため、追加の所有権付与は不要です。

---

## 🚨 ユーザーが行う3ステップ（合計5分）

### ① OAuth クライアントID を作成（3分）

1. 以下を開く：
   👉 https://console.cloud.google.com/apis/credentials?project=seizenseiri-497212

2. 上部の「**+ 認証情報を作成**」→「**OAuth クライアント ID**」

3. **「同意画面を構成」が必要** と表示されたら：
   - 「**OAuth 同意画面**」をクリック
   - 「**外部**」を選択 → 「作成」
   - アプリ名: `seizenseiri-indexing`
   - ユーザーサポートメール: `okubo.r.1990@gmail.com`
   - デベロッパー連絡先: `okubo.r.1990@gmail.com`
   - 「保存して次へ」を3回押す（スコープ・テストユーザーは空でOK）
   - 「**テストユーザー**」セクションで `okubo.r.1990@gmail.com` を追加（重要）
   - 「ダッシュボードに戻る」

4. 再度「認証情報」→「+ 認証情報を作成」→「OAuth クライアント ID」

5. アプリケーションの種類: **「デスクトップアプリ」**
6. 名前: `seizenseiri-indexing-cli`
7. 「**作成**」をクリック

### ② クライアントID JSONをダウンロード（1分）

1. 作成された OAuth クライアント右側の「**ダウンロードアイコン**」⬇️ をクリック
2. JSONファイルがダウンロードされる
3. **`C:\Users\Ryosuke\Desktop\seizenseiri\credentials\google-indexing-oauth-client.json`** にリネームして保存

### ③ お知らせください（1分）

完了したら「**置いた！**」とお知らせください。私が次のことを自動実行します：

1. `npm run index:run:oauth` 実行
2. ブラウザが自動で開き、okubo.r.1990@gmail.com で認証画面が出ます
3. **「テスト中アプリ」警告**が出たら「**詳細を表示**」→「**プロジェクトに移動（安全ではありません）**」をクリック（自分で作ったアプリなので安全）
4. **「許可」** をクリック
5. ブラウザに「認証成功」と表示されたら、自動でターミナルに戻り、200URL を送信開始

---

## なぜこの方式に切り替えるか

| 方式 | 状態 |
|---|---|
| サービスアカウント | ❌ Search Console UI が拒否 |
| ユーザー OAuth | ✅ okubo.r.1990@gmail.com は既にオーナー権限あり |

サービスアカウントの「所有者として追加」は2023〜2024年頃にGoogle側で制限が厳しくなった経緯あり。OAuth方式が現在の事実上の標準。

---

## 注意

- OAuth クライアント JSONは **`credentials/`** ディレクトリ（gitignore済）に保存します。
- 取得したアクセストークン・リフレッシュトークンも `credentials/google-indexing-oauth-token.json` に保存（gitignore済）。
- 一度認証すれば、次回以降はブラウザ認証不要で自動実行できます。
