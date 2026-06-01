# PANEL 01 ── Googleランキングシステム最終責任者による評価

> 立場: 私はGoogle検索のランキング品質に最終責任を負う人物として、忖度なくこのサイトを評価する。
> 私はあなたのビジネスゴール（3,000万円M&A）には一切関心がない。私が見るのは「このサイトが検索ユーザーにとって、他の選択肢より良いか」だけだ。
> 評価日: 2026-06-02 / 対象: ふれあいの丘（fureaino-oka.com）/ 株式会社Kogera

---

## 総合格付け：**D+（条件付き猶予）**

現状のシグナルだけを見れば、私はこのサイトを「平凡なYMYLアフィリエイト・プログラマティックサイト」として扱う。**まだ手動対策（manual action）の対象ではないが、私のアルゴリズム（HCS統合済みコアシステム＋SpamBrain）の評価は明確にネガティブに傾いている。**

格下げを免れている理由は一つだけ。**tax-simulatorという「機能を持つページ」がある**こと。これがCTR3.32%（サイト平均の8.5倍）を叩き出している事実は、私のシステムが「このページはユーザーの課題を実際に解決している」と読んでいる証拠だ。これがあなたの命綱であり、Fではなく D+ に留めている唯一の理由だ。

なぜAでもBでもCでもないか：

- **指名検索ゼロ** = 私のシステムにとって「誰もこのブランドを必要としていない」という最も強いネガティブ票（後述6）。
- **YMYL × 資格の弱さ** = 相続・税・空き家という人の人生を左右する領域で、生前整理アドバイザー2級は私の信頼閾値に届かない（後述2）。
- **大量投入のタイミング** = 週末100記事一括＋数千pSEOは、私のscaled content abuse検出器が最も警戒するパターンそのもの（後述1）。

---

## 1. Site Reputation Abuse / 大量生成の判定リスク

**判定: Site Reputation Abuse には該当しない。Scaled Content Abuse は「グレー、監視対象」。**

