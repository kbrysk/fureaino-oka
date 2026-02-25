# Step 1: 捨て方辞典 UI/SEO 改修 — ディレクトリ構造と Props 設計案

## 1. 現状の整理

- **捨て方トップ**: `app/dispose/page.tsx`
- **カテゴリ一覧**: `app/dispose/category/[categorySlug]/page.tsx`
- **品目詳細**: `app/dispose/[slug]/page.tsx`
- **既存コンポーネント**: `DisposeItemLineCTA`, `DisposeToCostCrossLink`
- **空き家補助金ブロック**: ルートレイアウトで `AreaNavigation` を全ページに表示している（`app/layout.tsx`）。捨て方詳細ではテーマ希薄化を防ぐため、**特定カテゴリ以外では非表示**とする条件分岐が必要。

---

## 2. 新規・改修コンポーネントの配置（ディレクトリ構造）

```
app/
├── dispose/
│   ├── [slug]/
│   │   └── page.tsx                    # 改修: 新コンポーネントを組み込み
│   ├── category/
│   │   └── [categorySlug]/
│   │       └── page.tsx               # 改修: SearchBar 等を組み込み
│   └── page.tsx                       # 改修: SearchBar をファーストビューに
├── components/
│   ├── dispose/                        # ★ 捨て方辞典専用コンポーネント群
│   │   ├── SearchBar.tsx               # 1. ナビゲーション（検索バー）
│   │   ├── DIYStepGuide.tsx            # 2. マニュアルUI（ステップ解説）
│   │   ├── AuthorProfile.tsx           # 3. E-E-A-T（監修者ブロック）
│   │   ├── RealTransactionTable.tsx    # 3. E-E-A-T（実績テーブル）
│   │   ├── DisposalDiagnostic.tsx      # 4. 粘着性（診断チャート）
│   │   ├── ContextualCTA.tsx           # 4. マイクロCV（文脈CTA）
│   │   ├── SubsidyBlock.tsx            # 1. 空き家補助金ブロック（条件表示用）
│   │   └── index.ts                   # バレル export（任意）
│   └── AreaNavigation.tsx             # 改修: 表示条件を受け取る or 子で条件分岐
app/
└── lib/
    └── dispose/
        ├── types.ts                    # 捨て方辞典用 Props 型定義
        ├── subsidy-visibility.ts       # 空き家補助金の表示可否ロジック
        └── (既存: dispose-categories.ts, dispose-items.ts, dispose-buyback-examples.ts)
```

- **`app/components/dispose/`** に捨て方辞典専用の新コンポーネントを集約し、`app/lib/dispose/types.ts` で Props を共通化する。
- **空き家補助金**: ルートレイアウトの `AreaNavigation` を「パスに応じて非表示」にするクライアントラッパーを導入し、捨て方詳細では「特定カテゴリのみ」表示する `SubsidyBlock` をページ内で使用する形を想定。

---

## 3. Props・型定義（インターフェース）

以下、`app/lib/dispose/types.ts` に置く想定の型と、各コンポーネントの Props です。

### 3.1 共通で参照する既存型

- `DisposeItem`, `DisposeCategory`（`app/lib/dispose-items.ts`, `app/lib/dispose-categories.ts`）はそのまま利用。
- カテゴリ ID は `DisposeCategory['id']`（例: `memorial` | `furniture` | `outdoor-garage` 等）で統一。

### 3.2 SearchBar（検索バー）

```ts
// app/lib/dispose/types.ts

export interface SearchBarProps {
  /** プレースホルダー */
  placeholder?: string;
  /** 検索対象の品目リスト（サジェスト用）。slug と name のペア */
  suggestions?: { slug: string; name: string }[];
  /** アクセシビリティ用ラベル */
  ariaLabel?: string;
  /** 検索実行時のコールバック（例: 品目詳細へ遷移） */
  onSearch?: (slug: string) => void;
  /** 入力中のサジェスト表示有無 */
  showSuggestions?: boolean;
}
```

