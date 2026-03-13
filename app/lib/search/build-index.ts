// U6: 検索インデックス生成 2026-03
// このファイルはサーバーサイドのみで実行される

import { getPrefectureIds } from "../utils/city-loader";
import { PREFECTURE_ID_TO_NAME } from "../prefecture-ids";

export type SearchIndexItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "area" | "tool" | "article" | "guide" | "static";
  keywords: string[];
};

export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const items: SearchIndexItem[] = [];

  const staticPages: SearchIndexItem[] = [
    {
      id: "home",
      title: "生前整理・実家じまいを無料でサポート | ふれあいの丘",
      description: "実家じまい・生前整理を何から始めるか迷っていませんか？",
      url: "/",
      category: "static",
      keywords: ["生前整理", "実家じまい", "トップ", "ホーム"],
    },
    {
      id: "area",
      title: "全国の実家じまい・空き家補助金を地域から探す",
      description: "都道府県・市区町村別に補助金・費用相場・粗大ゴミ情報を掲載",
      url: "/area",
      category: "area",
      keywords: ["補助金", "地域", "都道府県", "市区町村", "空き家"],
    },
    {
      id: "ending-note",
      title: "デジタルエンディングノート",
      description: "スマホで書けて家族と共有できる無料のエンディングノート",
      url: "/ending-note",
      category: "static",
      keywords: ["エンディングノート", "遺言", "終活"],
    },
    {
      id: "master-guide",
      title: "実家じまい・生前整理のはじめかた完全ガイド",
      description: "何から始めるかを3ステップでわかりやすく解説",
      url: "/articles/master-guide",
      category: "article",
      keywords: ["はじめかた", "手順", "進め方", "ガイド"],
    },
    {
      id: "checklist",
      title: "生前整理チェックリスト",
      description: "生前整理の進捗を管理するチェックリスト",
      url: "/checklist",
      category: "static",
      keywords: ["チェックリスト", "進捗", "管理"],
    },
    {
      id: "cost",
      title: "実家じまい・遺品整理の費用目安",
      description: "間取り別の費用相場と業者選びのポイント",
      url: "/cost",
      category: "static",
      keywords: ["費用", "料金", "相場", "見積もり", "コスト"],
    },
  ];
  items.push(...staticPages);

  const toolPages: SearchIndexItem[] = [
    { id: "tool-jikka", title: "実家じまい力診断", description: "約10問でリスク度と優先対策がわかる無料診断", url: "/tools/jikka-diagnosis", category: "tool", keywords: ["実家じまい", "診断", "リスク"] },
    { id: "tool-akiya", title: "空き家リスク診断", description: "放置するといくら損する？約8問でわかる", url: "/tools/akiya-risk", category: "tool", keywords: ["空き家", "リスク", "診断", "固定資産税"] },
    { id: "tool-tax", title: "空き家税金シミュレーター", description: "維持費・固定資産税を自動計算", url: "/tools/empty-house-tax", category: "tool", keywords: ["税金", "シミュレーター", "固定資産税", "維持費"] },
    { id: "tool-inheritance", title: "法定相続分シミュレーター", description: "相続人と相続分を自動計算", url: "/tools/inheritance-share", category: "tool", keywords: ["相続", "法定相続", "シミュレーター"] },
    { id: "tool-souzoku", title: "相続準備力診断", description: "相続の準備がどれくらいできているかを診断", url: "/tools/souzoku-prep", category: "tool", keywords: ["相続", "準備", "診断"] },
    { id: "tool-digital", title: "デジタル遺品リスク診断", description: "スマホ・SNS・サブスクの整理状況を診断", url: "/tools/digital-shame", category: "tool", keywords: ["デジタル", "遺品", "スマホ", "SNS"] },
    { id: "tool-hoji", title: "法要カレンダー", description: "命日から法要の日程を自動計算", url: "/tools/hoji-calendar", category: "tool", keywords: ["法要", "七回忌", "一周忌", "カレンダー", "命日"] },
    { id: "tool-appraisal", title: "不動産・資産の査定目安", description: "実家・土地・家財の概算査定", url: "/tools/appraisal", category: "tool", keywords: ["査定", "不動産", "資産", "土地"] },
  ];
  items.push(...toolPages);

  const prefIds = getPrefectureIds();
  prefIds.forEach((id) => {
    const name = PREFECTURE_ID_TO_NAME[id] ?? id;
    items.push({
      id: `area-${id}`,
      title: `${name}の実家じまい・補助金情報`,
      description: `${name}の空き家補助金・遺品整理費用相場・粗大ゴミ情報`,
      url: `/area/${id}`,
      category: "area",
      keywords: [name, `${name}補助金`, `${name}遺品整理`],
    });
  });

  return items;
}

export function searchIndex(
  items: SearchIndexItem[],
  query: string,
  limit = 8
): SearchIndexItem[] {
  if (!query.trim()) return [];

  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/);

  const scored = items.map((item) => {
    let score = 0;
    words.forEach((word) => {
      if (item.title.toLowerCase().includes(word)) score += 3;
      if (item.keywords.some((k) => k.toLowerCase().includes(word))) score += 2;
      if (item.description.toLowerCase().includes(word)) score += 1;
    });
    return { item, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
