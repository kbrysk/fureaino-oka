"use client";

/**
 * 自治体ページ用の動的FAQ（Pure UI）。
 * FAQ データは Page が buildDynamicFaqItems で生成し、items として渡す。
 */

import type { FaqItem } from "@/app/lib/faq/schema";

export interface DynamicFaqProps {
  /** 表示する Q&A リスト（Page で buildDynamicFaqItems で生成） */
  items: FaqItem[];
  /** セクション見出し（省略時は「{cityName}の実家・空き家に関するよくある質問」相当を想定） */
  heading: string;
}

export default function DynamicFaq({ items, heading }: DynamicFaqProps) {
  return (
    <section
      className="bg-card rounded-2xl border border-border overflow-hidden"
      aria-labelledby="dynamic-faq-heading"
    >
      <div className="px-5 py-4 border-b border-border bg-primary-light/30">
        <h2 id="dynamic-faq-heading" className="font-bold text-primary text-base">
          {heading}
        </h2>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <div key={index} className="px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Q. {item.question}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
