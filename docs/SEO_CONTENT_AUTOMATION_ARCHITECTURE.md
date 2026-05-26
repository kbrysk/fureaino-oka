# SEOコンテンツ自動量産アーキテクチャ設計書

> 対象プロジェクト: 生前整理ナビ / ふれあいの丘（seizenseiri）
> 目的: Claude Code を中核に、SEOコンテンツの「調査→構成→執筆→検閲→CMS投入」を半自動化し、**M&A評価額3,000万円**に資する「移管可能な集客資産＋それを生み続けるエンジン」を構築する。
> ステータス: 設計確定版（実装着手可能レベル）。本書は調査→ドラフト→批判的レビュー→練り直しの全工程を経たもの。第10章に批判的レビューの全文を収録。

---

## 0. エグゼクティブサマリ（最初に結論）

- **コンテンツ「工場」ではなく「品質の堀（moat）を持つ半自動ライン」を作る。** 大量生成だけを狙うと Google の Helpful Content / スケールドコンテンツ濫用ポリシーで資産価値そのものを毀損する。本設計は「SERP接地＋独自データ（全国844エリア・生前整理アドバイザー実務）＋人間承認」で差別化を担保する。
- **アーキテクチャは2層**: ①**決定論層（scripts/hooks）**＝法務QA・構成チェック・CMS投入・KW台帳など「100%再現すべき処理」はコードで固定。②**生成層（subagents）**＝キーワード判断・構成・執筆・編集・総合検閲という「判断と創造」をAIエージェントが担当。
- **YMYL（法務・税務・医療隣接）なので、公開は完全自動化しない。** 決定論的な法務リンターを必須ゲートにし、最終公開は人間承認（microCMSへは既定で「下書き」投入）。これは離脱リスク回避であると同時に、買い手のデューデリ（DD）で評価される「品質管理プロセスの証跡」になる。
- **ユーザーの4ステップ**（①統括/KW調査/構成 ②独自視点注入 ③執筆/編集/最終検閲 ④CMS自動連携）を、Claude Code の **サブエージェント／スラッシュコマンド／フック／スクリプト** に1対1で実装する。
- **既存資産を最大活用**: 4フェーズKW戦略、`seo-article-outlines-seizenseiri.md`（完成ブリーフ群）、`SEO_ARTICLE_BRIEF_TEMPLATE.md`、`municipalities.json`（pSEOの心臓部）、`scripts/gsc-report.ts`（GSCフィードバック）を入力・部品として組み込む。

---

## 1. 前提：既存資産の棚卸し（調査結果サマリ）

設計を「絵に描いた餅」にしないため、リポジトリ実態を調査して固定した事実。

### 1.1 SEO戦略・キーワード（grounding）
- **4フェーズ戦略**（`M&A_KEYWORD_STRATEGY_AND_NAMING.md`）: F1=共感・悩み系（ドメインパワー育成、YMYL直撃回避）/ F2=買取・処分系（初期マネタイズ）/ F3=不動産・相続系（バリュエーションの本丸）/ F4=指名・ツールブランド化。
- **記事の黄金フォーミュラ**: 入口=共感(Emotional)→中間=論理(Logic)→出口=ツール/CV(Action)。
- **KW台帳**（`docs/seo-keywords.csv`）スキーマ: `keyword, search_intent, category, phase, h2_idea, priority, cv_destination, status, url`。**現状22行・`status`/`url`空欄で未運用**。
- **本数・ペース目標**（`SEO_CONTENT_STRATEGY.md`）: Year1末150〜200本（月12〜18本）、Year2末350〜450本（月15〜20本）。
- **3トピッククラスタ**: 実家じまい（Hub `/articles/master-guide`）/ 遺品整理・費用（Hub `/cost`）/ 相続・手続き（Hub: ツール群）。
- **完成ブリーフ群**: `seo-article-outlines-seizenseiri.md`（グループ1〜8、各3,500〜6,000字の骨子・タイトル案・meta案・独自切り口つき）= **生成プロンプトの一次入力**として即利用可。
- **pSEO**: L1ハブ→L2カード→L3個別LPの3層。`municipalities.json`（844エリア規模）が心臓部。地域×補助金／地域×相場が拡張軸。

### 1.2 CMS・記事配信の技術形状（grounding・重要な訂正含む）
- **配信は100% microCMS `blogs` エンドポイント**。記事ルートは `app/articles/[id]/page.tsx`（`[id]`= microCMS の `contentId`）。**`[slug]` ルートは存在しない。**
- **記事モデル `MicroCmsBlogPost`**（`app/lib/microcms-types.ts`）:
  | フィールド | 型 | 必須 | 備考 |
  |---|---|---|---|
  | `title` | string | ○ | |
  | `content` | string(HTML) | ○ | **本文フィールド名は `content`**（旧 `body` はフォールバック） |
  | `description` | string | 任意 | 未設定時は本文先頭160字を自動抽出 |
  | `thumbnail` / `ogpImage` | image | 任意 | |
  | `category` | 参照(単一) | 推奨 | `categories` API の contentId |
  | `tags` | 参照(複数) | 任意 | `tags` API の contentId |
