# PANEL 03 — Google対策（テクニカルSEO / E-E-A-T / 被リンク / 指名検索 / Coreアップデート）

**作成日**: 2026-06-02
**対象**: ふれあいの丘（fureaino-oka.com／株式会社Kogera／Next.js 16・Vercel・microCMS）
**前提データ**: GSC 過去90日（2026-06-01）— 表示10,072／クリック39／CTR0.39%／平均約55位／指名検索ゼロ／被リンクほぼ無し
**立場**: 冷徹な外部SEO監査。忖度なし。

---

## エグゼクティブ・サマリー（断言）

現状のふれあいの丘は、Googleから見ると **「2026年3月Coreアップデートで最も標的になった形のサイト」** である。YMYL（相続・税・終活・空き家）に踏み込みながら、(1) 著者の専門性証明が薄く、(2) 指名検索＝Navigational Demand がゼロで、(3) 被リンクが無く、(4) 短期に大量公開した、という4点が揃っている。これは「中身は空のドメイン（Hollow Shell）」とGoogleが分類する典型だ。**だが救いが3つある**——独自ツール（tax-simulator／akiya-risk）、公的補助金の構造化データ（municipalities.json）、当事者の実体験（運営者の実家じまい体験）。Googleが「情報の独自性」として高く評価する資産を既に持っている。勝ち筋は明確で、後述する。

---

## 1. YMYL × E-E-A-T 現状採点（各10点満点）

2026年9月の品質評価ガイドライン改訂と2月の「Authors」セクション追加で、Googleは**著者の透明性そのものを直接の品質要素**に格上げした。YMYLでは E-E-A-T の相関が約24%まで跳ね上がる（非YMYLの約3倍）。この物差しで冷徹に採点する。

| 軸 | 採点 | 根拠 | 是正策 |
|---|---|---|---|
| **Experience（実体験）** | **6/10** | 運営者・大久保亮佑の実家じまい当事者体験（`/supervisor/okubo`）は本物で、これは最大の武器。ただし**地域pSEOページ・記事本文に一次体験が反映されておらず**、体験が個人ページに閉じている。 | 各記事に「私の場合は〜」の一次体験を1段落、独自写真（実家・整理現場・現物）を1点。pSEOにも運営者トラストブロックを既に持つ（`OperatorTrustBlock`）が体験エピソード化が薄い。 |
| **Expertise（専門性）** | **3/10** | 生前整理アドバイザー2級**のみ**。相続・税・不動産・解体・登記の**5領域すべてに有資格者監修がゼロ**。監修者未付与9記事・外部出典0本11記事は、YMYLでは致命傷。2級だけで相続・税の上位は**構造的に不可能**。 | (a) 領域別の有資格者監修を最低3名確保（司法書士＝相続登記、税理士＝相続税、宅建士＝不動産売却）。(b) 確保まで該当領域は記事を増やさず「一般情報＋専門家相談」表記を厳守（`supervisor="none"`の中立表記は正しい設計）。(c) 全YMYL記事に公的一次出典（国税庁・法務省・国交省・自治体）を最低2本。 |
| **Authoritativeness（権威性）** | **2/10** | **指名検索ゼロ・被リンクほぼ無し**＝外部からの権威シグナルが存在しない。Googleにとって「誰も知らない・誰も引用しないサイト」。Person schemaの著者性も外部から裏付けられていない。 | 後述の被リンク10先＋指名検索施策。村上充恵 様（生前整理普及協会 認定指導員・神奈川大学講師）の総合監修開始は権威性を一気に押し上げる最短手。`sameAs`で外部プロフィール（協会・大学・SNS・PR TIMES）をPerson/Organizationに連結。 |
| **Trust（信頼性）** | **5/10** | 運営会社情報・編集方針・監修方針の透明性、アフィリエイト開示、PII非保存は良好。一方、**HTTPS以外のトラスト裏付け（第三者評価・レビュー・外部言及）が皆無**。Trustは E-E-A-T の中心であり、ここが弱いと他3軸も効かない。 | 「最終更新日／レビュー日」を全YMYL記事に明示（年次レビューサイクル必須）。問い合わせ・運営者実名・所在地（既に大阪府）を構造化。第三者言及を被リンク施策で獲得。 |

**合計 16/40。YMYLとしては「入場料未払い」の状態。** 最優先で底上げすべきは **Expertise（3点）と Authoritativeness（2点）**。この2軸が低いままでは、どれだけ記事を量産してもCoreアップデートで沈む。

