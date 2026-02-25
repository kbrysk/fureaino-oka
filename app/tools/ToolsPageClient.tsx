"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolCardIcon from "../components/ToolCardIcon";
import { useToolsHub } from "../hooks/useToolsHub";
import {
  TOOLS,
  getRecommendedToolIds,
  type ToolItemWithRecommended,
  type TriageAnswers,
  type TriageQ1,
  type TriageQ2,
  type TriageQ3,
} from "../lib/tools-data";

/** 診断系ツールは「診断済」、それ以外は「完了」バッジを表示 */
function isDiagnosisTool(id: string): boolean {
  return ["jikka-diagnosis", "akiya-risk", "digital-shame", "souzoku-prep"].includes(id);
}

const OWL_IMAGE = "/images/owl-character.png";

const Q1_OPTIONS: { value: TriageQ1; label: string }[] = [
  { value: "親が健在", label: "親が健在" },
  { value: "施設・入院中", label: "施設・入院中" },
  { value: "すでに亡くなった", label: "すでに亡くなった" },
];

const Q2_OPTIONS: { value: TriageQ2; label: string }[] = [
  { value: "住んでいる", label: "住んでいる" },
  { value: "空き家", label: "空き家" },
  { value: "売却・解体予定", label: "売却・解体予定" },
];

const Q3_OPTIONS: { value: TriageQ3; label: string }[] = [
  { value: "まだ何もしていない", label: "まだ何もしていない" },
  { value: "少し始めた", label: "少し始めた" },
  { value: "だいたい済んだ", label: "だいたい済んだ" },
];

export default function ToolsPageClient() {
  const {
    isMounted,
    completedTools,
    triageAnswers,
    setTriageAnswers,
    isTriageComplete,
  } = useToolsHub();
  const [triageExpanded, setTriageExpanded] = useState(true);

  const recommendedIds = useMemo(
    () => (isMounted && isTriageComplete ? getRecommendedToolIds(triageAnswers) : []),
    [isMounted, isTriageComplete, triageAnswers]
  );

  const sortedTools = useMemo((): ToolItemWithRecommended[] => {
    const list = [...TOOLS];
    if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
      return list.map((t) => ({ ...t, isRecommended: false }));
    }
    const withRec: ToolItemWithRecommended[] = list.map((t) => ({
      ...t,
      isRecommended: recommendedIds.includes(t.id),
    }));
    withRec.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return 0;
    });
    return withRec;
  }, [recommendedIds]);

  const handleTriageChange = (key: keyof TriageAnswers, value: TriageAnswers[keyof TriageAnswers]) => {
    setTriageAnswers({ ...triageAnswers, [key]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">無料ツール</h1>
        <p className="text-foreground/60 mt-1">
          生前整理の進捗や資産の目安を可視化するツールです。
        </p>
      </div>

      {/* 10秒トリアージ */}
      <section className="bg-primary-light/40 border border-primary/20 rounded-xl p-6 mb-8">
        {!isMounted ? (
          <div className="animate-pulse h-24 bg-primary-light/30 rounded-lg" aria-hidden />
        ) : isTriageComplete && !triageExpanded ? (
          <div>
            <button
              type="button"
              onClick={() => setTriageExpanded(true)}
              className="w-full text-left flex items-center justify-between gap-2 text-primary font-medium"
            >
              <span>✅ 診断完了：あなたに今必要なツールをピックアップしました</span>
              <span className="shrink-0">▼ 再診断する</span>
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-primary mb-4">10秒で診断：今必要なツールをピックアップ</h2>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-foreground/90 mb-2">Q1. 現在の状況は？</p>
                <div className="flex flex-wrap gap-2">
                  {Q1_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => handleTriageChange("q1", o.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                        triageAnswers.q1 === o.value
                          ? "bg-primary text-white border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/90 mb-2">Q2. ご実家は？</p>
                <div className="flex flex-wrap gap-2">
                  {Q2_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => handleTriageChange("q2", o.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                        triageAnswers.q2 === o.value
                          ? "bg-primary text-white border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/90 mb-2">Q3. 相続の準備は？</p>
                <div className="flex flex-wrap gap-2">
                  {Q3_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => handleTriageChange("q3", o.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                        triageAnswers.q3 === o.value
                          ? "bg-primary text-white border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {isTriageComplete && (
              <button
                type="button"
                onClick={() => setTriageExpanded(false)}
                className="mt-4 text-sm text-primary font-medium hover:underline"
              >
                診断を確定してツール一覧を更新
              </button>
            )}
          </>
        )}
      </section>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTools.map((t) => {
          const isCompleted = isMounted && completedTools.includes(t.id);
          return (
            <li key={t.slug}>
              <Link
                href={t.href}
                className={`flex gap-4 bg-card rounded-2xl p-5 border transition overflow-hidden relative ${
                  t.isRecommended
                    ? "border-primary/50 ring-2 ring-primary/30 hover:shadow-lg hover:border-primary/40"
                    : "border-border hover:shadow-lg hover:border-primary/40"
                }`}
              >
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                  {t.isRecommended && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      🔥 今すぐやるべき
                    </span>
                  )}
                  {isCompleted && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      {isDiagnosisTool(t.id) ? "💮 診断済" : "✅ 完了"}
                    </span>
                  )}
                </div>
                <ToolCardIcon slug={t.slug} />
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h2 className="font-bold text-base text-primary leading-tight">{t.title}</h2>
                  <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{t.description}</p>
                </div>
                <div className="hidden sm:flex shrink-0 self-center w-10 h-10 rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={OWL_IMAGE} alt="" width={28} height={28} className="object-contain w-7 h-7" aria-hidden />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* トピッククラスター：はじめかた・費用・捨て方への送客 */}
      <section className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-3">あわせて読む</h2>
        <p className="text-sm text-foreground/70 mb-4">
          進め方の全体像、間取り別の費用相場、品目別の捨て方は以下のページでまとめています。
        </p>
        <ul className="grid gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/guide"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              実家じまいの進め方 全手順
            </Link>
          </li>
          <li>
            <Link
              href="/cost"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              間取り別 遺品整理費用相場
            </Link>
          </li>
          <li>
            <Link
              href="/dispose"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              捨て方辞典（品目別）
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
