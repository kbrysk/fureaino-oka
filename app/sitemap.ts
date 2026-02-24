import type { MetadataRoute } from "next";
import { getAllCityPaths } from "./lib/utils/city-loader";
import { getRegionSlugs } from "./lib/regions";
import { getBlogPostIds } from "./lib/microcms";
import { getLayoutSlugs } from "./lib/cost-by-layout";
import { getDisposeSlugs } from "./lib/dispose-items";
import { DISPOSE_CATEGORIES } from "./lib/dispose-categories";
import { getCanonicalBase } from "./lib/site-url";

/** 正規ドメインで sitemap を出力し、Search Console の評価を正規URLに統合 */
const SITEMAP_BASE = getCanonicalBase();

/** 主要93エリア：クロール頻度 daily・メイン priority 0.8 を付与する先頭N件の市区町村 */
const MAJOR_AREA_COUNT = 93;

/**
 * 市区町村の「主要」判定用 Set（prefId/cityId）。メモリ効率のため 1 回だけ生成。
 */
function getMajorAreaKeys(): Set<string> {
  const paths = getAllCityPaths();
  const set = new Set<string>();
  const limit = Math.min(MAJOR_AREA_COUNT, paths.length);
  for (let i = 0; i < limit; i++) {
    const p = paths[i];
    set.add(`${p.prefId}/${p.cityId}`);
  }
  return set;
}

/**
 * XML Sitemap（SEO: インデックス最適化・5,200+ URL を Google に即認識させる）
 * 固定ページ＋全市区町村×3（メイン・補助金・相場）＋税シミュ・費用・捨て方・地域・記事を出力。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITEMAP_BASE;
  const now = new Date();
  const majorKeys = getMajorAreaKeys();

  // 1. トップ・主要静的ページ（トップは daily / 1.0）
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${base}/area`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/cost`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/dispose`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/guidebook`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/guidebook/jikka-jimai`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about-site`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.65 },
    { url: `${base}/senryu`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/senryu/submit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/checklist`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/assets`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ending-note`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tools/jikka-diagnosis`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/akiya-risk`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/souzoku-prep`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/empty-house-tax`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/appraisal`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/inheritance-share`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/hoji-calendar`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/digital-shame`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const costLayoutRoutes: MetadataRoute.Sitemap = getLayoutSlugs().map((slug) => ({
    url: `${base}/cost/layout/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const disposeCategoryRoutes: MetadataRoute.Sitemap = DISPOSE_CATEGORIES.map((cat) => ({
    url: `${base}/dispose/category/${encodeURIComponent(cat.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const disposeItemRoutes: MetadataRoute.Sitemap = getDisposeSlugs().map((slug) => ({
    url: `${base}/dispose/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const regionSlugs = getRegionSlugs();
  const regionRoutes: MetadataRoute.Sitemap = regionSlugs.map(({ slug }) => ({
    url: `${base}/region/${slug.map((s) => encodeURIComponent(s)).join("/")}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 2. 全市区町村：メイン・補助金・相場・税シミュ（getAllCityPaths のみ使用・メモリ効率ループ）
  const areaRoutes: MetadataRoute.Sitemap = [];
  const paths = getAllCityPaths();
  for (let i = 0; i < paths.length; i++) {
    const { prefId, cityId } = paths[i];
    const key = `${prefId}/${cityId}`;
    const isMajor = majorKeys.has(key);
    const changeFreq: "daily" | "weekly" = isMajor ? "daily" : "weekly";
    const mainPriority = isMajor ? 0.8 : 0.5;
    const subPriority = 0.5;

    areaRoutes.push(
      { url: `${base}/area/${prefId}/${cityId}`, lastModified: now, changeFrequency: changeFreq, priority: mainPriority },
      { url: `${base}/area/${prefId}/${cityId}/subsidy`, lastModified: now, changeFrequency: changeFreq, priority: subPriority },
      { url: `${base}/area/${prefId}/${cityId}/cleanup`, lastModified: now, changeFrequency: changeFreq, priority: subPriority },
      { url: `${base}/tax-simulator/${prefId}/${cityId}`, lastModified: now, changeFrequency: changeFreq, priority: subPriority }
    );
  }

  const articleIds = await getBlogPostIds();
  const articleRoutes: MetadataRoute.Sitemap = articleIds.map((id) => ({
    url: `${base}/articles/${encodeURIComponent(id)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...costLayoutRoutes,
    ...disposeCategoryRoutes,
    ...disposeItemRoutes,
    ...regionRoutes,
    ...areaRoutes,
    ...articleRoutes,
  ];
}
