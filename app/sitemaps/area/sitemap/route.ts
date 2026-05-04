import { NextResponse } from "next/server";
import { getCanonicalBase } from "@/app/lib/site-url";
import { getPrefectureIds, getCityPathsByPrefecture } from "@/app/lib/utils/city-loader";
import { buildSitemapXml, type SitemapEntry } from "@/app/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
  const base = getCanonicalBase();
  const lastModified = new Date();
  const entries: SitemapEntry[] = [];

  try {
    const prefIds = getPrefectureIds();
    for (const prefId of prefIds) {
      const cities = getCityPathsByPrefecture(prefId);
      for (const { prefId: p, cityId } of cities) {
        entries.push(
          { url: `${base}/area/${p}/${cityId}`, lastModified, changeFrequency: "weekly", priority: 0.6 },
          { url: `${base}/area/${p}/${cityId}/subsidy`, lastModified, changeFrequency: "monthly", priority: 0.7 },
          { url: `${base}/area/${p}/${cityId}/garbage`, lastModified, changeFrequency: "monthly", priority: 0.5 },
          { url: `${base}/area/${p}/${cityId}/cost`, lastModified, changeFrequency: "monthly", priority: 0.5 }
          // INSTRUCTION-010: cleanup excluded (noindex)
        );
      }
    }
  } catch {
    // フォールバック: 空で返さず最低限のエントリ
    entries.push({ url: base + "/area", lastModified, changeFrequency: "weekly", priority: 0.9 });
  }

  const xml = buildSitemapXml(entries);
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
