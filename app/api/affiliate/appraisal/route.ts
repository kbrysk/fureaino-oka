import { NextRequest, NextResponse } from "next/server";

const TRANSPARENT_1X1_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

/**
 * 不動産査定アフィリエイトのクリック計測・リダイレクト、およびインプレッション計測用。
 * GET /api/affiliate/appraisal?area=[cityId]&type=[nomu|wakegai]
 * GET /api/affiliate/appraisal?area=[cityId]&type=[nomu|wakegai]&imp=1 … 1x1画像返却（A8インプレ計測）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area") ?? "";
  const type = searchParams.get("type") === "wakegai" ? "wakegai" : "nomu";
  const isImpression = searchParams.get("imp") === "1";

  const payload = { area, type, event: isImpression ? "impression" : "click", at: new Date().toISOString() };

  if (isImpression) {
    console.info("[affiliate/appraisal] impression", payload);
    return new NextResponse(TRANSPARENT_1X1_GIF, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store",
      },
    });
  }

  console.info("[affiliate/appraisal] click", payload);
  const baseUrl = type === "wakegai" ? process.env.WAKEGAI_URL : process.env.NOMUCOM_URL;
  if (baseUrl) {
    const url = new URL(baseUrl);
    if (area) url.searchParams.set("area", area);
    return NextResponse.redirect(url.toString(), 302);
  }

  const fallback = `/tools/appraisal?from=affiliate_appraisal&type=${type}${area ? `&area=${encodeURIComponent(area)}` : ""}`;
  return NextResponse.redirect(fallback, 302);
}
