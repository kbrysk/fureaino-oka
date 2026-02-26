/**
 * 捨て方辞典コンポーネント用の Props 型定義（Step 2 では SearchBar 用を定義）。
 */

export interface SearchBarProps {
  /** プレースホルダー */
  placeholder?: string;
  /** 検索対象の品目リスト（サジェスト用）。slug と name のペア */
  suggestions?: { slug: string; name: string }[];
  /** アクセシビリティ用ラベル */
  ariaLabel?: string;
  /** 検索実行時のコールバック（例: 品目詳細へ遷移）。未指定時はフォーム送信で /dispose?q= 等の簡易挙動も可 */
  onSearch?: (slug: string) => void;
  /** 入力中のサジェスト表示有無（今回は簡易モックのため true でクライアント絞り込み） */
  showSuggestions?: boolean;
}

// ========== Step 3: DIYStepGuide ==========

export interface StepItem {
  /** ステップの短い見出し（例: 電話で申し込む） */
  name: string;
  /** ステップの説明文（HowTo の step.text に相当） */
  text: string;
  /** オプション: ステップ用画像（public 相対または絶対URL） */
  imageUrl?: string;
}

export interface DIYStepGuideProps {
  /** 手順のタイトル（HowTo schema の name） */
  title: string;
  /** 手順の説明（HowTo の description） */
  description?: string;
  steps: StepItem[];
}

// ========== Step 3: AuthorProfile ==========

export interface AuthorProfileProps {
  /** 表示名（例: 生前整理支援センター ふれあいの丘 センター長） */
  name: string;
  /** 資格・肩書き（任意。空の場合は表示しない） */
  qualification: string;
  /** コメント（専門家の一言） */
  comment: string;
  /** 顔写真のパス（public 相対、例: /images/author-xxx.jpg） */
  imageUrl: string;
  /** 画像の代替テキスト */
  imageAlt?: string;
  /** rel="author" を付与するリンク（オプション。ある場合は名前を <a rel="author"> でラップ） */
  authorUrl?: string;
}

// ========== Step 3: RealTransactionTable ==========

export interface RealTransactionRow {
  /** 日付または時期（例: 2024年1月） */
  date: string;
  /** 品目・状態の説明 */
  itemDescription: string;
  /** 実績の種類 */
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
