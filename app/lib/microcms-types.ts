/**
 * microCMS ブログ API 用の型定義
 * 買い手がソースを見た際の保守性・拡張性を意識した明示的な型
 */

export interface MicroCmsCategory {
  id: string;
  name: string;
}

export interface MicroCmsTag {
  id: string;
  name: string;
}

export interface MicroCmsBlogPost {
  id: string;
  title: string;
  description?: string;
  /** 本文（microCMS のフィールド名は "content"） */
  content?: string;
  /** @deprecated microCMS で "content" に変更した場合は未使用 */
  body?: string;
  publishedAt: string;
  revisedAt?: string;
  thumbnail?: { url: string; width?: number; height?: number };
  category?: MicroCmsCategory;
  /** タグ（複数参照） */
  tags?: MicroCmsTag[];
  /** OGP用（未設定時は thumbnail を使用） */
  ogpImage?: { url: string; width?: number; height?: number };
  /**
   * 監修区分。記事末尾の監修バイライン表示を制御する。
   * - "general"（または未設定）… 現・総合監修者の人物バイラインを表示
   * - "okubo" / "murakami" … 指定した総合監修者の人物バイラインを表示
   * - "none" … 専門家領域（相続税・年金・登記・不動産等）で総合監修対象外。
   *            人物監修バイラインを出さず、中立の運営者表記＋一般情報の注記に切り替える。
   */
  supervisor?: string;
}

export interface MicroCmsListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