### E-E-A-T 是正の決定打（最重要3手）
1. **領域別有資格者監修の確保**（税理士・司法書士・宅建士）。2級アドバイザーは生前整理／実家じまい／介護離職予防に**専念**させ、相続税・登記・不動産には名前を出さない（現行ガード `supervisor="none"` は正しい。維持せよ）。
2. **村上充恵 様の総合監修を即始動**。協会認定指導員・大学講師という外部権威を `Person` + `sameAs` でナレッジグラフに接続。これだけで Authoritativeness が2→5に動く。
3. **Article schema の `author` を Organization → Person に修正**（後述§4の技術指摘と直結）。現状、記事UIには監修者バイラインが出るのに、構造化データ上の著者は法人。Googleの「Authors」評価に著者人物が一切渡っていない。

---

## 2. 指名検索ゼロの突破策

Googleの内部文書・2025年11月のGSC「ブランドクエリ・フィルタ」導入が示すのは一つ——**スパマーが生成できない唯一のシグナルが Navigational Demand（指名検索）** だということ。AI生成コンテンツが無限化した時代に、指名検索は「Proof of Work（実在する事業の証明）」として機能し、ブランドクリックが Navboost を通じてサイト全体の `site_quality` を底上げする。指名検索ゼロは、**ランキング上限を構造的に抑えている**。優先度は **P1（最重要・継続）**。

**具体施策（着手順）**:
1. **PR TIMESで「全国市区町村 解体補助金データベース無料公開」を配信**（既存 municipalities.json を資産化）。「ふれあいの丘」のブランド名を必ず本文・引用可能形式で。データ系PRは指名検索とメディア被リンクを同時に生む。
2. **X（@fureaino_oka・基盤あり）で毎日、独自データ・地域別補助金Tipsを発信**。プロフィール・固定ポストでブランド名を刷り込む。
3. **note連載（大久保署名・月4本）＋村上様の寄稿**。当事者体験 × 専門家視点はSNS/AIに引用されやすい一次素材。
4. **無料ツールを指名検索のフックに**：「ふれあいの丘 固定資産税シミュレーター」「ふれあいの丘 空き家診断」で再訪を促し、ツール名にブランドを冠する。
5. **GSCブランドクエリ・フィルタを有効化**し、指名検索の発生をKPI化（現状ゼロ→月50件→月500件を6ヶ月マイルストーン）。
6. **YouTube/Reddit/まとめ系での言及づくり**。2025年10月時点で主要LLMの被引用元上位がReddit・YouTube。実家じまい体験談を当該プラットフォームに置き、AI Overview経由の指名想起を狙う。

> 指名検索はランキングの「結果」ではなく「燃料」。記事を増やす前に、ブランドを作る。

---

## 3. 被リンク戦略（YMYLで安全・効果的に）

YMYLでGoogleが最も厳しく監視するのがリンクパターン。**PBN・有料リンク・低品質ディレクトリ・汎用ゲスト投稿は厳禁**（短期ブーストの価値なし、ペナルティ risk のみ）。安全かつ効くのは **(a) データ・ジャーナリズム（独自データを記者が引用）、(b) ツール埋め込み、(c) 公的機関・自治体からの参照、(d) 有資格専門家の寄稿/相互監修** の4系統。同時にこれらはGEO（AI被引用）の燃料でもある。

### 獲得可能な被リンク先 10（実在カテゴリ・具体アプローチ）

| # | リンク先カテゴリ | 具体的アプローチ | 安全性/効果 |
|---|---|---|---|
| 1 | **PR TIMES / 共同通信PRワイヤー等の配信→ニュースサイト二次掲載** | 「全国◯◯自治体の解体補助金・空き家データ」調査リリース。記者が引用しやすい数値・図表・引用可CCを用意 | 高/高 |
| 2 | **地方自治体・空き家バンクの参考リンク欄** | 補助金ページが正確（一次情報準拠）であることを示し、自治体の「関連リンク／民間情報」欄への掲載を依頼。`/area/*/subsidy`の正確性が武器 | 高/高 |
| 3 | **生前整理普及協会・関連協会サイト** | 村上様（認定指導員）経由で、協会の指導員紹介・コラム欄からの参照 | 高/中 |
| 4 | **介護・終活系メディア（みんなの介護・終活ねっと系等）への専門寄稿** | 大久保/村上署名で「介護離職と実家じまい」を寄稿し著者リンクを獲得 | 高/中 |
| 5 | **大学・公開講座（神奈川大学エクステンション等）の講師紹介ページ** | 村上様の講師活動からの参照リンク | 高/高（.ac.jp） |
| 6 | **不動産・相続士業（司法書士・税理士・宅建士）事務所サイト** | 領域別監修者の事務所からの相互紹介・監修クレジットリンク | 高/中 |
| 7 | **データ・ツールの埋め込み（固定資産税シミュレーター/空き家診断のembed配布）** | 士業ブログ・不動産メディアに「貴サイトに無料で埋め込めるツール」を提供＝自然な被リンク | 高/高 |
| 8 | **HARO後継 Featured.com / 日本のプレスリクエスト系** | 「実家じまい・生前整理」の専門家コメント提供で編集リンク獲得 | 高/中 |
| 9 | **地域情報・自治体広報・社会福祉協議会のリソースページ** | 高齢者向け「終活・片付け相談先」リストへの掲載依頼（公益性が高く採用されやすい） | 高/中 |
| 10 | **業界統計・データジャーナリズムの被引用（記者・ブロガーが数値を引用）** | municipalities.json由来の「補助金がある自治体の割合」等を引用可能な統計ページとして公開し、引用元リンクを誘発 | 高/高 |

