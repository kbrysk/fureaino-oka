"use client";

import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  /** デジタル遺品・口座などセキュリティ演出用。伏せ字表示＋「表示する」で切り替え */
}

export default function MaskedInput({
  value,
  onChange,
  placeholder,
  className = "",
  label,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-foreground/70">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={visible ? placeholder : "●●●●●●●●"}
          autoComplete="off"
          className={`flex-1 border border-border rounded-lg px-3 py-2 bg-white text-sm font-mono ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="text-xs text-primary font-medium whitespace-nowrap px-2 py-1.5 border border-primary/30 rounded-lg hover:bg-primary/5 transition"
        >
          {visible ? "隠す" : "表示する"}
        </button>
      </div>
      <p className="text-[10px] text-foreground/40">
        {visible ? "入力内容がそのまま表示されています" : "入力内容は伏せ字で表示されています"}
      </p>
    </div>
  );
}
