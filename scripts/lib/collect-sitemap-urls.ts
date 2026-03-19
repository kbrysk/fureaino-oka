/**
 * サイトマップと同等の全URLを収集するモジュール。
 * app/sitemap.ts のロジックを Node 単体実行用に再現し、
 * Google Indexing API 用の「優先度付きURLリスト」を返す。
 */
import path from "path";
import { getCanonicalBase } from "../../app/lib/site-url";
import { getPrefectureIds, getCityPathsByPrefecture } from "../../app/lib/utils/city-loader";
import { getBlogPostIds } from "../../app/lib/microcms";
import { getLayoutSlugs } from "../../app/lib/cost-by-layout";
import { getDisposeSlugs } from "../../app/lib/dispose-items";
import { DISPOSE_CATEGORIES } from "../../app/lib/dispose-categories";

export type UrlPriority = "High" | "Normal";

export interface UrlWithPriority {
  url: string;
  priority: UrlPriority;
}

const base = getCanonicalBase();

/** 固定ページ（main サイトマップ）のURLリスト */
function getStaticUrls(): string[] {
  return [
    base,
    `${base}/tool/optimizer`,
    `${base}/area`,
    `${base}/company`,
    `${base}/cost`,
    `${base}/dispose`,
    `${base}/tools`,
    `${base}/articles/master-guide`,
    `${base}/guidebook`,
    `${base}/guidebook/jikka-jimai`,
    `${base}/about`,
    `${base}/editorial-policy`,
    `${base}/about-site`,
    `${base}/senryu`,
    `${base}/senryu/submit`,
    `${base}/checklist`,
    `${base}/assets`,
    `${base}/ending-note`,
    `${base}/articles`,
    `${base}/tools/jikka-diagnosis`,
    `${base}/tools/akiya-risk`,
    `${base}/tools/souzoku-prep`,
    `${base}/tools/empty-house-tax`,
    `${base}/tools/appraisal`,
    `${base}/tools/inheritance-share`,
    `${base}/tools/hoji-calendar`,
    `${base}/tools/digital-shame`,
    `${base}/terms`,
    `${base}/privacy`,
    `${base}/contact`,
  ];
}

/**
 * 全URLをサイトマップと同様に収集し、優先度を付与して返す。
 * /subsidy を含むURL = 補助金LP → High、それ以外 = Normal。
 * 並び順: High を先に、その後 Normal。
 */
export async function collectAllUrlsWithPriority(): Promise<UrlWithPriority[]> {
  const result: UrlWithPriority[] = [];

  function add(url: string): void {
    const priority: UrlPriority = url.includes("/subsidy") ? "High" : "Normal";
    result.push({ url, priority });
  }

  // 1. 固定ページ
  for (const url of getStaticUrls()) {
    add(url);
  }

  // 2. cost/layout
  for (const slug of getLayoutSlugs()) {
    add(`${base}/cost/layout/${encodeURIComponent(slug)}`);
  }

  // 3. dispose/category
  for (const cat of DISPOSE_CATEGORIES) {
    add(`${base}/dispose/category/${encodeURIComponent(cat.slug)}`);
  }

  // 4. dispose 品目
  for (const slug of getDisposeSlugs()) {
    add(`${base}/dispose/${encodeURIComponent(slug)}`);
  }

  // 5. 記事（microCMS）
  const articleIds = await getBlogPostIds().catch(() => []);
  for (const id of articleIds) {
    add(`${base}/articles/${encodeURIComponent(id)}`);
  }

  // 7. 都道府県別 area（地域ノード + 補助金LP 等）
  const prefIds = getPrefectureIds();
  for (const prefId of prefIds) {
    const cities = getCityPathsByPrefecture(prefId);
    for (const { prefId: p, cityId } of cities) {
      add(`${base}/area/${p}/${cityId}`);
      add(`${base}/area/${p}/${cityId}/subsidy`);
      add(`${base}/area/${p}/${cityId}/garbage`);
      add(`${base}/area/${p}/${cityId}/cost`);
    }
  }

  // 優先度でソート: High → Normal
  result.sort((a, b) => {
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    return 0;
  });

  return result;
}
