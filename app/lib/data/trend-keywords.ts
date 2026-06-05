/**
 * 終活・生前整理 検索トレンドレポート 監視キーワード定義
 *
 * - クラスタは content/pipeline/keywords.csv の既存クラスタと整合
 * - Google Trends で安定的にデータが取れる汎用語を優先
 * - 「親世代の悩み」「親子温度差」など、競合（SUUMO/LIFULL/鎌倉新書）にない切り口を意図的に含める
 * - 月間検索ボリュームは keywords.csv の集計値（参考値）
 */

export type TrendCluster =
  | "core"
  | "parent_struggle"
  | "parent_child_gap"
  | "money_law"
  | "disposal"
  | "trouble";

export type TrendKeyword = {
  /** Google Trends に投げる検索語（短く、表記ゆれを避ける） */
  keyword: string;
  /** クラスタ分類 */
  cluster: TrendCluster;
  /** keywords.csv 由来の月間検索数（参考値、絶対値ではなく相対比較用） */
  monthlyVolume?: number;
  /** keywords.csv の kw_id があれば紐付け */
  kwId?: string;
  /** レポート上の表示用ラベル */
  label?: string;
  /** YMYL配慮上、本文での扱いに注意が必要な語に true */
  ymylSensitive?: boolean;
};

export const TREND_CLUSTERS: Record<
  TrendCluster,
  { label: string; description: string }
> = {
  core: {
    label: "生前整理コア",
    description:
      "生前整理・終活・実家じまい・エンディングノートなど、業界の基幹キーワード",
  },
  parent_struggle: {
    label: "親世代の悩み",
    description:
      "親の介護・終活・きょうだい関係など、子世代が抱える親世代起点の悩み",
  },
  parent_child_gap: {
    label: "親子の温度差",
    description:
      "「親が片付けを嫌がる」「実家が片付かない」など、親子のすれ違いを示すシグナル",
  },
  money_law: {
    label: "制度・お金・法律",
    description:
      "生前贈与・相続放棄・空き家補助金など、制度や金銭が絡む領域（YMYL高）",
  },
  disposal: {
    label: "処分・買取・整理",
    description: "遺品整理・不用品回収・粗大ごみなど、実務的な処分まわり",
  },
  trouble: {
    label: "トラブル・消費者保護",
    description:
      "押し買い・不用品回収トラブルなど、消費者保護文脈で自治体に刺さる切り口",
  },
};

/**
 * 初号で監視する20語。
 * 公開後、データの取れ高を見ながら入れ替える。
 */
export const TREND_KEYWORDS: TrendKeyword[] = [
  // 生前整理コア（4語）
  { keyword: "生前整理", cluster: "core", monthlyVolume: 3600, kwId: "C10-008" },
  { keyword: "終活", cluster: "core", monthlyVolume: 18100, kwId: "C5-003" },
  { keyword: "実家じまい", cluster: "core", monthlyVolume: 5400, kwId: "P1-004" },
  {
    keyword: "エンディングノート",
    cluster: "core",
    monthlyVolume: 22200,
    kwId: "C5-003",
  },

  // 親世代の悩み（4語）
  {
    keyword: "親の介護",
    cluster: "parent_struggle",
    monthlyVolume: 6600,
    kwId: "P4-006",
    ymylSensitive: true,
  },
  {
    keyword: "親の介護 兄弟",
    cluster: "parent_struggle",
    monthlyVolume: 480,
    kwId: "P4-018",
  },
  {
    keyword: "親の終活",
    cluster: "parent_struggle",
    monthlyVolume: 260,
    kwId: "P4-031",
  },
  {
    keyword: "高齢の親 一人暮らし",
    cluster: "parent_struggle",
    ymylSensitive: true,
  },

  // 親子の温度差（3語）— ふれあいの丘の差別化角度
  {
    keyword: "親 片付け 嫌がる",
    cluster: "parent_child_gap",
    label: "親が片付けを嫌がる",
  },
  {
    keyword: "実家 片付かない",
    cluster: "parent_child_gap",
    monthlyVolume: 90,
    kwId: "P1-036",
  },
  {
    keyword: "高齢の親 物を捨てない",
    cluster: "parent_child_gap",
    monthlyVolume: 70,
    kwId: "P4-039",
  },

  // 制度・お金・法律（4語）
  {
    keyword: "生前贈与",
    cluster: "money_law",
    monthlyVolume: 5400,
    kwId: "C9-044",
    ymylSensitive: true,
  },
  {
    keyword: "家族信託",
    cluster: "money_law",
    monthlyVolume: 12100,
    kwId: "C9-045",
    ymylSensitive: true,
  },
  {
    keyword: "空き家 補助金",
    cluster: "money_law",
    monthlyVolume: 1600,
    kwId: "P3-017",
  },
  {
    keyword: "相続放棄",
    cluster: "money_law",
    monthlyVolume: 390,
    kwId: "C9-048",
    ymylSensitive: true,
  },

  // 処分・買取・整理（3語）
  { keyword: "遺品整理", cluster: "disposal", monthlyVolume: 27100, kwId: "C6-002" },
  { keyword: "不用品回収", cluster: "disposal", monthlyVolume: 49500, kwId: "C8-021" },
  {
    keyword: "ゴミ屋敷 片付け",
    cluster: "disposal",
    monthlyVolume: 6600,
    kwId: "C8-014",
  },

  // トラブル・消費者保護（2語）— /public-sector との連動
  { keyword: "不用品回収 トラブル", cluster: "trouble" },
  { keyword: "訪問購入", cluster: "trouble", label: "押し買い（訪問購入）" },
];

/** クラスタごとにKWを取り出す */
export function keywordsByCluster(cluster: TrendCluster): TrendKeyword[] {
  return TREND_KEYWORDS.filter((kw) => kw.cluster === cluster);
}

/** レポート用の表示ラベル */
export function displayLabel(kw: TrendKeyword): string {
  return kw.label ?? kw.keyword;
}
