"use client";

import { useCallback } from "react";

const OWL_IMAGE = "/images/owl-character.png?v=4";

interface TriageOption {
  label: string;
  targetId: string;
}

const OPTIONS: TriageOption[] = [
  {
    label: "まだ元気だけど、将来に向けて家族で準備や話し合いを始めたい",
    targetId: "step-1",
  },
  {
    label: "そろそろ本格的にモノの整理・リストアップを始めたい",
    targetId: "step-2",
  },
  {
    label: "すでに誰も住んでいない空き家がある・実家を処分したい",
    targetId: "step-4",
  },
];

function scrollToStep(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function GuideTriage() {
  const handleClick = useCallback((targetId: string) => {
    scrollToStep(targetId);
  }, []);

  return (
    <section
      className="bg-primary-light/40 border border-primary/20 rounded-xl p-5 sm:p-6 mb-8"
      aria-labelledby="guide-triage-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex shrink-0 items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-primary-light/50 border border-primary/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={OWL_IMAGE}
            alt=""
            width={64}
            height={64}
            className="w-full h-full object-contain"
            aria-hidden
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 id="guide-triage-heading" className="font-bold text-primary text-lg mb-4">
            実家じまいや生前整理、何から手をつけていいか不安だよね。キミの今の状況を教えてほしいホゥ！
          </h2>
          <ul className="space-y-3">
            {OPTIONS.map((opt) => (
              <li key={opt.targetId}>
                <button
                  type="button"
                  onClick={() => handleClick(opt.targetId)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border bg-card hover:bg-primary-light/50 hover:border-primary/30 transition-colors text-sm font-medium text-foreground/90"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
