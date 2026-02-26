# Step 4: 捨て方詳細ページへのコンポーネント統合とマイクロCV 設計案

## 1. 現在のページ構成（`app/dispose/[slug]/page.tsx`）

| 順序 | ブロック | 備考 |
|------|----------|------|
| 1 | パンくず | 捨て方辞典 / カテゴリ / 品目名 |
| 2 | H1 | 品目名の捨て方決定版｜… |
| 3 | 結論（自治体で捨てられる？） | バッジ＋costNote |
| 4 | 処分方法3選 | A/B/C |
| 5 | 買取相場例テーブル | getBuybackExamples ありの場合のみ |
| 6 | ふれあいの丘からのアドバイス | item.adviceFureai |
| 7 | 供養について | item.memorialNote ありの場合のみ |
| 8 | DisposeItemLineCTA | 品目名・ctaType |
| 9 | DisposeToCostCrossLink | 費用・診断への蜘蛛の巣 |
| 10 | SubsidyBlock | 特定カテゴリのみ |
| 11 | フッターリンク（一覧へ・トップ・相談） |

---

## 2. Step 4 での配置方針

- **DIYStepGuide**: 「処分方法3選」の**直後**に配置。  
  「3つの選択肢」の次に「では実際にどう手順を踏むか」を番号付きで示し、HowTo リッチリザルトで評価されやすくする。  
  **データ**: 品目（slug）またはカテゴリ単位で手順を返すデータ層を用意し、**データがある場合のみ**表示する。

- **RealTransactionTable**: 「買取相場例」の**直後**に配置。  
  相場例（概算）→ 実績（日付・金額）の流れで、Experience を強調。  
  **データ**: 品目（slug）またはカテゴリ単位で行を返すデータ層を用意し、**行が1件以上ある場合のみ**表示する。

- **AuthorProfile**: 既存の「ふれあいの丘からのアドバイス」を**発展**させる形で配置。  
  **案A（推奨）**: 同じ位置に `AuthorProfile` を置き、`comment` に `item.adviceFureai` を渡す。見出しは「専門家のアドバイス」、本文は従来どおり。  
  **案B**: 既存セクションは残し、その直下に `AuthorProfile` を追加（アドバイス文が二重になるため、案Aを推奨）。

---

## 3. 挿入位置のイメージ（案A: AuthorProfile で既存アドバイスを置き換え）

```
1. パンくず
2. H1
3. 結論：自治体で捨てられる？
4. 処分方法3選
5. ★ DIYStepGuide（steps がある場合のみ）
6. 買取相場例テーブル（既存）
7. ★ RealTransactionTable（rows がある場合のみ）
8. ★ AuthorProfile（専門家のアドバイス）← 既存「ふれあいの丘からのアドバイス」を置き換え
9. 供養について（memorialNote ありの場合のみ）
10. DisposeItemLineCTA
11. DisposeToCostCrossLink
12. SubsidyBlock（条件付き）
13. フッターリンク
```

---

## 4. データの用意方法（実装オプション）

### 4.1 DIYStepGuide 用の steps

- **案**: `app/lib/dispose/step-guide-data.ts` を新規作成。  
  - `getStepGuideForSlug(slug: string): { title: string; description?: string; steps: StepItem[] } | null`  
  - 戻り値が `null` または `steps.length === 0` のときは `<DIYStepGuide />` をレンダリングしない。  
- **初期**: 代表品目（例: 仏壇、粗大ゴミ系 1〜2 品目）だけエントリを持たせ、他は `null` でよい。  
- **型**: `StepItem` は `app/lib/dispose/types` のものを利用。

### 4.2 RealTransactionTable 用の rows

- **案**: `app/lib/dispose/real-transaction-data.ts` を新規作成。  
  - `getRealTransactionRows(slug: string): RealTransactionRow[]`  
  - 戻り値が空配列のときは `<RealTransactionTable />` をレンダリングしない。  
- **初期**: サンプルで 1〜2 品目分のモック行（日付・品目・種別・金額・備考）を返す形でよい。  
- **型**: `RealTransactionRow` は `app/lib/dispose/types` のものを利用。

### 4.3 AuthorProfile 用の著者情報

- **案**: サイト共通の監修者を 1 名定義。  
  - `app/lib/dispose/author-profile-data.ts` に  
    `getDefaultAuthor(): AuthorProfileProps` を用意し、  
    名前・資格・imageUrl・authorUrl（任意）を返す。  
  - コメントだけは呼び出し元で `item.adviceFureai` を渡す。  
- Page 側:  
  `const author = getDefaultAuthor();`  
  `<AuthorProfile {...author} comment={item.adviceFureai} />`

---

## 5. Page 側の変更イメージ（疑似コード）

```tsx
// 追加 import
import DIYStepGuide from "../../components/dispose/DIYStepGuide";
import AuthorProfile from "../../components/dispose/AuthorProfile";
import RealTransactionTable from "../../components/dispose/RealTransactionTable";
import { getStepGuideForSlug } from "../../lib/dispose/step-guide-data";
import { getRealTransactionRows } from "../../lib/dispose/real-transaction-data";
import { getDefaultAuthor } from "../../lib/dispose/author-profile-data";

// ページ内（上から順に）
// ...
// 処分方法3選の直後
const stepGuide = getStepGuideForSlug(slug);
{stepGuide && stepGuide.steps.length > 0 && (
  <DIYStepGuide title={stepGuide.title} description={stepGuide.description} steps={stepGuide.steps} />
)}

// 買取相場例の直後
const realRows = getRealTransactionRows(slug);
{realRows.length > 0 && (
  <RealTransactionTable
    title="実際の買取実績・処分費用"
    caption="当センター相談事例に基づく一例です。状態・時期により変動します。"
    rows={realRows}
  />
)}

// 「ふれあいの丘からのアドバイス」を AuthorProfile に置き換え
const author = getDefaultAuthor();
<AuthorProfile {...author} comment={item.adviceFureai} />
```

---

## 6. まとめ（Step 4 でやること）

| 項目 | 内容 |
|------|------|
| **配置** | DIYStepGuide＝処分方法3選の次、RealTransactionTable＝買取相場例の次、AuthorProfile＝既存アドバイスブロックの位置で置き換え。 |
| **条件表示** | DIYStepGuide は steps ありのみ、RealTransactionTable は rows ありのみ。AuthorProfile は全品目で表示（コメントは item.adviceFureai）。 |
| **データ層** | （任意）`step-guide-data.ts` / `real-transaction-data.ts` / `author-profile-data.ts` を用意し、Page はそこから取得したデータで各コンポーネントに渡す。 |
| **マイクロCV** | 既存の DisposeItemLineCTA・DisposeToCostCrossLink・SubsidyBlock はそのまま。Step 4 では「どこに何を置くか」とデータの渡し方までを設計し、Step 5 で DisposalDiagnostic や ContextualCTA を追加する想定。 |

この設計に沿って、必要ならデータ層の実装（モック含む）と `app/dispose/[slug]/page.tsx` の具体的な差分を続けて用意できます。
