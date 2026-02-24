/**
 * コンテキスト対応型ルーティング：CTA の最適な遷移先を中央管理。
 * prefId / cityId の有無で査定セクション or 地域選択アンカーへ誘導する。
 */

/**
 * 現在の都道府県・市区町村に応じた最適な CTA 遷移先 URL を返す。
 * - 両方存在: 該当エリアページの査定セクションへ
 * - それ以外: 地域選択アンカー（同一ページ内 or ツールページ）
 */
export function getOptimalCtaUrl(prefId?: string, cityId?: string): string {
  const hasArea = typeof prefId === "string" && prefId.trim() !== "" && typeof cityId === "string" && cityId.trim() !== "";
  if (hasArea) {
    return `/area/${prefId!.trim()}/${cityId!.trim()}#appraisal-section`;
  }
  return "#area-selector";
}
