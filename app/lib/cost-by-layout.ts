/**
 * 戦略B：間取り別 遺品整理・実家じまい 費用シミュレーション用データ
 * キーワード: [間取り]+費用 / トラック何台 / 荷物多い・ゴミ屋敷 / 親の家・団地・階段 / 安くする
 */

export type BuildingType = "戸建て" | "マンション";

export interface ModelCase {
  name: string;
  scenario: string;
  totalYen: number;
  breakdown: string;
}

export interface LayoutCostData {
  slug: string;
  label: string;
  minYen: number;
  avgYen: number;
  maxYen: number;
  workHoursMin: number;
  workHoursMax: number;
  buildingTypes: BuildingType[];
  tipShort: string;
  /** 軽トラックの目安（荷物少なめ） */
  truckLight: string;
  /** 2トントラックの目安（標準） */
  truckTwoTon: string;
  /** 費用が変わる要因：搬出条件（階段・階数） */
  factorCarry: string;
  /** 費用が変わる要因：処分品の質 */
  factorQuality: string;
  /** 費用が変わる要因：トラック台数 */
  factorTruck: string;
  /** 松・竹・梅の3モデルケース */
  modelCases: [ModelCase, ModelCase, ModelCase];
}

export const LAYOUT_COST_LIST: LayoutCostData[] = [
  {
    slug: "1k",
    label: "1K",
    minYen: 8,
    avgYen: 15,
    maxYen: 25,
    workHoursMin: 4,
    workHoursMax: 8,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "不用品の量を減らしてから業者依頼すると見積もりを抑えられます。",
    truckLight: "荷物が少なめなら軽トラック1台で済むことが多いです。",
    truckTwoTon: "標準的な荷物量なら2トントラック1台が目安です。",
    factorCarry: "1階か、5階階段かで数万円変わります。エレベーターなしの階段作業は人件費・時間がかかります。",
    factorQuality: "リサイクルできる家電・家具が多いと買取で相殺されたり、業者によっては減額になる場合も。混載ゴミばかりだと処分費が重くなります。",
    factorTruck: "軽トラ1台で済むか、2トン車が必要かで運搬費が変わります。荷物多い・ゴミ屋敷状態だと2トン車複数台になることも。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・自分たちで分別済み・1階またはエレベーターあり", totalYen: 78000, breakdown: "基本料金+軽トラ1台+処分費 など" },
      { name: "竹", scenario: "標準的な荷物量・業者に分別お任せ・2〜3階階段", totalYen: 150000, breakdown: "人件費+2トン車1台+処分費+搬出作業 など" },
      { name: "梅", scenario: "荷物多い・ゴミ屋敷に近い・エレベーターなし高層・全てお任せ", totalYen: 220000, breakdown: "人件費+2トン車2台+処分費+階段搬出 など" },
    ],
  },
  {
    slug: "2k",
    label: "2K",
    minYen: 12,
    avgYen: 22,
    maxYen: 35,
    workHoursMin: 6,
    workHoursMax: 12,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "事前に「残す・捨てる」を分けておくと作業時間と費用が抑えられます。",
    truckLight: "荷物が少なめなら軽トラック1台で収まる場合も。",
    truckTwoTon: "標準では2トントラック1台が目安。荷物多めなら2台。",
    factorCarry: "団地・マンションの階数や階段の有無で搬出費が変わります。親の家・遠方の場合は出張費が加わることも。",
    factorQuality: "買取可能な家電・家具を事前に分けておくと、処分費を抑えられる場合があります。",
    factorTruck: "2Kなら2トン車1台で済むことが多いですが、荷物多いと2台必要になります。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・分別済み・1階", totalYen: 120000, breakdown: "基本料金+軽〜2トン1台+処分費 など" },
      { name: "竹", scenario: "標準的な荷物・業者お任せ・階段あり", totalYen: 220000, breakdown: "人件費+2トン車1台+処分費+搬出 など" },
      { name: "梅", scenario: "荷物多い・ゴミ屋敷気味・階段・全てお任せ", totalYen: 350000, breakdown: "人件費+2トン車2台+処分費+搬出 など" },
    ],
  },
  {
    slug: "2ldk",
    label: "2LDK",
    minYen: 18,
    avgYen: 28,
    maxYen: 45,
    workHoursMin: 8,
    workHoursMax: 16,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "複数社の無料見積もりで比較し、作業内容の差を確認しましょう。",
    truckLight: "荷物少なめなら2トン車1台で済むことも。",
    truckTwoTon: "標準で2トントラック1〜2台が目安です。",
    factorCarry: "親の家・団地・エレベーターなしだと搬出に時間と人数がかかり、費用が上がります。女性スタッフ希望の場合は業者により対応可。",
    factorQuality: "処分品の質（リサイクル可か混載か）で処分費が変動。買取分があると総額が下がる場合も。",
    factorTruck: "2LDKなら2トン車1〜2台が相場。荷物多い・ゴミ屋敷なら2台以上。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・分別済み・搬出しやすい", totalYen: 180000, breakdown: "基本+2トン1台+処分費 など" },
      { name: "竹", scenario: "標準・業者お任せ・階段あり", totalYen: 280000, breakdown: "人件費+2トン1〜2台+処分費 など" },
      { name: "梅", scenario: "荷物多い・階段・全てお任せ", totalYen: 450000, breakdown: "人件費+2トン2台+処分費+搬出 など" },
    ],
  },
  {
    slug: "3k",
    label: "3K",
    minYen: 20,
    avgYen: 32,
    maxYen: 50,
    workHoursMin: 10,
    workHoursMax: 20,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "買取可能な家電・家具は事前に査定すると処分費を相殺できる場合があります。",
    truckLight: "荷物少なめでも2トン車1台は欲しいところ。",
    truckTwoTon: "標準で2トントラック2台が目安。荷物多いと3台。",
    factorCarry: "階段・階数で搬出コストが大きく変わります。1K 遺品整理 安くする なら階段を考慮した業者選びを。",
    factorQuality: "リサイクルできる家電が多いか、混載ゴミばかりかで処分費が数万円単位で変わります。",
    factorTruck: "3Kなら2トン車2台が目安。荷物多い・ゴミ屋敷なら3台以上。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・分別済み・1階", totalYen: 200000, breakdown: "基本+2トン1〜2台+処分費 など" },
      { name: "竹", scenario: "標準・業者お任せ・階段", totalYen: 320000, breakdown: "人件費+2トン2台+処分費 など" },
      { name: "梅", scenario: "荷物多い・階段・全てお任せ", totalYen: 500000, breakdown: "人件費+2トン2〜3台+処分費 など" },
    ],
  },
  {
    slug: "3ldk",
    label: "3LDK",
    minYen: 28,
    avgYen: 42,
    maxYen: 65,
    workHoursMin: 12,
    workHoursMax: 24,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "戸建ては庭・倉庫の荷物も含めると費用が増えるため、見積もりで範囲を確認を。",
    truckLight: "荷物少なめなら2トン車2台程度。",
    truckTwoTon: "標準で2トントラック2〜3台が目安。戸建ては倉庫分で増えることも。",
    factorCarry: "エレベーターなし・高層・親の家・遠方だと搬出・出張で費用が上がります。作業員の人数・女性スタッフの有無も業者により対応。",
    factorQuality: "処分品の質で処分費が変動。買取可能品があると総額を抑えられる場合も。",
    factorTruck: "3LDKなら2トン車2〜3台が相場。荷物多い・ゴミ屋敷なら3台以上。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・分別済み・搬出しやすい", totalYen: 280000, breakdown: "基本+2トン2台+処分費 など" },
      { name: "竹", scenario: "標準・業者お任せ・階段あり", totalYen: 420000, breakdown: "人件費+2トン2〜3台+処分費 など" },
      { name: "梅", scenario: "荷物多い・戸建て倉庫含む・全てお任せ", totalYen: 650000, breakdown: "人件費+2トン3台+処分費 など" },
    ],
  },
  {
    slug: "4k",
    label: "4K",
    minYen: 35,
    avgYen: 52,
    maxYen: 80,
    workHoursMin: 16,
    workHoursMax: 32,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "段階的に片付ける「部分依頼」も選択肢。まずは1階だけなどで相談を。",
    truckLight: "荷物少なめでも2トン車2台は見ておく。",
    truckTwoTon: "標準で2トントラック3台前後。荷物多いと4台以上。",
    factorCarry: "階段・エレベーターなし・遠方の親の家などで搬出費・人件費が増えます。",
    factorQuality: "処分品の質・買取可能品の有無で総額が変わります。",
    factorTruck: "4Kなら2トン車3台前後が目安。ゴミ屋敷状態だと台数が増えます。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・部分依頼・搬出しやすい", totalYen: 350000, breakdown: "基本+2トン2台+処分費 など" },
      { name: "竹", scenario: "標準・業者お任せ・階段", totalYen: 520000, breakdown: "人件費+2トン3台+処分費 など" },
      { name: "梅", scenario: "荷物多い・階段・全てお任せ", totalYen: 800000, breakdown: "人件費+2トン3〜4台+処分費 など" },
    ],
  },
  {
    slug: "4ldk",
    label: "4LDK",
    minYen: 42,
    avgYen: 65,
    maxYen: 100,
    workHoursMin: 20,
    workHoursMax: 40,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "遺品整理と不用品回収をセットにすると単価がお得な業者もあります。",
    truckLight: "荷物少なめなら2トン車2〜3台。",
    truckTwoTon: "標準で2トントラック3〜4台が目安。",
    factorCarry: "搬出条件（階段・階数・エレベーターなし）で数万円〜十数万円変動。親の家・遠方の場合は出張費も。",
    factorQuality: "処分品の質・買取で処分費を相殺できる場合があります。",
    factorTruck: "4LDKなら2トン車3〜4台が相場。荷物多い・ゴミ屋敷なら4台以上。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・分別済み・搬出しやすい", totalYen: 420000, breakdown: "基本+2トン2〜3台+処分費 など" },
      { name: "竹", scenario: "標準・業者お任せ・階段", totalYen: 650000, breakdown: "人件費+2トン3〜4台+処分費 など" },
      { name: "梅", scenario: "荷物多い・戸建て・全てお任せ", totalYen: 1000000, breakdown: "人件費+2トン4台+処分費 など" },
    ],
  },
  {
    slug: "5ldk",
    label: "5LDK以上",
    minYen: 55,
    avgYen: 85,
    maxYen: 130,
    workHoursMin: 28,
    workHoursMax: 56,
    buildingTypes: ["戸建て", "マンション"],
    tipShort: "大規模な場合は複数日に分けると人件費が読みやすく、見積もりも取りやすいです。",
    truckLight: "荷物少なめでも2トン車3台程度。",
    truckTwoTon: "標準で2トントラック4台以上が目安。",
    factorCarry: "階段・階数・遠方・作業員人数（女性スタッフ希望含む）で費用が大きく変動。",
    factorQuality: "処分品の質・買取で総額を抑えられる場合があります。",
    factorTruck: "5LDK以上なら2トン車4台以上が相場。荷物多い・ゴミ屋敷なら5台以上も。",
    modelCases: [
      { name: "松", scenario: "荷物少なめ・部分依頼・搬出しやすい", totalYen: 550000, breakdown: "基本+2トン3台+処分費 など" },
      { name: "竹", scenario: "標準・業者お任せ・階段", totalYen: 850000, breakdown: "人件費+2トン4台+処分費 など" },
      { name: "梅", scenario: "荷物多い・大規模・全てお任せ", totalYen: 1300000, breakdown: "人件費+2トン5台以上+処分費 など" },
    ],
  },
];

export function getLayoutBySlug(slug: string): LayoutCostData | undefined {
  return LAYOUT_COST_LIST.find((l) => l.slug === slug);
}

export function getLayoutSlugs(): string[] {
  return LAYOUT_COST_LIST.map((l) => l.slug);
}