- **本文はHTML**（Markdownではない）。描画は `html-react-parser`。`<h2>` 直前に記事内広告を自動挿入。
- **フクロウ相槌は本文HTMLにインライン記法 `【フクロウ: メッセージ】`**（`ArticleBodyContentMicroCms.tsx` の `OWL_REGEX = /【フクロウ:\s*([^】]+)】/g`）。**`owlMessages` 配列は旧JSON時代の遺物で現行未使用**（ドキュメント `CMS-ARTICLE-INTEGRATION.md` の記述は現行型と乖離。本設計では現行=インライン記法を採用）。
- **書き込みAPIは現状未使用**。`microcms-js-sdk@3.3.0` は `create()/update()/delete()` 可。**書き込み権限付きキーを新規発行**し `MICROCMS_WRITE_API_KEY` として分離するのが安全（現行 `MICROCMS_API_KEY` は閲覧用）。`category`/`tags` は作成時に**参照先 contentId** を渡す必要がある。
- **タクソノミー**: カテゴリ6種（`guide / cleanup / inheritance / real-estate / digital / mental`）、タグ10種（`long-distance / save-money / no-time / parent-stubborn / family-conflict / gomi-yashiki / akiya-long / digital-worry / inheritance-deadline / guilt-cannot-throw`）。**コード側slugとmicroCMS側contentIdの一致は保証なし → 投入時に `getCategories()/getTags()` で実IDへマッピング必須。**
- **LINE誘導CTAは本文に入れない**（テンプレ `ArticleLineCTABanner` が固定表示）。署名・更新日・末尾CTAもテンプレ側で自動付与。

### 1.3 法務・E-E-A-T制約（machine-checkable）
第5.5章のQAリンター仕様に全ルールを機械可読な形で収録。要点:
- 非弁・非税理士: 遺言文案／遺産分割代行／個別相続税計算／節税スキーム／断定的法的判断 は禁止。一般論＋専門家相談明記のみ。押し買い・強引買取勧誘の禁止。
- 出典: 公的一次出典（厚労省/総務省/国民生活センター/法務省/国税庁/`.lg.jp`）を1つ以上引用。
- 監修: 代表者資格は**生前整理アドバイザー2級**。法務・税務の「監修済み」表示は実監修記事のみ。**虚偽の有資格者表示はFAIL。**
- 構成: リード150字前後→H2≥2→まとめ＋CTA、本文2,000〜3,000字。
- 本文混入禁止: LINE CTA、相槌の地書き（`【フクロウ:】`記法以外の「ホー」等）、PII保存誘導、レイアウトHTML、`tel:`/自治体電話番号の強調。

---

## 2. 全体アーキテクチャ

```
                          ┌─────────────────────────────────────────────┐
                          │   生成層（Claude Code サブエージェント）       │
   GSC/GA4データ ───┐     │  director → kw-researcher → serp-outliner →   │
   (scripts/        │     │  expert-angle → writer → editor → qa-reviewer │
    gsc-report.ts)  │     └───────────────┬─────────────────────────────┘
                    │                     │ 生成物（brief/draft/qa-report）
                    ▼                     ▼
        ┌───────────────────────────────────────────────────────────┐
        │              決定論層（scripts/ + hooks）                    │
        │  kw-queue.mjs（台帳）│ qa-lint.mjs（法務/構成）│             │
        │  char-count │ link-check │ dedup/cannibalization │          │
        │  microcms-publish.mjs（Write API・既定=下書き）              │
        └───────────────────────────────┬───────────────────────────┘
                                         │ QA合格のみ通過
                                         ▼
                          ┌──────────────────────────┐
                          │   人間承認ゲート（必須）    │  ←── あなた（または編集担当）
                          │  下書きをレビュー→公開許可  │
                          └────────────┬─────────────┘
                                       ▼
                              microCMS（公開）→ サイト反映
                                       │
                                       ▼
                              GSC計測 → フィードバックループへ（第7章）
```

**設計原則**
1. **判断はAI、検証はコード。** 法務・構成・リンク・文字数・CMS整合といった「正解が定義できる検証」は決定論スクリプトに固定し、LLMに自己申告させない。
2. **公開は人間ゲート。** 自動化は「人間が承認/却下するだけ」の状態まで仕上げることをゴールとする（完全無人公開はしない）。
3. **全状態をリポジトリに残す。** 台帳・ブリーフ・ドラフト・QAレポート・公開履歴を git 管理＝**移管可能な資産＋DD証跡**。

---

