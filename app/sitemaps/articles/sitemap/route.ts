import { NextResponse } from "next/server";
import { getCanonicalBase } from "@/app/lib/site-url";
import { getBlogPostIds } from "@/app/lib/microcms";
import { buildSitemapXml, type SitemapEntry } from "@/app/lib/sitemap-xml";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const base = getCanonicalBase();
  const lastModified = new Date();
  const entries: SitemapEntry[] = [
    { url: `${base}/articles`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/articles/master-guide`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];

  try {
    const articleIds = await getBlogPostIds();
    for (const id of articleIds) {
      entries.push({
        url: `${base}/articles/${encodeURIComponent(id)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // microCMS 未設定時は静的エントリのみ
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
