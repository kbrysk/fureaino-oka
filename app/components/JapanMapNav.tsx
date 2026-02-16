"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    svgJapan?: (opts: {
      element: string;
      width?: string;
      height?: string;
      type?: string;
      stroked?: boolean;
      strokeColor?: string;
      withTips?: boolean;
    }) => unknown;
  }
}

/**
 * 日本列島の形をしたSVG地図。都道府県をクリックで該当セクションへスクロール。
 * svg-japan (MIT) を使用。type: deform でイラスト風・押しやすいブロック表示。
 */
export default function JapanMapNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = document.getElementById("japan-map-container");
    if (!container) return;

    const runMap = () => {
      if (typeof window.svgJapan !== "function" || initializedRef.current) return;
      initializedRef.current = true;
      // 二重描画防止（Strict Mode等で effect が2回走っても1つだけにする）
      container.innerHTML = "";
      window.svgJapan({
        element: "#japan-map-container",
        width: "100%",
        height: "420px",
        type: "deform",
        stroked: true,
        strokeColor: "#2d5a3d",
        withTips: true,
      });
      container.addEventListener("click", (e: MouseEvent) => {
        const path = (e.target as HTMLElement).closest?.("path");
        if (path && path.getAttribute("data-name")) {
          const name = path.getAttribute("data-name");
          if (name) {
            document.getElementById(name)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    };

    if (typeof window.svgJapan === "function") {
      runMap();
      return;
    }

    const existing = document.querySelector('script[src="/svg-japan.min.js"]');
    if (existing) {
      existing.addEventListener("load", runMap);
      return () => existing.removeEventListener("load", runMap);
    }

    const script = document.createElement("script");
    script.src = "/svg-japan.min.js";
    script.async = false;
    script.onload = runMap;
    document.body.appendChild(script);
    return () => {
      script.remove();
      initializedRef.current = false;
    };
  }, []);

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
      <h2 className="text-lg font-bold text-primary mb-1 text-center">日本地図</h2>
      <p className="text-sm font-medium text-foreground/70 mb-3 text-center">
        都道府県をクリックすると該当エリアへ移動します
      </p>
      <div
        id="japan-map-container"
        ref={containerRef}
        className="svg-japan-wrapper w-full min-h-[280px] max-h-[50vh] [&_.svg-japan-container]:!h-full [&_.svg-japan-container]:!max-h-[50vh] [&_.svg-japan-container_svg]:max-h-[50vh] [&_.svg-japan-container_svg]:w-full [&_.svg-japan-container_svg]:h-auto [&_.svg-japan-container_svg]:object-contain"
        style={{ width: "100%", minHeight: 280 }}
      />
    </div>
  );
}