## 3. データモデルと状態管理

### 3.1 KW台帳（パイプラインのキュー）
`content/pipeline/keywords.csv`（既存 `docs/seo-keywords.csv` を拡張・統合）。1行=1記事候補。

```
kw_id,keyword,cluster,phase,intent,cv_destination,priority,status,
brief_path,draft_path,qa_report_path,article_id,published_at,gsc_position,notes
```
- `cluster`: 介護前段階P0（介護離職予防・啓蒙）/ 実家じまい / 遺品整理費用 / 相続手続き / 地域pSEO のいずれか
- `journey_phase`: P0(準備/介護離職) / P1(決断/生前整理) / P2(ロードマップ/実家じまい) / P3(実行/売却・解体・相続)。**収益軸 `phase`(F1〜F4) とは別軸**で、記事は「人生段階×収益クラスタ」のマトリクスで位置づける（第6.5章）
- `supervisor`: murakami(総合監修) / shihoshoshi(司法書士) / zeirishi(税理士) / kaitai(解体専門家) / takken(宅建士) / none(一般情報・監修クレジット無し)。記事ドメインに応じて確定（第6.5章の線引き）
- `status` 遷移: `backlog → researching → outlined → drafting → editing → qa → human_review → ready → published → monitoring`（FAIL時は前段へ差し戻し、`notes`に理由）
- `article_id`: 公開後の microCMS contentId（再更新・内部リンクに使用）
- `gsc_position`: 監視ループが更新する平均順位

### 3.2 記事ワークディレクトリ
`content/pipeline/<kw_id>/`
- `brief.md` … SERP接地＋独自切り口を盛った構成（`SEO_ARTICLE_BRIEF_TEMPLATE.md` 準拠）
- `draft.html` … 本文HTML（`【フクロウ:】`記法・内部リンク・公的出典込み、LINE CTA無し）
- `meta.json` … title/description/category(slug)/tags(slug)/thumbnail案
- `qa-report.json` … リンター＋LLM検閲の合否レポート
- `sources.json` … 引用した公的出典URL（検証用）

> 既存 `scripts/expand-*.mjs` が使う `content/articles/*.json` の中間JSON運用を踏襲しつつ、最終投入先を microCMS Write API に変更する。

---

## 4. パイプライン詳細（ユーザー4ステップ × Claude Code）

### Step 1 — 全体統括・KW調査・構成作成
- **content-director**（統括）が `gsc-report` 結果と台帳を読み、次に着手するKWを **フェーズ×優先度×striking-distance（順位5〜15位）× カニバリ回避** で選定。
- **keyword-researcher** がシード/クラスタからKWを拡張（WebSearchでサジェスト・関連語、GSCの既存表示クエリ）、検索意図とCV先を分類し、**既存記事との重複（カニバリ）を台帳＋microCMS既存記事で照合**してから台帳へ追記。
- **serp-outliner** が対象KWの現在の上位コンテンツを WebSearch で調査し、共通の必須見出しと**不足している論点（差別化の余地）**を抽出。`SEO_ARTICLE_BRIEF_TEMPLATE.md` 形式で `brief.md` を生成（独自切り口スロットを空けておく）。

### Step 2 — 独自視点の注入
- **expert-angle** が `brief.md` に「ふれあいの丘」固有の価値を注入:
  - 生前整理アドバイザー実務の観点（手順・現場の声・心理的ハードルの解きほぐし）
  - 自社独自データ（全国844エリアの補助金・相場、診断ツール、実家じまい力診断）への内部リンク導線
  - 「共感→論理→ツール」フォーミュラへの落とし込み
- **重要ガード**: 資格・監修は実態（2級）に即した表現に限定。「税理士監修」等は実監修記事のみ。`expert-angle` は誇張資格表現を出力しない（QAでも再検査）。

### Step 3 — 執筆・編集・最終検閲
- **article-writer** が `brief.md` から `draft.html` を執筆（本文HTML、2,000〜3,000字、`【フクロウ:】`インライン、内部リンク2〜3本、公的出典1つ以上、LINE CTA無し）。
- **article-editor** が推敲（トーン共感化、KW詰め込み除去、可読性、構成整合）。
- **qa-reviewer** が二段検閲:
  1. **決定論リンター** `scripts/content/qa-lint.mjs` を Bash 実行（第5.5章の全ルール、合否JSON）。
  2. **LLM検閲**（regexで拾えない法務・トーン・事実性の機微）＋ **公的出典URLの実在チェック**。
- **content-director** が最後に「SEO観点・独自性・事業品質」で総合判定し、`status=human_review` にして停止（人間承認待ち）。

