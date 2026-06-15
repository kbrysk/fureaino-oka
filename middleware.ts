import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AREA_ID_MAP } from "./app/lib/area-id-map.generated";
import municipalities from "./app/lib/data/municipalities.json";

/** 日本語（ひらがな・カタカナ・漢字）が含まれるか */
function containsJapanese(str: string): boolean {
  return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3000-\u303f]/.test(str);
}

/** 中古ドメイン時代の残骸：410 Gone で「永久に消滅」を伝えインデックス削除を促す */
const LEGACY_410_PREFIXES = ["/tenmon", "/shizen", "/search"] as const;
const LEGACY_410_EXACT = "/parking.php";

/**
 * 記事カニバリ統合の 301 マップ（CONTENT_CONSOLIDATION_PLAN.md）。
 * key=旧slug（非公開化する側） → value=残す canonical slug。
 * 運用: 301をデプロイ→microCMSで旧記事を下書きに戻す、の順で404期間ゼロ。
 * パイロット#5（遺品整理 自分で）: 本文は ihin-seiri-jibun-de に統合済み。
 */
const ARTICLE_CONSOLIDATION_301: Record<string, string> = {
  "ihin-seiri-jibunde": "ihin-seiri-jibun-de", // 統合#5（slugハイフン1本違いの完全カニバリ）2026-06
};

type MunicipalityRow = {
  prefId: string;
  cityId: string;
  subsidy?: {
    hasSubsidy: boolean | null;
  };
};

const SUBSIDY_EXISTS_BY_AREA_KEY: Map<string, boolean> = (() => {
  const m = new Map<string, boolean>();
  for (const row of municipalities as unknown as MunicipalityRow[]) {
    const key = `${row.prefId}`.toLowerCase().trim() + "/" + `${row.cityId}`.toLowerCase().trim();
    m.set(key, row.subsidy?.hasSubsidy === true);
  }
  return m;
})();

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /region/ トップは /area へ恒久リダイレクト
  if (pathname === "/region" || pathname === "/region/") {
    const url = new URL("/area", request.url);
    url.search = ""; // クエリ除去
    return NextResponse.redirect(url, 301);
  }

  // 0. 運営者情報 → 会社概要ページへ恒久リダイレクト（SEO 評価の引き継ぎ）
  if (pathname === "/about" || pathname === "/about/") {
    return NextResponse.redirect(new URL("/company", request.url), 301);
  }

  // 0-b. 「空き家 解体 補助金」のカニバリ統合：旧CMS記事 → 新リッチ・ピラーへ301
  //      （同一KWで競合する2ページを1本化し、評価を集約。データ統合・FAQ・47県ハブを持つ
  //        /akiya/kaitai-hojokin を唯一の正規ページにする）
  if (
    pathname === "/articles/akiya-kaitai-hojokin" ||
    pathname === "/articles/akiya-kaitai-hojokin/"
  ) {
    return NextResponse.redirect(new URL("/akiya/kaitai-hojokin", request.url), 301);
  }

  // 0-c. 記事カニバリ統合 301マップ（CONTENT_CONSOLIDATION_PLAN.md）
  //      重複記事を canonical 1本へ集約。旧slug → 残すslug。
  //      ※301を先にデプロイ→旧記事の非公開化、の順で404期間ゼロ。
  if (pathname.startsWith("/articles/")) {
    const slug = pathname.replace(/^\/articles\//, "").replace(/\/$/, "");
    const target = ARTICLE_CONSOLIDATION_301[slug];
    if (target) {
      return NextResponse.redirect(new URL(`/articles/${target}`, request.url), 301);
    }
  }

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
  if (base !== "area" && base !== "tax-simulator" && base !== "region") return NextResponse.next();

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
  const prefEntry = !entry ? AREA_ID_MAP.find((e) => e.prefecture === pRaw) : null;

  if (base === "region") {
    let newPath: string;
    if (entry) {
      const subsidyKey = `${entry.prefectureId}/${entry.cityId}`.toLowerCase();
      const hasSubsidy = SUBSIDY_EXISTS_BY_AREA_KEY.get(subsidyKey) === true;
      newPath = hasSubsidy
        ? `/area/${entry.prefectureId}/${entry.cityId}/subsidy`
        : `/area/${entry.prefectureId}/${entry.cityId}`;
    } else if (prefEntry) {
      newPath = `/area/${prefEntry.prefectureId}`;
    } else {
      newPath = `/area`;
    }

    const url = new URL(newPath, request.url);
    url.search = ""; // /region/ はクエリを除去して 301
    return NextResponse.redirect(url, 301);
  }

  if (!entry) return NextResponse.next();

  let newPath = `/${base}/${entry.prefectureId}/${entry.cityId}`;
  if (base === "area" && segments[3] && (segments[3] === "subsidy" || segments[3] === "cleanup")) {
    newPath += `/${segments[3]}`;
  }

  return NextResponse.redirect(new URL(newPath, request.url), 301);
}

export const config = {
  matcher: [
    "/about",
    "/about/",
    // 記事カニバリ統合301（ARTICLE_CONSOLIDATION_301）を全記事で評価するため :path* に拡張。
    // 旧 /articles/akiya-kaitai-hojokin 明示登録を包含。
    "/articles/:path*",
    "/area/:path*",
    "/region/:path*",
    "/tax-simulator/:path*",
    "/tenmon/:path*",
    "/shizen/:path*",
    "/search/:path*",
    "/parking.php",
  ],
};
