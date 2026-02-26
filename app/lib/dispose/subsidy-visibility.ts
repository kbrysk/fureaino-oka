/**
 * 捨て方詳細ページで「全国の空き家補助金」ブロックを表示してよいカテゴリかどうかを判定する。
 * テーマの関連性が高いカテゴリに限定し、関連性の低い内部リンクによるテーマ希薄化を防ぐ。
 */

/**
 * 捨て方詳細ページで「空き家補助金」ブロックを表示してよいカテゴリ ID。
 * 屋外・庭・家屋解体等、実家の片付けと関連が強いものに限定。
 */
export const SUBSIDY_VISIBLE_CATEGORY_IDS: string[] = [
  "outdoor-garage",     // 屋外・庭・ガレージ
  "materials-difficult", // 素材・資源・処理困難物（家屋解体等と関連）
];

export function isSubsidyBlockVisibleForCategory(categoryId: string | undefined): boolean {
  if (!categoryId) return false;
  return SUBSIDY_VISIBLE_CATEGORY_IDS.includes(categoryId);
}
