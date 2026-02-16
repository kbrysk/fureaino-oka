import { createToolOgImage, toolOgSize } from "../../lib/og-tool-image";

export const alt = "法要カレンダー - 生前整理支援センター ふれあいの丘";
export const size = toolOgSize;
export const contentType = "image/png" as const;

export default async function Image() {
  return await createToolOgImage("法要カレンダー（命日→三十三回忌）");
}
