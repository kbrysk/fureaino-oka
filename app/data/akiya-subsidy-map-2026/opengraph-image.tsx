import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "全国空き家・解体補助金マップ 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DATA_PATH = path.join(
  process.cwd(),
  "app",
  "lib",
  "data",
  "subsidy-map.json"
);

export default async function Image() {
  let topCity = "—";
  let topAmount = "—";
  let coverageNational = 0;
  let total = 0;
  if (fs.existsSync(DATA_PATH)) {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    const t = data.top_amount_ranking?.[0];
    if (t) {
      topCity = `${t.prefName}${t.cityName}`;
      topAmount = `${Math.round((t.maxAmountYen ?? 0) / 10000).toLocaleString()}万円`;
    }
    coverageNational = data.data_source?.coverage_rate_national ?? 0;
    total = data.data_source?.total_cities ?? 0;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
          color: "white",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            opacity: 0.9,
            marginBottom: 20,
          }}
        >
          ふれあいの丘 編集部 独自データ
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          全国空き家・解体補助金
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.0,
            marginBottom: 26,
            color: "#fde68a",
          }}
        >
          マップ 2026
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.14)",
              borderRadius: 16,
              padding: "22px 28px",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", fontSize: 22, opacity: 0.85 }}>
              最高支給額
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 50,
                fontWeight: 800,
                color: "#fde68a",
                marginTop: 6,
              }}
            >
              {topAmount}
            </div>
            <div style={{ display: "flex", fontSize: 22, opacity: 0.85, marginTop: 6 }}>
              {topCity}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.14)",
              borderRadius: 16,
              padding: "22px 28px",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", fontSize: 22, opacity: 0.85 }}>
              全国カバレッジ
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 50,
                fontWeight: 800,
                color: "#fde68a",
                marginTop: 6,
              }}
            >
              {coverageNational}%
            </div>
            <div style={{ display: "flex", fontSize: 22, opacity: 0.85, marginTop: 6 }}>
              {total.toLocaleString()}市区町村
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 40,
            left: 60,
            fontSize: 22,
            opacity: 0.75,
          }}
        >
          fureaino-oka.com / CC BY 4.0
        </div>
      </div>
    ),
    { ...size }
  );
}
