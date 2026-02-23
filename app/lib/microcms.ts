/**
 * microCMS クライアントの初期化（環境変数で安全に設定）
 * 未設定時はビルド・実行時にエラーにせず、取得処理側でハンドリングする
 */
import { createClient } from "microcms-js-sdk";
import type { MicroCmsBlogPost, MicroCmsListResponse } from "./microcms-types";

const DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN ?? "";
const API_KEY = process.env.MICROCMS_API_KEY ?? "";

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

/** 一覧取得（公開済みのみ・日付降順） */
export async function getBlogList(limit = 20, offset = 0): Promise<MicroCmsListResponse<MicroCmsBlogPost>> {
  if (!microCmsClient) {
    return { contents: [], totalCount: 0, offset, limit };
  }
  const res = await microCmsClient.get<MicroCmsListResponse<MicroCmsBlogPost>>({
    endpoint: BLOG_LIST_ENDPOINT,
    queries: { limit, offset, orders: "-publishedAt" },
  });
  return res;
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
  } catch {
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
