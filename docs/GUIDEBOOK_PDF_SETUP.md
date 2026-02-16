# ガイドブック「メールでPDFを受け取る」の設定手順

ガイドブックページ（`/guidebook`）でメール登録した方に、実際にPDFをメールで送るための設定です。

---

## 1. やること一覧

| 順番 | やること | 詳細 |
|------|----------|------|
| 1 | Resend アカウント作成 | [resend.com](https://resend.com) でサインアップ |
| 2 | API キー取得 | ダッシュボード → API Keys → Create API Key |
| 3 | 送信元ドメイン認証（本番用） | 自ドメイン（例: fureaino-oka.com）でメールを送る場合はドメイン認証が必要 |
| 4 | 環境変数を設定 | Vercel / 本番環境に `RESEND_API_KEY` と（任意）`RESEND_FROM_EMAIL` を追加 |
| 5 | PDF を配置 | ガイドブックPDFを `public/guidebook/jikka-jimai-complete-guide.pdf` に置く |

---

## 2. Resend の設定

### 2.1 アカウントと API キー

1. [resend.com](https://resend.com) にアクセスし、アカウントを作成する。
2. ログイン後、**API Keys** から **Create API Key** をクリック。
3. 名前（例: `production`）を付けてキーを発行する。**表示されるキー（`re_xxxxx`）は一度しか表示されないのでコピーして保管する。**

### 2.2 送信元メールアドレス

- **テスト時**: 環境変数を設定しなければ、送信元は `onboarding@resend.dev` が使われます（Resend のテスト用。届かない場合もあるので本番では自ドメインを推奨）。
- **本番**: 自ドメイン（例: `noreply@fureaino-oka.com`）で送る場合:
  1. Resend ダッシュボードで **Domains** → **Add Domain** で `fureaino-oka.com` を追加。
  2. 表示される **DNS レコード**（SPF, DKIM など）を、ドメインの DNS 設定に追加する。
  3. 認証が完了したら、送信元として `〇〇 <noreply@fureaino-oka.com>` のように指定できる。

---

## 3. 環境変数

Vercel の **Project → Settings → Environment Variables** で次を設定する。

| 変数名 | 必須 | 説明 | 例 |
|--------|------|------|-----|
| `RESEND_API_KEY` | ✅ | Resend の API キー | `re_xxxxxxxxxx` |
| `RESEND_FROM_EMAIL` | 任意 | 送信元表示名とアドレス | `生前整理支援センター ふれあいの丘 <noreply@fureaino-oka.com>` |

`RESEND_FROM_EMAIL` を省略した場合は `onboarding@resend.dev` が使われます。

---

## 4. PDF の配置

1. ガイドブックの **PDF ファイル** を用意する。  
   - 現在のテキストは `content/guidebook/jikka-jimai-complete-guide.md` にあります。  
   - Word / Google Docs / Markdown→PDF ツールなどで PDF に変換し、ファイル名を **`jikka-jimai-complete-guide.pdf`** にする。
2. プロジェクト内の **`public/guidebook/`** フォルダに、その PDF を配置する。  
   - パス: `public/guidebook/jikka-jimai-complete-guide.pdf`
3. デプロイ後、メール登録するとこの PDF が添付されて送信されます。  
   - PDF を置いていない場合は、メール本文のみ送られ、ウェブで読むリンクが含まれます。

---

## 5. 動作の流れ

1. ユーザーが `/guidebook` でメールアドレスを入力し「無料で受け取る」を押す。
2. `POST /api/lead` が呼ばれ、`source: "guidebook"` でリードが保存される（Supabase が設定されていれば）。
3. **Resend** が有効（`RESEND_API_KEY` が設定されている）場合:
   - `public/guidebook/jikka-jimai-complete-guide.pdf` が存在すれば、その PDF を添付してメール送信。
   - 存在しなければ、添付なしで「ウェブで読むリンク」のみのメールを送信。

---

## 6. 確認方法

- **Resend ダッシュボード**: Emails タブで送信履歴と開封状況を確認できる。
- **テスト**: 本番またはステージングで、自分のメールアドレスでガイドブック登録し、PDF付きメールが届くか確認する。

---

## 参照

- 実装: `app/api/lead/route.ts`（`source === "guidebook"` 時の Resend 呼び出し）
- スタック概要: `docs/GEMINI_CMS_STACK_IMPROVEMENTS.md`「Resend でガイドブック PDF 自動送信」
