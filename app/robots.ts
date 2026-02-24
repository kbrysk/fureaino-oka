import type { MetadataRoute } from "next";
import { getCanonicalBase } from "./lib/site-url";

/** 正規ドメインで sitemap の場所を案内（Search Console の評価統合） */
const ROBOTS_BASE = getCanonicalBase();

/**
 * robots.txt（SEO: クローラーへの案内・Sitemap Index の明示）
 * generateSitemaps により /sitemap.xml がインデックスとなり /sitemap/0.xml, /sitemap/1.xml... を参照。
 * 正規ドメインの絶対URLで Sitemap を指定し、Search Console の評価を正規URLに統合。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${ROBOTS_BASE}/sitemap.xml`,
  };
}
