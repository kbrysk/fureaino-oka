/**
 * 役所の難解な表現を「中学生でもわかる言葉」に置き換える。
 * subsidyInfo.condition 等の一次情報をベースに、表現のみをやさしくする。
 */

const REPLACEMENTS: [string | RegExp, string][] = [
  ["老朽危険家屋等除却工事", "ボロボロになった古い家を壊す工事"],
  ["交付申請の要件", "お金をもらうために守るべきルール"],
  ["暴力団員との密接な関係がないこと", "誠実な一般の方であること"],
  ["除却", "取り壊し・解体"],
  ["危険空家等", "危険と判断された空き家"],
  ["申請者", "お金をもらう人（申請する方）"],
  ["市税の滞納がなく", "市に納める税金をきちんと払っている"],
  ["事前の確認手続き", "役所で「対象になりますか」と事前に確認する手続き"],
  ["建設業許可業者に依頼すること", "解体のプロ（建設業の許可を持った業者）に頼むこと"],
  ["老朽化した建物", "古くて傷みが進んだ建物"],
  ["昭和56年（1981年）以前", "1981年より前に建てられた"],
];

/**
 * 役所言葉が含まれた文字列を、やさしい言葉に置き換えた結果を返す。
 * 一次情報を捏造せず、表現のみを翻訳する。
 */
export function translateBureaucraticToPlain(text: string): string {
  let result = text;
  for (const [from, to] of REPLACEMENTS) {
    result = typeof from === "string" ? result.split(from).join(to) : result.replace(from, to);
  }
  return result;
}