**運用ルール**: アンカーは自然分散、リンク先は実在・関連・高信頼ドメインに限定。月次で被リンクプロファイルを監視（既存 `/link-run`・link-director エージェント基盤を活用）。否認は明確なスパムのみ。

---

## 4. テクニカルSEO監査チェックリスト（Next.js/Vercel/microCMS・優先度付き）

コードベース実査で確認した固有の問題を含む。

| 優先 | 項目 | 現状所見（実コード確認済） | アクション |
|---|---|---|---|
| **P0** | **Article schema の著者が Person でない** | `app/articles/[id]/page.tsx` の JSON-LD は `author: {@type:"Organization"}`。UIには監修者バイラインが出るのに**構造化データの著者は法人**。2026年2月の「Authors」評価に人物が渡っていない | `author` を `Person`（監修者）に変更し、`/supervisor/*` の `@id` と連結。`reviewedBy` も付与 |
| **P0** | **大量同時公開によるHCS/インデックス遅延** | articles配下 imp11/clk0、100記事が未反映。短期大量公開＝Coreアップデート標的 | Indexing API送信は段階投入（既に実施）。低品質はnoindex/統合。`revalidate=600`のISRは妥当 |
| **P0** | **インデックス未進行・soft 404リスク** | Next.jsの典型問題：notFound経路や中間状態が200で返るとsoft 404化。2025年のGoogleレンダリング更新で**非200ページはレンダリング対象外** | GSCカバレッジで「クロール済み未登録／検出未登録」を点検。`notFound()`が正しく404を返すか実機確認 |
| **P0** | **CTR底上げ（title/meta）** | 平均CTR0.39%。tax-simulatorのみ3.32% | §6で詳述。pSEOのtitle/descをベネフィット型に一括改修 |
| **P1** | **Core Web Vitals（INP/LCP/CLS）** | GTMはafterInteractive、AdSenseはlazyOnloadと**遅延読み込みは良好**。記事サムネに`priority`/`fetchPriority="high"`も適切。要監視はINP<200ms（AdSense/GTMの実行コスト） | Vercel Speed Insights/CrUXで実測。INP悪化時はサードパーティJSをさらに後ろへ |
| **P1** | **canonical の健全性** | layout/各ページで `getCanonicalUrl` 運用は良好。記事は`alternates.canonical`あり。**canonical先が200・非リダイレクト・indexableか**の検証が未確認 | canonical先がmiddlewareの301に巻き込まれていないか全テンプレで検査（日本語URL正規化との競合に注意） |
| **P1** | **サイトマップ分割の鮮度** | `generateSitemaps`で都道府県別分割＋`/api/sitemap-index`へrewriteは正しい設計。`lastModified=new Date()`は**毎回現在時刻**になり鮮度シグナルが嘘になる | `lastModified`を実コンテンツ更新日に。articlesは`revisedAt`を反映 |
| **P1** | **構造化データの重複・競合** | layoutで Organization を **2回出力**（head内インラインJSON-LD ＋ body末尾 `EeatJsonLd`）。`@id`は共通だが二重定義は冗長 | Organizationを単一ソース化（`EeatJsonLd`に集約）。`knowsAbout`等のリッチ情報を残す方に統合 |
| **P2** | **FAQPage の扱い** | `app/lib/faq/schema.ts`等でFAQ実装あり。**2026年5月7日でFAQリッチリザルトは廃止**。ただしFAQPage付きページはAI Overview被引用が3.2倍 | 見た目のリッチ目的は捨て、**AI Overview/GEO目的でFAQPageは維持**。HowTo schemaはデスクトップ廃止済のため過度な依存をやめる |
| **P2** | **モバイル/PCのCTR乖離** | モバイルCTR1.9% vs PC0.16%。モバイルファースト・インデックスでモバイルが実体 | モバイルでのタイトル切れ・CTA位置を最優先で最適化（`MobileFooterBar`活用） |
| **P3** | **robots/メタの noindex 管理** | 低品質pSEO（cleanup CTR0.04%）の扱い | 「誰の役にも立っていない」判定ページはnoindexかコンテンツ拡充の二択 |

