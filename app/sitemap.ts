import type { MetadataRoute } from "next";
import { getAreaIdSlugs } from "./lib/area-data";
import { getRegionSlugs } from "./lib/regions";
import { getBlogPostIds } from "./lib/microcms";
import { getLayoutSlugs } from "./lib/cost-by-layout";
import { getDisposeSlugs } from "./lib/dispose-items";
import { DISPOSE_CATEGORIES } from "./lib/dispose-categories";
import { getCanonicalBase } from "./lib/site-url";

/** 正規ドメインで sitemap を出力し、Search Console の重複・評価を https://www.fureaino-oka.com に統合 */
const SITEMAP_BASE = getCanonicalBase();

/**
 * XML Sitemap（SEO: クロール効率・インデックス促進）
 * 静的ページ＋地域・費用・捨て方・記事の全URLを出力。クローラーが全ページを確実に発見できるようにする。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITEMAP_BASE;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${base}/area`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cost`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/dispose`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/guidebook`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guidebook/jikka-jimai`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about-site`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.65 },
    { url: `${base}/senryu`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/senryu/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/checklist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/assets`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ending-note`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tools/jikka-diagnosis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/akiya-risk`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/souzoku-prep`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/empty-house-tax`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools/appraisal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/inheritance-share`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/hoji-calendar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/digital-shame`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const costLayoutRoutes: MetadataRoute.Sitemap = getLayoutSlugs().map((slug) => ({
    url: `${base}/cost/layout/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const disposeCategoryRoutes: MetadataRoute.Sitemap = DISPOSE_CATEGORIES.map((cat) => ({
    url: `${base}/dispose/category/${encodeURIComponent(cat.slug)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const disposeItemRoutes: MetadataRoute.Sitemap = getDisposeSlugs().map((slug) => ({
    url: `${base}/dispose/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const regionSlugs = getRegionSlugs();
  const regionRoutes: MetadataRoute.Sitemap = regionSlugs.map(({ slug }) => ({
    url: `${base}/region/${slug.map((s) => encodeURIComponent(s)).join("/")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const areaSlugs = getAreaIdSlugs();
  const areaRoutes: MetadataRoute.Sitemap = [];
  for (const { prefectureId, cityId } of areaSlugs) {
    areaRoutes.push(
      { url: `${base}/area/${prefectureId}/${cityId}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${base}/area/${prefectureId}/${cityId}/subsidy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${base}/area/${prefectureId}/${cityId}/cleanup`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${base}/tax-simulator/${prefectureId}/${cityId}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    );
  }

  const articleIds = await getBlogPostIds();
  const articleRoutes: MetadataRoute.Sitemap = articleIds.map((id) => ({
    url: `${base}/articles/${encodeURIComponent(id)}`,
    lastModified: new Date(),
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
