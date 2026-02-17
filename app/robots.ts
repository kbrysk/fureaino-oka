import type { MetadataRoute } from "next";
import { getBaseUrl } from "./lib/site-url";

/** 本番ドメイン（sitemap URL は常にここで明示） */
const ROBOTS_BASE = getBaseUrl() || "https://www.fureaino-oka.com";

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
