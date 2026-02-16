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

export interface SenryuItem {
  id: string;
  text: string;
  categoryId: SenryuCategoryId;
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
  // (a) 哀愁
  { id: "a1", text: "片付けの　手止まるアルバム　若き父", categoryId: "aijo" },
  { id: "a2", text: "柱の傷　消せずに撫でる　引越し日", categoryId: "aijo" },
  // (b) 家族のいざこざ
  { id: "b1", text: "着物など　要らぬと言うが　売るなと言う", categoryId: "family" },
  { id: "b2", text: "母さんの　『あれは大事』は　ゴミばかり", categoryId: "family" },
  // (c) あるある
  { id: "c1", text: "実家から　謎の壺出た　価値はゼロ", categoryId: "aruaru" },
  { id: "c2", text: "孫が来る　その日だけきれい　実家の間", categoryId: "aruaru" },
  // (d) 運営者の体験（スモールスタート5句程度）
  { id: "d1", text: "業者呼び　母が隠した　ボロ下着", categoryId: "experience" },
  { id: "d2", text: "査定額　聞かずに捨てた　父の意地", categoryId: "experience" },
  { id: "d3", text: "『まだ使う』　十年しまいの　ストーブよ", categoryId: "experience" },
  { id: "d4", text: "段ボール　開けたら中身　また段ボール", categoryId: "experience" },
  { id: "d5", text: "遺品整理　涙より先に　くしゃみ出る", categoryId: "experience" },
];

export function getSenryuByCategory(categoryId: SenryuCategoryId): SenryuItem[] {
  return SENRYU_ITEMS.filter((s) => s.categoryId === categoryId);
}

export function getCategoryById(id: SenryuCategoryId): SenryuCategory | undefined {
  return SENRYU_CATEGORIES.find((c) => c.id === id);
}
