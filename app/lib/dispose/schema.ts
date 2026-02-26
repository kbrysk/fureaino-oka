/**
 * 捨て方辞典用の構造化データ（JSON-LD）生成。
 * コンポーネントは UI のみ担当し、スキーマ生成はここに集約する。
 */

import type { StepItem } from "./types";

export interface HowToSchemaOptions {
  /** 手順の説明（HowTo の description） */
  description?: string;
  /** ページの正規URL（絶対URL）。任意 */
  url?: string;
}

export interface HowToSchema {
  "@context": string;
  "@type": "HowTo";
  name: string;
  description?: string;
  step: Array<{
    "@type": "HowToStep";
    name: string;
    text: string;
    position: number;
    image?: string;
  }>;
  url?: string;
}

/**
 * StepItem 配列から、Google ガイドライン準拠の HowTo オブジェクトを生成する。
 */
export function generateHowToSchema(
  title: string,
  steps: StepItem[],
  options?: HowToSchemaOptions
): HowToSchema {
  const schema: HowToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((s, i) => {
      const step: HowToSchema["step"][number] = {
        "@type": "HowToStep",
        name: s.name,
        text: s.text,
        position: i + 1,
      };
      if (s.imageUrl?.startsWith("http")) {
        step.image = s.imageUrl;
      }
      return step;
    }),
  };
  if (options?.description) schema.description = options.description;
  if (options?.url) schema.url = options.url;
  return schema;
}
