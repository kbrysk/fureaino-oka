import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AREA_ID_MAP } from "./app/lib/area-id-map.generated";

/** 日本語（ひらがな・カタカナ・漢字）が含まれるか */
function containsJapanese(str: string): boolean {
  return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3000-\u303f]/.test(str);
}

/** 中古ドメイン時代の残骸：410 Gone で「永久に消滅」を伝えインデックス削除を促す */
const LEGACY_410_PREFIXES = ["/tenmon", "/shizen", "/search"] as const;
const LEGACY_410_EXACT = "/parking.php";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. 中古ドメイン遺物 → 410 Gone（Search Console でインデックス削除を促す）
  if (pathname === LEGACY_410_EXACT) {
    return new NextResponse(null, { status: 410 });
  }
  for (const prefix of LEGACY_410_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return new NextResponse(null, { status: 410 });
    }
  }

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
  matcher: [
    "/area/:path*",
    "/tax-simulator/:path*",
    "/tenmon/:path*",
    "/shizen/:path*",
    "/search/:path*",
    "/parking.php",
  ],
};
