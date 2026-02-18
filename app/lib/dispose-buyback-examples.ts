/**
 * 捨て方辞典：買取相場例（「実はこんなに高く売れる？」セクション用）
 * 品目別の概算買取例。※相場は状態・時期により変動します。
 */

export type BuybackExample = {
  itemName: string;
  priceRange: string;
};

/** slug ごとの買取相場例（その品目または関連品目） */
const BUYBACK_BY_SLUG: Record<string, BuybackExample[]> = {
  butsudan: [
    { itemName: "唐木仏壇（小型）", priceRange: "5,000円〜" },
    { itemName: "唐木仏壇（大型）", priceRange: "30,000円〜" },
    { itemName: "経机・仏具セット", priceRange: "3,000円〜" },
  ],
  hinaningyo: [
    { itemName: "雛人形（高級・七段）", priceRange: "10,000円〜" },
    { itemName: "五月人形（鎧・兜）", priceRange: "5,000円〜" },
    { itemName: "市松人形", priceRange: "3,000円〜" },
  ],
  ningyo: [
    { itemName: "日本人形（アンティーク）", priceRange: "5,000円〜" },
    { itemName: "フランス人形", priceRange: "3,000円〜" },
    { itemName: "ぬいぐるみ（限定・ブランド）", priceRange: "1,000円〜" },
  ],
  kimono: [
    { itemName: "振袖（正絹）", priceRange: "30,000円〜" },
    { itemName: "留袖・訪問着", priceRange: "10,000円〜" },
    { itemName: "帯（袋帯・名古屋帯）", priceRange: "3,000円〜" },
    { itemName: "着物（正絹・無地）", priceRange: "5,000円〜" },
  ],
  tansu: [
    { itemName: "桐箪笥（大型）", priceRange: "20,000円〜" },
    { itemName: "洋タンス・衣装箪笥", priceRange: "5,000円〜" },
    { itemName: "茶箪笥", priceRange: "10,000円〜" },
  ],
  sofa: [
    { itemName: "ソファ（3人掛け・革）", priceRange: "15,000円〜" },
    { itemName: "電動リクライニングソファ", priceRange: "10,000円〜" },
    { itemName: "マッサージチェア", priceRange: "5,000円〜" },
  ],
  shokkidana: [
    { itemName: "食器棚（木製・大型）", priceRange: "10,000円〜" },
    { itemName: "サイドボード", priceRange: "5,000円〜" },
  ],
  "gakushu-desk": [
    { itemName: "学習机（木製・ブランド）", priceRange: "5,000円〜" },
    { itemName: "チェア付きセット", priceRange: "8,000円〜" },
  ],
  "massage-chair": [
    { itemName: "マッサージチェア（フル機能）", priceRange: "10,000円〜" },
    { itemName: "据え置き型", priceRange: "5,000円〜" },
  ],
  hondana: [
    { itemName: "本棚（木製・大型）", priceRange: "5,000円〜" },
    { itemName: "ブックケース", priceRange: "2,000円〜" },
  ],
  tv: [
    { itemName: "液晶テレビ（40型以上）", priceRange: "5,000円〜" },
    { itemName: "薄型テレビ", priceRange: "3,000円〜" },
  ],
  eacon: [
    { itemName: "エアコン（稼働・省エネ型）", priceRange: "5,000円〜" },
    { itemName: "据え置き型", priceRange: "3,000円〜" },
  ],
  pasokon: [
    { itemName: "ノートPC（メーカー・型番による）", priceRange: "5,000円〜" },
    { itemName: "デスクトップPC", priceRange: "3,000円〜" },
    { itemName: "モニター", priceRange: "2,000円〜" },
  ],
  kotatsu: [
    { itemName: "こたつ（据え置き・電動）", priceRange: "3,000円〜" },
    { itemName: "こたつ布団セット", priceRange: "1,000円〜" },
  ],
  piano: [
    { itemName: "アップライトピアノ", priceRange: "30,000円〜" },
    { itemName: "グランドピアノ", priceRange: "50,000円〜" },
    { itemName: "エレクトーン", priceRange: "10,000円〜" },
  ],
  chadougu: [
    { itemName: "鉄瓶・銀瓶", priceRange: "30,000円〜" },
    { itemName: "茶碗（作家物・古い）", priceRange: "5,000円〜" },
    { itemName: "掛け軸", priceRange: "10,000円〜" },
    { itemName: "茶筒・茶入れ", priceRange: "3,000円〜" },
  ],
  gakki: [
    { itemName: "ギター（エレキ・アコギ）", priceRange: "5,000円〜" },
    { itemName: "バイオリン", priceRange: "10,000円〜" },
    { itemName: "三味線", priceRange: "15,000円〜" },
    { itemName: "琴", priceRange: "20,000円〜" },
  ],
  gorufu: [
    { itemName: "ゴルフクラブ（セット）", priceRange: "5,000円〜" },
    { itemName: "ドライバー（ブランド）", priceRange: "3,000円〜" },
    { itemName: "ゴルフバッグ", priceRange: "2,000円〜" },
  ],
  shokki: [
    { itemName: "ブランド食器（ノリタケ等）", priceRange: "3,000円〜" },
    { itemName: "陶器・作家物", priceRange: "5,000円〜" },
    { itemName: "グラス・カトラリー", priceRange: "1,000円〜" },
  ],
  irui: [
    { itemName: "ブランド服・バッグ", priceRange: "5,000円〜" },
    { itemName: "古着（まとめて）", priceRange: "1,000円〜" },
  ],
  bed: [
    { itemName: "ベッドフレーム（木製）", priceRange: "5,000円〜" },
    { itemName: "マットレス（高反発等）", priceRange: "3,000円〜" },
  ],
};

/** カテゴリ別のデフォルト例（slug に専用データがない場合に表示） */
const BUYBACK_BY_CATEGORY: Record<string, BuybackExample[]> = {
  memorial: [
    { itemName: "着物・帯（正絹）", priceRange: "5,000円〜" },
    { itemName: "雛人形・五月人形", priceRange: "5,000円〜" },
    { itemName: "人形（アンティーク）", priceRange: "3,000円〜" },
  ],
  furniture: [
    { itemName: "桐箪笥", priceRange: "20,000円〜" },
    { itemName: "ソファ・マッサージチェア", priceRange: "5,000円〜" },
    { itemName: "学習机・食器棚", priceRange: "5,000円〜" },
  ],
  appliance: [
    { itemName: "テレビ・エアコン", priceRange: "3,000円〜" },
    { itemName: "パソコン・モニター", priceRange: "5,000円〜" },
    { itemName: "こたつ", priceRange: "3,000円〜" },
  ],
  hobby: [
    { itemName: "茶道具・鉄瓶", priceRange: "30,000円〜" },
    { itemName: "楽器・ゴルフ", priceRange: "5,000円〜" },
    { itemName: "骨董・掛け軸", priceRange: "10,000円〜" },
  ],
  daily: [
    { itemName: "食器・陶器（ブランド）", priceRange: "3,000円〜" },
    { itemName: "衣類・古着（まとめて）", priceRange: "1,000円〜" },
  ],
  difficult: [
    { itemName: "ピアノ", priceRange: "30,000円〜" },
    { itemName: "金庫（開錠後・中身による）", priceRange: "要査定" },
  ],
};

export function getBuybackExamples(
  slug: string,
  categoryId: string
): BuybackExample[] {
  return BUYBACK_BY_SLUG[slug] ?? BUYBACK_BY_CATEGORY[categoryId] ?? [];
}
