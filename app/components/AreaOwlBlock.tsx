"use client";

import OwlCharacter from "./OwlCharacter";
// U8: フクロウコメント トーン統一 2026-03

/** 地域ページ用：モグ隊長（フクロウ）が粗大ゴミルールを解説するブロック（権威性・親しみ） */
export default function AreaOwlBlock({ cityName }: { cityName: string }) {
  return (
    <div className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
      <OwlCharacter
        size={80}
        message={`${cityName}の粗大ゴミの出し方は、自治体の案内で確認してみてね。`}
        tone="calm"
      />
    </div>
  );
}
