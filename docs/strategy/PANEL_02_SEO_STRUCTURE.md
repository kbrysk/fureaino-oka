# PANEL 02 — SEO構造・情報設計（IA）監査と再設計

**対象**: ふれあいの丘（fureaino-oka.com / Next.js App Router / Vercel / microCMS）
**観点**: サイトアーキテクチャ / 情報設計 / 内部リンク / トピカルオーソリティ
**作成日**: 2026-06-02
**結論の一行**: *pSEO・ツール・記事という3つの資産は「同じドメインに同居しているだけの別サイト」であり、内部リンクで結合し直せば追加投資ゼロで順位とCVを同時に押し上げられる。*

---

## 0. 監査サマリ（実コードから確認した事実）

| 資産 | ルート | 規模 | GSC実績 | 内部リンクの現状 |
|---|---|---|---|---|
| 地域ハブ | `/area/[pref]/[city]` | pSEO | — | spoke全てへ＋`tax-simulator`へ発リンク（**唯一の優等生**） |
| 補助金スポーク | `/area/[pref]/[city]/subsidy` | pSEO | **47位** | 兄弟spoke・近隣・`master-guide`へ。**`tax-simulator`へリンク無し** |
| 費用/粗大ゴミ | `/area/[pref]/[city]/{cost,garbage}` | pSEO | — | 兄弟spokeへ |
| 遺品整理 | `/area/[pref]/[city]/cleanup` | pSEO | **noindex+nofollow隔離済** | PageRank流出を遮断（妥当な判断） |
| 税金試算 | `/tax-simulator/[pref]/[city]` | 844p | **CTR3.32%（最強）** | subsidy/cost/`master-guide`へ発信。**被リンクは地域ハブのみ** |
| 編集記事 | `/articles/[id]` | 104本（pipeline 122） | imp11 / clk0 | **記事・タグ・記事一覧のみ。area/tax-simulatorへゼロリンク** |
| 状況別LP | `/articles/situation/[s]` | 5本 | — | キュレーション記事へ。ツールへ1本 |
| カテゴリ/タグ | `/articles/category|tag/[x]` | 6+11 | — | 記事・状況へ |
| 診断ツール | `/tools/*` | 8種 | — | 主に査定CTAへ |
| 公式ピラー候補 | `/articles/master-guide` | 1本 | — | tools/area/ending-noteへ（**事実上のピラー**） |

**グローバルナビ（全ページ固定）**: ホーム / ガイドブック / 記事 / ツール / はじめかた / チェックリスト / 資産 / エンディングノート / 設定 / お問い合わせ。
→ **致命的事実: 最大の資産である `/area`（pSEO数千ページ）と `/tax-simulator`（最強CTR）がグローバルナビに存在しない。** `/area` はフッターに1本あるのみ、`/tax-simulator` はナビ・フッターのどこにも無い。サイト全体のPageRankが、トラフィックを生む2大資産へほぼ流れていない。

---

## 1. 現状IAの致命的欠陥 — 「3つの島」問題

