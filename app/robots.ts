import type { MetadataRoute } from "next";
import { getCanonicalBase } from "./lib/site-url";

/** 正規ドメインで sitemap の場所を案内（Search Console の評価統合） */
const ROBOTS_BASE = getCanonicalBase();

/**
 * robots.txt（GSC クロールバジェット最適化）
 * - 無駄な再クロールを防ぐ: /api/, 管理・送信完了ページを Disallow
 * - Sitemap Index を明示し「検出」目的のクロールを sitemap に集約
 * - WRS リソース枯渇対策: インデックス不要なパスを遮断
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/settings",
          "/contact/thanks",
          "/senryu/submit",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/settings",
          "/contact/thanks",
          "/senryu/submit",
        ],
      },
    ],
    sitemap: `${ROBOTS_BASE}/sitemap.xml`,
    host: ROBOTS_BASE,
  };
}
