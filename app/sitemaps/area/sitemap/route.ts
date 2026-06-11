import { NextResponse } from "next/server";
import { getCanonicalBase } from "@/app/lib/site-url";
import { getPrefectureIds, getCityPathsByPrefecture } from "@/app/lib/utils/city-loader";
import { getMunicipalitiesByPrefecture } from "@/app/lib/data/municipalities";
import { getAreaContentsStaticParams } from "@/app/lib/utils/area-contents-paths";
import { buildSitemapXml, type SitemapEntry } from "@/app/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
  const base = getCanonicalBase();
  const lastModified = new Date();
  const entries: SitemapEntry[] = [];

  try {
    // HCS対策(2026-06): subsidy は「補助金の実データあり(hasSubsidy===true)」または
    // 監修済み areaContent 持ちのみ index（page.tsx の robots と同一基準）。
    // noindex のページはサイトマップにも載せない（index シグナルの整合性維持）。
    const curated = new Set(
      getAreaContentsStaticParams().map(({ prefecture, city }) => `${prefecture}/${city}`)
    );

    const prefIds = getPrefectureIds();
    for (const prefId of prefIds) {
      // 県別 cleanup ハブ（2026-06 新設・粗大ごみ/遺品整理の県単位統合ページ）
      entries.push({
        url: `${base}/area/${prefId}/cleanup`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });

      const subsidyOk = new Set(
        getMunicipalitiesByPrefecture(prefId)
          .filter((m) => m.subsidy?.hasSubsidy === true)
          .map((m) => m.cityId)
      );

      const cities = getCityPathsByPrefecture(prefId);
      for (const { prefId: p, cityId } of cities) {
        entries.push(
          { url: `${base}/area/${p}/${cityId}`, lastModified, changeFrequency: "weekly", priority: 0.6 },
          // 勝者クラスタ(2026-06): 固定資産税[市]=GSC唯一のクリック源(pos16-18)。tax-simulator都市ページは
          // 静的生成済みなのにサイトマップ未登録だった→発見性修復のため高優先度(0.7)で配信。
          { url: `${base}/tax-simulator/${p}/${cityId}`, lastModified, changeFrequency: "monthly", priority: 0.7 },
          { url: `${base}/area/${p}/${cityId}/cost`, lastModified, changeFrequency: "monthly", priority: 0.5 }
          // INSTRUCTION-010: cleanup excluded (noindex)
          // HCS対策(2026-06): garbage(粗大ゴミ)も noindex 化したため除外。情報は base 都市ハブに集約。
        );
        if (subsidyOk.has(cityId) || curated.has(`${p}/${cityId}`)) {
          entries.push({
            url: `${base}/area/${p}/${cityId}/subsidy`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
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