WebSearch調査でも繰り返し指摘される通り、pSEOと編集コンテンツは**サイロを越えて相互リンクすることで初めて意味ネットワークが強化される**（[Postdigitalist](https://www.postdigitalist.xyz/blog/programmatic-seo-vs-editorial-seo)、[SeoMatic](https://seomatic.ai/blog/programmatic-seo-internal-linking)）。本サイトはこの逆を行っている。

### 現状構造図（テキストツリー）

```
ふれあいの丘（fureaino-oka.com）
│
├─ [グローバルナビ] ホーム / 記事 / ツール / はじめかた / チェックリスト / 資産 / EN / 設定
│
├─【島A：地域 pSEO】★ナビに無い（フッター1本のみ）
│   └ /area
│       └ /area/[pref]/[city]  ←地域ハブ（spoke全部＋tax-simへ発信）★唯一結合できている
│           ├ /subsidy  ←47位。tax-simへリンク無し ✗
│           ├ /cost
│           ├ /garbage
│           └ /cleanup  ←noindex/nofollow隔離
│
├─【島B：ツール／試算】★ナビ"ツール"はあるが tax-simulator はナビにもフッターにも無い
│   ├ /tax-simulator/[pref]/[city]  ←CTR3.32%最強。被リンク=地域ハブのみ ✗
│   └ /tools/{jikka-diagnosis,akiya-risk,empty-house-tax,...}
│
└─【島C：編集記事】★島A・島Bへ一切リンクしない閉鎖系
    └ /articles
        ├ /articles/master-guide  ←事実上のピラー（tools/areaへ発信）
        ├ /articles/[id] ×104    ←関連記事・タグ・一覧のみ。area/tax-simへゼロ ✗✗✗
        ├ /articles/category/[c] ×6
        ├ /articles/tag/[t] ×11
        └ /articles/situation/[s] ×5  ←キュレーション。ツール1本
```

### 欠陥の核心（4点）

1. **記事→pSEO/ツールへの発リンクが構造的にゼロ**。`app/articles/[id]/page.tsx` は本文・関連記事・タグ・査定CTAのみで、`/area` や `/tax-simulator` への動線が**テンプレートに存在しない**。104本の記事が獲得しうるPageRankとトピカル文脈が、収益ページ（pSEO・査定）に1ミリも伝わらない。

2. **最強資産 tax-simulator が孤立島**。被リンクは地域ハブからの1本のみ。subsidyスポーク（47位＝あと一押しで1ページ目）からも、記事からも、ナビからもリンクされない。「最強CTRを持つページに権威が集まらない」＝勝ち筋を自ら塞いでいる。

3. **ハブ&スポークの"ハブ"が3つに割れている**。地域ハブ（`/area/[city]`）、master-guide、状況別LPがそれぞれ部分的にハブ機能を持つが、**互いを束ねる上位ピラーが不在**。Googleから見て「このサイトの中心トピックはどこか」が読めない。

4. **トピカルオーソリティの"テーマ語"が内部リンクのアンカーに乗っていない**。subsidyスポークやarea hubのCTAアンカーが「無料見積もり」「はじめかた」等の汎用語で、`master-guide`へ送っている。2026年は**送り先トピックを正確に表す説明的アンカー**が効く（[Fuel Online](https://fuelonline.com/seo/internal-linking-strategy-seo-guide/)）。「実家じまい完全ガイド」等にすべき。

---

## 2. トピカルオーソリティの理想構造（ピラー＋クラスター）

理想は**3クリック以内に全重要ページが収まる**3階層（[Digital Applied](https://www.digitalapplied.com/blog/internal-linking-strategy-2026-large-site-architecture-guide)）。本サイトの全資産を、**3つの中核ピラー（=勝ち筋ハブ）**の下にトピッククラスターとして再編成する。

### 理想構造図（テキストツリー）

```
ふれあいの丘
│
├─[グローバルナビ改] ホーム / 実家じまい / 空き家・不動産 / 相続・手続き / 記事 / 無料ツール
│                     └ ↑ 3ピラーをナビに昇格（=全ページから3クリック以内を保証）
│
├─■ピラー1: /jikka-jimai （実家じまい完全ガイド）  ※master-guideを昇格・拡張
│   ├─クラスター記事: 進め方/業者選び/費用/親の説得/遺品整理/買取/粗大ゴミ
│   ├─状況LP: /articles/situation/{jikka-cleanup, before-care}
│   ├─ツール: /tools/jikka-diagnosis
│   └─pSEO群: /area/[city] と /area/[city]/{cost,garbage} ←★記事から地域へ降りる動線
│
├─■ピラー2: /akiya （空き家・不動産処分完全ガイド）  ※新規ピラー
│   ├─クラスター記事: 空き家リスク/維持費/解体費用/特定空家/3000万控除/売却
│   ├─状況LP: /articles/situation/after-death（一部）
│   ├─ツール: /tools/empty-house-tax, /tools/akiya-risk, /tools/appraisal
│   ├─pSEO群: /area/[city]/subsidy（解体補助金47位）
│   └─★最強資産: /tax-simulator/[city] ←ここを束ねるハブを与える
│
├─■ピラー3: /souzoku （相続・死後手続き完全ガイド）  ※新規ピラー
│   ├─クラスター記事: 親が亡くなったら/口座凍結/相続放棄/準確定申告/遺言/保険金
│   ├─状況LP: /articles/situation/{after-death, my-shukatsu}
│   ├─ツール: /tools/inheritance-share, /tools/souzoku-prep, /ending-note
│   └─関連pSEO: 相続文脈で /tax-simulator・/area/subsidy へ送客
│
└─横断: カテゴリ(6)/タグ(11) は各ピラーへ昇る補助ハブとして温存（薄ければ統合）
```

**設計原則**: 各クラスターページ（記事・スポーク）は (a) 自分が属するピラーへ説明的アンカーで戻る、(b) 隣接クラスター1〜3本へ横リンクする、(c) 該当するツール/pSEOへ"次の行動"として降りる——の3方向を必ず持つ。これが2026年の標準的ハブ&スポーク（[seo-kreativ](https://www.seo-kreativ.de/en/blog/hub-and-spoke-model/)、[Conductor](https://www.conductor.com/academy/topic-clusters/)）。

---

## 3. pSEO × 編集記事の結合（リンクグラフ設計）

トピカルな関連性をGoogleへ伝える核は**「双方向・文脈リンク」**。pSEOは"地域×行動"の検索意図を網羅し、記事は"テーマの深さ"で権威を立てる。両者を結ぶと、記事の文脈が地域ページのE-E-A-Tを補強し、地域ページの内部リンク量が記事をクロール・インデックスさせる。

### リンクグラフ（誰が誰に張るか）

```
            ┌──────────── ピラー1〜3（権威の貯水池）─────────┐
            │  ↑戻る(説明的アンカー)        ↓降りる(次の行動) │
   ┌────────┴────────┐                ┌────────┴─────────┐
   │  編集記事 ×104   │ ──テーマ隣接──> │  pSEO地域 /area  │
   │ /articles/[id]   │ <─地域実例で補強─ │  ・/subsidy(47位)│
   └────────┬────────┘                └────────┬─────────┘
            │  ↘ "次に試算"                       │ ↘ "次に試算"
            │     ┌───────────────────────────────┘
            └────>│  最強資産 /tax-simulator/[city]  │──> 査定アフィCV
                  └───────────────────────────────┘
```

### 具体ルール（テンプレ実装で量産）

- **記事→地域**: 記事カテゴリ（cleanup/real-estate/inheritance）に応じて、ユーザーの都道府県を問わず「お住まいの地域の費用・補助金を見る → /area」を本文末に**動的挿入**。空き家系記事は `/tax-simulator` と `/area/[city]/subsidy` へ。(`pickAppraisalVariant` と同じ分岐ロジックを流用可能)
- **地域→記事**: subsidyスポークに「解体費用の考え方を詳しく → /articles/akiya-kaitai-hiyou」等、**そのスポークのテーマを深掘りする記事3本**を文脈リンク。地域ハブの「生前整理コラム」枠（既存）を、汎用文ではなく**実記事への発リンク**に置換。
- **pSEO相互**: subsidy ⇄ tax-simulator を必ず相互リンク（現状は片方向）。これが「解体補助金」と「固定資産税6倍」という同一ユーザーの連続意図を束ねる。

---

## 4. URL設計・カニバリ・薄いページのリスク

2026年3月コア更新は**scaled content abuse（テンプレ量産で固有価値の無いページ）を明示的に違反**と位置づけた（[Digital Applied](https://www.digitalapplied.com/blog/programmatic-seo-after-march-2026-surviving-scaled-content-ban)）。本サイトのリスク評価：

| 項目 | 評価 | 詳細 |
|---|---|---|
| cleanup隔離 | ◎ 妥当 | noindex+nofollowで薄いページをインデックスから除外済。良判断。 |
| `_isDefault`フォールバック | △ 要監視 | 固有データの無い自治体ページ。固有テキストが薄ければ統合/noindex候補。GSCで6か月無反応を点検。 |
| **subsidy ⇔ tax-simulator のカニバリ** | ⚠ 注意 | 両者とも「空き家 固定資産税 6倍」を語る。意図が"補助金で解体"と"試算して売却判断"で分かれるよう、見出し・内部リンクで**役割を明確に分離**（disambiguation）。canonical KW→URLマップの整備を推奨。 |
| `/tool/optimizer`（単数）と`/tools/*` | ⚠ 重複疑い | ルートが2系統。`/tool/optimizer` の存在意義をGSCで確認し、無実績なら `/tools` へ301統合。 |
| area配下の `cost` と `/cost`（共通費用） | △ 確認 | 地域別費用と全国費用相場が「費用」意図で競合しうる。地域版=ローカル、`/cost`=ピラー的まとめ、と役割分離を。 |

**原則**: pSEOは「固有データ（補助金額・粗大ゴミルール・地価）があるページのみ生成」を厳守。データ無し自治体は薄いテンプレ量産＝HCUリスクなので、フォールバックは**ディレクトリ的に集約**してインデックスを絞る。

---

## 5. 中核ハブ（勝ち筋ハブ）3つの定義

トラフィックとCVを最大化する中核ハブを、**既存資産の再編成で**3つ定義する（新規執筆を最小化）。

### ハブ&スポーク設計表

| ハブ（ピラー） | 検索意図の核 | 束ねるpSEO | 束ねるツール | 束ねる記事クラスター | CV導線 |
|---|---|---|---|---|---|
| **①実家じまいハブ** `/jikka-jimai`（master-guide昇格） | 「実家 片付け／実家じまい 進め方／遺品整理 費用」 | `/area/[city]`, `/area/[city]/{cost,garbage}` | jikka-diagnosis | 進め方/業者/費用/親説得/遺品整理/買取/お焚き上げ | 片付け業者見積アフィ＋LINE PDF |
| **②空き家ハブ** `/akiya`（新規） | 「空き家 固定資産税／特定空家／解体補助金／実家 売却」 | `/area/[city]/subsidy`(47位) | empty-house-tax, akiya-risk, appraisal | 空き家リスク/維持費/解体費用/3000万控除/売却 | **`/tax-simulator/[city]`→野村査定アフィ（最強動線）** |
| **③相続・手続きハブ** `/souzoku`（新規） | 「親が亡くなったら／口座凍結／相続放棄／遺言」 | （文脈で）`/area/subsidy`, `/tax-simulator` | inheritance-share, souzoku-prep, ending-note | 死後手続き/口座凍結/相続放棄/準確定申告/遺言/保険金 | 相続絡みの不動産→査定アフィ＋LINE |

→ **②空き家ハブが収益の主戦場**。最強CTRの tax-simulator・47位の解体補助金・空き家系記事・査定アフィが全てここに集まる。**今このハブが存在しないことが、最大の機会損失**。

---

## 6. 回遊→CVの最短動線（構造の観点）

最短動線は **「流入ページ（記事 or pSEO）→ 該当ハブ → ツール/試算 → 査定アフィ/LINE」** の3〜4ホップに収める。

```
[検索] ─┬─> 記事(浸透前imp11) ──"地域の費用/補助金を見る"──> /area or /tax-sim ──査定CV
        ├─> /area/subsidy(47位) ──"固定資産税を試算"──> /tax-simulator ──野村査定CV ★最短
        └─> /tax-simulator(CTR最強) ──既存"無料査定"──> A8アフィCV ←既に機能。上流を増やせ
```

**構造的ボトルネックと処方**:
- subsidy(47位)→tax-simulator のリンクが無いため、**最強CV経路が1本欠落**。ここを繋ぐだけでCTR最強ページへ上流トラフィックを注入できる。
- 記事の唯一のCV出口が査定インラインCTAのみ。**記事→tax-simulator/area への文脈リンク**を足せば、CVR実証済みの試算経路へ合流できる。
- グローバルナビに `/tax-simulator`（または上位ハブ`/akiya`）と`/area`が無い → 全ページからの常時動線が欠落。**ナビ昇格＝サイト全体のPageRank再配分**。

---

## 7. 今すぐ張るべき内部リンク 30本

> 多くはテンプレ1箇所の改修で全pSEO/全記事に一括展開できる（"30本"は論理リンクの種類。実数は数千本に増幅）。

**A. 記事テンプレ → pSEO/ツール（島Cの開放・最優先）**
1. `/articles/[id]`（real-estate/akiya系）→ `/tax-simulator`（アンカー「お住まいの地域の固定資産税を試算」）本文末に動的挿入
2. `/articles/[id]`（cleanup/guide系）→ `/area`（「地域の片付け費用・補助金を見る」）
3. `/articles/[id]`（inheritance系）→ `/tools/inheritance-share`
4. `/articles/[id]` 全記事 → 所属ピラー（`/jikka-jimai` 等）へ「完全ガイドに戻る」
5. `/articles/master-guide` → `/tax-simulator`（現在欠落。空き家ステップから）
6. `/articles/master-guide` → 代表記事5本（クラスター明示）への発リンク
7. `/articles/situation/after-death` → `/area/[相続文脈]/subsidy`・`/tax-simulator`

**B. subsidyスポーク（47位）の権威還流**
8. `/area/[city]/subsidy` → `/tax-simulator/[city]`（**最重要欠落リンク**・相互化）
9. `/area/[city]/subsidy` → 空き家解体費用の深掘り記事3本
10. `/area/[city]/subsidy` → ピラー②`/akiya`（「空き家対策の完全ガイド」）
11. subsidy CTAアンカー「無料見積もり」→「○○市の解体費用と補助金を確認」へ説明的化

**C. tax-simulator（最強）への被リンク増強**
12. `/tax-simulator/[city]` ← `/area/[city]/subsidy`（=8の逆）
13. `/tax-simulator/[city]` ← `/area/[city]/cost`
14. `/tax-simulator/[city]` ← 空き家系記事クラスター全本
15. `/tax-simulator/[city]` ← ピラー②`/akiya`（直下スポークとして）
16. `/tax-simulator/[city]` → ピラー②`/akiya` へ「戻る」（双方向化）

**D. ピラー新設と昇格**
17. グローバルナビに「空き家・不動産」(`/akiya`)を追加
18. グローバルナビに「相続・手続き」(`/souzoku`)を追加
19. グローバルナビ「はじめかた」を「実家じまい」(`/jikka-jimai`)に改名・ピラー化
20. `/akiya` → 配下スポーク（tax-sim/subsidy/empty-house-tax/akiya-risk/appraisal）全束ね
21. `/souzoku` → inheritance-share/souzoku-prep/ending-note/相続記事クラスター束ね

**E. カテゴリ/タグ/状況の上方接続**
22. `/articles/category/real-estate` → ピラー②`/akiya`
23. `/articles/category/inheritance` → ピラー③`/souzoku`
24. `/articles/tag/akiya-long` → `/tax-simulator`（現状toolHrefはempty-house-tax固定。地域版へ）
25. `/articles/situation/jikka-cleanup` → `/area`（地域の費用へ降りる）

**F. ハブ→収益・補助動線**
26. `/area/[city]`（hub）→ 所属ピラー②③へ「戻る」リンク追加（現状ピラー不在）
27. ホーム「空き家をなんとかしたい」カード → `/akiya`（現状 empty-house-tax 直行）
28. ホーム「実家を片付けたい」カード → `/jikka-jimai`
29. `/tools/empty-house-tax`（全国版）→ `/tax-simulator/[直近city]` 地域版へ送客
30. フッターに `/tax-simulator`（または`/akiya`）を追加（現在皆無）

---

## 結論 — サイト構造の観点での勝ち筋（1段落・断言）

**このサイトの勝ち筋は「②空き家ハブ `/akiya` を新設し、最強CTRの `/tax-simulator`・47位の解体補助金スポーク・空き家系記事・野村査定アフィを1つのトピッククラスターに束ねること」に尽きる。** 現状はpSEO・ツール・記事が相互リンクを持たない3つの孤立島で、特に104本の記事と最強の tax-simulator が構造的にデッドエンド化している。3つの中核ピラー（実家じまい／空き家／相続）を立て、記事テンプレと地域スポークに「双方向＋説明的アンカー」の動的内部リンクを1度実装すれば、数千本のリンクが一括で増幅され、トピカルオーソリティ・クロール網・CV動線が同時に立ち上がる——新規執筆ほぼゼロ、テンプレ改修のみで、指名検索ゼロの現状から「生前整理・実家じまい・空き家処分」の権威ドメインへ最短で移行できる。これがM&A評価額3,000万円を構造面から正当化する唯一の設計である。

---

### 参照（WebSearch / 2026）
- [Hub-and-Spoke SEO Model — seo-kreativ](https://www.seo-kreativ.de/en/blog/hub-and-spoke-model/)
- [Internal Linking Strategy 2026 Large-Site — Digital Applied](https://www.digitalapplied.com/blog/internal-linking-strategy-2026-large-site-architecture-guide)
- [Programmatic vs Editorial SEO Integration — Postdigitalist](https://www.postdigitalist.xyz/blog/programmatic-seo-vs-editorial-seo)
- [Programmatic SEO Internal Linking — SeoMatic](https://seomatic.ai/blog/programmatic-seo-internal-linking)
- [Programmatic SEO After March 2026 — Digital Applied](https://www.digitalapplied.com/blog/programmatic-seo-after-march-2026-surviving-scaled-content-ban)
- [Internal Linking Strategy for SEO 2026 — Fuel Online](https://fuelonline.com/seo/internal-linking-strategy-seo-guide/)
- [Topic Clusters — Conductor](https://www.conductor.com/academy/topic-clusters/)
