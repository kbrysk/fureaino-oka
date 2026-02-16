# CMS 設計と候補比較（安さ・SEO・表示速度）

コンテンツを「別で追加していきたい」前提で、CMS 化の設計と、**安く運用できる CMS** の候補を整理しました。**Sanity（サニティ）** のスタジオも含めて比較し、SEO・表示速度の観点も入れています。

---

## 1. 現状のコンテンツ構造（CMS で管理したいもの）

| 種別 | 保存場所 | 主なフィールド | 用途 |
|------|----------|----------------|------|
| **記事（Article）** | `content/articles/index.json` + `{slug}.json` | slug, title, description, category, date, keywords, eyecatch, images[], owlMessages[], body(HTML) | SEO 記事一覧・詳細 |
| **地域データ** | `content/area-data/areas.csv`, municipalities-nationwide.json | 都道府県・市区町村・粗大ゴミ・補助金・相場メモ等 | pSEO 地域 LP |
| **ガイドブック** | `content/guidebook/data.ts` | セクション配列（id, title, level, paragraphs[], elderComment, owlComment） | 無料 PDF／LP 用 |
| **内部リンク** | `content/internal-links.json` | 記事同士の関連リンク | 内部リンク施策 |

まず **記事（Article）** を CMS 化するのが効果大です。地域データ・ガイドブックは後から CMS 化してもよいです。

---

## 2. 記事用 CMS スキーマ案（Article）

CMS 側で持つドキュメント型のイメージです。現在の JSON 構造に合わせています。

| フィールド | 型 | 必須 | 備考 |
|------------|-----|------|------|
| slug | string | ○ | URL 用。英数字・ハイフンのみ。一意 |
| title | string | ○ | タイトル（SEO） |
| description | string | ○ | メタ説明 |
| category | string | ○ | 進め方 / 処分・買取 / 資産・家 / デジタル / 親・家族 等 |
| date | date | ○ | 公開日 |
| keywords | array of string | - | キーワード配列 |
| eyecatch | image / url | - | アイキャッチ画像 |
| images | array of { afterIndex, image, alt } | - | 記事中差し込み画像 |
| owlMessages | array of string | - | 段落ごとのフクロウの一言 |
| body | block content / HTML | ○ | 本文（リッチテキスト or HTML） |

- **body**: Sanity なら `blockContent`（Portable Text）、他 CMS は HTML または Markdown が一般的です。既存が HTML なら「HTML 長文」1フィールドでも可。
- **eyecatch / images**: URL のみでも可。CMS で画像アップロードにすると CDN 配信で速度・SEO にも有利です。

---

## 3. CMS 候補比較（安さ・SEO・速度）

### 3.1 比較表

| CMS | 料金の目安 | SEO・表示速度 | 編集 UI | 備考 |
|-----|------------|----------------|----------|------|
| **Sanity** | **無料枠が広い**（3ユーザー、10GB、50万 API リクエスト/月） | ◎ ビルド時取得で HTML に含められる＝速い | **Sanity Studio**（スタジオ）が強力でカスタムしやすい | Next と相性◎。スタジオは自前ホスト or sanity.io で無料 |
| **Decap (旧 Netlify CMS)** | **完全無料**（Git に保存するだけ） | ◎ ビルド時にファイル読む＝現状と同等で速い | シンプル。Git がわかる人向け | サーバー不要。編集は PR 経由。スタジオのようなリッチ UI はない |
| **Contentful** | 無料枠あり（5ユーザー、2.5万レコード、100万 API 呼び出し/月） | ◎ ビルド時取得で速い | きれいだが無料枠を超えると有料 | 大規模向け。小規模なら Sanity の方が無料枠が使いやすい |
| **Strapi** | **OSS＝無料**。ホスト代のみ（Railway 等 月数百円〜） | ◎ 自前 API をビルド時に叩く＝速い | 管理画面付き。自前サーバー必要 | 運用コストがやや高い |
| **Notion** | 無料枠あり | △ API が遅め。ビルド時取得なら許容範囲 | 使い慣れた Notion | ブロック→HTML 変換が必要。SEO はビルド時取得なら問題なし |
| **Markdown + Git（現状）** | **無料** | ◎ ファイル読み＝最速 | エディタ or GitHub で編集 | 「CMS」ではないが、編集を GitHub 上でするなら Decap が近い |

