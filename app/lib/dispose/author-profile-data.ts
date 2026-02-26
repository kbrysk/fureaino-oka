/**
 * 捨て方辞典：専門家（監修者）プロフィール。
 * AuthorProfile 用。E-E-A-T 強化のためサイト共通で利用。
 */

import type { AuthorProfileProps } from "./types";

const DEFAULT_AUTHOR: Omit<AuthorProfileProps, "comment"> = {
  name: "生前整理支援センター ふれあいの丘 センター長",
  qualification: "",
  imageUrl: "/images/operator.png",
  imageAlt: "生前整理支援センター ふれあいの丘 センター長",
  authorUrl: "/company",
};

/**
 * サイト共通の監修者情報を返す。コメント（comment）は呼び出し元で item.adviceFureai を渡す。
 */
export function getDefaultAuthor(): Omit<AuthorProfileProps, "comment"> {
  return { ...DEFAULT_AUTHOR };
}
