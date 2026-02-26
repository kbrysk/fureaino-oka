/**
 * FAQPage 構造化データの共通型とヘルパー。
 * 1 ページ 1 FAQPage に集約するため、全ルートで利用可能。
 */

/** 1 問 1 答。UI 表示と JSON-LD の両方で利用する最小単位 */
export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage スキーマ生成時のオプション（url は任意） */
export interface FaqSchemaOptions {
  /** ページの正規URL（絶対URL）。指定時のみ FAQPage に url を付与 */
  url?: string;
}

export interface FaqPageSchema {
  "@context": string;
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
  url?: string;
}

/**
 * FaqItem 配列から、Google ガイドライン準拠の 1 つの FAQPage オブジェクトを生成する。
 * 捨て方辞典・記事ページなど、どのルートからでも利用可能。
 */
export function generateFaqSchema(items: FaqItem[], options?: FaqSchemaOptions): FaqPageSchema {
  const schema: FaqPageSchema = {
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
  if (options?.url) {
    schema.url = options.url;
  }
  return schema;
}
