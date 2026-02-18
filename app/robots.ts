import type { MetadataRoute } from "next";
import { getCanonicalBase } from "./lib/site-url";

/** 正規ドメインで sitemap の場所を案内（Search Console の評価統合） */
const ROBOTS_BASE = getCanonicalBase();

/**
 * robots.txt（SEO: クローラーへの案内・sitemapの明示）
 * User-agent: * に Allow、sitemap.xml の絶対URLを必ず出力。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${ROBOTS_BASE}/sitemap.xml`,
  };
}
