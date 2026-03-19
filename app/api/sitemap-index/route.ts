/**
 * サイトマップインデックス（/sitemap.xml から rewrite で参照）。
 * Next.js の generateSitemaps は /sitemap/[id].xml のみ生成し /sitemap.xml は自動生成されないため、
 * next.config の rewrite で /sitemap.xml → この API に転送し、GSC が参照する /sitemap.xml でインデックスを返す。
 *
 * データ取得で例外が出ても 500 にせず 200 + 空のインデックスを返し、クローラーを止めない。
 */
import { NextResponse } from "next/server";
import { getCanonicalBase } from "@/app/lib/site-url";

export const dynamic = "force-dynamic";

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 子 sitemap 0 件のインデックス（エラー時フォールバック） */
function emptySitemapIndexXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="${SITEMAP_NS}">
</sitemapindex>`;
}

function buildSitemapIndexXml(base: string, ids: string[], lastmod: string): string {
  const body =
    ids.length === 0
      ? ""
      : ids
          .map(
            (id) => `  <sitemap>
    <loc>${escapeXml(`${base}/sitemap/${id}.xml`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </sitemap>`
          )
          .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="${SITEMAP_NS}">
${body}
</sitemapindex>`;
}

function xmlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

export async function GET() {
  try {
    let base: string;
    try {
      base = getCanonicalBase();
    } catch (baseErr) {
      console.error("[sitemap-index] getCanonicalBase failed:", baseErr);
      return xmlResponse(emptySitemapIndexXml());
    }

    const lastmod = new Date().toISOString();

    let ids: string[] = [];
    try {
      // 動的 import にして、巨大マップの静的読み込み失敗も GET 内で捕捉（500 を避ける）
      const { getPrefectureIds } = await import("@/app/lib/utils/city-loader");
      const prefIds = getPrefectureIds();
      ids = ["main", ...prefIds];
    } catch (dataErr) {
      console.error("[sitemap-index] city-loader / getPrefectureIds failed:", dataErr);
      return xmlResponse(emptySitemapIndexXml());
    }

    try {
      const sitemapIndex = buildSitemapIndexXml(base, ids, lastmod);
      return xmlResponse(sitemapIndex);
    } catch (buildErr) {
      console.error("[sitemap-index] build XML failed:", buildErr);
      return xmlResponse(emptySitemapIndexXml());
    }
  } catch (fatal) {
    console.error("[sitemap-index] unexpected error:", fatal);
    return xmlResponse(emptySitemapIndexXml());
  }
}