- 初期実装では `suggestions` を `getItemsByCategoryId` / 全品目から渡し、`onSearch` で `router.push(\`/dispose/${slug}\`)` を想定。
- サジェスト UI は「ベース」（入力＋ドロップダウン）のみ Step 2 で実装し、必要に応じて API 化は Step 5 以降で検討。

### 3.3 DIYStepGuide（ステップ解説・HowTo）

```ts
export interface StepItem {
  name: string;
  text: string;
  /** オプション: 画像URL */
  imageUrl?: string;
}

export interface DIYStepGuideProps {
  /** 手順のタイトル（HowTo schema の name） */
  title: string;
  /** 手順の説明（HowTo description） */
  description?: string;
  steps: StepItem[];
  /** JSON-LD を HowTo で出すか FAQPage で出すか */
  schemaType?: "HowTo" | "FAQPage";
}
```

- 品目ごとに「電話する→券を買う→出す」のような配列を渡す。`schemaType: "HowTo"` で JSON-LD をコンポーネント内で出力する想定。

### 3.4 AuthorProfile（監修者ブロック）

```ts
export interface AuthorProfileProps {
  /** 表示名（例: 遺品整理士 山田 太郎） */
  name: string;
  /** 資格・肩書き（例: 遺品整理士認定協会 認定資格） */
  qualification: string;
  /** コメント（専門家の一言） */
  comment: string;
  /** 顔写真のパス（public 相対） */
  imageUrl: string;
  /** 画像の代替テキスト */
  imageAlt?: string;
  /** rel="author" を付与するリンク先（オプション） */
  authorUrl?: string;
}
```

- 記事の信頼性（E-E-A-T）用。`rel="author"` は `authorUrl` がある場合にリンクに付与。

### 3.5 RealTransactionTable（実績・処分費用テーブル）

```ts
export interface RealTransactionRow {
  /** 日付または時期（例: 2024年1月） */
  date: string;
  /** 品目・状態の説明 */
  itemDescription: string;
  /** 実績の種類: 買取金額 / 処分費用 等 */
  resultType: "buyback" | "disposal_fee" | "other";
  /** 表示用金額・文言（例: "3,000円", "無料"） */
  amount: string;
  /** 備考（任意） */
  note?: string;
}

export interface RealTransactionTableProps {
  /** 表の見出し */
  title: string;
  /** 補足（一次情報である旨など） */
  caption?: string;
  rows: RealTransactionRow[];
}
```

- 既存の「買取相場例」テーブルを拡張し、日付・状態・実金額を扱う「実績」テーブルとして再利用可能にする。

### 3.6 DisposalDiagnostic（捨て方判定チャート）

```ts
export interface DiagnosticQuestion {
  id: string;
  label: string;
  /** Yes 時の次の質問 id または結果 id */
  yesNext: string;
  /** No 時の次の質問 id または結果 id */
  noNext: string;
}

export interface DiagnosticResult {
  id: string;
  /** 処分方法のラベル（例: 自治体の粗大ゴミで出す） */
  method: string;
  /** 説明文 */
  description: string;
  /** 詳細ページへのリンク（任意） */
  linkHref?: string;
  linkLabel?: string;
}

export interface DisposalDiagnosticProps {
  /** 品目名（例: 仏壇） */
  itemName: string;
  questions: DiagnosticQuestion[];
  results: DiagnosticResult[];
  /** 最初の質問 id */
  startQuestionId: string;
}
```

- 状態はコンポーネント内で `useState`（現在の questionId / resultId）で管理。`yesNext` / `noNext` でツリーをたどり、結果 id に到達したら `results` から表示。

### 3.7 ContextualCTA（文脈に合わせた CTA）

