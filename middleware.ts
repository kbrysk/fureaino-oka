import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AREA_ID_MAP } from "./app/lib/area-id-map.generated";

/** 日本語（ひらがな・カタカナ・漢字）が含まれるか */
function containsJapanese(str: string): boolean {
  return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3000-\u303f]/.test(str);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length < 3) return NextResponse.next();

  const base = segments[0];
  if (base !== "area" && base !== "tax-simulator") return NextResponse.next();

  let pRaw: string;
  let cRaw: string;
  try {
    pRaw = decodeURIComponent(segments[1]);
    cRaw = decodeURIComponent(segments[2]);
  } catch {
    return NextResponse.next();
  }

  if (!containsJapanese(pRaw) && !containsJapanese(cRaw)) {
    return NextResponse.next();
  }

  const entry = AREA_ID_MAP.find((e) => e.prefecture === pRaw && e.city === cRaw);
  if (!entry) return NextResponse.next();

  let newPath = `/${base}/${entry.prefectureId}/${entry.cityId}`;
  if (base === "area" && segments[3] && (segments[3] === "subsidy" || segments[3] === "cleanup")) {
    newPath += `/${segments[3]}`;
  }

  return NextResponse.redirect(new URL(newPath, request.url), 301);
}

export const config = {
  matcher: ["/area/:path*", "/tax-simulator/:path*"],
};
