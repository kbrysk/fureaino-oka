# Gemini→CMS 前提での改善提案（契約ツールスタック準拠）

**前提**: 以下の 4 ツールで運用する（PDF「Gemini→CMS 前提での契約ツール（再まとめ）」に準拠）。

| # | ツール | 用途 | プラン | 目安コスト（年） |
|---|--------|------|--------|------------------|
| 1 | **Vercel** | ホスティング・デプロイ | Pro | 約36,000円 |
| 2 | **microCMS** または **Sanity** | CMS（記事管理） | Hobby / Free | 0円（500記事以上なら Sanity Free 推奨） |
| 3 | **Supabase** | DB・Auth（リード・イベント） | Free | 0円 |
| 4 | **Resend** | メール・PDF送付 | Free | 0円 |

**合計（年間）**: 約 36,000円（Vercel Pro のみ。他は無料枠）。

---

## 1. 契約・登録の流れ（変更点の整理）

- **CMS の位置づけ**: 「記事を CMS 化する場合」ではなく、**常に必須**。Gemini の出力を追加する先として CMS（microCMS or Sanity）を必ず契約する。
- 契約順: Vercel → microCMS または Sanity → Supabase → Resend（いずれもアカウント作成・キー取得）。詳細は `docs/TECH_STACK_ALTERNATIVES_M&A_GROWTH.md` の「別途新規で契約すべきツール一覧」を参照。

---

## 2. コード・ドキュメントの改善提案（優先度順）

### 高：Resend でガイドブック PDF 自動送信を実装する

**現状**: `/api/lead` は Supabase にリードを保存するのみ。登録者への「ガイドブック PDF をメールで送る」処理は未実装。

**やること**:

1. Resend の API キーを環境変数 `RESEND_API_KEY` に設定。
2. `POST /api/lead` 内で、Supabase 保存成功後、`source === "guidebook"` のときだけ **Resend API** を呼び出す。
3. 送信内容: 登録メールアドレス宛に、件名・本文＋**PDF添付**（ガイドブック PDF の URL またはバイナリ）。Resend の「Attachments」で PDF を添付。
4. 送信元アドレスは Resend のドメイン認証済みアドレスを使う。

**参照**: `docs/TECH_STACK_ALTERNATIVES_M&A_GROWTH.md` の「ガイドブック登録者へのメール・PDF自動送付」に記載済み。実装後は「登録しました」画面の文言を「メールでお送りしました」に合わせて問題ないか確認する。

---

### 高：記事取得を CMS 対応にできるよう adapter 層を用意する

**現状**: `app/lib/articles.ts` は `content/articles/index.json` と `content/articles/{slug}.json` のファイル読み込みのみ。

**やること**:

1. **記事データ取得のインターフェースを抽象化**  
   - `getArticlesIndex()` / `getArticleBySlug(slug)` の実装を、「ファイル読み」と「CMS API 呼び出し」で切り替え可能にする。
2. **環境変数で取得元を切り替え**  
   - 例: `CMS_SOURCE=file` のときは現状のファイル読み、`CMS_SOURCE=microcms` または `sanity` のときは CMS から取得。
3. **CMS 側のスキーマを現行の ArticleMeta に合わせる**  
   - slug, title, description, category, date, body, eyecatch, images, **owlMessages**（配列）, tags。  
   - LINE 誘導はテンプレート側固定のため CMS には持たせない（`docs/CMS-ARTICLE-INTEGRATION.md` の方針どおり）。
4. **microCMS 用**: API エンドポイント・API キーを env に持ち、一覧・単体取得を fetch で実装。  
5. **Sanity 用**: Project ID・Token を env に持ち、GROQ で一覧・単体取得を実装。

**効果**: Gemini で作成した記事を CMS に追加するだけで、サイトに反映される。Cursor では記事本文を編集せず、CMS から取得して表示するだけに統一できる。

---

### 中：本番で Supabase を必須と明記する

