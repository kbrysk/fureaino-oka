/** 正規ドメイン（Canonical・sitemap・robots の基準）。未設定時は本番ドメイン */
export const CANONICAL_BASE =
  (typeof process.env.NEXT_PUBLIC_BASE_URL === "string" && process.env.NEXT_PUBLIC_BASE_URL.trim()) ||
  "https://www.fureaino-oka.com";

/**
 * サイトの絶対URL（OG・ファビコン等）。NEXT_PUBLIC_SITE_URL または VERCEL_URL を利用。
 * Canonical・sitemap には getCanonicalBase() を使うこと。
 */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "";
}

/** Canonical・sitemap・robots 用の正規ベースURL（末尾スラッシュなし） */
export function getCanonicalBase(): string {
  return CANONICAL_BASE.replace(/\/$/, "");
}

/**
 * パラメータ・ハッシュを含まない Canonical 用の絶対URL。
 * ?l=xxx 等の重複インデックスを防ぎ、Search Console の評価を正規URLに集約する。
 */
export function getCanonicalUrl(pathname: string): string {
  const base = getCanonicalBase();
  const clean = pathname.replace(/\?.*$/, "").replace(/#.*$/, "").trim();
  const path = !clean || clean === "/" ? "" : clean.startsWith("/") ? clean : `/${clean}`;
  return path ? `${base}${path}` : `${base}/`;
}
