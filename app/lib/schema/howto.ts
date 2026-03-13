/**
 * HowTo 構造化データ（schema.org）生成ヘルパー。
 */

export type HowToStep = {
  name: string;
  text: string;
  url?: string;
};

export function generateHowToSchema(options: {
  name: string;
  description: string;
  url: string;
  steps: HowToStep[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    url: options.url,
    step: options.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
    })),
  };
}
