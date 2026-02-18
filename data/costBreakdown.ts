/**
 * 費用相場ページ：建物・状況・オプション別の料金目安データ
 * 間取り以外の軸でロングテールSEOを強化するための構造化データ。
 */

export type CostCategory = {
  id: string;
  title: string;
  description: string;
  items: { label: string; priceRange: string; url: string }[];
};

export const COST_BREAKDOWN_DATA: CostCategory[] = [
  {
    id: "building",
    title: "建物・立地による費用変動（追加料金の目安）",
    description:
      "エレベーターの有無やトラックの駐車位置によって、作業員の増員が必要になり費用が変わります。",
    items: [
      { label: "エレベーターなし（階段作業）", priceRange: "＋10,000円〜/階", url: "/cost/stairs" },
      { label: "団地（養生・搬出距離長）", priceRange: "＋20,000円〜", url: "/cost/danchi" },
      { label: "道幅が狭い（2tトラック不可）", priceRange: "＋15,000円〜", url: "/cost/narrow-road" },
      {
        label: "タワーマンション（防災センター届出等）",
        priceRange: "見積もり要相談",
        url: "/cost/tower-mansion",
      },
    ],
  },
  {
    id: "condition",
    title: "部屋の状態・ゴミ屋敷レベル別",
    description:
      "足の踏み場がない場合や、害虫・異臭が発生している場合は、特殊清掃費用がかかります。",
    items: [
      { label: "ゴミ屋敷（膝丈まで）", priceRange: "通常の1.5倍〜", url: "/cost/trash-level-1" },
      { label: "ゴミ屋敷（天井近くまで）", priceRange: "通常の3倍〜", url: "/cost/trash-level-max" },
      { label: "ペット屋敷（消臭・消毒）", priceRange: "＋50,000円〜", url: "/cost/pet-odor" },
      { label: "孤独死・特殊清掃", priceRange: "70,000円〜（清掃のみ）", url: "/cost/special-cleaning" },
    ],
  },
  {
    id: "option",
    title: "その他の付帯作業・オプション",
    description: "片付けと同時に依頼することで、個別に頼むより安く済む作業です。",
    items: [
      { label: "エアコン取り外し", priceRange: "3,000円〜/台", url: "/cost/ac-removal" },
      {
        label: "物置の解体・撤去",
        priceRange: "15,000円〜",
        url: "/dispose/category/outdoor-garage",
      },
      {
        label: "仏壇の供養・処分",
        priceRange: "20,000円〜",
        url: "/dispose/category/memorial",
      },
      { label: "庭木の剪定・草刈り", priceRange: "10,000円〜/時", url: "/cost/garden" },
    ],
  },
];