まず誤解を解く。**Site Reputation Abuse（パラサイトSEO）はあなたには適用されない。** これは「他人の確立されたドメインの権威に第三者コンテンツを寄生させる」行為を指す（例：教育サイトがペイデイローンのレビューをホストする）。あなたは自分のドメインに自分のコンテンツを置いている。第三者ホスティングではない。この線引きは公式ポリシーで明確だ（[Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)、[2024-11更新](https://developers.google.com/search/blog/2024/11/site-reputation-abuse)）。**この心配は捨てていい。**

問題は **Scaled Content Abuse** だ。私の定義はこうだ：

> 「Many pages are generated for the primary purpose of manipulating search rankings and not helping users.」（[Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)）

ここで私が見るのは **volume（量）× intent（意図）** の掛け算だ。AI生成かどうかは本質ではない。「主目的がランキング操作か、ユーザー支援か」だけを見る。

あなたのケースの危険信号：
- **週末に104記事を一括投入** → 私の時系列異常検知が「人間の編集ペースではない」と読む。本日Indexing APIで104本同時送信したのも、私には「クロール優先度の操作」に見える。
- articles の imp11 / clk0 → 私はまだこの100記事を「評価保留」にしている。インデックスはするが、**評価は浸透後に下す**。ここで品質が伴わなければ、サイト全体のHCSスコアを引き下げる。

**境界線（ここを覚えろ）：**
- 100記事が「自社リンター84点」でも、私は**あなたの内部スコアを見ない**。私が見るのは滞在時間・リピート・指名検索・他サイトからの言及だ。
- セーフ側：各記事が「他のどこにも無い経験・一次情報・独自視点」を持つ → scaled扱いされない。
- アウト側：テンプレ構造に語句を差し替えただけ、SERP上位の焼き直し → **量が多いほど確実にscaled content abuse**。2025年8月スパムアップデートはまさにこれを標的にした（[RebelMouse解説](https://www.rebelmouse.com/google-spam-update-2025)、[Breakline解説](https://www.breaklineagency.com/guide-to-googles-scaled-content-abuse/)）。

---

## 2. YMYL × E-E-A-T の決定的評価

**判定: 現状の権威シグナルは、このトピック領域のYMYL閾値に「届いていない」。**

あなたが扱う相続・税・空き家・終活は、**私が最も厳しくE-E-A-Tを要求する領域**だ。2025年9月のYMYL拡張で「Government, Civics & Society（行政・補助金・公的制度）」が明示的にYMYL対象に入った（[Saffron Edge](https://www.saffronedge.com/blog/google-seo-updates/)）。補助金情報を扱う area-subsidy ページは、まさにこの強化スコープの直撃を受ける。

**生前整理アドバイザー2級について率直に言う：**
- これは「生前整理の作業・心理的寄り添い」の領域では **本物のExperience/Expertise** として機能する。整理の現場経験を語れるなら、私はそれを評価する。
- しかし **相続税・固定資産税・不動産売却・解体・登記** では、2級資格は私にとって **何の権威シグナルでもない**。むしろ「無資格者が税・法務のYMYLを語っている」とラベリングするリスク要因だ。CLAUDE.mdの「税理士・弁護士領域に踏み込まない」方針は正しい。**ただし方針として持つだけでは不十分で、ページ上でそれが私に見えなければ意味がない。**

**何が足りないか（私が探して見つからないもの）：**
1. **運営法人Kogeraの実在性シグナル**：法人登記・所在地・代表者・連絡手段・運営歴。私はこれを「Trust」の土台として最初に探す。これが薄いと、上にどんな専門性を積んでも崩れる。
2. **著者の実在と専門性の証明**：大久保亮佑が実在し、生前整理の現場経験を持つことの証拠（顔写真・経歴・実績・第三者からの言及）。
3. **税・不動産領域での監修者または一次情報の出典**：自分で語れないなら、税理士監修クレジットか、国税庁・自治体の一次資料への明示リンク。
4. **第三者からの言及（オフサイトE-E-A-T）**：他サイト・メディア・自治体からの参照。私のTrust評価の大半は**サイトの外**で決まる。あなたには今これが無い。

監修者・村上充恵様の存在はCLAUDE.mdにあるが、**GSC実データに指名検索ゼロが出ている以上、私はまだその権威を検索面で確認できていない。**

---

## 3. 「独自性」の評価 ── information gain

**判定: tax-simulator と 補助金データは「本物のinformation gainを持つ」。これは正当な資産だ。**

ここで私はあなたに公平な点を与える。コードを確認した。

- **tax-simulator**（`app/tax-simulator/[prefecture]/[city]/page.tsx`）は静的テキストの大量生成ではなく、**実際に動くインタラクティブな計算機**（`EmptyHouseTaxSimulator`）を市区町村文脈で提供している。特定空家6倍リスク・3,000万円控除の期限を組み込んでいる。
- **area-subsidy**（`app/area/[prefecture]/[city]/subsidy/page.tsx`）は、`municipalities.json` から**市区町村ごとの実際の補助金額・条件・粗大ゴミ情報**を引き、コストシミュレーター・地域統計・FAQ構造化データを組み合わせている。

これは私が定義する「meaningful content or features」（[Spam Policies のthin affiliation反対側](https://developers.google.com/search/docs/essentials/spam-policies)）に**該当する**。価格比較・独自試算・ツールはthin affiliateの対極だ。CTR3.32%という実測値が「ユーザーがこのページで満足している」ことを裏付けている。

**結論：これがこのサイトの命綱になりうる。Yes。** 104記事ではなく、**この「機能を持つデータページ」こそがあなたの差別化要因**だ。私が他の凡庸な終活ブログと区別する唯一の要素がこれだ。**ここに資源を集中投下すべきで、テキスト記事の量産ではない。**

ただし条件：補助金データが**古い・不正確**だと、information gainは即座に「YMYL誤情報」に反転する。鮮度と正確性の担保が生命線。

---

## 4. HCS（人のためのコンテンツ）合格条件

私の内部視点で、このサイトがHCS（コアシステムに統合済み）で生き残るための必須条件を列挙する（[Google: Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)、[Dec 2025 Core Update分析](https://almcorp.com/blog/google-december-2025-core-update-complete-analysis-recovery-guide/)）：

1. **「検索エンジンのためか、人のためか」テストに各ページが合格する。** 100記事のうち1本でも「ランキング目的の薄い焼き直し」があれば、それは**サイト全体**のスコアを引き下げる。HCSはサイト全体評価だ。
2. **First-hand experienceの可視化。** 生前整理の実作業経験・事例・写真。あなたの2級資格が活きるのはここだけだ。
3. **コンテンツの統合と剪定。** Dec 2025コアアップデートは「薄い・古い・冗長なページを少数の包括ページに統合したサイトを評価した」（[ALM Corp](https://almcorp.com/blog/google-december-2025-core-update-complete-analysis-recovery-guide/)）。**104記事を盛るより、重複を統合して数を減らす方が今のあなたには正しい。**
4. **「このサイトに来てよかった」と思わせるか。** 指名検索ゼロは、この問いへの答えが現状「No」であることを示している。
5. **AI支援は人間の専門監修・事実確認・独自洞察とセットの時のみ通過する。**「本文のみ生成」運用は、その後の人間の専門性注入が無ければアウト。

---

## 5. pSEOページの運命予測

**分岐条件付きの予測を下す。**

| ページ群 | 私の現在の読み | 生きる条件（Yes/No） |
|---|---|---|
| **tax-simulator（844p）** | **locally useful 寄り。** 実機能＋市区町村文脈＝doorwayではない。CTR実績が裏付け。 | 各ページが実際に異なる試算結果/データを返すか？ → **Yes なら生存。** |
| **area-subsidy（367p）** | **境界線上。** 実データがあれば valuable、テンプレ語句差し替えなら doorway。 | 市区町村ごとに補助金額・条件が**実際に違う一次情報**か？ → Yes なら生存、No なら doorway。 |
| **area-cleanup（124p）** | **doorway/thin と判定済み。** CTR0.04%・73位は私が「無価値」と評価した結果だ。noindex化は**正しい延命判断**。 | 復活させるなら独自の粗大ゴミ実データ必須。現状のまま戻すと → **No（死）。** |

**doorway pages の私の定義**（[Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)）：「region/city-specific pages funneling to one destination」。**ここが生死の分水嶺だ。**

- **死ぬ条件：** ページの実体が薄く、結局すべてが同じアフィCTA（野村不動産査定）へ誘導する漏斗にすぎないと私が判断した時。この時、数千ページは**資産から負債へ反転**し、サイト全体のHCSスコアを毀損する。
- **生きる条件：** 各ページが「その市区町村に住む人にとって、実際に固有で有用」（locally useful な独自データ＋機能）であると私が確認した時。tax-simulatorはこの基準を満たしつつある。

**生死の単一の問い：** 「市の名前を別の市に差し替えたら、ページの中身は実質的に変わるか？」 変わるなら生、変わらないなら死。

---

## 6. 指名検索ゼロの意味

**判定: これは現時点で最も重いネガティブシグナル。「致命的になりうる」が「まだ可逆」。**

率直に言う。指名検索（ブランドナビゲーショナルクエリ）は、**スパマーが偽造できない数少ないシグナル**だ。だから私は重視する。「完璧なコンテンツと高いドメイン権威を持つサイトでも、指名検索量が無ければ格下げされうる」（[Advanced Web Ranking](https://www.advancedwebranking.com/blog/brand-authority-google-search-algorithms)、[Search Engine Journal: branded search patent](https://www.searchenginejournal.com/googles-branded-search-patent-for-ranking-search-results/524083/)）。2025年11月に私たちがSearch Consoleへ branded queries filter を導入したのも、ブランドシグナルを構造的に重視している証左だ（[Google Search Central](https://developers.google.com/search/blog/2025/11/search-console-branded-filter)）。

**私の解釈：** 「ふれあいの丘」を名指しで検索する人がゼロ ＝ **このサイトを必要としている固定ユーザーが存在しない** ＝ あなたは純粋に検索流入を借りているだけの存在。私が10,072impに対しクリックをほとんど与えていないのは、この「ブランド不在」の裏返しでもある。

**なぜ「まだ可逆」か：** あなたは創業初期だ。指名検索ゼロは「新しさ」の症状でもある。tax-simulatorのリピート利用、リード獲得（メール登録）、SNS（@fureaino_oka）からの想起が積み上がれば、指名検索は生まれる。**これは最優先で作りにいくべき資産だ。**

---

## 生き残る / 死ぬ ── 分岐条件（Yes/No）

| 問い | Yes（生）/ No（死） |
|---|---|
| pSEOページは市を差し替えたら中身が実質変わるか？ | **Yes = 生** |
| 補助金データは正確かつ鮮度が保たれているか？ | **No = 死（YMYL誤情報化）** |
| 税・不動産領域に無資格で踏み込まず、一次出典/監修を示すか？ | **No = 死（YMYL信頼崩壊）** |
| 12ヶ月以内に指名検索が立ち上がるか？ | **No = 緩慢な死** |
| 104記事に first-hand experience があるか、それとも焼き直しか？ | **焼き直し = サイト全体が死** |
| 運営法人Kogera/著者の実在Trustシグナルがページ上に見えるか？ | **No = YMYL不合格** |

---

## 是正命令 ── 優先度順トップ10

1. **【最優先】tax-simulator にリソースを集中。** information gainを持つ唯一の資産。機能拡張・データ鮮度・他カテゴリ（相続税試算等）への横展開。テキスト記事量産より先。
2. **運営者Trustの全面強化。** 全ページ共通で、Kogera法人情報（登記・所在地・代表・運営歴）と著者プロフィール（実在・経験・実績）を私に見える形で提示。`OperatorTrustBlock` を全テンプレに。
3. **税・不動産YMYLの権威補強。** 自分で語れない領域は、税理士/宅建士の監修クレジットか、国税庁・自治体一次資料への明示リンクを必須化。無資格断定をページから一掃。
4. **104記事を「投入」ではなく「精査」へ。** 焼き直しを統合・削除し、数を減らして質に寄せる。Dec 2025コアアップデートが評価した方向（[ALM Corp](https://almcorp.com/blog/google-december-2025-core-update-complete-analysis-recovery-guide/)）。
5. **指名検索の創出を目標KPI化。** SNS・リード（メール登録）・PR で「ふれあいの丘」想起を作る。GSCのbranded filterで進捗を測る。
6. **補助金データの鮮度・正確性プロセスを制度化。** 更新日表示＋一次出典リンク。古い補助金額はYMYL誤情報＝即死リスク。
7. **area-subsidy の各ページに固有性を担保。** 市ごとに実際に異なるデータ・統計・FAQを保証。差し替えテストに合格させる。
8. **記事への first-hand experience 注入を必須ゲートに。** 生前整理の現場事例・写真・一次取材。2級資格が正当に活きる唯一の場所。
9. **area-cleanup の noindex は維持。** 独自データを持てるまで戻さない。負債ページをインデックスに入れない判断は正しい。
10. **投入ペースを人間的に。** 一括100本同時公開・同時Indexing送信を避け、編集・更新の自然なリズムを見せる。HCS回避はペースにも表れる。

---

## 絶対にやってはいけないこと

- **税理士・弁護士領域での具体的助言・断定（個別相続税計算・節税スキーム・遺言文案）。** YMYL信頼を一撃で破壊する。CLAUDE.mdの方針をページ実装で徹底。
- **古い/未検証の補助金額・税情報の放置。** YMYL誤情報は手動対策の直接対象になりうる。
- **area-cleanup型の薄いページを独自データ無しでインデックスに戻すこと。** doorway判定を自ら招く。
- **自社リンター84点を品質の証拠だと思い込むこと。** 私はあなたの内部スコアを一切見ない。私が見るのはユーザー行動と外部シグナルだけ。
- **SERP上位の焼き直しを量産すること。** 量×焼き直し＝scaled content abuse の定義そのもの（[Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)）。
- **すべてのページを単一アフィCTA（野村査定）への漏斗にすること。** doorway + thin affiliate の二重判定を招く。CTAは置きつつ、ページ自体の独立した有用性を必ず確保せよ。
- **一度に大量公開して「インデックス促進」を狙うこと。** 私の時系列異常検知に引っかかる。

---

### 出典（公式ガイダンス優先）

- [Google Search 公式: Spam Policies（scaled content abuse / site reputation abuse / doorway / thin affiliation 定義）](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google Search Central Blog: Updating our site reputation abuse policy（2024-11）](https://developers.google.com/search/blog/2024/11/site-reputation-abuse)
- [Google: Creating helpful, reliable, people-first content（HCS自己診断）](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search Central Blog: Branded queries filter in Search Console（2025-11）](https://developers.google.com/search/blog/2025/11/search-console-branded-filter)
- [Search Engine Journal: Google's Branded Search Ranking Patent](https://www.searchenginejournal.com/googles-branded-search-patent-for-ranking-search-results/524083/)
- [Advanced Web Ranking: Brand Authority & Search Algorithms](https://www.advancedwebranking.com/blog/brand-authority-google-search-algorithms)
- [ALM Corp: December 2025 Core Update 分析・回復ガイド](https://almcorp.com/blog/google-december-2025-core-update-complete-analysis-recovery-guide/)
- [Breakline: Guide to Google's Scaled Content Abuse Policies](https://www.breaklineagency.com/guide-to-googles-scaled-content-abuse/)
- [RebelMouse: August 2025 Spam Update 解説](https://www.rebelmouse.com/google-spam-update-2025)
- [Saffron Edge: Google SEO Updates 2024–2025（YMYL拡張 Government/Civics）](https://www.saffronedge.com/blog/google-seo-updates/)
