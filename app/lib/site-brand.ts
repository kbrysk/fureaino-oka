/**
 * サイトブランド（生前整理支援センター ふれあいの丘）
 * トップ: サイト名＋キャッチ。下層: ページ名を文頭、文末にサイト名（SEO）。
 */
export const SITE_NAME_FULL = "生前整理支援センター - ふれあいの丘";
/** ロゴ・表示用（スペース区切り） */
export const SITE_NAME_LOGO = "生前整理支援センター ふれあいの丘";
export const SITE_NAME_SHORT = "生前整理支援センター";
export const SITE_TAGLINE = "実家じまい・遺品整理の無料相談";

/** トップページの title（SEO用） */
export const SITE_TITLE_TOP = "生前整理支援センター - ふれあいの丘 | 実家じまい・遺品整理の無料相談";

/** 下層ページの title テンプレート（SEO: ページ名を文頭、文末にサイト名） */
export function pageTitle(pageName: string): string {
  return `${pageName}｜${SITE_NAME_FULL}`;
}

/** 公式LINE登録URL（環境変数未設定時は lin.ee のURLを使用） */
export const LINE_ADD_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_LINE_ADD_URL) ||
  "https://lin.ee/XBvI8cD";
