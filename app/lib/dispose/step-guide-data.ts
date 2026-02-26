/**
 * 捨て方辞典：品目別「自分で処分する手順」データ。
 * DIYStepGuide 用。slug ごとに HowTo 用の steps を返す。
 */

import type { StepItem } from "./types";

export interface StepGuideData {
  title: string;
  description?: string;
  steps: StepItem[];
}

const STEP_GUIDE_BY_SLUG: Record<string, StepGuideData> = {
  butsudan: {
    title: "仏壇・仏具を自治体の粗大ゴミで出す手順（受け付けがある地域の場合）",
    description: "自治体によっては仏壇を粗大ゴミで受け付けていません。供養を希望する場合は業者・寺院への依頼をご検討ください。",
    steps: [
      {
        name: "自治体に電話で申し込む",
        text: "お住まいの市区町村の粗大ゴミ受付窓口（環境課・清掃課など）に電話し、「仏壇を出したい」と伝えて収集の可否と申し込み方法を確認します。魂が宿る品のため、受け付けていない自治体も多いです。",
      },
      {
        name: "粗大ゴミ券（処理券）を購入する",
        text: "申し込みが可能な場合は、コンビニや自治体窓口で粗大ゴミ処理券を購入します。仏壇はサイズにより料金が異なります。券のシールを仏壇の見やすい場所に貼ります。",
      },
      {
        name: "指定された収集日に出す",
        text: "自治体から案内された収集日の朝、指定場所（玄関先や道路際など）に仏壇を出します。雨の日はビニールで覆うなど、自治体の案内に従ってください。魂抜き（閉眼供養）を希望する場合は、事前に寺院や供養業者に相談してください。",
      },
    ],
  },
};

/**
 * 品目 slug に対応するステップガイドを返す。ない場合は null。
 */
export function getStepGuideForSlug(slug: string): StepGuideData | null {
  return STEP_GUIDE_BY_SLUG[slug] ?? null;
}
