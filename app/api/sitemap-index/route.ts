/**
 * サイトマップインデックス（/sitemap.xml から rewrite で参照）。
 * Next.js の generateSitemaps は /sitemap/[id].xml のみ生成し /sitemap.xml は自動生成されないため、
 * next.config の rewrite で /sitemap.xml → この API に転送し、GSC が参照する /sitemap.xml でインデックスを返す。
 */
import { NextResponse } from "next/server";
import { getPrefectureIds } from "@/app/lib/utils/city-loader";
import { getCanonicalBase } from "@/app/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const base = getCanonicalBase();
  const lastmod = new Date().toISOString();

  let ids: string[] = ["main"];
  try {
    const prefIds = getPrefectureIds();
    ids = ["main", ...prefIds];
  } catch {
    // fallback: main のみ
  }

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ids.map((id) => `  <sitemap>
    <loc>${base}/sitemap/${id}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
