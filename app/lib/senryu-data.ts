/**
 * 実家じまい川柳：4つの切り口で共感を呼ぶコンテンツ
 * フクロウのキャラクターが詠んでいる演出
 */

export type SenryuCategoryId = "aijo" | "family" | "aruaru" | "experience";

export interface SenryuCategory {
  id: SenryuCategoryId;
  name: string;
  description: string;
}

/** 初期（ダミー）投票数。ユーザーのローカル投票と合算してランキング等に使用 */
export interface SenryuInitialVotes {
  empathy: number;
  zabuton: number;
}

/** 課題解決記事への文脈SEOリンク */
export interface SenryuSolutionLink {
  text: string;
  url: string;
}

export interface SenryuItem {
  id: string;
  /** 5・7・5の句（配列または文字列。表示は text を優先） */
  phrase: string | string[];
  /** 表示用テキスト（phrase と同一でも可） */
  text: string;
  categoryId: SenryuCategoryId;
  initialVotes: SenryuInitialVotes;
  solutionLink?: SenryuSolutionLink;
}

export const SENRYU_CATEGORIES: SenryuCategory[] = [
  {
    id: "aijo",
    name: "実家じまいにまつわる、ちょっとした哀愁",
    description: "センチメンタルな感情を肯定し、サイトへの信頼感を深めます。",
  },
  {
    id: "family",
    name: "家族のちょっとしたいざこざ",
    description: "「うちだけじゃないんだ」という安心感を。",
  },
  {
    id: "aruaru",
    name: "思わずくすっと笑えるエモい内容（あるある）",
    description: "重たいテーマのガス抜き。SNSでシェアされやすいコンテンツです。",
  },
  {
    id: "experience",
    name: "運営者の実体験",
    description: "「同じ苦労をした人間だ」という自己開示で、距離を縮めます。",
  },
];

export const SENRYU_ITEMS: SenryuItem[] = [
  { id: "a1", phrase: "片付けの　手止まるアルバム　若き父", text: "片付けの　手止まるアルバム　若き父", categoryId: "aijo", initialVotes: { empathy: 12, zabuton: 5 }, solutionLink: { text: "写真・アルバムの整理のコツ", url: "/dispose/category/memorial" } },
  { id: "a2", phrase: "柱の傷　消せずに撫でる　引越し日", text: "柱の傷　消せずに撫でる　引越し日", categoryId: "aijo", initialVotes: { empathy: 8, zabuton: 3 } },
  { id: "b1", phrase: "着物など　要らぬと言うが　売るなと言う", text: "着物など　要らぬと言うが　売るなと言う", categoryId: "family", initialVotes: { empathy: 25, zabuton: 10 }, solutionLink: { text: "着物・古着の処分と買取", url: "/dispose" } },
  { id: "b2", phrase: "母さんの　『あれは大事』は　ゴミばかり", text: "母さんの　『あれは大事』は　ゴミばかり", categoryId: "family", initialVotes: { empathy: 20, zabuton: 8 }, solutionLink: { text: "家族で話し合うコツ", url: "/guide" } },
  { id: "c1", phrase: "実家から　謎の壺出た　価値はゼロ", text: "実家から　謎の壺出た　価値はゼロ", categoryId: "aruaru", initialVotes: { empathy: 18, zabuton: 12 }, solutionLink: { text: "骨董・壺の処分と査定", url: "/tools/appraisal" } },
  { id: "c2", phrase: "孫が来る　その日だけきれい　実家の間", text: "孫が来る　その日だけきれい　実家の間", categoryId: "aruaru", initialVotes: { empathy: 10, zabuton: 4 } },
  { id: "d1", phrase: "業者呼び　母が隠した　ボロ下着", text: "業者呼び　母が隠した　ボロ下着", categoryId: "experience", initialVotes: { empathy: 15, zabuton: 7 }, solutionLink: { text: "遺品整理の進め方", url: "/guide" } },
  { id: "d2", phrase: "査定額　聞かずに捨てた　父の意地", text: "査定額　聞かずに捨てた　父の意地", categoryId: "experience", initialVotes: { empathy: 14, zabuton: 6 }, solutionLink: { text: "資産・査定の目安", url: "/tools/appraisal" } },
  { id: "d3", phrase: "『まだ使う』　十年しまいの　ストーブよ", text: "『まだ使う』　十年しまいの　ストーブよ", categoryId: "experience", initialVotes: { empathy: 22, zabuton: 9 }, solutionLink: { text: "家具・家電の処分", url: "/dispose/category/appliance" } },
  { id: "d4", phrase: "段ボール　開けたら中身　また段ボール", text: "段ボール　開けたら中身　また段ボール", categoryId: "experience", initialVotes: { empathy: 28, zabuton: 15 }, solutionLink: { text: "不用品の片付け手順", url: "/guide" } },
  { id: "d5", phrase: "遺品整理　涙より先に　くしゃみ出る", text: "遺品整理　涙より先に　くしゃみ出る", categoryId: "experience", initialVotes: { empathy: 16, zabuton: 8 }, solutionLink: { text: "遺品整理の費用相場", url: "/cost" } },
];

export function getSenryuByCategory(categoryId: SenryuCategoryId): SenryuItem[] {
  return SENRYU_ITEMS.filter((s) => s.categoryId === categoryId);
}

export function getCategoryById(id: SenryuCategoryId): SenryuCategory | undefined {
  return SENRYU_CATEGORIES.find((c) => c.id === id);
}
