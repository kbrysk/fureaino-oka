import type { MetadataRoute } from "next";
import { getBaseUrl } from "./lib/site-url";

/**
 * robots.txt（SEO: クローラーへの案内・sitemapの明示）
 * 本番では NEXT_PUBLIC_SITE_URL を設定すると sitemap の絶対URLを出力。
 */
export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(base && { sitemap: `${base}/sitemap.xml` }),
  };
}
