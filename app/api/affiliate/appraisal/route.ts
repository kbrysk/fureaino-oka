import { NextRequest, NextResponse } from "next/server";

/** 環境変数未読込時用フォールバック（500エラー絶対防止） */
const FALLBACK_NOMUCOM_URL = "https://px.a8.net/svt/ejp?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";
const FALLBACK_WAKEGAI_URL = "https://px.a8.net/svt/ejp?a8mat=4AXDCK+E6TXTE+5J56+5YRHE";

const TRANSPARENT_1X1_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

/**
 * 不動産査定アフィリエイトのクリック計測・リダイレクト、およびインプレッション計測用。
 * GET /api/affiliate/appraisal?area=[cityId]&type=[nomu|wakegai]
 * type=nomu → NOMUCOM_URL へ 302、type=wakegai → WAKEGAI_URL へ 302。
 * GET ?imp=1 のときは 1x1 GIF を返す（自前計測用）。
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

  const redirectUrl =
    type === "wakegai"
      ? (process.env.WAKEGAI_URL ?? FALLBACK_WAKEGAI_URL)
      : (process.env.NOMUCOM_URL ?? FALLBACK_NOMUCOM_URL);

  return NextResponse.redirect(redirectUrl, 302);
}
