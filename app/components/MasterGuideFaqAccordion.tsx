"use client";

import { useState } from "react";

export interface MasterGuideFaqItem {
  question: string;
  answer: string;
}

export interface MasterGuideFaqAccordionProps {
  items: MasterGuideFaqItem[];
  heading: string;
}

/**
 * マスターガイドページ用FAQアコーディオン（シニア向け・タップ領域広め）
 */
export default function MasterGuideFaqAccordion({ items, heading }: MasterGuideFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="rounded-2xl border border-border bg-card overflow-hidden"
      aria-labelledby="master-guide-faq-heading"
    >
      <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-primary-light/30">
        <h2 id="master-guide-faq-heading" className="font-bold text-primary text-lg sm:text-xl">
          {heading}
        </h2>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          const id = `master-guide-faq-answer-${i}`;
          return (
            <div key={i} className="border-border">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={id}
                  id={`master-guide-faq-question-${i}`}
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
                aria-labelledby={`master-guide-faq-question-${i}`}
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
