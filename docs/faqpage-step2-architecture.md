# Step 2: FAQPage 集約アーキテクチャ設計案

## 1. 設計の目的

- **1 ページ 1 FAQPage**: 各 URL で `<script type="application/ld+json">` の `@type: "FAQPage"` を **1 回だけ** 出力する。
- **関心の分離**: FAQ の「データ生成」と「UI 表示」を分離し、構造化データの出力責任を Page に集約する。
- **拡張性**: 捨て方辞典（dispose）や記事ページなど、他ルートで FAQ を追加する際にも再利用できる共通ヘルパーを用意する。

---

## 2. ディレクトリ・責務の配置

### 2.1 新規作成: データ層とスキーマ共通化

| パス | 責務 |
|------|------|
| `app/lib/faq/schema.ts` | **共通**: FAQPage 用 JSON-LD を 1 つ生成するヘルパー。全ページで利用可能。 |
| `app/lib/faq/area-faq-data.ts` | **地域ページ用**: LocalSubsidyFaq / DynamicFaq / DynamicCaseStudy の「Q&A 配列」を生成するロジックを集約。Page または他モジュールから呼び出す。 |

### 2.2 既存コンポーネントの変更

| コンポーネント | 変更内容 |
|----------------|----------|
| `LocalSubsidyFaq` | `<script type="application/ld+json">` を**削除**。Props を「Q&A 配列を受け取るだけ」に変更（後述）。 |
| `DynamicFaq` | 同上。JSON-LD 出力を削除し、`items` を Props で受け取る Pure UI に。 |
| `DynamicCaseStudy` | `<script type="application/ld+json">` を**削除**。表示用の `cases` を Props で受け取り、データ生成は Page 側で行う（または `generateCases` を lib に移し、Page が呼んで cases を渡す）。 |

### 2.3 Page の責務

| ページ | 責務 |
|--------|------|
| `app/area/[prefecture]/[city]/page.tsx` | 地域ページ用の FAQ データを **すべてここで取得・結合** し、**1 本だけ** `generateFaqSchema(...)` で FAQPage を生成して `<script type="application/ld+json">` を 1 回出力。各 UI コンポーネントには「表示用データ」のみ渡す。 |

---

## 3. データ型と共通ヘルパー（拡張性の要）

### 3.1 共通型（`app/lib/faq/schema.ts`）

```ts
/** 1 問 1 答。UI 表示と JSON-LD の両方で利用する最小単位 */
export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage スキーマ生成時のオプション（url は任意） */
export interface FaqSchemaOptions {
  /** ページの正規URL（絶対URL）。指定時のみ FAQPage に url を付与 */
  url?: string;
}
```

### 3.2 共通ヘルパー（`app/lib/faq/schema.ts`）

```ts
/**
 * FaqItem 配列から、Google ガイドライン準拠の 1 つの FAQPage オブジェクトを生成する。
 * 捨て方辞典・記事ページなど、どのルートからでも利用可能。
 */
export function generateFaqSchema(
  items: FaqItem[],
  options?: FaqSchemaOptions
): { "@context": string; "@type": "FAQPage"; mainEntity: unknown[]; url?: string }
```

- 実装イメージ: `items` を `mainEntity` に `@type: "Question"` / `acceptedAnswer` の形で並べ、`options?.url` があればトップレベルに `url` を付与する。
- 1 ページ内の「複数セクション由来の Q&A」は、Page 側で配列を結合したうえで、**この関数に 1 回だけ渡す**。

---

## 4. 地域ページ用データロジック（`app/lib/faq/area-faq-data.ts`）

現在各コンポーネント内にある「データ生成」を、Page から呼べる形でエクスポートする。

### 4.1 移行・エクスポートする関数

| 関数名（新） | 元の場所 | 役割 |
|--------------|----------|------|
| `buildLocalSubsidyFaqItems(props)` | LocalSubsidyFaq の `buildFaqItems` / `buildGenericFaqItems` | 地域の補助金・粗大ゴミ・年間損失の 3 問を生成。`MunicipalityDataOrDefault` の有無で分岐。 |
| `buildDynamicFaqItems(prefName, cityName, hasData, municipalityData?)` | DynamicFaq の `buildFaqItems` | 補助金・3,000 万円控除・不用品処分の 3 問を生成。 |
| `generateCaseStudyFaqItems(cityId, cityName, landPrice)` | DynamicCaseStudy の `generateCases` + Question への変換 | 診断事例 3 件を生成し、それぞれを 1 問 1 答の `FaqItem[]` に変換して返す。 |

