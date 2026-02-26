# Step 1: FAQPage 重複 — サイトワイド影響範囲調査報告

## 1. FAQPage JSON-LD を出力しているファイル一覧

以下の **3 コンポーネント** が、それぞれ独立した `<script type="application/ld+json">` で `@type: "FAQPage"` を出力しています。

| # | ファイル | 出力内容 | 備考 |
|---|----------|----------|------|
| 1 | `app/components/LocalSubsidyFaq.tsx` | 1 つの FAQPage（mainEntity に 3 問） | 地域特化FAQ。補助金・粗大ゴミ・年間損失の Q&A。`url` プロパティあり。 |
| 2 | `app/components/DynamicFaq.tsx` | 1 つの FAQPage（mainEntity に 3 問） | 自治体ページ用動的FAQ。補助金・3,000万円控除・不用品処分の Q&A。 |
| 3 | `app/components/DynamicCaseStudy.tsx` | 1 つの FAQPage（mainEntity に 3 件） | 診断事例を Q&A 形式で出力。`generateCases()` で生成したケースを Question に変換。 |

**補足**: `docs/dispose-ui-seo-step1-design.md` には FAQPage の**設計上の言及**のみあり、現時点で捨て方辞典から FAQPage を出力する実装はありません。

---

## 2. 各コンポーネントの現在の出力ロジック（概要）

### 2.1 LocalSubsidyFaq.tsx
- **データ**: `buildFaqItems(props)` または `buildGenericFaqItems(cityName, prefName)` で 3 問を生成。
- **出力**: コンポーネントの `return` 内で `faqPageJsonLd` を組み立て、`<script type="application/ld+json">` を 1 回だけレンダリング。
- **構造**: `@context`, `@type: "FAQPage"`, `mainEntity`（Question 3 件）, `url`（ページ絶対URL）。

### 2.2 DynamicFaq.tsx
- **データ**: `buildFaqItems(prefName, cityName, hasData, municipalityData)` で 3 問を生成。
- **出力**: 同上。コンポーネント内で `jsonLd` を組み立て、`<script type="application/ld+json">` を 1 回レンダリング。
- **構造**: `@context`, `@type: "FAQPage"`, `mainEntity`（Question 3 件）。`url` なし。

### 2.3 DynamicCaseStudy.tsx
- **データ**: `generateCases(cityId, cityName, landPrice)` で 3 件のケースを生成し、各ケースを 1 問 1 答に変換。
- **出力**: 同上。`faqData` を組み立て、`<script type="application/ld+json">` を 1 回レンダリング。
- **構造**: `@context`, `@type: "FAQPage"`, `mainEntity`（Question 3 件）。

---

## 3. 使用箇所と「1 ページあたりの FAQPage 数」

### 3.1 使用されているページ

| ページ（ルート） | 使用コンポーネント | 同一ページ内の FAQPage 数 |
|------------------|--------------------|----------------------------|
| `app/area/[prefecture]/[city]/page.tsx` | 下記参照 | **3 または 4** |

### 3.2 area/[prefecture]/[city]/page.tsx の詳細

このページは **2 ブランチ**（`showFallback` / 通常）でレンダリングされます。

- **ブランチ A（showFallback = true）**  
  データ未整備・デフォルトデータ時。
  - `<LocalSubsidyFaq ... />` → **FAQPage 1**
  - `<DynamicCaseStudy ... />` → **FAQPage 2**
  - `<AreaDirectoryFallback ... />` 内の `<DynamicFaq ... />` → **FAQPage 3**
  - 直下の `<DynamicFaq ... />` → **FAQPage 4**  
  → **合計 4 個の FAQPage** が同一 HTML に出力される。

- **ブランチ B（showFallback = false）**  
  通常の地域ページ（例: `/area/hiroshima/hiroshima`）。
  - `<LocalSubsidyFaq ... />` → **FAQPage 1**
  - `<DynamicCaseStudy ... />` → **FAQPage 2**
  - `<DynamicFaq ... />` → **FAQPage 3**  
  → **合計 3 個の FAQPage** が同一 HTML に出力される。

### 3.3 その他のページ

- **AreaDirectoryFallback** は `app/area/[prefecture]/[city]/page.tsx` の **showFallback 時のみ** 使用され、その中で `DynamicFaq` を 1 回レンダリング。
- **捨て方辞典**（`app/dispose/` 配下）、**記事**（`app/articles/` 配下）では、上記 3 コンポーネントは使用されていません。現状、これらのページから FAQPage は出力されていません。

---

## 4. 結論（Step 1 サマリ）

- **FAQPage を出力しているコンポーネント**: 上記 3 つのみ（`LocalSubsidyFaq`, `DynamicFaq`, `DynamicCaseStudy`）。
- **重複が発生しているページ**: `app/area/[prefecture]/[city]/page.tsx` のみ。  
  - 通常時: 3 個の FAQPage。  
  - フォールバック時: 4 個の FAQPage（`DynamicFaq` が 2 回＝AreaDirectoryFallback 内 + 直下）。
- **現在のロジック**: 各コンポーネントが「自分用の FAQ データ」だけを持ち、それぞれが**独立した 1 つの FAQPage** を 1 つの `<script type="application/ld+json">` で出力している。ページ単位での集約は行われていない。

以上を踏まえ、Step 2 では「ページ単位で 1 つの FAQPage に集約する」ためのアーキテクチャ案を提示します。
