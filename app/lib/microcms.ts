/**
 * microCMS クライアントの初期化（環境変数で安全に設定）
 * 未設定時はビルド・実行時にエラーにせず、取得処理側でハンドリングする。
 *
 * 【Vercel 必須環境変数】
 * - MICROCMS_SERVICE_DOMAIN … サービスID（例: xxxxx）
 * - MICROCMS_API_KEY       … 閲覧用APIキー
 */
import { createClient } from "microcms-js-sdk";
import type {
  MicroCmsBlogPost,
  MicroCmsCategory,
  MicroCmsListResponse,
  MicroCmsTag,
} from "./microcms-types";

const DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN ?? "";
const API_KEY = process.env.MICROCMS_API_KEY ?? "";

/** 環境変数未設定時のデバッグログ（Vercel ビルドログで欠落変数を判別するため） */
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "test") {
  const missing: string[] = [];
  if (!DOMAIN || DOMAIN.trim() === "") missing.push("MICROCMS_SERVICE_DOMAIN");
  if (!API_KEY || API_KEY.trim() === "") missing.push("MICROCMS_API_KEY");
  if (missing.length > 0) {
    console.warn(
      "[microCMS] 環境変数が未設定のためブログAPIは無効です。欠落:",
      missing.join(", ")
    );
  }
}

export const microCmsClient =
  DOMAIN && API_KEY
    ? createClient({
        serviceDomain: DOMAIN,
        apiKey: API_KEY,
      })
    : null;

/** ブログ一覧取得用エンドポイント名（microCMS 管理画面の API 名に合わせて変更可） */
export const BLOG_LIST_ENDPOINT = "blog";

/** ブログ1件取得用（同上） */
export const BLOG_CONTENT_ENDPOINT = "blog";

/** カテゴリ一覧用エンドポイント */
export const CATEGORIES_ENDPOINT = "categories";

/** タグ一覧用エンドポイント */
export const TAGS_ENDPOINT = "tags";

export interface GetBlogListFilters {
  categoryId?: string;
  tagId?: string;
}

/** 一覧取得（公開済みのみ・日付降順）。categoryId / tagId で絞り込み可能 */
export async function getBlogList(
  limit = 20,
  offset = 0,
  filters?: GetBlogListFilters
): Promise<MicroCmsListResponse<MicroCmsBlogPost>> {
  if (!microCmsClient) {
    return { contents: [], totalCount: 0, offset, limit };
  }
  try {
    const queries: Record<string, string | number> = { limit, offset, orders: "-publishedAt" };
    if (filters?.categoryId) {
      queries.filters = `category[equals]${filters.categoryId}`;
    }
    if (filters?.tagId) {
      queries.filters = queries.filters
        ? `${queries.filters}[and]tags[contains]${filters.tagId}`
        : `tags[contains]${filters.tagId}`;
    }
    const res = await microCmsClient.get<MicroCmsListResponse<MicroCmsBlogPost>>({
      endpoint: BLOG_LIST_ENDPOINT,
      queries,
    });
    return res;
  } catch (e) {
    logMicroCmsError(`getBlogList (${BLOG_LIST_ENDPOINT})`, e);
    return { contents: [], totalCount: 0, offset, limit };
  }
}

/** API エラー時のデバッグログ（404＝エンドポイント名不一致の可能性） */
function logMicroCmsError(context: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`[microCMS] ${context} でエラー:`, msg);
}

/** カテゴリ一覧取得（記事一覧の「カテゴリから探す」用） */
export async function getCategories(): Promise<MicroCmsCategory[]> {
  if (!microCmsClient) return [];
  try {
    const res = await microCmsClient.get<MicroCmsListResponse<MicroCmsCategory>>({
      endpoint: CATEGORIES_ENDPOINT,
      queries: { limit: 100 },
    });
    return res.contents ?? [];
  } catch (e) {
    logMicroCmsError(`getCategories (${CATEGORIES_ENDPOINT})`, e);
    return [];
  }
}

/** タグ一覧取得（記事一覧の「今のあなたの状況に近いものは？」用） */
export async function getTags(): Promise<MicroCmsTag[]> {
  if (!microCmsClient) return [];
  try {
    const res = await microCmsClient.get<MicroCmsListResponse<MicroCmsTag>>({
      endpoint: TAGS_ENDPOINT,
      queries: { limit: 100 },
    });
    return res.contents ?? [];
  } catch (e) {
    logMicroCmsError(`getTags (${TAGS_ENDPOINT})`, e);
    return [];
  }
}

/** 1件取得（存在しない場合は null） */
export async function getBlogPost(id: string): Promise<MicroCmsBlogPost | null> {
  if (!microCmsClient) return null;
  try {
    const res = await microCmsClient.get<MicroCmsBlogPost>({
      endpoint: BLOG_CONTENT_ENDPOINT,
      contentId: id,
    });
    return res;
  } catch (e) {
    logMicroCmsError(`getBlogPost (${BLOG_CONTENT_ENDPOINT}/${id})`, e);
    return null;
  }
}

/** 全ID取得（generateStaticParams / sitemap 用） */
export async function getBlogPostIds(): Promise<string[]> {
  if (!microCmsClient) return [];
  const ids: string[] = [];
  const limit = 100;
  let offset = 0;
  for (;;) {
    const res = await getBlogList(limit, offset);
    ids.push(...res.contents.map((c) => c.id));
    if (res.contents.length === 0 || offset + res.contents.length >= res.totalCount) break;
    offset += limit;
  }
  return ids;
}
