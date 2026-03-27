/**
 * /area/.../cleanup の title・description 生成（SEO用）。
 * 全角換算: 半角英数字・記号は0.5、それ以外は1。
 */

const SEO_YEAR = 2026;

/** ページ名部分の最大全角換算長（pageTitle 接頭辞） */
const MAX_TITLE_PART_ZEN = 32;
/** meta description の最大全角換算長 */
const MAX_DESCRIPTION_ZEN = 120;

export function zenkakuLength(str: string): number {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if ((c >= 0x20 && c <= 0x7e) || (c >= 0xff61 && c <= 0xff9f)) {
      len += 0.5;
    } else {
      len += 1;
    }
  }
  return len;
}

/**
 * title タグのページ名部分（pageTitle に渡す文字列）を生成。
 */
export function buildCleanupSeoTitlePart(cityName: string): string {
  const long = `【${SEO_YEAR}年最新】${cityName}の実家じまい完全ガイド｜遺品整理・費用・業者選びまで解説`;
  const short1 = `【${SEO_YEAR}年】${cityName}の実家じまいガイド｜遺品整理・費用・業者`;
  const short2 = `${cityName}の実家じまい｜遺品整理・費用・業者【${SEO_YEAR}年最新】`;
  if (zenkakuLength(long) <= MAX_TITLE_PART_ZEN) return long;
  if (zenkakuLength(short1) <= MAX_TITLE_PART_ZEN) return short1;
  return short2;
}

/**
 * meta description を生成。
 */
export function buildCleanupSeoDescription(cityName: string): string {
  const long = `${cityName}で実家じまいをお考えの方へ。遺品整理の費用相場・業者の選び方・補助金情報まで、地域の実情を踏まえてわかりやすく解説します。`;
  const short = `${cityName}の実家じまいをサポート。遺品整理の費用・業者選び・補助金を解説。`;
  if (zenkakuLength(long) <= MAX_DESCRIPTION_ZEN) return long;
  return short;
}
