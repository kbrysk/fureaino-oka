# 生前整理ナビ：M&A 3,000万円達成の全体設計

**目標**: 1年以内に評価額3,000万円での事業売却（M&A）  
**前提**: Next.js (App Router), Tailwind CSS, TypeScript  
**方針**: 買い手が「即収益化できる」と判断する、美しく拡張性の高い設計。PV→リード→送客の最短ルート。

---

## 0. 戦略の順序（何を先に作るか）

**まず「1本のルート」を完成させてから、他を増やす。**

| 順番 | やること | 目的 |
|------|----------|------|
| **1** | **生前整理系のSEO記事** でトラフィックを集める | 検索流入の土台 |
| **2** | **この生前整理ナビ**（ホーム・記事）でリード獲得（無料PDF・メール登録） | Zero-Party Data の蓄積 |
| **3** | 獲得したリードを **アフィに流す**（見積もり・買取・査定等の導線） | 即収益化・数字の見える化 |
| **4** | 上記が回り始めてから **他ツール**（空き家シミュ・査定ツール等）や別導線を増やす | 収益の掛け算・M&A用の差別化 |

- いきなりツールをたくさん作るより、**「記事 → リード獲得 → アフィ」の1本を確実に動かす**方が早い。
- モックアップのとおり、**ホームの「完全ガイドブック（無料PDF）」CTA** と **記事からの回遊・CTA** を軸にし、その後にツール群を足していく。

---

## 1. 最強ディレクトリマップ（フォルダ構成）