### 3.2 一番安くできるのは？

- **運用コストゼロにしたい**  
  → **Decap CMS（Git ベース）** または **現状の Markdown/JSON + GitHub で編集**。サーバーも CMS も無料。
- **「スタジオ」のような編集画面で、かつ安く**  
  → **Sanity** がおすすめです。  
  - 無料枠: 3ユーザー、10GB アセット、50万 API リクエスト/月（小〜中規模メディアで十分）  
  - Sanity Studio は **無料** で使え、Vercel などにデプロイすれば「編集用サイト」として常時利用可能。  
  - 有料になるのは「チーム人数」「ストレージ」「API 超過」からで、記事テキスト中心なら長く無料で運用しやすいです。

### 3.3 Sanity（スタジオ）で安くできるか

- **できます。**  
  - 無料プランで **Sanity Studio** をホスト（`sanity.io` のホストでも、自前で Next に組み込んでも可）。  
  - コンテンツは Sanity の CDN 経由で取得。Next では **ビルド時（getStaticProps / Server Component）** に 1 回だけ取得して HTML に含めるため、**表示は速く、SEO も問題ありません**。  
- 画像も Sanity の CDN で最適化（幅・フォーマット指定）できるので、**Core Web Vitals や LCP の改善**にも使えます。

---

## 4. SEO・表示速度の観点

- **重要**: 記事本文は **サーバー側で HTML に含める** ことが前提です。  
  - クライアントで CMS を叩く方式だと、初回表示が遅く、クローラーによってはコンテンツを正しく評価されない可能性があります。
- **推奨**:  
  - **Next.js の SSG または ISR** のまま、**ビルド時（または revalidate 時）に CMS API を 1 回叩き、取得したデータで HTML を生成する**。  
  - これなら現在の「ファイル読み」と同様に、**初回表示が速く、SEO も維持**できます。
- **画像**: CMS の画像は **CDN + 幅/quality 指定** に対応していると、LCP 改善に有利です（Sanity は対応済み）。

---

## 5. おすすめの組み合わせ（結論）

| 目的 | おすすめ |
|------|----------|
| **一番安く・スタジオっぽい編集画面が欲しい** | **Sanity**（無料枠 + Sanity Studio） |
| **完全無料・Git で管理したい** | **Decap CMS** または **現状の JSON + GitHub 編集** |
| **SEO・表示速度を維持したい** | どの CMS でも **ビルド時（SSG/ISR）に API 取得** する設計にする |

**Sanity を選ぶ場合のイメージ**

1. Sanity で「Article」のスキーマを上記のように定義。  
2. Sanity Studio を `your-site.com/studio` などに配置（Next に組み込む or 別デプロイ）。  
3. 記事一覧・詳細は、Next の **getStaticProps / generateStaticParams + fetch(Sanity API)** でビルド時に取得。  
4. 既存の `content/articles/*.json` は、移行用スクリプトで Sanity にインポート可能。  

これで「コンテンツは別で（スタジオから）追加していく」運用にしつつ、**安く・SEO・速度を両立**できます。

---

## 6. 次のステップ（Sanity を選んだ場合）

1. **Sanity プロジェクト作成**（sanity.io）  
2. **Article スキーマ定義**（上記テーブルを Sanity の schema に落とす）  
3. **既存 JSON → Sanity へのインポートスクリプト**（slug, title, body 等を一括投入）  
4. **Next 側**  
   - `app/lib/articles.ts` を「Sanity から取得」に差し替え（ビルド時に `fetch`）。  
   - 一覧: `getArticlesIndex()` → Sanity GROQ で一覧取得。  
   - 詳細: `getArticleBySlug(slug)` → Sanity GROQ で 1 件取得。  
5. **Sanity Studio** を `/studio` で提供（`sanity dev` を Next のサブパスにマウントする構成が一般的）。

必要なら、**Sanity の具体的なスキーマ例（GROQ クエリ付き）** や **Next の `getStaticProps` / App Router での取得例** を別ドキュメントにまとめます。
