/**
 * 地域特化FAQ（Pure UI）。
 * FAQ データは Page が buildLocalSubsidyFaqItems で生成し、items として渡す。
 */

import type { FaqItem } from "@/app/lib/faq/schema";

export interface LocalSubsidyFaqProps {
  /** 表示する Q&A リスト（Page で buildLocalSubsidyFaqItems 等で生成） */
  items: FaqItem[];
  /** セクション見出し */
  heading: string;
}

export default function LocalSubsidyFaq({ items, heading }: LocalSubsidyFaqProps) {
  return (
    <section className="bg-card rounded-2xl border border-border overflow-hidden" aria-labelledby="local-faq-heading">
      <div className="px-6 py-4 border-b border-border bg-primary-light/30">
        <h2 id="local-faq-heading" className="font-bold text-primary">
          {heading}
        </h2>
      </div>
      <dl className="p-6 space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-2">
            <dt className="font-semibold text-foreground text-sm md:text-base">
              Q. {item.question}
            </dt>
            <dd className="text-foreground/85 text-sm md:text-base leading-relaxed pl-4 border-l-2 border-primary/30">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
