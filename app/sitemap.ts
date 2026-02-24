import type { MetadataRoute } from "next";
import { getPrefectureIds, getCityPathsByPrefecture } from "./lib/utils/city-loader";
import { getRegionSlugs } from "./lib/regions";
import { getBlogPostIds } from "./lib/microcms";
import { getLayoutSlugs } from "./lib/cost-by-layout";
import { getDisposeSlugs } from "./lib/dispose-items";
import { DISPOSE_CATEGORIES } from "./lib/dispose-categories";
import { getCanonicalBase } from "./lib/site-url";

/** 正規ベースURL（絶対URL）。未設定時は https://www.fureaino-oka.com */
const SITEMAP_BASE = getCanonicalBase();

/**
 * サイトマップ分割IDを生成（Sitemap Index 用）。
 * id "main" = トップ・固定ページ・cost/dispose/region/articles
 * id "tokyo" | "osaka" | ... = 都道府県ごとの area Hub/Spoke（Vercel タイムアウト・メモリ対策）
 */
export async function generateSitemaps(): Promise<{ id: string }[]> {
  const prefIds = getPrefectureIds();
  const main = { id: "main" };
  const prefSitemaps = prefIds.map((prefId) => ({ id: prefId }));
  return [main, ...prefSitemaps];
}

/**
 * 動的XMLサイトマップ（Next.js generateSitemaps 利用）。
 * id === "main" のとき固定ページ＋region/articles 等、それ以外は都道府県IDとして area URL を返す。
 */
export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const base = SITEMAP_BASE;
  const lastModified = new Date();

  if (id === "main") {
    const staticEntries: MetadataRoute.Sitemap = [
      { url: base, lastModified, changeFrequency: "daily", priority: 1.0 },
      { url: `${base}/tool/optimizer`, lastModified, changeFrequency: "daily", priority: 1.0 },
      { url: `${base}/area`, lastModified, changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/cost`, lastModified, changeFrequency: "weekly", priority: 0.85 },
      { url: `${base}/dispose`, lastModified, changeFrequency: "weekly", priority: 0.85 },
      { url: `${base}/tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
      { url: `${base}/guide`, lastModified, changeFrequency: "weekly", priority: 0.85 },
      { url: `${base}/guidebook`, lastModified, changeFrequency: "weekly", priority: 0.8 },
      { url: `${base}/guidebook/jikka-jimai`, lastModified, changeFrequency: "weekly", priority: 0.75 },
      { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/about-site`, lastModified, changeFrequency: "monthly", priority: 0.65 },
      { url: `${base}/senryu`, lastModified, changeFrequency: "weekly", priority: 0.6 },
      { url: `${base}/senryu/submit`, lastModified, changeFrequency: "monthly", priority: 0.5 },
      { url: `${base}/checklist`, lastModified, changeFrequency: "weekly", priority: 0.8 },
      { url: `${base}/assets`, lastModified, changeFrequency: "monthly", priority: 0.7 },
      { url: `${base}/ending-note`, lastModified, changeFrequency: "monthly", priority: 0.7 },
      { url: `${base}/articles`, lastModified, changeFrequency: "weekly", priority: 0.8 },
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
    ];

    const costLayoutRoutes: MetadataRoute.Sitemap = getLayoutSlugs().map((slug) => ({
      url: `${base}/cost/layout/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    const disposeCategoryRoutes: MetadataRoute.Sitemap = DISPOSE_CATEGORIES.map((cat) => ({
      url: `${base}/dispose/category/${encodeURIComponent(cat.slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const disposeItemRoutes: MetadataRoute.Sitemap = getDisposeSlugs().map((slug) => ({
      url: `${base}/dispose/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const regionSlugs = getRegionSlugs();
    const regionRoutes: MetadataRoute.Sitemap = regionSlugs.map(({ slug }) => ({
      url: `${base}/region/${slug.map((s) => encodeURIComponent(s)).join("/")}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const articleIds = await getBlogPostIds();
    const articleRoutes: MetadataRoute.Sitemap = articleIds.map((articleId) => ({
      url: `${base}/articles/${encodeURIComponent(articleId)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [
      ...staticEntries,
      ...costLayoutRoutes,
      ...disposeCategoryRoutes,
      ...disposeItemRoutes,
      ...regionRoutes,
      ...articleRoutes,
    ];
  }

  // 都道府県ID: 当該都道府県の area Hub + Spoke 4種（subsidy, garbage, cost）のみ
  const cities = getCityPathsByPrefecture(id);
  const areaRoutes: MetadataRoute.Sitemap = [];

  for (const { prefId, cityId } of cities) {
    areaRoutes.push(
      {
        url: `${base}/area/${prefId}/${cityId}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${base}/area/${prefId}/${cityId}/subsidy`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${base}/area/${prefId}/${cityId}/garbage`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${base}/area/${prefId}/${cityId}/cost`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      }
    );
  }

  return areaRoutes;
}