### Step 4 — CMSへの自動連携
- 人間が承認後、`/publish <kw_id>` で `scripts/content/microcms-publish.mjs` を実行。
  - category/tag slug → microCMS contentId に実マッピング（`getCategories()/getTags()`）。
  - **既定は `status: "draft"`（下書き）投入**。`--live` 指定時のみ公開。これによりmicroCMS上で最終プレビュー後に公開フラグを立てられる。
  - 投入後、台帳に `article_id`・`published_at` を記録、`status=published`。

---

## 5. Claude Code 実装仕様

ディレクトリ構成（新規）:
```
.claude/
  agents/         content-director.md / keyword-researcher.md / serp-outliner.md
                  expert-angle.md / article-writer.md / article-editor.md / qa-reviewer.md
  commands/       kw-expand.md / brief.md / write.md / content-run.md / publish.md
  settings.json   （フック・権限）
scripts/content/
  kw-queue.mjs / qa-lint.mjs / link-check.mjs / microcms-publish.mjs
content/pipeline/ keywords.csv / <kw_id>/...
```

### 5.1 サブエージェント定義（`.claude/agents/*.md`）
各エージェントは frontmatter（name/description/tools/model）＋ system prompt。**全エージェント共通の制約として CLAUDE.md と本書第1.3章を参照**させる。例（writer）:

```markdown
---
name: article-writer
description: ブリーフからmicroCMS投入用の本文HTMLを執筆する。SEO記事の本文のみ生成。
tools: Read, Write, WebSearch
model: sonnet
---
あなたは「生前整理支援センター ふれあいの丘」の記事ライターです。
入力: content/pipeline/<kw_id>/brief.md と sources.json。
出力: content/pipeline/<kw_id>/draft.html（本文HTMLのみ）。

絶対ルール（違反するとQAでFAIL）:
- 本文はHTML。見出しは<h2>/<h3>、段落は<p>、リストは<ul>/<ol>のみ。
- 文字数2,000〜3,000字。リード文（最初の<h2>の前）は120〜180字で「共感→得られること→結論」。
- フクロウの相槌は本文中に【フクロウ: ◯◯】の記法でのみ挿入（地書きの「ホー」等は禁止）。
- 内部リンクを2〜3本（/guide, /articles/master-guide, /checklist, 同テーマ記事, 関連ツールのいずれか）。
- 公的出典（厚労省/総務省/国民生活センター/国税庁/自治体.lg.jp等）を最低1つ、根拠提示の形で引用。
- 法務: 遺言文案・遺産分割代行・個別相続税計算・節税スキーム・断定的法的判断は書かない。
  YMYLに触れる場合は「弁護士・税理士・医師等にご相談を」を明記。
- LINE誘導・友だち追加・バナー・CTAボックス・署名・更新日は本文に入れない（テンプレが付与）。
- 資格/監修の誇張禁止（当社代表は生前整理アドバイザー2級。税理士監修等と書かない）。
- tel:リンク・自治体電話番号を強調表示しない。PII保存を誘導しない。
トーン: 共感・寄り添い（「〜すべき」より「〜で困っている方へ」「まずは一歩から」）。
```

他エージェントの役割（system promptは同様に厳密化）:
- **content-director**（model: opus）: 台帳＋GSC読込、KW選定（フェーズ×優先度×striking-distance×カニバリ回避）、各記事の総合検閲と human_review への昇格判断。
- **keyword-researcher**（sonnet, +WebSearch）: KW拡張・意図分類・CV先付与・重複照合・台帳追記。
- **serp-outliner**（sonnet, +WebSearch）: 上位SERP構造抽出＋不足論点抽出→brief.md（テンプレ準拠）。
- **expert-angle**（opus）: 独自切り口・実務観点・自社データ導線の注入、誇張資格の抑止。
- **article-editor**（sonnet）: 推敲・トーン・KW詰め込み除去。
- **qa-reviewer**（opus, +Bash）: qa-lint.mjs実行＋LLM法務/事実検閲＋出典URL実在チェック＋監修ドメイン整合（S4/S5）。
- **interview-writer**（opus）: 村上様インタビューの文字起こし（`content/experience/murakami/*.md`）から寄稿記事・著者ページのドラフトを生成。実体験の一人称を活かし、誇張資格を付けない。出力は村上様の最終確認に回す（第6.5.3）。

### 5.2 スラッシュコマンド（`.claude/commands/*.md`）
- `/kw-expand <cluster>` → keyword-researcher 起動。
- `/brief <kw_id>` → serp-outliner → expert-angle。
- `/write <kw_id>` → writer → editor → qa-reviewer（FAILなら差し戻し）。
- `/content-run <N>` → director が次N件を選定し、各件で brief→write を実行、全件 human_review で停止（**夜間バッチの主役**）。
- `/publish <kw_id> [--live]` → 人間承認後に microcms-publish 実行。

