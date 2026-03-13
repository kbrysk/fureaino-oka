// U6: サイト内検索API 2026-03
import { NextRequest, NextResponse } from "next/server";
import { buildSearchIndex, searchIndex } from "@/app/lib/search/build-index";

let cachedIndex: Awaited<ReturnType<typeof buildSearchIndex>> | null = null;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }
  if (query.length > 100) {
    return NextResponse.json(
      { error: "クエリが長すぎます" },
      { status: 400 }
    );
  }

  if (!cachedIndex) {
    cachedIndex = await buildSearchIndex();
  }

  const results = searchIndex(cachedIndex, query);

  return NextResponse.json({ results });
}