---

## 5. 構造化データ戦略（リッチリザルト/AI Overview露出の最大化）

2025-2026の潮流：**リッチリザルト（見た目）よりAI被引用（GEO）に価値がシフト**。FAQ/HowToのリッチ表示は縮小だが、構造化データはLLMが実体・著者・信頼性を読む主経路として重要性が上がっている。ページ種別ごとの実装方針：

| ページ種別 | 実装すべきschema | 狙い |
|---|---|---|
| **全ページ共通（layout）** | `Organization` + `WebSite`（`@id`連結・`sameAs`で外部プロフィール）+ `BreadcrumbList` | ナレッジパネル・実体証明。`sameAs`が指名検索/権威性に直結 |
| **記事（/articles）** | `Article` + **`author:Person`（監修者）** + `reviewedBy` + `datePublished/dateModified` + `mainEntityOfPage` | 著者性・鮮度をGoogle/AIに。**§4のP0修正が前提** |
| **監修者（/supervisor/*）** | `Person`（`hasCredential`既に実装・良好）+ `sameAs`（協会・大学・SNS・PR）+ `worksFor` | E-E-A-Tの著者ハブ。記事の`author`からここへ`@id`参照 |
| **無料ツール（/tools/*, tax-simulator）** | `SoftwareApplication`/`WebApplication`（`applicationCategory`, `offers:無料`, `aggregateRating`は実レビューがある時のみ） | 「情報の独自性」をGoogleに明示。CTR最強ページの権威強化 |
| **補助金pSEO（/area/*/subsidy）** | `FAQPage`（AI Overview用に維持）+ `BreadcrumbList` + 適切なら`GovernmentService`/`Dataset` | 「[地名]の補助金はいくら？」のAI Overview直接回答枠を狙う |
| **地域ハブ・会社情報** | `LocalBusiness`（既に`local-business.ts`あり）※電話番号非露出ルールと整合させ`telephone`は出さない | 地域 × サービスの実体証明 |
| **データ公開ページ** | `Dataset` + `Organization`（提供元） | 「全国補助金DB」を被リンク/被引用される統計資産に |

**AI Overview/GEO最適化の横断ルール**：(1) 各ページ冒頭200字で主要クエリに直接回答（AIは冒頭を最重視）、(2) H2/H3を疑問文化（「実家じまいの費用はいくら？」）、(3) 具体的な数値・統計を本文に（曖昧表現はAIに引用されない）、(4) 「最終更新日」を可視表示。

---

## 6. CTR改善（0.39% → 2%超へ）

**tax-simulatorが3.32%を取れている理由＝(1) 検索意図に1対1で答えるツール（即時ベネフィット）、(2) 「いくら？」という疑問に数値で応える明確な価値、(3) 地域名×具体ニーズのロングテール。** これを全ページに横展開する。

**具体策**：
1. **title をベネフィット＋数値＋ブランドの型に統一**
   - Before: `[市区町村] 固定資産税シミュレーター`
   - After: `[市区町村]の固定資産税はいくら？1分で試算｜空き家・実家の維持費｜ふれあいの丘`
   - 補助金: `[市区町村]の解体補助金 最大◯◯万円｜2026年度の対象・申請を解説`（`extractMaxAmount`の数値をtitleに反映）
2. **meta description に「数値・年度・行動」を入れる**（「2026年度」「最大◯万円」「無料」「1分」）。鮮度はAI Overviewにも効く。
3. **構造化データでSERP占有面積を増やす**（Breadcrumb・FAQPageのAI回答枠・ツールのリッチ要素）。
4. **モバイル優先でtitle32字以内・主要KW前方**（モバイルCTR1.9%が実体）。
5. **pSEOに数値の「結論先出し」**（SubsidySummaryBox/DirectAnswerFaqは良い土台。冒頭で「○○市は最大◯万円」と断言）。
6. **ブランド名をtitle末尾に固定**し、ブランド露出→指名検索の刷り込みを兼ねる。

**目標**: pSEO全体を0.35%→1.5%、tax-simulatorを3.32%→5%、記事を0%→2%へ。加重平均でサイトCTR2%超は到達可能。

---

## 7. Coreアップデート耐性（次で沈まない予防策）