- **LocalSubsidyFaq**: `estimateAnnualLossFromLandPrice` や `LAND_AREA_M2` 等の定数は、`area-faq-data.ts` に移すか、同ファイル内のプライベート関数として保持する。
- **DynamicCaseStudy**: `generateCases` の戻り値 `CaseItem[]` は UI でも使うため、`CaseItem` 型と `generateCases` を `area-faq-data.ts` に移し、`generateCaseStudyFaqItems` は内部で `generateCases` を呼んでから `FaqItem[]` にマッピングする。UI 用の `cases` も Page が同じ `generateCases` を呼んで `DynamicCaseStudy` に渡す形にし、データ生成は 1 箇所にまとめる。

### 4.2 型の参照

- `FaqItem` は `app/lib/faq/schema.ts` から import。
- `MunicipalityDataOrDefault` は現状どおり `@/app/lib/data/municipalities` 等から参照。
- `CaseItem` は `area-faq-data.ts` で定義し、`DynamicCaseStudy` はそこから import（または `area-faq-data` が `CaseItem` と `generateCases` を export し、Page と DynamicCaseStudy の両方が利用）。

---

## 5. UI コンポーネントの Props 変更（Pure UI 化）

### 5.1 LocalSubsidyFaq

- **削除**: 内部の `buildFaqItems` / `buildGenericFaqItems` 呼び出し、および `<script type="application/ld+json">` の出力。
- **新 Props**:
  - `items: FaqItem[]`（必須）… 表示する Q&A リスト。
  - `heading?: string`（任意）… セクション見出し。省略時は従来どおり「{cityName}の実家じまい・補助金よくある質問」など固定文言でも可。
- **データの流れ**: Page が `buildLocalSubsidyFaqItems(props)` を呼び、得た `FaqItem[]` を `items` として渡す。

### 5.2 DynamicFaq

- **削除**: 内部の `buildFaqItems` 呼び出しと `<script type="application/ld+json">` の出力。
- **新 Props**:
  - `items: FaqItem[]`（必須）
  - `heading?: string`（任意）
- **データの流れ**: Page が `buildDynamicFaqItems(...)` を 1 回だけ呼び（フォールバック時も 1 回）、その結果を `items` で渡す。フォールバック時は「AreaDirectoryFallback 内の DynamicFaq」と「直下の DynamicFaq」の両方に、**同じ配列**を渡して表示を揃え、スキーマには 1 回だけ含める。

### 5.3 DynamicCaseStudy

- **削除**: コンポーネント内での `generateCases` 呼び出しと `<script type="application/ld+json">` の出力。
- **新 Props**:
  - `cityName: string`
  - `cases: CaseItem[]`（必須）… 表示用のケース一覧。生成ロジックは Page が `area-faq-data` の `generateCases` を呼んで取得。
- **データの流れ**: Page が `generateCases(cityId, cityName, landPrice)` を 1 回呼び、その `cases` を当コンポーネントに渡す。同一の `cases` から `generateCaseStudyFaqItems` で `FaqItem[]` を得て、ページ全体の FAQ リストにマージする。

---

## 6. Page での集約フロー（トップダウン）

### 6.1 `app/area/[prefecture]/[city]/page.tsx` の処理順（概念）

1. **既存どおり** 地域データ・`showFallback` などを取得。
2. **FAQ データの取得（データ層の利用）**
   - `localSubsidyItems = buildLocalSubsidyFaqItems({ municipalityData, cityName, prefName, prefId, cityId, regionalStats, baseUrl })` など、現在 LocalSubsidyFaq に渡しているのと同じ情報で呼び出す。
   - `dynamicFaqItems = buildDynamicFaqItems(prefName, cityName, hasData, municipalityData)` を **1 回だけ** 呼ぶ（showFallback 時は `hasData=false`、通常時は `hasData=!data._isDefault` など）。
   - `cases = generateCases(cityId, cityName, landPrice)` を 1 回呼ぶ。
   - `caseStudyFaqItems = generateCaseStudyFaqItems(cityId, cityName, landPrice)` で、ケーススタディ用の 3 問を取得（内部で `generateCases` を使う実装なら、`cases` と `caseStudyFaqItems` の両方を返す関数にしてもよい）。
