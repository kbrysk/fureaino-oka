/**
 * サイトブランド（生前整理支援センター ふれあいの丘）
 * タイトルは「生前整理」を最左に。実家じまい・遺品整理の無料相談を訴求。
 */
export const SITE_NAME_FULL = "生前整理支援センター - ふれあいの丘";
/** ロゴ・表示用（スペース区切り） */
export const SITE_NAME_LOGO = "生前整理支援センター ふれあいの丘";
export const SITE_NAME_SHORT = "生前整理支援センター";
export const SITE_TAGLINE = "実家じまい・遺品整理の無料相談";

/** トップページの title（SEO用） */
export const SITE_TITLE_TOP = "生前整理支援センター - ふれあいの丘 | 実家じまい・遺品整理の無料相談";

/** 下層ページの title テンプレート（生前整理を左に） */
export function pageTitle(pageName: string): string {
  return `${SITE_NAME_FULL} | ${pageName}`;
}

/** 公式LINE登録URL（未設定時はガイドページへ） */
export const LINE_ADD_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_LINE_ADD_URL) ||
  "/guide?intent=line";
