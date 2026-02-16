"use client";

import { useState } from "react";

interface Props {
  value: string;
  label?: string;
}

export default function MaskedText({ value, label }: Props) {
  const [visible, setVisible] = useState(false);

  if (!value) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      {label && <span className="text-foreground/40">{label}:</span>}
      <span className="font-mono text-sm">
        {visible ? value : "●".repeat(Math.min(value.length, 12))}
      </span>
      <button
        onClick={() => setVisible(!visible)}
        className="text-xs text-primary hover:underline"
      >
        {visible ? "隠す" : "表示"}
      </button>
    </span>
  );
}
