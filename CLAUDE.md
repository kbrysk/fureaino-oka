# CLAUDE.md

このリポジトリで作業する際のガイド。Cursor（`.cursor/rules`）から移行した内容を含む。

## プロジェクト概要

**生前整理支援センター ふれあいの丘**（コードネーム: seizenseiri）。生前整理・実家じまい・空き家／解体補助金・粗大ゴミ情報を扱う SEO 主体の Web メディア。

- **正規ドメイン**: https://www.fureaino-oka.com
- **事業ゴール**: 1年以内に評価額3,000万円での事業売却（M&A）。
- **収益ルート**: 検索流入 → リード獲得（無料PDF・メール登録 = Zero-Party Data）→ 不動産査定アフィリエイト送客（A8.net）。
- 全体設計は `docs/ARCHITECTURE_AND_ROADMAP.md` を参照。

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS 4
- ホスティング: Vercel ／ CMS: microCMS（記事・ブログ）／ メール: Resend
- 性能監視: Lighthouse CI（`.github/workflows/lighthouse-ci.yml`）

## コマンド

```bash
npm run dev        # 開発サーバー（localhost:3000）
npm run build      # 本番ビルド（typescript.ignoreBuildErrors=false で型エラーは失敗扱い）
npm run start      # 本番起動
npm run lint       # ESLint
npm run index:run  # Google Indexing API 送信（-- --dry-run で件数確認のみ）
npm run gsc:report # Search Console データを logs/gsc/ に CSV/JSON 出力
npm run ga4:report # GA4 データを logs/ga4/ に CSV/JSON 出力（--days N で期間変更）
```

- 環境: Windows / PowerShell。シェル操作は PowerShell 構文（`$null`, `$env:VAR` 等）。

## アーキテクチャの要点

- **市区町村データが心臓部**: `app/lib/data/municipalities.json`（全国の補助金・粗大ゴミ情報）。型は `app/lib/data/municipalities.ts` の `MunicipalityData`。データ更新は `scripts/manage-data.mjs`（README 参照）や都道府県別 `merge-*-municipalities.mjs`。
- **programmatic SEO**: `/area/[prefecture]/[city]/(subsidy|cleanup)` を `generateStaticParams` で量産。
- **`middleware.ts`**: 日本語URL→ID正規化301、旧中古ドメイン残骸（`/tenmon` `/shizen` `/search` `/parking.php`）は410 Gone、`/region`→`/area` 統合、`/about`→`/company`。
- **SEO 正規化**: Canonical/sitemap は `app/lib/site-url.ts` の `getCanonicalBase()`。サイト名は `app/lib/site-brand.ts`。
- **sitemap**: 分割配信（`/sitemaps/{static,area,tools,articles}/sitemap.xml`）。`/sitemap.xml` は `/api/sitemap-index` へ rewrite。
- **ツール群**: `app/tools/`（空き家リスク診断・相続シミュレーター等）。

## 遵守ルール（旧 .cursor/rules・絶対遵守）

### 法務（YMYL / E-E-A-T）
- **非弁・非税理士**: 遺言の具体文案・遺産分割代行・個別相続税計算・節税スキームは書かない。一般論＋「専門家へ相談を」のみ。
- **押し買い勧誘に触れない**。医療・法務・税務は断定せず専門家相談を明記。
- **出典は公的機関**（厚労省・総務省・国民生活センター・自治体）を引用し、更新日を表示。
- 詳細: `docs/CONTENT_LEGAL_AND_SEO_GUIDE.md`

### リスク管理（Exit-Focused Lead Engineer 視点）
全コードは「資産価値（M&A価格）を高めるか」「即時リードを生むか」の2軸で評価する。
- **機密PII（口座番号・パスワード・PIN）を絶対に保存しない。**
- **自治体の電話番号・`tel:` リンクを目立つ形で露出しない**（離脱・直帰の原因）。
- **CTA のないデッドエンドページを作らない**（全ページに査定・見積もり・無料ガイド導線を置く）。
- 地域ページは programmatic SEO（`generateStaticParams`）で量産する。

### 記事 × CMS 連携
- LINE誘導CTAは記事本文（body）に含めない（テンプレ側で固定表示: `ArticleLineCTATop` / `ArticleFooterCTA`）。
- 外部AI（Gemini等）で記事生成する場合は「本文のみ出力。LINE・友だち追加・バナー誘導は含めない」と指示。
- フクロウの相槌は CMS の `owlMessages`（文字列配列）で段落単位に制御可。不足分はデフォルトで補完。
- 詳細: `docs/CMS-ARTICLE-INTEGRATION.md`

### SEO 記事の文体
- トーン: 共感・寄り添い（「〜すべき」より「〜で困っている方へ」）。
- 構成: リード文（150字前後）→ H2/H3 → まとめ + CTA。目安 2,000〜3,000字。
- 各記事に内部リンク（チェックリスト・はじめかた・関連記事）を2〜3本。
- 参照: `docs/SEO_ARTICLE_BRIEF_TEMPLATE.md`, `docs/seo-keywords.csv`

## 分析データ（Search Console / GA4）

サイトの全体感を把握する際は、以下で実データを取得してから `logs/gsc/` `logs/ga4/` の CSV を読む。

- 認証は Indexing API と共通のサービスアカウント（`credentials/google-indexing-key.json`）。
- GSC: `npm run gsc:report`（query/page/country/device 別の表示回数・クリック・CTR・平均順位）。
- GA4: `npm run ga4:report`（チャネル別・ページ別・LP別・国別・日別のセッション/ユーザー/CV）。`.env.local` に `GA4_PROPERTY_ID` が必要。
- 事前準備: Cloud Console で「Search Console API」「Analytics Data API」を有効化。GA4 はサービスアカウントの client_email を GA4 プロパティに「閲覧者」で追加。

## コンテンツ自動化（SEO量産パイプライン）

Claude Code を使ったSEO記事の半自動量産ラインを構築中。設計は `docs/SEO_CONTENT_AUTOMATION_ARCHITECTURE.md`（決定論層＝scripts/hooks＋生成層＝subagents＋人間承認ゲート）。

- **サブエージェント**: `.claude/agents/`（content-director / keyword-researcher / serp-outliner / expert-angle / article-writer / article-editor / qa-reviewer / interview-writer）。
- **コマンド**: `.claude/commands/`（`/kw-expand` `/brief` `/write` `/content-run` `/publish`）。
- **決定論ツール**: `scripts/content/qa-lint.mjs`（法務・構成・CTAの合否判定）、`scripts/content/microcms-publish.mjs`（既定=下書き投入、`MICROCMS_WRITE_API_KEY` 要）。
- **台帳**: `content/pipeline/keywords.csv`（KWキュー。status遷移で進捗管理）。
- **監修**: 村上充恵 様＝総合監修（生前整理/介護離職予防/親子コミュニケーション等）。専門外（相続税/不動産/解体/登記）には村上様クレジットを付けない（`docs/SUPERVISOR_PLACEMENT_AND_PROFILE.md`）。
- **重要原則**: YMYLのため完全自動公開しない（人間承認＋下書き既定）。HCS回避のため一度に大量公開しない。専門家監修が付いたドメインだけ量産を開放する。

## デプロイ

- Vercel へ git push でデプロイ。デプロイ後は Search Console で対象URLのインデックス登録をリクエスト。
- 詳細手順: `docs/DEPLOY_AND_DOMAIN.md` / `docs/DEPLOYMENT-GUIDE.md`
