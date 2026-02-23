/**
 * 記事関連の型定義（レガシー）
 * 一覧・詳細・カテゴリ・タグは microCMS に移行済み。
 * ArticleImage は ArticleBodyWithOwl 等で参照される可能性があるため残置。
 */

export interface ArticleImage {
  /** 何番目の段落の直後に表示するか（0始まり） */
  afterIndex: number;
  src: string;
  alt: string;
}
