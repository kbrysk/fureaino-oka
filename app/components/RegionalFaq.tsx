"use client";

import { useMemo, useState } from "react";

export interface RegionalFaqProps {
  /** 市区町村名（例: 北九州市, 鹿児島市） */
  cityName: string;
}

/** 単一データソース：UI表示とFAQPage JSON-LDで同一文字列を使用（Google構造化データガイドライン準拠） */
function buildRegionalFaqItems(cityName: string): { question: string; answer: string }[] {
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

/** FAQPage JSON-LD（UIと同一テキストのみ使用） */
function buildFaqPageSchema(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * 地域別空き家解体補助金FAQ。
 * 画面上のアコーディオンと検索エンジン向けFAQPage JSON-LDを、単一データソースから同時生成する。
 * シニア向けUI：タップ領域・文字サイズ・コントラストを重視。
 */
export default function RegionalFaq({ cityName }: RegionalFaqProps) {
  const items = useMemo(() => buildRegionalFaqItems(cityName), [cityName]);
  const faqSchema = useMemo(() => buildFaqPageSchema(items), [items]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section
        className="rounded-2xl border border-border bg-card overflow-hidden"
        aria-labelledby="regional-faq-heading"
      >
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-primary-light/30">
          <h2 id="regional-faq-heading" className="font-bold text-primary text-lg sm:text-xl">
            {cityName}の補助金 よくある質問
          </h2>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const id = `regional-faq-answer-${i}`;
            return (
              <div key={i} className="border-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={id}
                    id={`regional-faq-question-${i}`}
                    className="w-full flex items-center justify-between gap-3 text-left py-4 px-5 sm:py-5 sm:px-6 min-h-[3.5rem] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-none"
                  >
                    <span className="font-bold text-foreground text-base sm:text-[18px] leading-snug flex-1">
                      Q. {item.question}
                    </span>
                    <span
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold"
                      aria-hidden
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  aria-labelledby={`regional-faq-question-${i}`}
                  hidden={!isOpen}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-0 sm:px-6 sm:pb-5 sm:pt-0">
                    <p className="text-foreground/90 text-base sm:text-[17px] leading-relaxed pl-0">
                      A. {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