例（`/content-run`）:
```markdown
---
description: 次のN件のKWについて、調査→構成→執筆→QAまでを一括実行し人間承認待ちにする
---
台帳 content/pipeline/keywords.csv を読み、status=backlog のうち
フェーズ×優先度×striking-distance を考慮して上位 $1 件を選ぶ。
各KWについて serp-outliner → expert-angle → article-writer → article-editor → qa-reviewer
を順に実行。qa-lint.mjs がFAILなら最大2回まで該当段へ差し戻して再生成。
合格したら status=human_review に更新。最後に「承認待ち一覧」を表で出力。
公開（microCMS投入）は行わない。
```

### 5.3 決定論スクリプト（`scripts/content/*.mjs`）
- **`kw-queue.mjs`**: 台帳の読み書き（add/dedup/status更新/next-N選定）。`read-kw-csv.mjs` のCSV処理を流用。
- **`qa-lint.mjs`**: 第5.5章のルールを実装。入力=draft.html+meta.json、出力=qa-report.json（ルールごとにpass/fail＋該当箇所）。**終了コードで合否**（CI/フック連携）。
- **`link-check.mjs`**: 内部リンクが実在URL（サイトのルート群/既存article_id）に解決するか、公的出典URLが200応答かを検証。
- **`microcms-publish.mjs`**: `microcms-js-sdk` の管理クライアントで `create()`。slug→contentIdマッピング、thumbnail設定、既定draft。`.env.local` の `MICROCMS_WRITE_API_KEY`/`MICROCMS_SERVICE_DOMAIN` を使用。投入結果（article_id）を台帳へ反映。

`microcms-publish.mjs` の骨子:
```js
import { createManagementClient } from "microcms-js-sdk"; // or createClient
const client = createManagementClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_WRITE_API_KEY,
});
// 1) getCategories()/getTags() で slug→contentId マップを構築（閲覧クライアント）
// 2) qa-report.json が pass か検証（fail なら exit 1）
// 3) client.create({ endpoint: "blogs", content: {
//      title, content: bodyHtml, description, category: catId, tags: tagIds, thumbnail
//    }, ...(live ? {} : { status: ["draft"] }) })  ← 既定は下書き
// 4) 台帳に article_id / published_at を記録
```

