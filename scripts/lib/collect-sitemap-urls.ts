/**
 * サイトマップと同等の全URLを収集するモジュール。
 * app/sitemap.ts のロジックを Node 単体実行用に再現し、
 * Google Indexing API 用の「優先度付きURLリスト」を返す。
 */
import { getCanonicalBase } from "../../app/lib/site-url";
import { getPrefectureIds, getCityPathsByPrefecture } from "../../app/lib/utils/city-loader";
import { getMunicipalitiesByPrefecture } from "../../app/lib/data/municipalities";
import { getAreaContentsStaticParams } from "../../app/lib/utils/area-contents-paths";
import { getBlogPostIds } from "../../app/lib/microcms";
import { getLayoutSlugs } from "../../app/lib/cost-by-layout";
import { getAllPrefectureSlugs } from "../../app/lib/data/municipality-stats";
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
    `${base}/akiya`, // 空き家ハブ（収益ピラー・2026-06新設）
    `${base}/akiya/kaitai-hojokin`, // リッチ・ピラー 解体補助金 完全ガイド（2026-06新設）
    `${base}/news`, // ニュース・プレスリリース（一次ソース・2026-06新設）
    `${base}/news/akiya-hojokin-survey-2026`, // 調査発表（一次ソース・2026-06新設）
    `${base}/data`, // データ室ハブ（被リンク発見性・2026-06新設）
    `${base}/data/akiya-hojokin-ranking`, // データの堀（被リンク/AI引用源・2026-06新設）
    `${base}/data/seizen-seiri-trends`, // 検索トレンドデータ
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
    // 新設の収益ピラー・データ室（全/data配下）・リッチガイド・ニュースは最優先（インデックス浸透を急ぐ）
    // 県別cleanupハブ(2026-06新設・47枚)も新規発見を急ぐため Top
    const isPriorityHub =
      url.endsWith("/akiya") ||
      url.includes("/akiya/kaitai-hojokin") ||
      url.includes(`${base}/data`) ||
      url.includes(`${base}/news`) ||
      /\/area\/[^/]+\/cleanup$/.test(url);
    const priority: UrlPriority =
      isArticleDetail || isPriorityHub
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

  // 1.5 都道府県別 空き家解体補助金 データ（47面・2026-06新設・データの堀）
  for (const { prefId } of getAllPrefectureSlugs()) {
    add(`${base}/data/akiya-hojokin-ranking/${prefId}`);
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
  // HCS対策(2026-06): noindex化したURLは送信しない（クォータの浪費＋矛盾シグナル回避）
  // - garbage: 全市区 noindex のため除外
  // - subsidy: hasSubsidy===true または監修済み areaContent のみ（page.tsx の robots と同一基準）
  const curated = new Set(
    getAreaContentsStaticParams().map(({ prefecture, city }) => `${prefecture}/${city}`)
  );
  const prefIds = getPrefectureIds();
  for (const prefId of prefIds) {
    // 県別 cleanup ハブ（2026-06新設）
    add(`${base}/area/${prefId}/cleanup`);

    const subsidyOk = new Set(
      getMunicipalitiesByPrefecture(prefId)
        .filter((m) => m.subsidy?.hasSubsidy === true)
        .map((m) => m.cityId)
    );
    const cities = getCityPathsByPrefecture(prefId);
    for (const { prefId: p, cityId } of cities) {
      add(`${base}/area/${p}/${cityId}`);
      if (subsidyOk.has(cityId) || curated.has(`${p}/${cityId}`)) {
        add(`${base}/area/${p}/${cityId}/subsidy`);
      }
      add(`${base}/area/${p}/${cityId}/cost`);
    }
  }

  // 優先度でソート: Top → High → Normal
  const rank = (p: UrlPriority): number => (p === "Top" ? 0 : p === "High" ? 1 : 2);
  result.sort((a, b) => rank(a.priority) - rank(b.priority));

  return result;
}
