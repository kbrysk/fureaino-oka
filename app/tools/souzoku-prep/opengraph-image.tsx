import { createToolOgImage, toolOgSize } from "../../lib/og-tool-image";

export const alt = "相続準備力診断 - 生前整理支援センター ふれあいの丘";
export const size = toolOgSize;
export const contentType = "image/png" as const;

export default async function Image() {
  return await createToolOgImage("相続準備力診断");
}