```
seizenseiri/
├── app/
│   ├── layout.tsx                 # ルートレイアウト（メタ・フォント・ナビ）
│   ├── page.tsx                   # ホーム（既存）
│   ├── globals.css
│   │
│   ├── (marketing)/               # オプション: ランディング用グループ
│   │   └── lp/
│   │       └── page.tsx           # キャンペーンLP用（必要時）
│   │
│   ├── articles/                  # ★ オウンドメディア（SEO記事）
│   │   ├── page.tsx               # 記事一覧（カテゴリフィルタ・ページネーション）
│   │   ├── [slug]/
│   │   │   └── page.tsx           # 個別記事（generateStaticParams + MD/MDX or CMS）
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx       # カテゴリ一覧（親・進め方・処分・資産・デジタル等）
│   │
│   ├── tools/                     # ★ 高収益Webツール群
│   │   ├── page.tsx               # ツール一覧（シミュレーター・査定等の入口）
│   │   ├── empty-house-tax/       # 空き家税金シミュレーター（最優先）
│   │   │   └── page.tsx
│   │   ├── appraisal/             # 資産・不動産査定の目安（リード獲得）
│   │   │   └── page.tsx
│   │   └── checklist-preview/     # チェックリスト体験版（既存機能への導線）
│   │       └── page.tsx
│   │
│   ├── guide/                     # 既存
│   ├── checklist/                 # 既存
│   ├── assets/                    # 既存
│   ├── ending-note/               # 既存
│   ├── settings/                  # 既存
│   │
│   ├── api/                       # ★ リード蓄積・送客計測
│   │   ├── lead/
│   │   │   └── route.ts           # POST: メール登録・ツール結果送信（Zero-Party）
│   │   ├── estimate/
│   │   │   └── route.ts           # POST: 見積もり申込（送客連携）
│   │   └── health/
│   │       └── route.ts          # GET: 死活監視
│   │
│   ├── components/                # 共通UI
│   │   ├── Navigation.tsx         # 既存（/articles, /tools を追加）
│   │   ├── ContextualCTABanner.tsx
│   │   ├── EmailCTA.tsx
│   │   ├── AppraisalModal.tsx
│   │   ├── ArticleCard.tsx        # 新規: 記事カード（内部リンク・OGP）
│   │   ├── InternalLinkList.tsx   # 新規: 記事内「関連リンク」自動表示
│   │   └── ToolCTA.tsx            # 新規: 記事→ツール/見積もりCTA
│   │
│   └── lib/
│       ├── storage.ts             # 既存（クライアント localStorage）
│       ├── types.ts               # 既存
│       ├── articles.ts            # 新規: 記事メタ取得・slug一覧（内部リンク用）
│       ├── internal-links.ts     # 新規: カテゴリ別関連記事・ツールリンク
│       └── lead.ts                # 新規: リード送信ヘルパー（API呼び出し）
│
├── content/                       # ★ 記事コンテンツ（量産体制）
│   ├── articles/
│   │   ├── index.json             # slug, title, category, date, description 一覧
│   │   ├── [slug].json            # 本文付き（例: example.json）。index と併用
│   └── *.mdx                  # 将来: MDX に移行可（1記事1ファイル）
│   └── internal-links.json       # カテゴリ→関連記事slug・ツールURL
│
├── public/
│   ├── og/                        # OGP画像（記事用は動的生成も可）
│   └── ...
│
├── docs/                          # 戦略・運用
│   ├── ARCHITECTURE_AND_ROADMAP.md # 本ドキュメント
│   ├── M&A_KEYWORD_STRATEGY_AND_NAMING.md  # M&A用キーワード4フェーズ・ネーミング
│   ├── SEO_CONTENT_STRATEGY.md
│   ├── SEO_ARTICLE_BRIEF_TEMPLATE.md
│   ├── seo-keywords.csv           # フェーズ・CV先付きキーワード一覧
│   ├── DD_IMPROVEMENTS_APPLIED.md
│   ├── DEPLOY_AND_DOMAIN.md       # デプロイ・ドメイン手順
│   ├── PSEO_AND_PLG_ROADMAP.md    # pSEO垂直展開・PLGループ・リードスコア（S/A/B）・lead_events SQL
│   └── PROGRAMMATIC_SEO_SCHEMA.md # 地域×粗大ゴミ・補助金・相場のCSVスキーマ
│
├── .cursor/
│   └── rules/
│       └── seo-article.mdc
│
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 設計のポイント

| 観点 | 対応 |
|------|------|
| **M&A評価** | `/tools` で「即収益化できるツール」、`/api/lead` で Zero-Party Data を明示。コードはレイヤー分離（lib, api, components）で引き継ぎ容易。 |
| **SEO・CWV** | 記事は `app/articles/[slug]/page.tsx` で SSG/ISR。画像は `next/image`、フォントは `next/font` で CWV 満点を狙う。 |
| **記事量産** | `content/articles/*.mdx` + `index.json` で Cursor/CI から一括生成しやすく、`/articles` と `/tools` を分離してルーティングを安定させる。 |
| **PV→CV** | 記事・ホームから「無料PDF」「見積もり」等のCTAでリード獲得 → アフィ導線。その後ツール別CTAを追加。 |

---

## 2. 最速で実装すべき機能リスト（優先順位）

**方針**: まず「SEO記事 → 生前整理ナビでリード獲得 → アフィに流す」の1本を完成させる。ツールはその後に増やす。

### Phase 0：サービスを形にする（1〜2週間）

| # | 機能 | 概要 | 成果物 |
|---|------|------|--------|
| 1 | **記事ルート** | 記事一覧・個別記事の骨組み | `app/articles/page.tsx`, `app/articles/[slug]/page.tsx` |
| 2 | **記事コンテンツ基盤** | 1本は手書きでテンプレ確定 | `content/articles/index.json`, `content/articles/[slug].json` |
| 3 | **ナビに「記事」追加** | 記事への回遊・SEO | `Navigation.tsx` に `/articles`（ツールは後でも可） |
| 4 | **ホームのリード獲得** | 無料PDF CTA（モックアップ通り）を確実に表示 | 既存 `EmailCTA` をホームに配置済み。API と接続する |

### Phase 1：1本のルートを完成させる（2〜4週間）

| # | 機能 | 概要 | 成果物 |
|---|------|------|--------|
| 5 | **リードAPI + 保存先** | メール登録をサーバーに保存（Zero-Party Data） | `app/api/lead/route.ts` + DB（Vercel Postgres / Supabase / Airtable 等） |
| 6 | **メール登録→API 接続** | ホーム・記事の「無料で受け取る」で API を叩く | `EmailCTA` から `POST /api/lead` を呼ぶ |
| 7 | **アフィ導線の設置** | リード獲得後 or 記事内で「見積もり」「買取」等へ誘導 | 専用ページ or 記事フッターの CTA・バナー |
| 8 | **記事→ホーム/リードCTA** | 全記事で「チェックリスト」「無料ガイド」へリンク | 記事レイアウトに CTA コンポーネントを組み込み |

### Phase 2：記事量産・トラフィック拡大（1〜2ヶ月）

| # | 機能 | 概要 | 成果物 |
|---|------|------|--------|
| 9 | **記事を増やす** | キーワード表に沿って週3〜4本ペースで追加 | `content/articles` に slug 追加、Cursor で下書き量産 |
| 10 | **内部リンク・カテゴリ** | 記事同士・記事→ホームのリンクを最適化 | `internal-links.json`, 記事フッターの関連リンク |
| 11 | **OGP・メタの統一** | 記事用 generateMetadata、OG画像 | `app/articles/[slug]/page.tsx` の metadata |
| 12 | **サイトマップ** | 記事一覧の sitemap.xml | `app/sitemap.ts` |

### Phase 3：ツール・別導線を増やす（ルートが回ってから）

| # | 機能 | 概要 | 成果物 |
|---|------|------|--------|
| 13 | **ツール一覧ページ** | ツール群の入口（中身は後から追加） | `app/tools/page.tsx` |
| 14 | **空き家税金シミュ** | 入力→維持費目安。リード取得オプション | `app/tools/empty-house-tax/page.tsx` |
| 15 | **資産・査定ツール** | 査定の目安＋見積もり申込 | `app/tools/appraisal/page.tsx` |
| 16 | **見積もり申込API** | 申込を保存・提携先へ通知 | `app/api/estimate/route.ts` |
| 17 | **管理用ダッシュボード** | リード数・ソース別の確認（M&A用） | 別ルート or スプレッドシート連携 |

---

## 3. 技術選定（確定）

| 項目 | 選定 | 理由 |
|------|------|------|
| FW | Next.js 16 (App Router) | 既存。SSG/ISR、API Routes、CWV に有利。 |
| UI | Tailwind CSS 4 | 既存。速度・一貫性。 |
| 言語 | TypeScript | 既存。保守性・M&A時の説明が容易。 |
| 記事 | MDX または Markdown | 量産・バージョン管理しやすい。`content/articles` で一元管理。 |
| リード保存 | Vercel Postgres / Supabase / Airtable | 運用コスト低・スキーマ明確なら買い手に説明しやすい。 |
| ホスティング | Vercel | デプロイ・プレビュー・Edge が最短。 |
| ドメイン | お名前.com / エックスサーバー等 | 取得のみ。DNS を Vercel 向けに設定。 |

---

## 4. データベース設計（リード・Zero-Party Data）

買い手が「顧客リストの価値」を即判断できるよう、**1テーブルで完結**を推奨。

### 推奨テーブル: `leads`

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID / ulid | 主キー |
| email | string | 必須。メール登録・PDF申込等 |
| name | string (optional) | 名前 |
| source | string | 流入元: `article`, `tool_empty_house_tax`, `tool_appraisal`, `estimate`, `home_cta` 等 |
| source_slug | string (optional) | 記事の slug やツール識別子 |
| payload | jsonb (optional) | ツール結果（空き家シミュ結果）、査定希望内容など |
| consented_at | timestamp | 同意日時（GDPR/個人情報保護） |
| created_at | timestamp | 登録日時 |

- **インデックス**: `email`, `source`, `created_at`  
- **運用**: エクスポートは CSV/スプレッドシート連携で「月間リード数・ソース別」をダッシュボード化し、DD 用資料に使う。

### Supabase で `leads` テーブルを作る

Supabase ダッシュボード → SQL Editor で以下を実行する。

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  source text not null default 'home_cta',
  source_slug text,
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_leads_email on public.leads (email);
create index if not exists idx_leads_source on public.leads (source);
create index if not exists idx_leads_created_at on public.leads (created_at);
alter table public.leads enable row level security;
create policy "Service role can do all" on public.leads for all using (true);
```

環境変数に `NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を設定すると、`POST /api/lead` がここに保存する。

---

## 5. 内部リンク・ドメインパワー最適化

- **記事 → 記事**: 同カテゴリから 2〜3 本を `internal-links.json` または記事メタで指定し、`InternalLinkList` で表示。  
- **記事 → ツール**: カテゴリに応じて「空き家」「査定」「チェックリスト」のいずれかを `ToolCTA` で表示。  
- **ツール → 記事**: ツールページ下部に「関連コラム」で該当カテゴリ記事 2 本リンク。  
- **サイト内リンク**: ヘッダー・フッターで `/articles`, `/tools`, `/guide`, `/checklist` を必ず露出。

これで**少ない記事数でもドメインパワーを分散させず、重要ページにリンクを集約**できる。

---

## 6. 次のアクション（今すぐやること）

**1本のルート（記事 → リード獲得 → アフィ）を先に完成させる。**

1. **記事基盤**: 既に `app/articles`, `content/articles` はある。**1本目の記事を増やす**（キーワード表の Phase 1 から選び、ブリーフで下書き→公開）。  
2. **リードAPI**: `app/api/lead/route.ts` で POST 受付（email, source 等）、保存先（Vercel Postgres / Supabase / Airtable）を決めて接続。  
3. **メール登録をAPIに繋ぐ**: ホームの「無料で受け取る」送信時に `POST /api/lead` を呼び、localStorage だけでなくサーバーに保存する。  
4. **アフィ導線**: リード獲得後のサンクスページ or メール内で「見積もりを取る」「買取の相談」等のリンクを設置。記事フッターにも同じCTAを入れる。  
5. **ツール**: 上記が動いてから、空き家シミュ・査定ツール等を追加する。

デプロイ・ドメイン取得の具体的な手順は `docs/DEPLOY_AND_DOMAIN.md` に記載する。
