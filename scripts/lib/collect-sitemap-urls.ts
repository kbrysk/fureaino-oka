/**
 * サイトマップと同等の全URLを収集するモジュール。
 * app/sitemap.ts のロジックを Node 単体実行用に再現し、
 * Google Indexing API 用の「優先度付きURLリスト」を返す。
 */
import { getCanonicalBase } from "../../app/lib/site-url";
import { getPrefectureIds, getCityPathsByPrefecture } from "../../app/lib/utils/city-loader";
import { getBlogPostIds } from "../../app/lib/microcms";
import { getLayoutSlugs } from "../../app/lib/cost-by-layout";
/**
 * 送信優先度:
 * - Top: 記事(/articles/[id])。100記事一括公開後の即時インデックス促進のため最優先化（2026-06-01）。
 * - High: 補助金LP(/area/[pref]/[city]/subsidy)。事業収益直結のため第2優先。
 * - Normal: その他。
 */
export type UrlPriority = "Top" | "High" | "Normal";

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
 * - /articles/[id] = Top（記事インデックス浸透を最優先・2026-06-01より）
 * - /subsidy を含むURL = 補助金LP → High
 * - それ以外 = Normal
 * 並び順: Top → High → Normal。
 */
export async function collectAllUrlsWithPriority(): Promise<UrlWithPriority[]> {
  const result: UrlWithPriority[] = [];

  function add(url: string): void {
    // 「/articles/master-guide」「/articles」TOPは Normal にとどめ、個別記事 (/articles/{id}) のみ Top
    const isArticleDetail = /\/articles\/[^/]+$/.test(url) && !url.endsWith("/articles/master-guide");
    const priority: UrlPriority = isArticleDetail
      ? "Top"
      : url.includes("/subsidy")
      ? "High"
      : "Normal";
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

  // 3. 記事（microCMS）
  const articleIds = await getBlogPostIds().catch(() => []);
  for (const id of articleIds) {
    add(`${base}/articles/${encodeURIComponent(id)}`);
  }

  // 4. 都道府県別 area（地域ノード + 補助金LP 等）
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

  // 優先度でソート: Top → High → Normal
  const rank = (p: UrlPriority): number => (p === "Top" ? 0 : p === "High" ? 1 : 2);
  result.sort((a, b) => rank(a.priority) - rank(b.priority));

  return result;
}
