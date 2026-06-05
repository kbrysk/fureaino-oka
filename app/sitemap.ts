import type { MetadataRoute } from "next";
import { getPrefectureIds, getCityPathsByPrefecture } from "./lib/utils/city-loader";
import { getBlogPostIds } from "./lib/microcms";
import { getLayoutSlugs } from "./lib/cost-by-layout";
import { getCanonicalBase } from "./lib/site-url";
import { getAllPrefectureSlugs } from "./lib/data/municipality-stats";

/** 正規ベースURL（絶対URL）。未設定時は https://www.fureaino-oka.com */
const SITEMAP_BASE = getCanonicalBase();

/**
 * サイトマップ分割IDを生成（Sitemap Index 用）。
 * id "main" = トップ・固定ページ・cost/articles
 * id "tokyo" | "osaka" | ... = 都道府県ごとの area Hub/Spoke（Vercel タイムアウト・メモリ対策）
 */
export async function generateSitemaps(): Promise<{ id: string }[]> {
  try {
    const prefIds = getPrefectureIds();
    const main = { id: "main" };
    const prefSitemaps = prefIds.map((prefId) => ({ id: prefId }));
    return [main, ...prefSitemaps];
  } catch {
    return [{ id: "main" }];
  }
}

/**
 * 動的XMLサイトマップ（Next.js generateSitemaps 利用）。
 * id === "main" のとき固定ページ＋articles 等、それ以外は都道府県IDとして area URL を返す。
 * エラー時は有効なURLのみ返し、500 を防ぐ。
 */
export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const base = SITEMAP_BASE;
  const lastModified = new Date();
  const fallbackEntry: MetadataRoute.Sitemap = [
    { url: base, lastModified, changeFrequency: "daily", priority: 1.0 },
  ];

  let id: string;
  try {
    id = await props.id;
  } catch {
    return fallbackEntry;
  }

  if (id === "main") {
    try {
      const staticEntries: MetadataRoute.Sitemap = [
        { url: base, lastModified, changeFrequency: "daily", priority: 1.0 },
        { url: `${base}/tool/optimizer`, lastModified, changeFrequency: "daily", priority: 1.0 },
        { url: `${base}/area`, lastModified, changeFrequency: "daily", priority: 0.9 },
        { url: `${base}/company`, lastModified, changeFrequency: "monthly", priority: 0.6 },
        { url: `${base}/cost`, lastModified, changeFrequency: "weekly", priority: 0.85 },
        { url: `${base}/tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/articles/master-guide`, lastModified, changeFrequency: "weekly", priority: 0.85 },
        { url: `${base}/guidebook`, lastModified, changeFrequency: "weekly", priority: 0.8 },
        { url: `${base}/guidebook/jikka-jimai`, lastModified, changeFrequency: "weekly", priority: 0.75 },
        { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
        { url: `${base}/editorial-policy`, lastModified, changeFrequency: "monthly", priority: 0.6 },
        { url: `${base}/about-site`, lastModified, changeFrequency: "monthly", priority: 0.65 },
        { url: `${base}/senryu`, lastModified, changeFrequency: "weekly", priority: 0.6 },
        { url: `${base}/senryu/submit`, lastModified, changeFrequency: "monthly", priority: 0.5 },
        { url: `${base}/checklist`, lastModified, changeFrequency: "weekly", priority: 0.8 },
        { url: `${base}/assets`, lastModified, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/ending-note`, lastModified, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/articles`, lastModified, changeFrequency: "weekly", priority: 0.8 },
        // 空き家・不動産ピラー（収益の心臓部）＋リッチ・ガイド
        { url: `${base}/akiya`, lastModified, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/akiya/kaitai-hojokin`, lastModified, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/tools/jikka-diagnosis`, lastModified, changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/tools/akiya-risk`, lastModified, changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/tools/souzoku-prep`, lastModified, changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/tools/empty-house-tax`, lastModified, changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/tools/appraisal`, lastModified, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/tools/inheritance-share`, lastModified, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/tools/hoji-calendar`, lastModified, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/tools/digital-shame`, lastModified, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.5 },
        { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.5 },
        { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
        // データ室（独自調査データ・被リンク資産）
        { url: `${base}/data`, lastModified, changeFrequency: "weekly", priority: 0.8 },
        { url: `${base}/data/akiya-hojokin-ranking`, lastModified, changeFrequency: "weekly", priority: 0.85 },
        { url: `${base}/data/akiya-hojokin-joken`, lastModified, changeFrequency: "monthly", priority: 0.8 },
        { url: `${base}/data/akiya-subsidy-map-2026`, lastModified, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/data/seizen-seiri-trends`, lastModified, changeFrequency: "monthly", priority: 0.6 },
        // ニュース・プレスリリース（一次ソース・被リンク資産）
        { url: `${base}/news`, lastModified, changeFrequency: "weekly", priority: 0.7 },
        { url: `${base}/news/akiya-hojokin-survey-2026`, lastModified, changeFrequency: "monthly", priority: 0.75 },
      ];

      // 都道府県別 空き家解体補助金 データ（47面）
      const dataPrefRoutes: MetadataRoute.Sitemap = getAllPrefectureSlugs().map((p) => ({
        url: `${base}/data/akiya-hojokin-ranking/${p.prefId}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));

      const costLayoutRoutes: MetadataRoute.Sitemap = getLayoutSlugs().map((slug) => ({
        url: `${base}/cost/layout/${encodeURIComponent(slug)}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      }));

      const articleIds = await getBlogPostIds().catch(() => []);
      const articleRoutes: MetadataRoute.Sitemap = articleIds.map((articleId) => ({
        url: `${base}/articles/${encodeURIComponent(articleId)}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

      return [
        ...staticEntries,
        ...dataPrefRoutes,
        ...costLayoutRoutes,
        ...articleRoutes,
      ];
    } catch {
      return fallbackEntry;
    }
  }

  try {
    const cities = getCityPathsByPrefecture(id);
    const areaRoutes: MetadataRoute.Sitemap = [];
    for (const { prefId, cityId } of cities) {
      areaRoutes.push(
        { url: `${base}/area/${prefId}/${cityId}`, lastModified, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/area/${prefId}/${cityId}/subsidy`, lastModified, changeFrequency: "weekly", priority: 0.8 },
        { url: `${base}/area/${prefId}/${cityId}/garbage`, lastModified, changeFrequency: "weekly", priority: 0.8 },
        { url: `${base}/area/${prefId}/${cityId}/cost`, lastModified, changeFrequency: "weekly", priority: 0.8 }
        // INSTRUCTION-010: cleanup excluded (noindex)
      );
    }
    return areaRoutes;
  } catch {
    return [];
  }
}
