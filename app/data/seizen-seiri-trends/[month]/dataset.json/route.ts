import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * 終活・生前整理 検索トレンドレポート データセットダウンロードエンドポイント
 *
 * GET /data/seizen-seiri-trends/[month]/dataset.json
 *
 * 返却: app/lib/data/trend-reports/[month].json の内容
 *      （CC BY 4.0で自由に再配布・引用可能）
 */

const REPORTS_DIR = path.join(process.cwd(), "app", "lib", "data", "trend-reports");

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ month: f.replace(".json", "") }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params;
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return new NextResponse("Invalid month format", { status: 400 });
  }
  const file = path.join(REPORTS_DIR, `${month}.json`);
  if (!fs.existsSync(file)) {
    return new NextResponse("Report not found", { status: 404 });
  }
  const content = fs.readFileSync(file, "utf-8");
  return new NextResponse(content, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="seizen-seiri-trends-${month}.json"`,
      "cache-control": "public, max-age=3600",
      "x-license": "CC-BY-4.0",
      "x-publisher": "Fureaino-Oka Editorial",
    },
  });
}
