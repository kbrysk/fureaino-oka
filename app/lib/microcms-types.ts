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
}

export interface MicroCmsListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
