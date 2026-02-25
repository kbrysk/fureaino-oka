"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { SenryuSolutionLink } from "../lib/senryu-data";
import { baseUrl } from "../lib/constants/site-metadata";

interface SenryuCardProps {
  id: string;
  text: string;
  solutionLink?: SenryuSolutionLink | null;
  onVote?: (id: string, type: "wakaru" | "zabuton" | null) => void;
}

/**
 * 川柳1句 + 共感ボタン（わかる！ / 座布団一枚！）+ LINEシェア + 文脈リンク
 */
export default function SenryuCard({ id, text, solutionLink, onVote }: SenryuCardProps) {
  const [pressed, setPressed] = useState<"wakaru" | "zabuton" | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`senryu_${id}`);
      if (raw === "wakaru" || raw === "zabuton") setPressed(raw);
    } catch {
      /* ignore */
    }
  }, [id]);

  const handleWakaru = () => {
    const next = pressed === "wakaru" ? null : "wakaru";
    setPressed(next);
    try {
      if (next === null) localStorage.removeItem(`senryu_${id}`);
      else localStorage.setItem(`senryu_${id}`, "wakaru");
    } catch {
      /* ignore */
    }
    onVote?.(id, next);
  };

  const handleZabuton = () => {
    const next = pressed === "zabuton" ? null : "zabuton";
    setPressed(next);
    try {
      if (next === null) localStorage.removeItem(`senryu_${id}`);
      else localStorage.setItem(`senryu_${id}`, "zabuton");
    } catch {
      /* ignore */
    }
    onVote?.(id, next);
  };

  const lineMessage = `【実家じまい川柳】\n「${text ?? ""}」\n\nこれ、うちの実家あるあるじゃない？笑 そろそろウチも片付けのこと話さない？👇\n${baseUrl ?? ""}`;
  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(lineMessage)}`;

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-center text-lg font-medium text-foreground/90 leading-relaxed tracking-wide" style={{ fontFamily: "serif" }}>
        {text}
      </p>
      <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
        <button
          type="button"
          onClick={handleWakaru}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            pressed === "wakaru"
              ? "bg-primary text-white"
              : "bg-primary-light/50 text-primary hover:bg-primary-light border border-primary/20"
          }`}
        >
          わかる！（共感）
        </button>
        <button
          type="button"
          onClick={handleZabuton}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            pressed === "zabuton"
              ? "bg-amber-500 text-white"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
          }`}
        >
          座布団一枚！
        </button>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
          style={{ backgroundColor: "#06C755" }}
        >
          <span aria-hidden>💬</span>
          LINEで家族に送る
        </a>
      </div>
      {solutionLink?.text != null && solutionLink?.url != null && solutionLink.text !== "" && solutionLink.url !== "" && (
        <Link
          href={solutionLink.url}
          className="mt-3 block text-center text-sm text-primary bg-primary-light/50 hover:bg-primary-light p-2 rounded border border-primary/10 transition-colors"
        >
          💡 ヒント: {solutionLink.text} →
        </Link>
      )}
    </div>
  );
}
