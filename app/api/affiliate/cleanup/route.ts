import { NextRequest, NextResponse } from "next/server";

/**
 * 不用品回収・遺品整理のアフィリエイト導線用リダイレクト。
 * 環境変数 AFFILIATE_CLEANUP_URL が設定されていればそこへリダイレクト、
 * 未設定時はサイト内の見積もり導線（/guide）へ。
 * 将来的にASPのURLを差し替えやすい構造。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area") ?? "";

  const destination = process.env.AFFILIATE_CLEANUP_URL;

  if (destination) {
    const url = new URL(destination);
    url.searchParams.set("area", area);
    return NextResponse.redirect(url.toString(), 302);
  }

  const fallback = `/guide?from=affiliate_cleanup${area ? `&area=${encodeURIComponent(area)}` : ""}`;
  return NextResponse.redirect(fallback, 302);
}
