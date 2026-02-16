"use client";

import { useState, useEffect } from "react";

interface SenryuCardProps {
  id: string;
  text: string;
}

/**
 * 川柳1句 + 共感ボタン（わかる！ / 座布団一枚！）
 * クリックでローカルに記録し、押した状態を表示
 */
export default function SenryuCard({ id, text }: SenryuCardProps) {
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
    setPressed((prev) => (prev === "wakaru" ? null : "wakaru"));
    try {
      if (pressed === "wakaru") localStorage.removeItem(`senryu_${id}`);
      else localStorage.setItem(`senryu_${id}`, "wakaru");
    } catch {
      /* ignore */
    }
  };

  const handleZabuton = () => {
    setPressed((prev) => (prev === "zabuton" ? null : "zabuton"));
    try {
      if (pressed === "zabuton") localStorage.removeItem(`senryu_${id}`);
      else localStorage.setItem(`senryu_${id}`, "zabuton");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-center text-lg font-medium text-foreground/90 leading-relaxed tracking-wide" style={{ fontFamily: "serif" }}>
        {text}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
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
      </div>
    </div>
  );
}