### 5.4 フック（`.claude/settings.json`）
決定論ゲートを「忘れず必ず」効かせるための保険。
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command",
            "command": "node scripts/content/qa-lint.mjs --if-draft \"$CLAUDE_TOOL_FILE_PATH\"" }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(node scripts/content/*.mjs:*)",
      "Bash(npm run gsc:report:*)"
    ]
  }
}
```
- `draft.html` が書かれるたびに qa-lint を自動実行（FAILを早期に可視化）。
- **公開前ゲートはスクリプト側で二重化**: `microcms-publish.mjs` は qa-report が pass でなければ投入拒否。

### 5.5 QAリンター ルール仕様（機械化）
`qa-lint.mjs` が判定する規則。括弧内は判定方法。

| # | ルール | 合否判定 |
|---|---|---|
| L1 | 遺言文案・サンプル全文 | NG正規表現（例: `遺言.*(と書|記載例|文例)`、blockquote内の「相続させる」定型）に該当でFAIL |
| L2 | 遺産分割代行・交渉の示唆 | `(分割協議|遺産分割).*(代行|交渉|代理)` でFAIL |
| L3 | 個別相続税の金額算出 | `相続税.*(◯◯万円|[0-9,]+円).*(になります|です)` 等、具体額断定でFAIL（制度説明は可） |
| L4 | 節税スキーム推奨 | `(節税|税金).*(減らせ|圧縮|スキーム)` でFAIL |
| L5 | 断定的法的/医療判断 | `(必ず|間違いなく|絶対に).*(なります|べきです)` の多用でFAIL |
| L6 | 押し買い・強引勧誘 | `(今すぐ売らないと|急がないと損)` 等でFAIL |
| S1 | 公的出典 | 本文に `(厚生労働省|総務省|国民生活センター|法務省|国税庁|\.lg\.jp)` が1つ以上。無→FAIL |
| S2 | 専門家相談（YMYL時） | `(弁護士|司法書士|税理士|医師|専門家).{0,15}(相談)` が1つ以上。YMYLカテゴリで無→FAIL |
| S3 | 虚偽資格表示 | `(税理士|弁護士|司法書士).{0,6}監修` を含み、許可リスト記事でなければFAIL |
| S4 | 監修クレジットのドメイン整合 | meta.json の `supervisor` と記事ドメインが第6.5.1表に整合。例: 相続税計算記事が `supervisor=murakami`→FAIL（村上様は税務非監修）。`supervisor=none` の記事に村上様クレジット混入→FAIL |
| S5 | 村上様の最終確認 | `supervisor=murakami` の記事は、台帳に承認記録が無ければ公開（live）FAIL（下書きは可） |
| T1 | 文字数 | タグ除去後 2,000〜3,000字（<1,500 or >4,000 でFAIL、1,500〜2,000/3,000〜4,000はWARN） |
| T2 | 構成 | `<h2>` が2つ以上。リード（最初のh2前）120〜180字。無→FAIL |
| T3 | トーン | `〜すべき/しなければならない` の過剰（閾値超）でWARN |
| C1 | 内部リンク | 自サイト内リンク2〜3本。0本→FAIL、1本→WARN |
| C2 | LINE CTA混入 | `(LINEで|友だち追加|今すぐ受け取る|特典をもらう)` でFAIL |
| C3 | 相槌の地書き | `【フクロウ:` 記法外の `(ホー|うんうん|なるほど)` の地書きでFAIL |
| C4 | tel/電話露出 | `tel:` リンク or 市役所代表番号の強調でFAIL |
| C5 | PII保存誘導 | `(口座番号|パスワード|暗証番号).*(記入|入力|保存)` でFAIL |
| M1 | メタ整合 | meta.json の category slug がカテゴリ6種に、tags が10種に含まれる。否→FAIL |

> 正規表現は初期セット。運用しながら誤検知/見逃しをチューニングする（ルール自体もgit管理＝改善履歴が資産）。

---

## 6. 品質・法務ガードと人間ゲート（YMYL / HCS対策）

- **完全無人公開はしない。** 公開は人間承認＋microCMS下書き経由。理由は2つ: (a) YMYLでの法務事故は致命的、(b) Google のスケールドコンテンツ濫用ポリシーは「人間の監督なき大量自動生成」を狙い撃ちする。
- **品質の堀**: ①SERP接地、②自社独自データ（844エリア・診断ツール・実務観点）、③公的出典の実在検証、④人間承認、⑤GSC駆動のリフレッシュ。これらが「コンテンツファーム」と「価値ある資産」を分ける。
- **事実性**: LLMの捏造（偽統計・偽出典・偽監修者）を防ぐため、出典URLは `link-check.mjs` で実在検証。資格表現は実態（2級）に固定。
- **カニバリ防止**: 新規KWは台帳＋既存microCMS記事と照合。重複は統合（既存記事の強化）に振り替える。

---

## 6.5 人間監修・Experience（実体験）レイヤー — 村上充恵 様パートナーシップの統合

自動生成の最大の弱点は **E-E-A-T の "Experience"（実体験）の欠如**。これを、生前整理アドバイザー上位資格・介護離職/実家じまい/家族信託の当事者経験を持つ **村上充恵 様（総合監修者）** の **インタビュー → 寄稿記事化** で補う。本レイヤーは自動量産の「品質の堀（第6章）」の中核を成す。

### 6.5.1 監修ドメインのルーティング（reputation保護＝QAの一級ルール）
村上様の専門家評判を守るため、**監修クレジットの付与をドメインで厳密にルーティング**する。台帳の `supervisor` 列で確定し、`qa-lint.mjs` と `microcms-publish.mjs` が機械的に強制する。

| ドメイン | supervisor | 村上クレジット | 備考 |
|---|---|---|---|
| 生前整理全般・親子コミュニケーション・家族会議・協会メソッド（思い入れ箱/ベストショット/4分類シート）・サイト全体のトーン | `murakami` | 可（総合監修） | |
| 介護離職リスクへの備え（P0） | `murakami` | 可 | 介護離職防止対策アドバイザー＋当事者経験 |
| 家族信託の**制度解説** | `shihoshoshi` | **不可** | 村上様は「**実体験の寄稿**」のみ可（別価値コンテンツ） |
| 相続登記・遺言書の制度 | `shihoshoshi` | 不可 | |
| 相続税・譲渡所得税の具体計算 | `zeirishi` | 不可 | |
| 解体工事の技術詳細 | `kaitai` | 不可 | |
| 不動産取引の媒介・契約 | `takken` | 不可 | |
| 上記専門家が未確保の領域 | `none` | 不可 | 一般情報＋専門家相談導線のみ（断定回避） |

### 6.5.2 Experience コーパス（横断利用される一次体験）
- 村上様インタビュー（Zoom 60〜90分）の文字起こしを `content/experience/murakami/*.md` に蓄積し、**一次体験コーパス**として管理。
- `expert-angle` エージェントは、執筆対象テーマに関連する体験エピソードをこのコーパスから引用して `brief.md` に織り込む（「机上の知識」を「経験者の語り」に変える）。
- **重要**: 村上様の名前で**監修クレジットを出すのは `supervisor=murakami` の記事のみ**。コーパスの一般的知見を他ドメイン記事の参考にするのは可だが、その場合クレジットは付けない。

### 6.5.3 2つの生成レーン
1. **KWレーン**（第4章）: 検索KW起点 → SERP接地 → 量産。一般情報が中心、クレジットは原則 `none`、ただし生前整理/P0テーマは `murakami` 監修対象に振り分け。
2. **インタビューレーン**（新設）: 村上様インタビュー → 文字起こし → `interview-writer` が寄稿記事ドラフト化 → **村上様の最終確認（3営業日想定）** → 公開。著者ページ（人物紹介）と P0/体験談コンテンツがここから生まれる。

### 6.5.4 監修ワークフローと負荷設計
- 提案の固定報酬は「月2〜3本の記事内容確認（メール完結）」。**これは `supervisor=murakami` のクレジット記事のみが村上様の確認対象**で、`none` の一般情報記事は自動ライン＋運営者(あなた)＋リンターのゲートで処理する。→ **量産本数と村上様の確認負荷を分離**できる（村上様の負荷は月2〜3本に保ったまま全体量は増やせる）。
- `microcms-publish.mjs` は `supervisor=murakami` の記事を、村上様の最終確認（承認フラグ）が記録されるまで**下書きから公開へ昇格させない**。確認は Google Docs/メールで実施し、承認を台帳 `notes` に記録。

### 6.5.5 著者・監修の構造化データ（E-E-A-T実装）
- 村上様の**著者ページ**（人物紹介・経歴・資格: 生前整理普及協会認定指導員・AFP・介護離職防止対策アドバイザー・神奈川大学エクステンション講師）を作成し、`Person` JSON-LD で構造化。
- 監修記事には `reviewedBy`（または `Article.author`/`contributor` + 監修表記）で村上様を関連付け、フッターと著者ページへ相互リンク。**実在資格のみ記載**（虚偽資格表示は従来どおりFAIL）。
- 専門家未確保ドメイン（司法書士/税理士/解体/宅建）は、確保するまで `none`＝一般情報＋「専門家にご相談を」に限定（断定しない）。

### 6.5.6 サイト全体のフェーズ再編（P0〜P3）への対応
- 既存3クラスタ（実家じまい/遺品整理費用/相続手続き）に **P0「介護前段階（介護離職予防）」クラスタを新設**。競合不在の上流トラフィックを獲得し、F1（共感）と直結。
- 立ち上げ順序: **インタビューレーンで著者ページ → P0コンテンツ**（村上様の当事者経験が最も活きる）→ 以降 P1/P2 を KWレーンと併走、P3 は各専門家監修の確保に合わせて段階投入。

## 7. 計測とフィードバックループ（成長エンジン）

月次サイクル（`content-director` が主導、`scripts/gsc-report.ts`／`ga4-report.ts` を入力）:
1. **勝ち記事**（クリック増・順位上位）→ 内部リンクを集約、関連KWで横展開。
2. **striking-distance**（平均順位5〜15位）→ リライト・出典追加・内部リンク強化で1ページ目へ。
3. **負け/薄い記事**（インプ低・滞在短）→ 統合 or noindex（過去に `/dispose` 削除等のHCS対応実績あり＝この判断は既に組織文化）。
4. **新規KW発掘** → GSCの未対応クエリ・サジェストを台帳へ。
このループ自体が、買い手に見せる「回り続ける集客エンジン」のストーリーになる。

---

## 8. コスト・スループット設計

- **モデル階層**: 判断系（director/expert-angle/qa-reviewer）= 上位モデル、量産系（writer/editor/researcher）= 中位モデルでコスト最適化。
- **バッチ**: `/content-run N` を夜間にまとめて実行し、翌朝に人間が承認。
- **ペース**: 戦略目標は月12〜18本だが、**初期は安全側（週3〜5本）**から始め、品質と順位の実績を見て増速。**一度に大量公開しない**（HCS回避・自然な成長カーブ）。
- **概算**: 1記事あたり 調査+構成+執筆+編集+QA で数十万〜百万トークン規模を想定。実測しながら `notes` にコストを記録し、単価×本数で月次予算を管理。

---

## 9. 段階的ロールアウト

- **Phase 0（2週間）パイロット**: 決定論ツール（kw-queue / qa-lint / microcms-publish[draft] / link-check）とエージェント定義を実装。`seo-article-outlines-seizenseiri.md` のグループ1〜3で**5記事**を通し、人間が重点レビューしてリンター精度と本文品質を較正。
- **Phase 1（1〜2ヶ月）半自動運用**: 週3〜5本。`/content-run` → 人間承認 → `/publish`。GSC監視を開始。
- **Phase 2（3ヶ月〜）拡張**: ペース増（月12〜18本）、pSEO（地域×補助金/相場、`municipalities.json`連携）をパイプラインに統合、フィードバックループでリフレッシュを定常化。

---

## 10. 批判的レビューと反映（red-team → 改善）

初版ドラフトに対し、あえて冷徹な批判を行い、以下を本設計に反映済み。

| # | 批判（初版の弱点） | 反映した改善 |
|---|---|---|
| R1 | 「YMYLを完全自動公開」は無謀。1件の非弁違反で信用とM&A評価が吹き飛ぶ。 | **公開は人間ゲート＋microCMS下書き既定**。法務は決定論リンターを必須ゲート化（LLM自己申告に依存しない）。 |
| R2 | 大量AI生成はGoogleのHCS/スケールドコンテンツ濫用で**資産自体を毀損**しうる。 | **品質の堀**（SERP接地＋独自データ＋人間承認＋リフレッシュ）を中核に。**初期は週3〜5本**、大量同時公開を禁止。 |
| R3 | LLMは出典・統計・監修者を**捏造**する。 | 出典URLの**実在検証**（link-check）、資格表現を実態(2級)に固定、虚偽監修表示をリンターでFAIL。 |
| R4 | タクソノミーのslugとmicroCMS contentIdが**不一致**で投入が壊れる。 | publish時に `getCategories()/getTags()` で**実IDマッピング**を必須化。 |
| R5 | フクロウ相槌をドキュメント通り`owlMessages`配列で出すと**現行描画で表示されない**。 | 現行=**本文インライン`【フクロウ:】`記法**を採用。リンターで記法を検査。 |
| R6 | KWの**カニバリ**で自社記事同士が共食い。 | director＋台帳で重複照合、重複は統合に振替。 |
| R7 | **効果測定がない**ので改善が回らない。 | GSC/GA4フィードバックループ（第7章）を常設、台帳に順位を記録。 |
| R8 | コストが**青天井**。 | モデル階層・バッチ・ペース上限・実測記録で予算管理。 |
| R9 | **一括ビルド**はリスク高。 | Phase 0で5記事パイロット→較正→段階拡張。 |
| R10 | `[slug]` 前提で書くと**ルート不整合**（実際は`/articles/[id]`）。 | 記事URL=contentId、内部リンクは公開後の`article_id`で張る運用に。 |
| R11 | 書き込みに閲覧用キーを使うと権限不足/事故。 | **書き込み専用キー `MICROCMS_WRITE_API_KEY` を分離発行**。 |

---

## 11. M&A資産としての位置づけ（DD観点）

- **移管性**: エージェント定義・コマンド・スクリプト・台帳・QAルール・公開履歴がすべて1リポジトリに揃う＝買い手が「即運用継続できる仕組み」として評価。
- **DD証跡**: qa-report.json（法務チェックの記録）、publish履歴、GSC/GA4ログCSV（既存 `logs/`）が「品質管理されたメディア」の証拠になる。
- **再現性**: 「人＋勘」ではなく「文書化された半自動プロセス」であること自体がバリュエーションを押し上げる。

---

## 12. 未確定の意思決定事項（要判断）

1. **ブランド名**: 正式名「ふれあいの丘」 vs M&A文書推奨「実家スッキリ」。指名検索（F4）戦略に直結するため確定が必要。
2. **監修体制**: ✅ **方針確定（村上充恵 様パートナーシップ提案）**。村上様＝総合監修（生前整理全般・P0介護離職・親子コミュニケーション・協会メソッド・全体トーン）。相続登記/遺言/家族信託制度→司法書士、相続税/譲渡所得税→税理士、解体→解体専門家、不動産取引→宅建士は別監修。第6.5章に統合済み。**残課題**: ①契約締結（5月下旬予定）②司法書士・税理士・解体・宅建の各監修者の確保（村上様からのご紹介含む）③インタビュー実施と著者ページ公開（6月）。
3. **microCMS書き込みキー**: 書き込み権限付きAPIキーの発行と `MICROCMS_WRITE_API_KEY` 設定。
4. **公開の自動度**: 当面は「下書き投入＋人間が公開フラグ」を推奨。将来、実績次第で信頼カテゴリのみ自動公開も検討可。
5. **KW台帳の一本化**: `seo-keywords.csv`（22行）・8グループ提案・地域KWが分散。`content/pipeline/keywords.csv` に統合する初期移行作業。

---

## 13. 次のアクション（実装の着手単位）

1. `content/pipeline/keywords.csv` を作成し、既存KW資産（CSV＋8グループ＋地域）を統合。
2. 決定論ツールを実装: `kw-queue.mjs` → `qa-lint.mjs` → `link-check.mjs` → `microcms-publish.mjs`（draft既定）。
3. `.claude/agents/*` と `.claude/commands/*` を作成。
4. microCMS 書き込みキー発行＋ `.env.local` 設定。
5. **Phase 0 パイロット**: グループ1〜3で5記事を通し、リンター較正と品質確認。
6. GSCフィードバックの月次運用を開始（`scripts/gsc-report.ts` は構築済み）。

> 本書は設計確定版。各実装単位（スクリプト・エージェント・コマンドのスキャフォルド）は本書の仕様に従って順次作成する。
