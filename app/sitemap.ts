import type { MetadataRoute } from "next";
import { getAllCityPaths } from "./lib/utils/city-loader";
import { getRegionSlugs } from "./lib/regions";
import { getBlogPostIds } from "./lib/microcms";
import { getLayoutSlugs } from "./lib/cost-by-layout";
import { getDisposeSlugs } from "./lib/dispose-items";
import { DISPOSE_CATEGORIES } from "./lib/dispose-categories";
import { getCanonicalBase } from "./lib/site-url";

const SITEMAP_BASE = getCanonicalBase();

/** 1サイトマップあたりのURL数（Google並列クロール促進・推奨1,000件以下） */
const URLS_PER_SITEMAP = 1000;

/** 自治体1件あたりのURL数（メイン・補助金・相場・税シミュ） */
const URLS_PER_AREA = 4;

/** 主要都市（政令指定都市等）：priority 0.8・daily。先頭N件を指定。 */
const MAJOR_AREA_COUNT = 93;

/** 有効な自治体パスのみ（getAllCityPaths = AREA_ID_MAP 由来のためすべて有効） */
function getValidAreaPaths(): { prefId: string; cityId: string }[] {
  return getAllCityPaths().map((p) => ({ prefId: p.prefId, cityId: p.cityId }));
}

/** 主要キー Set（prefId/cityId）。メモリ効率のため必要時のみ生成 */
function getMajorAreaKeys(): Set<string> {
  const paths = getValidAreaPaths();
  const set = new Set<string>();
  const limit = Math.min(MAJOR_AREA_COUNT, paths.length);
  for (let i = 0; i < limit; i++) {
    const p = paths[i];
    set.add(`${p.prefId}/${p.cityId}`);
  }
  return set;
}

/**
 * サイトマップ分割IDを生成（Sitemap Index 用）。
 * id "0" = 静的・トップ・診断ツール・cost/dispose/region/articles
 * id "1"～"N" = 自治体URLを1,000件単位で分割
 */
export async function generateSitemaps(): Promise<{ id: string }[]> {
  const paths = getValidAreaPaths();
  const areaUrlCount = paths.length * URLS_PER_AREA;
  const areaChunkCount = Math.ceil(areaUrlCount / URLS_PER_SITEMAP);
  const ids: { id: string }[] = [{ id: "0" }];
  for (let i = 1; i <= areaChunkCount; i++) {
    ids.push({ id: String(i) });
  }
  return ids;
}

/**
 * 動的XMLサイトマップ（Next.js 公式 generateSitemaps 利用）。
 * 各URL: url（正規）, lastModified（ビルド時）, changeFrequency, priority を厳密設定。
 */
export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const base = SITEMAP_BASE;
  const now = new Date();
  const majorKeys = getMajorAreaKeys();

  if (id === "0") {
    // 静的・トップ・診断ツール・その他（daily/1.0 でインデックス優先）
    const staticEntries: MetadataRoute.Sitemap = [
      { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${base}/tool/optimizer`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${base}/area`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/cost`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
      { url: `${base}/dispose`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
      { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${base}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
      { url: `${base}/guidebook`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
      { url: `${base}/guidebook/jikka-jimai`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
      { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
      { url: `${base}/about-site`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
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
      { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
      { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
      { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ];

    const costLayoutRoutes: MetadataRoute.Sitemap = getLayoutSlugs().map((slug) => ({
      url: `${base}/cost/layout/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    }));

    const disposeCategoryRoutes: MetadataRoute.Sitemap = DISPOSE_CATEGORIES.map((cat) => ({
      url: `${base}/dispose/category/${encodeURIComponent(cat.slug)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const disposeItemRoutes: MetadataRoute.Sitemap = getDisposeSlugs().map((slug) => ({
      url: `${base}/dispose/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const regionSlugs = getRegionSlugs();
    const regionRoutes: MetadataRoute.Sitemap = regionSlugs.map(({ slug }) => ({
      url: `${base}/region/${slug.map((s) => encodeURIComponent(s)).join("/")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const articleIds = await getBlogPostIds();
    const articleRoutes: MetadataRoute.Sitemap = articleIds.map((articleId) => ({
      url: `${base}/articles/${encodeURIComponent(articleId)}`,
      lastModified: now,
      changeFrequency: "monthly",
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

  // 自治体チャンク: id "1"～"N"（1,000 URL ≒ 250 件の自治体×4 URL）
  const paths = getValidAreaPaths();
  const chunkIndex = parseInt(id, 10);
  if (Number.isNaN(chunkIndex) || chunkIndex < 1) return [];

  const pathsPerChunk = Math.ceil(URLS_PER_SITEMAP / URLS_PER_AREA);
  const start = (chunkIndex - 1) * pathsPerChunk;
  const end = Math.min(start + pathsPerChunk, paths.length);
  const areaRoutes: MetadataRoute.Sitemap = [];

  for (let i = start; i < end; i++) {
    const { prefId, cityId } = paths[i];
    const key = `${prefId}/${cityId}`;
    const isMajor = majorKeys.has(key);
    const changeFreq: "daily" | "weekly" = isMajor ? "daily" : "weekly";
    const mainPriority = isMajor ? 0.8 : 0.6;
    const subPriority = 0.5;

    areaRoutes.push(
      { url: `${base}/area/${prefId}/${cityId}`, lastModified: now, changeFrequency: changeFreq, priority: mainPriority },
      { url: `${base}/area/${prefId}/${cityId}/subsidy`, lastModified: now, changeFrequency: changeFreq, priority: subPriority },
      { url: `${base}/area/${prefId}/${cityId}/cleanup`, lastModified: now, changeFrequency: changeFreq, priority: subPriority },
      { url: `${base}/tax-simulator/${prefId}/${cityId}`, lastModified: now, changeFrequency: changeFreq, priority: subPriority }
    );
  }

  return areaRoutes;
}
