import { NextResponse } from "next/server";
import { getCanonicalBase } from "@/app/lib/site-url";
import { buildSitemapXml, type SitemapEntry } from "@/app/lib/sitemap-xml";

const TOOLS_PAGES: { path: string; priority: number }[] = [
  { path: "/tools", priority: 0.8 },
  { path: "/tools/jikka-diagnosis", priority: 0.8 },
  { path: "/tools/akiya-risk", priority: 0.8 },
  { path: "/tools/empty-house-tax", priority: 0.8 },
  { path: "/tools/digital-shame", priority: 0.7 },
  { path: "/tools/inheritance-share", priority: 0.7 },
  { path: "/tools/hoji-calendar", priority: 0.7 },
  { path: "/tools/souzoku-prep", priority: 0.7 },
  { path: "/tools/appraisal", priority: 0.7 },
  { path: "/tool/optimizer", priority: 0.8 },
];

export const revalidate = 86400;

export async function GET() {
  const base = getCanonicalBase();
  const lastModified = new Date();
  const entries: SitemapEntry[] = TOOLS_PAGES.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const xml = buildSitemapXml(entries);
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
