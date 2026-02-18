/**
 * 捨て方辞典：カテゴリ定義（トピッククラスター用）
 */

export interface DisposeCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
}

export const DISPOSE_CATEGORIES: DisposeCategory[] = [
  {
    id: "memorial",
    slug: "memorial",
    name: "供養・想い出カテゴリー",
    shortName: "供養・想い出",
    description: "「捨てる罪悪感」と向き合う品目。供養・寄付の選択肢を解説します。",
  },
  {
    id: "furniture",
    slug: "furniture",
    name: "大型家具の捨て方",
    shortName: "大型家具",
    description: "運び出しが大変な家具。自治体回収と業者回収の選び方。",
  },
  {
    id: "appliance",
    slug: "appliance",
    name: "家電・デジタル機器の捨て方",
    shortName: "家電・デジタル",
    description: "家電リサイクル法やデータ消去が絡む品目。",
  },
  {
    id: "difficult",
    slug: "difficult",
    name: "処理困難物の捨て方",
    shortName: "処理困難物",
    description: "自治体で回収できないもの。専門業者への依頼が前提です。",
  },
  {
    id: "hobby",
    slug: "hobby",
    name: "趣味・コレクションの捨て方",
    shortName: "趣味・コレクション",
    description: "買取需要が高い品目。売る選択肢を優先して解説。",
  },
  {
    id: "daily",
    slug: "daily",
    name: "日用品・大量にあるものの捨て方",
    shortName: "日用品・大量",
    description: "まとめて処分したいニーズに応える品目。",
  },
  {
    id: "outdoor-garage",
    slug: "outdoor-garage",
    name: "屋外・庭・ガレージの捨て方",
    shortName: "屋外・庭・ガレージ",
    description: "物置・庭石・農機具など、解体や重量物の処分ニーズに応える品目。",
  },
  {
    id: "study-documents",
    slug: "study-documents",
    name: "書斎・金庫・重要書類の捨て方",
    shortName: "書斎・金庫・重要書類",
    description: "切手・古銭・権利書など、価値ある「紙モノ」や権利関係の整理。",
  },
  {
    id: "retro-misc",
    slug: "retro-misc",
    name: "納戸・レトロ雑貨の捨て方",
    shortName: "納戸・レトロ雑貨",
    description: "昭和レトロで価値が出る不用品。買取需要がある品目を解説。",
  },
  {
    id: "audio-precision",
    slug: "audio-precision",
    name: "オーディオ・精密機器の捨て方",
    shortName: "オーディオ・精密機器",
    description: "アンプ・スピーカー・レコードプレーヤーなど、マニア向け高価買取の品目。",
  },
  {
    id: "materials-difficult",
    slug: "materials-difficult",
    name: "素材・資源・処理困難物の捨て方",
    shortName: "素材・資源・処理困難物",
    description: "鉄くず・土砂・畳など、自治体で捨てられない「困ったモノ」の解決。",
  },
];

export function getCategoryBySlug(slug: string): DisposeCategory | undefined {
  return DISPOSE_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): DisposeCategory | undefined {
  return DISPOSE_CATEGORIES.find((c) => c.id === id);
}
