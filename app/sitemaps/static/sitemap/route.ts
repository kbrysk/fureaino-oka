import { NextResponse } from "next/server";
import { getCanonicalBase } from "@/app/lib/site-url";
import { buildSitemapXml, type SitemapEntry } from "@/app/lib/sitemap-xml";

const STATIC_PAGES: { path: string; priority: number; changeFrequency: SitemapEntry["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/area", priority: 0.9, changeFrequency: "weekly" },
  { path: "/articles", priority: 0.9, changeFrequency: "weekly" },
  { path: "/articles/master-guide", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/jikka-diagnosis", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/akiya-risk", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/empty-house-tax", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/digital-shame", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/inheritance-share", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/hoji-calendar", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/souzoku-prep", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/appraisal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ending-note", priority: 0.8, changeFrequency: "monthly" },
  { path: "/checklist", priority: 0.7, changeFrequency: "monthly" },
  { path: "/assets", priority: 0.7, changeFrequency: "monthly" },
  { path: "/guidebook", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cost", priority: 0.7, changeFrequency: "monthly" },
  { path: "/dispose", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/company", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about-site", priority: 0.5, changeFrequency: "yearly" },
  { path: "/editorial-policy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/senryu", priority: 0.6, changeFrequency: "weekly" },
  { path: "/tool/optimizer", priority: 0.8, changeFrequency: "monthly" },
];

export const revalidate = 86400;

export async function GET() {
  const base = getCanonicalBase();
  const lastModified = new Date();
  const entries: SitemapEntry[] = STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
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
