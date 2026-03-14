// S5: AI Overview対策・直接回答型FAQデータ 2026-03

import type { DirectAnswerItem } from "../../components/DirectAnswerFaq";

export function getSubsidyDirectAnswerFaq(
  cityName: string,
  maxSubsidyAmount: number | null
): DirectAnswerItem[] {
  const subsidyLabel = maxSubsidyAmount
    ? `最大${(maxSubsidyAmount / 10000).toFixed(0)}万円`
    : "自治体により異なります";

  return [
    {
      id: "faq-subsidy-amount",
      question: `${cityName}の空き家解体補助金はいくらもらえますか？`,
      directAnswer: maxSubsidyAmount
        ? `${cityName}の補助金上限は${(maxSubsidyAmount / 10000).toFixed(0)}万円です。`
        : `${cityName}の補助金上限額は自治体の予算により変わります。`,
      supplement:
        "対象条件（建築年・所有者要件・税金滞納なし等）を満たす必要があります。詳細は上記の申請条件セクションをご確認ください。",
    },
    {
      id: "faq-subsidy-target",
      question: `${cityName}の補助金は誰でも申請できますか？`,
      directAnswer: "昭和56年以前の建物の所有者・相続人が主な対象です。",
      supplement:
        "税金の滞納がないこと・建物が空き家であること等の条件があります。まずはこのページのチェックリストで対象か確認してください。",
    },
    {
      id: "faq-subsidy-timing",
      question: `${cityName}の補助金はいつまで申請できますか？`,
      directAnswer: "多くの自治体で予算がなくなり次第終了します。",
      supplement:
        "年度初め（4〜5月）に受付開始する自治体が多く、人気の補助金は数ヶ月で終了することがあります。早めの申請をお勧めします。",
    },
    {
      id: "faq-subsidy-cost",
      question: `補助金を使うと${cityName}の解体費用はいくらになりますか？`,
      directAnswer: maxSubsidyAmount
        ? `木造30〜40坪の場合、${Math.max(0, 90 - maxSubsidyAmount / 10000).toFixed(0)}〜${Math.max(0, 150 - maxSubsidyAmount / 10000).toFixed(0)}万円程度が目安です。`
        : "補助金（最大100万円程度）を差し引いた実質負担が目安です。",
      supplement:
        "建物の構造・規模・立地により変動します。複数の業者から無料見積もりを取ることをお勧めします。",
    },
  ];
}

export function getGarbageDirectAnswerFaq(cityName: string): DirectAnswerItem[] {
  return [
    {
      id: "faq-garbage-method",
      question: `${cityName}の粗大ゴミはどうやって出しますか？`,
      directAnswer: "事前に電話またはネットで申し込みが必要です。",
      supplement: `${cityName}では収集日の指定と手数料納付が必要です。申込方法は上記のページ内案内をご確認ください。`,
    },
    {
      id: "faq-garbage-cost",
      question: `${cityName}の遺品整理はいくらかかりますか？`,
      directAnswer: "1Kで3〜8万円、3LDK以上で25万円〜が目安です。",
      supplement:
        "荷物の量・種類・アクセス条件により変動します。無料見積もりで正確な金額を確認することをお勧めします。",
    },
  ];
}
