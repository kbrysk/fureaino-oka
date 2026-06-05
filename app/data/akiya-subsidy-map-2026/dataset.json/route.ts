import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const DATA_PATH = path.join(
  process.cwd(),
  "app",
  "lib",
  "data",
  "subsidy-map.json"
);

export async function GET() {
  if (!fs.existsSync(DATA_PATH)) {
    return new NextResponse("Dataset not found", { status: 404 });
  }
  const content = fs.readFileSync(DATA_PATH, "utf-8");
  return new NextResponse(content, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="akiya-subsidy-map-2026.json"`,
      "cache-control": "public, max-age=3600",
      "x-license": "CC-BY-4.0",
      "x-publisher": "Fureaino-Oka Editorial",
    },
  });
}
