import { createToolOgImage, toolOgSize } from "../../lib/og-tool-image";

export const alt = "空き家税金シミュレーター - 生前整理支援センター ふれあいの丘";
export const size = toolOgSize;
export const contentType = "image/png" as const;

export default async function Image() {
  return await createToolOgImage("空き家税金シミュレーター");
}
