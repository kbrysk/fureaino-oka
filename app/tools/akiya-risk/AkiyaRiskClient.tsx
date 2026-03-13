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
import { PageLead } from "../../components/PageLead";
import { DiagnosisProgress } from "../../components/ui/DiagnosisProgress";
import DiagnosisResultLineCTA from "../../components/DiagnosisResultLineCTA";
import { RegionalCTASelector } from "../../components/RegionalCTASelector";
import { CtaButton } from "../../components/ui/CtaButton";
import { PrintResultButton } from "../../components/ui/PrintResultButton";

const RANK_STYLES: Record<AkiyaRiskRank, { bg: string; text: string; border: string }> = {
  S: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  A: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  B: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  C: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  D: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
};

type PrefectureOption = { id: string; name: string };

export default function AkiyaRiskClient({ prefectures }: { prefectures: PrefectureOption[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getAkiyaRiskResult> | null>(null);

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
      <div className="space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-primary">空き家リスク診断 結果</h1>
          <p className="text-foreground/60 mt-1">あなたの実家の危険度は…</p>
        </div>

        {/* U4: 結果をブラウザで常に表示（LINE登録不要） */}
        <div className={`rounded-2xl border-2 p-6 transition-all print-result ${style.bg} ${style.text} ${style.border}`}>
          <p className="text-sm font-medium opacity-80">診断結果</p>
          <p className="text-xl font-bold mt-1">リスク{result.rank}ランク</p>
          <h2 className="text-lg font-bold mt-4">{result.title}</h2>
          <p className="mt-3 text-sm leading-relaxed opacity-90">{result.message}</p>
        </div>

        <p className="text-sm text-gray-500 text-center">※ 結果はこのページで確認できます。LINEシェアは任意です。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
          <CtaButton variant="secondary" href={lineUrl}>
            LINEで家族にシェアする（任意）
          </CtaButton>
        </div>

        <DiagnosisResultLineCTA />

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
          <CtaButton variant="secondary" href={lineUrl} className="mt-4">
            結果を家族に送る
          </CtaButton>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
          <PrintResultButton toolName="空き家リスク診断" />
        </div>

        <RegionalCTASelector
          targetPage="subsidy"
          labelText="空き家リスクを解消するための補助金をお住まいの地域で確認しましょう"
          prefectures={prefectures}
        />

        <div className="flex flex-wrap gap-3">
          <Link href="/tools/empty-house-tax" className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light transition">空き家の維持費をシミュレーション</Link>
          <Link href="/tools" className="inline-block text-primary font-medium hover:underline">← ツール一覧へ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-primary text-white rounded-2xl p-6 flex flex-wrap items-center gap-6 border-2 border-primary">
        <DiagnosisAnimeIllustration variant="akiya" size={100} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-white/80 text-sm mb-1">家族会議にそのまま使える</p>
          <h1 className="text-xl font-bold">【空き家リスク診断】</h1>
          <p className="text-white/90 text-sm mt-2">約8問で実家が空き家予備軍かがわかる。結果をLINEで送って会議を開こう</p>
        </div>
      </div>
      <PageLead text="約8問に答えるだけで、空き家を放置した場合のリスクと対策がわかります。" />

      <div className="bg-card rounded-2xl border border-border p-6">
        <DiagnosisProgress current={step + 1} total={totalQuestions} />
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
