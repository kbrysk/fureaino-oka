/**
 * 捨て方辞典：専門家（監修者）プロフィール。
 * AuthorProfile 用。E-E-A-T 強化のためサイト共通で利用。
 */

import type { AuthorProfileProps } from "./types";

const DEFAULT_AUTHOR: Omit<AuthorProfileProps, "comment"> = {
  name: "遺品整理士 ふれあいの丘 センター長",
  qualification: "遺品整理士認定協会 認定資格",
  imageUrl: "/images/operator.png",
  imageAlt: "遺品整理士 ふれあいの丘 センター長",
  authorUrl: "/company",
};

/**
 * サイト共通の監修者情報を返す。コメント（comment）は呼び出し元で item.adviceFureai を渡す。
 */
export function getDefaultAuthor(): Omit<AuthorProfileProps, "comment"> {
  return { ...DEFAULT_AUTHOR };
}
