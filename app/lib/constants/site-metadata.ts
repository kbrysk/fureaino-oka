/**
 * サイト運営者情報の SSOT（Single Source of Truth）。
 * E-E-A-T・構造化データ・運営者表示UI の共通データソース。
 * 電話番号は非公開のため含めない。
 */
export const siteName = "生前整理支援センター ふれあいの丘";

export const baseUrl = "https://www.fureaino-oka.com";

export const organization = {
  name: "株式会社Kogera",
  url: "https://www.fureaino-oka.com/company",
  logo: "https://www.fureaino-oka.com/logo.png",
  contactUrl: "https://www.fureaino-oka.com/contact",
} as const;
