/**
 * コラム（記事）のカテゴリ定義（縦軸＝テーマ）
 * PDF改善提案: 6カテゴリでディレクトリを構成。1記事1カテゴリ。
 */

export interface ArticleCategory {
  slug: string;
  name: string;
  description: string;
  /** 既存 index.json の category 表示名とのマッピング（いずれかに一致すればこのカテゴリ） */
  matchNames: string[];
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    slug: "guide",
    name: "基礎・段取り",
    description: "はじめての実家じまい。進め方・親への説得・業者に頼むか自分でやるか。",
    matchNames: ["進め方", "親・家族"],
  },
  {
    slug: "cleanup",
    name: "片付け・不用品処分",
    description: "モノの整理。品目別の捨て方・買取・業者選び。",
    matchNames: ["処分・買取"],
  },
  {
    slug: "inheritance",
    name: "相続・お金・手続き",
    description: "相続手続き・口座凍結・費用・補助金。YMYL領域。",
    matchNames: ["相続・お金", "相続"],
  },
  {
    slug: "real-estate",
    name: "空き家・不動産",
    description: "空き家の維持費・売却・解体・固定資産税。",
    matchNames: ["資産・家"],
  },
  {
    slug: "digital",
    name: "デジタル遺品・契約",
    description: "スマホ・パスワード・ネット銀行・サブスク解約。",
    matchNames: ["デジタル"],
  },
  {
    slug: "mental",
    name: "心・供養・終活",
    description: "供養・罪悪感・エンディングノート・墓じまい。",
    matchNames: ["心・供養", "供養・終活"],
  },
];

export function getCategoryBySlug(slug: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategorySlugForArticle(categoryName: string): string {
  const cat = ARTICLE_CATEGORIES.find((c) => c.matchNames.includes(categoryName));
  return cat?.slug ?? "guide";
}

export function getArticleCategoryBySlug(slug: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find((c) => c.slug === slug);
}
