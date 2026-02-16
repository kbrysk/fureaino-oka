/**
 * 無料ツール各ページ用のOGP画像を生成（ふくろう画像＋ツール名）
 * next/og の ImageResponse 用。各ツールの opengraph-image.tsx から利用。
 * ふくろう画像は public/icon.png（トップ掲載のマスコット）を参照。
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const WIDTH = 1200;
const HEIGHT = 630;
const SITE_NAME = "生前整理支援センター ふれあいの丘";

export const toolOgSize = { width: WIDTH, height: HEIGHT };

async function getOwlImageDataUrl(): Promise<string> {
  const path = join(process.cwd(), "public", "icon.png");
  const data = await readFile(path, "base64");
  return `data:image/png;base64,${data}`;
}

export async function createToolOgImage(title: string): Promise<ImageResponse> {
  const owlSrc = await getOwlImageDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f6f3",
          fontFamily: "Hiragino Sans, Noto Sans JP, sans-serif",
        }}
      >
        {/* 左側: ふくろう画像 */}
        <div
          style={{
            display: "flex",
            flex: "0 0 420px",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={owlSrc}
            alt=""
            width={320}
            height={320}
            style={{ objectFit: "contain" }}
          />
        </div>
        {/* 右側: ツール名＋サイト名 */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 56,
            paddingLeft: 24,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#2d2d2d",
              lineHeight: 1.35,
              marginBottom: 16,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#5b8a72",
              fontWeight: 600,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#6b7280",
              marginTop: 8,
            }}
          >
            実家じまい・遺品整理の無料相談
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
