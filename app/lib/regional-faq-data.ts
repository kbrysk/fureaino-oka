/**
 * 地域別空き家解体補助金FAQの単一データソース。
 * UI（RegionalFaq）とFAQPage JSON-LD（ページ側で generateFaqSchema に渡す）で同一文字列を使用する。
 */

export interface RegionalFaqItem {
  question: string;
  answer: string;
}

/** 地域別補助金FAQの3問（cityName を埋め込む） */
export function buildRegionalFaqItems(cityName: string): RegionalFaqItem[] {
  return [
    {
      question: `${cityName}の空き家解体補助金は、最大いくらもらえますか？`,
      answer: `${cityName}の制度や建物の状態によりますが、最大で数十万円〜100万円規模の補助金が支給されるケースがあります。予算には上限があり、先着順となることが多いため、早めの確認をおすすめします。`,
    },
    {
      question: "補助金をもらうための条件は何ですか？",
      answer: `主に『${cityName}内にある倒壊の危険がある空き家』であり、『申請者が正当な所有者（または相続人）であること』、『税金の滞納がないこと』などが一般的な条件です。ご自身の家が対象になるか、まずは事前の審査が必要です。`,
    },
    {
      question: "すでに解体工事を始めてしまった後でも、申請はできますか？",
      answer: `原則として、工事を始めた後からの申請はできません。必ず解体業者と契約し、工事に取り掛かる前に${cityName}の窓口へ事前相談を行う必要があります。`,
    },
  ];
}
