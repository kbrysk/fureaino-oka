/**
 * サイトマップXML生成ヘルパー（Route Handler 用）。
 * app/sitemap.ts の MetadataRoute.Sitemap 形式とは別に、XML文字列を返す。
 */

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urlNodes = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastModified.toISOString().slice(0, 10)}</lastmod>${e.changeFrequency ? `\n    <changefreq>${e.changeFrequency}</changefreq>` : ""}${e.priority !== undefined ? `\n    <priority>${e.priority}</priority>` : ""}
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