```ts
export interface ContextualCTAProps {
  /** 品目名（例: 仏壇） */
  itemName: string;
  /** CTA の種類（既存 CtaType と連携可能） */
  ctaType: "default" | "buy_sell" | "memorial" | "difficult";
  /** メイン CTA 文言（例: 仏壇の供養見積もりはこちら） */
  primaryCtaLabel: string;
  primaryCtaHref: string;
  /** サブ CTA（例: 写真を送ってLINE査定） */
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** 見出し（省略時は品目名から生成） */
  heading?: string;
}
```

- 既存の `DisposeItemLineCTA` の「品目特化」版として、品目名と `ctaType` に応じた文言・リンクを渡す。

### 3.8 空き家補助金ブロックの条件分岐

- **表示するカテゴリ ID の allow list** を `app/lib/dispose/subsidy-visibility.ts` で定義する想定。

```ts
// app/lib/dispose/subsidy-visibility.ts

import type { DisposeCategory } from "../dispose-categories";

/**
 * 捨て方詳細ページで「全国の空き家補助金」ブロックを表示してよいカテゴリ。
 * テーマの関連性が高いものに限定（屋外・庭・家屋関連など）。
 */
export const SUBSIDY_VISIBLE_CATEGORY_IDS: string[] = [
  "outdoor-garage",   // 屋外・庭・ガレージ
  "materials-difficult", // 素材・資源・処理困難物（家屋解体等と関連）
  // 必要に応じて "furniture" 等を追加
];

export function isSubsidyBlockVisibleForCategory(categoryId: string | undefined): boolean {
  if (!categoryId) return false;
  return SUBSIDY_VISIBLE_CATEGORY_IDS.includes(categoryId);
}
```

- **ルートレイアウト**: パスが `/dispose` 以下（トップ・カテゴリ・詳細のいずれか）のときは、フッター直前の **AreaNavigation を非表示**にするクライアントコンポーネント（例: `AreaNavigationGate`）でラップする。
- **捨て方詳細ページ**: `isSubsidyBlockVisibleForCategory(item.categoryId)` が `true` のときだけ、ページ下部に **SubsidyBlock**（「お住まいの地域の空き家補助金を探す」→ `/area` へのリンク 1 本）を表示する。

```ts
// SubsidyBlock は Props なし or オプションで見出しのみ
export interface SubsidyBlockProps {
  heading?: string;
}
```

---

## 4. コンポーネントとデータの対応（イメージ）

| コンポーネント | 主な利用場所 | データソース |
|----------------|-------------|-------------|
| SearchBar | 捨て方トップ・カテゴリページのファーストビュー | dispose-items（全品目 or カテゴリ別） |
| DIYStepGuide | 捨て方詳細ページ | 品目別ステップデータ（新規 JSON または dispose-items 拡張） |
| AuthorProfile | 捨て方詳細ページ | 固定 or 品目/カテゴリ別の監修者データ |
| RealTransactionTable | 捨て方詳細ページ | 既存 buyback examples 拡張 or 新規 realTransactions |
| DisposalDiagnostic | 捨て方詳細ページ・カテゴリページ | 品目別の質問ツリー（新規データ） |
| ContextualCTA | 捨て方詳細ページ | 既存 item.name + ctaType から生成 |
| SubsidyBlock | 捨て方詳細ページ（条件付き） | 表示可否のみ subsidy-visibility |

---

## 5. 次のステップ（Step 2）に向けた確認事項

- **SearchBar**: サジェストはクライアント側のフィルタ（`suggestions` を絞り込み）でよいか、それとも将来的に API 検索を想定するか。
- **空き家補助金**: 「表示してよいカテゴリ」は `outdoor-garage` と `materials-difficult` の 2 つでスタートで問題ないか。必要なら `furniture` 等を追加可能。
- **構造化データ**: DIYStepGuide は HowTo を優先し、必要に応じて FAQPage も同じコンポーネントで切り替え可能にする想定でよいか。

この設計案で問題なければ、Step 2「ナビゲーション（SearchBar ＋ 空き家補助金の条件分岐）」の実装に進みます。
