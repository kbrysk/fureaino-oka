/**
 * サイト全体のOGP画像（1200x630）
 * フクロウ・サイト名・ファーストビュー文言でX等シェア時のクリックを促すデザイン。
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const WIDTH = 1200;
const HEIGHT = 630;
const SITE_NAME = "生前整理支援センター ふれあいの丘";
const MAIN_COPY =
  "モノの整理だけでなく、心の整理も。エンディングノートから始まる生前整理。";
const SUB_COPY =
  "『何から始める？』の計画作りから、実家の片付け、不動産売却まで。あなたのペースで進めるトータルサポート。";

export const alt = "生前整理支援センター ふれあいの丘 - 実家じまい・遺品整理の無料相談";
export const size = { width: WIDTH, height: HEIGHT };
export const contentType = "image/png" as const;

async function getOwlDataUrl(): Promise<string | null> {
  try {
    const path = join(process.cwd(), "public", "images", "owl-character.png");
    const data = await readFile(path, "base64");
    return `data:image/png;base64,${data}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  const owlSrc = await getOwlDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          backgroundColor: "#f8f6f3",
          fontFamily: "Hiragino Sans, Noto Sans JP, sans-serif",
        }}
      >
        {/* 左: フクロウ（読み込み失敗時は非表示） */}
        {owlSrc && (
          <div
            style={{
              display: "flex",
              flex: "0 0 380px",
              alignItems: "center",
              justifyContent: "center",
              padding: 48,
              backgroundColor: "#e8f0ec",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={owlSrc}
              alt=""
              width={280}
              height={280}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        {/* 右: サイト名・完全無料・メインコピー・サブコピー */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: owlSrc ? 48 : 56,
            paddingRight: 56,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 20px",
              marginBottom: 20,
              fontSize: 18,
              fontWeight: 700,
              color: "#92400e",
              backgroundColor: "#fef3c7",
              border: "2px solid #fcd34d",
              borderRadius: 9999,
              width: "fit-content",
            }}
          >
            完全無料
          </span>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#5b8a72",
              marginBottom: 16,
              lineHeight: 1.35,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#2d2d2d",
              lineHeight: 1.4,
              marginBottom: 16,
            }}
          >
            {MAIN_COPY}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            {SUB_COPY}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    }
  );
}