2025年12月Coreアップデートで helpful content システムはコアに完全統合され、**ユーザー満足度（滞在・回遊・直帰戻り・直接来訪＝指名）が主評価軸**になった。2026年3月Coreは史上最も荒れた（Top-3の79.5%が変動）。耐性の作り方：

1. **HCS標的フォームから脱却**：短期大量公開を止め、品質基盤（baseline trust）が立つまで活動頻度を上げても効かない。低品質pSEO（cleanup CTR0.04%）はnoindex/統合。
2. **指名検索＝Proof of Workを作る**（§2）。Coreアップデートで生き残るのは「ブランドとして認知された実在事業」。
3. **YMYL年次レビューサイクルを制度化**：全YMYL記事に「最終更新日／レビュー日」、法改正時の即時更新（相続登記義務化・空き家特措法・3,000万円特別控除）。
4. **領域別有資格者監修で Expertise を底上げ**（§1）。2級だけのYMYL拡大は次Coreで沈むリスク最大。
5. **独自性に投資**：tax-simulator・municipalities.json・当事者体験——スパマーが複製できない資産を厚くする。SERP要約の焼き直しは二度と評価されない。
6. **回遊設計で満足度シグナル**：関連記事3本固定（`ArticleRelatedPosts`は良い）、文脈別CTA、ハブ→クラスターの内部リンクで滞在・回遊を伸ばす。

---

## Google対策の観点での勝ち筋（断言・1段落）

**ふれあいの丘がGoogleで勝つ唯一の道は「スパマーが複製できない3資産（独自ツール・公的補助金DB・当事者の実体験）を核に、有資格者監修と村上充恵 様の総合監修でYMYLのExpertise/Authoritativenessを最短で埋め、データPRと自治体・協会・大学・士業からの安全な被リンクで指名検索（Proof of Work）を点火し、Article schemaの著者をPersonに直して著者性をGoogleとAI Overviewの両方に明示する」——この一本道である。** 記事を増やす前にブランドと専門性を作れ。指名検索ゼロ・監修空白・Person未連結を放置したまま量産すれば、次のCoreアップデートでドメインごと沈む。逆に、この4点（領域別監修・村上監修・データPR被リンク・Person schema）を6月中に着手すれば、tax-simulatorとarea-subsidyの既存ポテンシャル（pos5-20）が一気に開花し、CTR2%・指名検索発生・被リンク獲得が連鎖して、エグジットに必要なトラフィック資産になる。

---

## 出典（2024-2026 / WebSearch 2026-06-02 確認）

- Google Search Central — Creating Helpful, Reliable, People-First Content / Authors: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google E-E-A-T Guidelines 2026 Playbook（Keywords Everywhere）: https://keywordseverywhere.com/blog/google-e-e-a-t-guidelines-an-overview/
- Google Quality Raters Guidelines Update 9/25（SEO-Kreativ）: https://www.seo-kreativ.de/en/blog/google-quality-raters-update_9-25/
- December 2025 Core Update analysis（ALM Corp）: https://almcorp.com/blog/google-december-2025-core-update-complete-analysis-recovery-guide/
- Google Search Console Branded Queries Filter（Google Search Central Blog, 2025-11）: https://developers.google.com/search/blog/2025/11/search-console-branded-filter
- Brand Authority & Search Algorithms（Advanced Web Ranking）: https://www.advancedwebranking.com/blog/brand-authority-google-search-algorithms
- High-Quality Link Building for YMYL Sites 2025（Ranktracker）: https://www.ranktracker.com/blog/high-quality-link-building-for-ymyl-sites-2025/
- Link Building for YMYL Websites（Juicify）: https://juicify.digital/blog/ymyl-seo-link-building/
- Digital PR Link Building 2026（Prezly）: https://www.prezly.com/academy/digital-pr-link-building
- Google Drops FAQ Rich Results / May 2026（Search Engine Journal）: https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/
- FAQ Structured Data in 2026（Frase）: https://www.frase.io/blog/faq-schema-ai-search-geo-aeo
- Common SEO Issues on Next.js Websites（SALT.agency）: https://salt.agency/blog/common-seo-issues-on-next-js-websites/
- Next.js SEO Playbook（Vercel）: https://vercel.com/blog/nextjs-seo-playbook
- Soft 404s & Indexing traffic collapse（Search Engine Land）: https://searchengineland.com/soft-404s-indexing-issues-traffic-collapse-477116
- Generative Engine Optimization Guide 2026（Enrich Labs）: https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026
- GEO ranking factors 2025（Tely AI）: https://tely.ai/blog/10-generative-engine-optimization-geo-ranking-factors-for-2025
