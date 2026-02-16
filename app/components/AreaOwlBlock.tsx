"use client";

import OwlCharacter from "./OwlCharacter";

/** 地域ページ用：モグ隊長（フクロウ）が粗大ゴミルールを解説するブロック（権威性・親しみ） */
export default function AreaOwlBlock({ cityName }: { cityName: string }) {
  return (
    <div className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
      <OwlCharacter
        size={80}
        message={`${cityName}の粗大ゴミルールをモグ隊長（フクロウ）が解説！`}
        tone="calm"
      />
    </div>
  );
}
