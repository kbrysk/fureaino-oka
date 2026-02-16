"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AKIYA_RISK_QUESTIONS,
  getAkiyaRiskResult,
  buildLineShareUrl,
  buildParentLetter,
  type AkiyaRiskRank,
} from "../../lib/akiya-risk-diagnosis";
import DiagnosisAnimeIllustration from "../../components/DiagnosisAnimeIllustration";
import OwlCharacter from "../../components/OwlCharacter";
import DiagnosisResultLineCTA from "../../components/DiagnosisResultLineCTA";

const RANK_STYLES: Record<AkiyaRiskRank, { bg: string; text: string; border: string }> = {
  S: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  A: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  B: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  C: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  D: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
};

export default function AkiyaRiskPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getAkiyaRiskResult> | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const totalQuestions = AKIYA_RISK_QUESTIONS.length;
  const isLastStep = step === totalQuestions - 1;
  const currentQ = AKIYA_RISK_QUESTIONS[step];

  const handleAnswer = (value: number) => {
    const next = [...answers, value];
    setAnswers(next);
    if (isLastStep) {
      setResult(getAkiyaRiskResult(next.reduce((a, b) => a + b, 0)));
      setDone(true);
    } else setStep(step + 1);
  };

  if (done && result) {
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    const lineUrl = buildLineShareUrl(result.lineShareText, appUrl);
    const parentLetter = buildParentLetter(result, appUrl);
    const letterLineUrl = buildLineShareUrl(parentLetter, appUrl);
    const style = RANK_STYLES[result.rank];

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">空き家リスク診断 結果</h1>
          <p className="text-foreground/60 mt-1">あなたの実家の危険度は…</p>
        </div>

        {/* 結果をモザイク化：未アンロック時はぼかし＋ゲートキーパーモーダル */}
        <div className="relative">
          <div
            className={`rounded-2xl border-2 p-6 transition-all ${style.bg} ${style.text} ${style.border} ${!unlocked ? "select-none blur-md pointer-events-none" : ""}`}
          >
            <p className="text-sm font-medium opacity-80">診断結果</p>
            <p className="text-xl font-bold mt-1">リスク{result.rank}ランク</p>
            <h2 className="text-lg font-bold mt-4">{result.title}</h2>
            <p className="mt-3 text-sm leading-relaxed opacity-90">{result.message}</p>
          </div>

          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80">
              <div className="bg-card border-2 border-primary rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl text-center space-y-4">
                <p className="font-bold text-primary text-lg">
                  詳細な診断レポートと対策PDFをLINEで受け取る（自分用に保存）
                </p>
                <a
                  href="/guide?intent=line_report"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setUnlocked(true)}
                  className="flex items-center justify-center gap-2 w-full bg-[#06C755] text-white px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
                >
                  <span className="text-2xl">LINE</span>
                  自分が結果を受け取る
                </a>
                <p className="text-xs text-foreground/50">受け取ったあと、このページで全文を確認できます</p>
                <hr className="border-border" />
                <p className="text-sm text-foreground/60">親に送りたい場合</p>
                <a
                  href={letterLineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#06C755] text-[#06C755] font-medium hover:bg-[#06C755]/10 transition"
                >
                  LINEで親に送る（お手紙）
                </a>
              </div>
            </div>
          )}
        </div>

        <DiagnosisResultLineCTA />

        {unlocked && (
          <>
            {/* 親御さんにそのまま送れる「お手紙」 */}
            <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
              <p className="font-bold text-amber-900 mb-1">親御さんにそのまま送れる『空き家の未来についてのお手紙』を生成しました</p>
              <p className="text-sm text-amber-800/80 mb-3">コピーまたはLINEでそのまま送れます。</p>
              <div className="bg-white rounded-xl p-4 border border-amber-100 text-sm text-foreground/80 whitespace-pre-wrap mb-4 max-h-48 overflow-y-auto">
                {parentLetter}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(parentLetter)}
                  className="px-4 py-2 rounded-xl border-2 border-amber-400 text-amber-800 font-medium hover:bg-amber-100 transition"
                >
                  コピーする
                </button>
                <a href={letterLineUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#06C755] text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition">
                  LINEで送る
                </a>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-6 text-white">
              <OwlCharacter size={70} message="結果を家族に送って、話し合いのきっかけにしよう" tone="calm" />
              <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 bg-[#06C755] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
                <span className="text-xl">LINE</span> 結果を家族に送る
              </a>
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/tools/empty-house-tax" className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light transition">空き家の維持費をシミュレーション</Link>
          <Link href="/tools" className="inline-block text-primary font-medium hover:underline">← ツール一覧へ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary text-white rounded-2xl p-6 flex flex-wrap items-center gap-6 border-2 border-primary">
        <DiagnosisAnimeIllustration variant="akiya" size={100} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-white/80 text-sm mb-1">家族会議にそのまま使える</p>
          <h1 className="text-xl font-bold">【空き家リスク診断】</h1>
          <p className="text-white/90 text-sm mt-2">約8問で実家が空き家予備軍かがわかる。結果をLINEで送って会議を開こう</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6">
        <p className="text-sm text-foreground/50 mb-2">{step + 1} / {totalQuestions}</p>
        <div className="w-full bg-border rounded-full h-2 mb-6">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((step + 1) / totalQuestions) * 100}%` }} />
        </div>
        <h2 className="text-lg font-bold text-foreground/90 mb-4">{currentQ.label}</h2>
        <ul className="space-y-2">
          {currentQ.options.map((opt) => (
            <li key={opt.value}>
              <button type="button" onClick={() => handleAnswer(opt.value)} className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-primary-light hover:border-primary/40 transition">
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/tools" className="inline-block text-foreground/50 text-sm hover:underline">← ツール一覧へ</Link>
    </div>
  );
}