**現状**: `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` が未設定のときはリードが保存されずログのみ。本番では必須であることが README 等に明記されていない可能性がある。

**やること**:

1. **README または `docs/DEPLOYMENT-GUIDE.md`** に「本番では Supabase のテーブル作成と環境変数設定が必須。未設定だとリードは保存されない」と追記。
2. **テーブル作成用 SQL** をリポジトリに含める（`docs/ARCHITECTURE_AND_ROADMAP.md` の `leads`、`docs/PSEO_AND_PLG_ROADMAP.md` の `lead_events` を参照）。`docs/supabase-schema.sql` のような 1 ファイルにまとめてもよい。
3. デプロイ前チェックリストに「Supabase 環境変数設定済み」「`leads` / `lead_events` テーブル作成済み」を追加。

---

### 中：環境変数一覧を「このスタック」用にまとめる

**やること**:

1. **`.env.example`**（または `docs/ENV_EXAMPLE.md`）に、この 4 ツール前提の変数一覧を記載する。
   - `NEXT_PUBLIC_SITE_URL`（本番ドメイン）
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`（実装後）
   - CMS 用: `MICROCMS_API_KEY` と `MICROCMS_SERVICE_DOMAIN` または、Sanity の `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN` など
   - （任意）`CMS_SOURCE=file|microcms|sanity`
2. 各変数の「どこで取得するか」「本番必須か」を 1 行ずつコメントで書く。

---

### 低：CMS 選定が Sanity の場合のスキーマ・GROQ 例をドキュメント化

**やること**:

- Sanity を選ぶ場合、**Article** のスキーマ例（slug, title, description, category, date, body, eyecatch, images, owlMessages, tags）と、一覧・単体取得の **GROQ クエリ例** を `docs/CMS_DESIGN_AND_OPTIONS.md` または新規 `docs/SANITY_SCHEMA_EXAMPLE.md` に記載する。
- 既存の `content/articles/*.json` を Sanity にインポートするスクリプトの概要（どのフィールドをマッピングするか）を書いておくと、移行時が楽になる。

---

## 3. 運用フロー（Gemini → CMS）の確認

| 役割 | やること | ツール |
|------|----------|--------|
| 記事の企画・執筆 | ディープリサーチ → 骨子 → 本文（＋必要なら owlMessages） | **Gemini** |
| 記事の保存・公開 | 本文を CMS に登録・公開 | **microCMS または Sanity**（管理画面に貼り付け or API で一括投入） |
| サイト表示・リード・メール | 表示、リード保存、ガイドブック PDF 送付 | **Next.js（Vercel）＋ Supabase ＋ Resend** |

- **LINE 誘導・フクロウの相槌**: 記事本文には含めない。LINE はテンプレート固定、相槌は CMS の `owlMessages` で指定するか、未指定時はサイト側デフォルト（`docs/CMS-ARTICLE-INTEGRATION.md` および `.cursor/rules/cms-article-integration.mdc` を参照）。

---

## 4. チェックリスト（このスタックで公開するまで）

- [ ] Vercel Pro・microCMS または Sanity・Supabase・Resend の 4 つを契約・登録済み
- [ ] 本番環境変数がすべて設定されている（`NEXT_PUBLIC_SITE_URL`, Supabase, Resend, CMS）
- [ ] Supabase に `leads`（および必要なら `lead_events`）テーブルを作成済み
- [ ] `/api/lead` にテスト送信し、Supabase に保存されることを確認
- [ ] ガイドブック登録後、Resend で PDF 送信が動くことを確認（Resend 実装後）
- [ ] 記事取得を CMS から行う場合、`CMS_SOURCE` と CMS 用 env を設定し、一覧・詳細が表示されることを確認

このドキュメントは、PDF「Gemini→CMS 前提での契約ツール（再まとめ）」を前提とした改善提案です。実装の詳細は各ドキュメント（TECH_STACK、ARCHITECTURE、CMS-ARTICLE-INTEGRATION 等）を参照してください。