3. **マージ**
   - `allFaqItems = [...localSubsidyItems, ...caseStudyFaqItems, ...dynamicFaqItems]`（順序はデザイン・読みやすさに合わせて調整可）。
4. **1 本の FAQPage のみ出力**
   - ページの適切な位置（例: BreadcrumbJsonLd の直後や、最初のセクションの前）に、  
     `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(allFaqItems, { url: pageUrl })) }} />` を **1 回だけ** 記述。
5. **UI コンポーネントには「表示用データ」のみ渡す**
   - `<LocalSubsidyFaq items={localSubsidyItems} />`
   - `<DynamicCaseStudy cityName={...} cases={cases} />`
   - `<DynamicFaq items={dynamicFaqItems} />`（フォールバック時は、AreaDirectoryFallback 内と直下の 2 箇所に同じ `dynamicFaqItems` を渡す）。

### 6.2 フォールバック時の注意

- 現在、フォールバック時は `DynamicFaq` が 2 回レンダリングされる（AreaDirectoryFallback 内 + 直下）。  
- スキーマ用の `dynamicFaqItems` は **1 回だけ** `buildDynamicFaqItems` を呼んで生成し、その 1 セットだけを `allFaqItems` に含める。  
- UI 上 2 つの DynamicFaq セクションには、同じ `dynamicFaqItems` を渡すため、表示内容は従来どおりで、FAQPage は 1 つにまとまる。

---

## 7. 捨て方辞典・記事など他ルートでの拡張（将来）

- 捨て方辞典の詳細ページや記事ページで FAQ を出す場合も、
  - そのページ用の「Q&A 配列」を用意（ページ内で組み立てるか、`app/lib/faq/` に `dispose-faq-data.ts` などを追加）し、
  - `generateFaqSchema(items, { url: canonicalUrl })` を 1 回だけ呼んで、
  - そのページの `<head>` 付近またはコンテンツ直前に `<script type="application/ld+json">` を 1 回だけ出力する。
- 複数セクションがある場合は、**必ず配列を結合したうえで 1 回だけ** `generateFaqSchema` に渡す。  
これにより、サイト全体で「1 URL 1 FAQPage」を守れる。

---

## 8. 実装時のチェックリスト（Step 3 用）

- [ ] `app/lib/faq/schema.ts` を新規作成（`FaqItem`, `generateFaqSchema`）。
- [ ] `app/lib/faq/area-faq-data.ts` を新規作成し、`buildLocalSubsidyFaqItems`, `buildDynamicFaqItems`, `generateCases`, `generateCaseStudyFaqItems`（および必要なら `CaseItem`）を配置・エクスポート。
- [ ] `LocalSubsidyFaq` から JSON-LD 出力とデータ生成を削除し、`items`（と任意で `heading`）を受け取る Pure UI に変更。
- [ ] `DynamicFaq` から JSON-LD 出力とデータ生成を削除し、`items`（と任意で `heading`）を受け取る Pure UI に変更。
- [ ] `DynamicCaseStudy` から JSON-LD 出力と内部の `generateCases` 呼び出しを削除し、`cases` を Props で受け取る Pure UI に変更。
- [ ] `app/area/[prefecture]/[city]/page.tsx` で、上記データ関数を呼んで配列をマージし、`generateFaqSchema` で 1 つの FAQPage を生成して `<script>` を 1 回だけ出力。各 UI には表示用データのみ渡す。
- [ ] `AreaDirectoryFallback` 内の `DynamicFaq` に、Page から渡した `items`（同じ `dynamicFaqItems`）を渡すよう、AreaDirectoryFallback の Props を拡張するか、または Page が `dynamicFaqItems` を AreaDirectoryFallback に渡し、その中で DynamicFaq に転送する。

---

以上が、関心の分離・Page トップダウン集約・Pure UI 化・拡張性を満たす Step 2 の設計案です。承認いただければ、Step 3 でこの方針に沿ってコード修正を適用します。
