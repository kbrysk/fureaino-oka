/**
 * 捨て方辞典：品目別「実際の買取・処分事例」データ。
 * RealTransactionTable 用。一次情報（Experience）の強調用。
 */

import type { RealTransactionRow } from "./types";

const ROWS_BY_SLUG: Record<string, RealTransactionRow[]> = {
  butsudan: [
    {
      date: "2024年10月",
      itemDescription: "唐木仏壇（小型・傷あり）",
      resultType: "buyback",
      amount: "5,000円",
      note: "リユース店に買取",
    },
    {
      date: "2024年9月",
      itemDescription: "仏壇・仏具一式（供養・引き取り）",
      resultType: "disposal_fee",
      amount: "約18,000円",
      note: "供養＋処分込み",
    },
    {
      date: "2024年8月",
      itemDescription: "大型仏壇（唐木・状態良好）",
      resultType: "buyback",
      amount: "28,000円",
      note: "骨董買取店に査定",
    },
  ],
};

/**
 * 品目 slug に対応する実績行を返す。ない場合は空配列。
 */
export function getRealTransactionRows(slug: string): RealTransactionRow[] {
  return ROWS_BY_SLUG[slug] ?? [];
}
