"use client";

import { useMemo, useState } from "react";
import { buildRegionalFaqItems } from "@/app/lib/regional-faq-data";

export interface RegionalFaqProps {
  /** 市区町村名（例: 北九州市, 鹿児島市） */
  cityName: string;
}

/**
 * 地域別空き家解体補助金FAQ（アコーディオンUIのみ）。
 * FAQPage JSON-LD はページ側（サーバーコンポーネント）で同一データ（buildRegionalFaqItems）から出力すること。
 * シニア向けUI：タップ領域・文字サイズ・コントラストを重視。
 */
export default function RegionalFaq({ cityName }: RegionalFaqProps) {
  const items = useMemo(() => buildRegionalFaqItems(cityName), [cityName]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
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
  );
}
