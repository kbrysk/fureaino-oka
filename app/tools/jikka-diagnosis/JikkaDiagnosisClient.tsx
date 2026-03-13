"use client";

import { useState } from "react";
import Link from "next/link";
import {
  JIKKA_DIAGNOSIS_QUESTIONS,
  getDiagnosisResult,
  buildLineShareUrl,
  buildParentLetter,
  type DiagnosisRank,
} from "../../lib/jikka-diagnosis";
import OwlCharacter from "../../components/OwlCharacter";
import DiagnosisAnimeIllustration from "../../components/DiagnosisAnimeIllustration";
import { PageLead } from "../../components/PageLead";
import { DiagnosisProgress } from "../../components/ui/DiagnosisProgress";
import DiagnosisResultLineCTA from "../../components/DiagnosisResultLineCTA";
import { RegionalCTASelector } from "../../components/RegionalCTASelector";
import { CtaButton } from "../../components/ui/CtaButton";
import { PrintResultButton } from "../../components/ui/PrintResultButton";
// U8: フクロウコメント トーン統一 2026-03

const RANK_STYLES: Record<DiagnosisRank, { bg: string; text: string; border: string }> = {
  S: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  A: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  B: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  C: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  D: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
};

type PrefectureOption = { id: string; name: string };

export default function JikkaDiagnosisClient({ prefectures }: { prefectures: PrefectureOption[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const totalQuestions = JIKKA_DIAGNOSIS_QUESTIONS.length;
  const isLastStep = step === totalQuestions - 1;
  const currentQ = JIKKA_DIAGNOSIS_QUESTIONS[step];

  const handleAnswer = (value: number) => {
    const next = [...answers, value];
    setAnswers(next);
    if (isLastStep) {
      const total = next.reduce((a, b) => a + b, 0);
      setResult(getDiagnosisResult(total));
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const [result, setResult] = useState<ReturnType<typeof getDiagnosisResult> | null>(null);

  if (done && result) {
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    const lineUrl = buildLineShareUrl(result.lineShareText, appUrl);
    const parentMessage = `お母さん、今の実家の状態を診断したら『危険度${result.rank}』だったよ。一緒にこのリスト（アプリ）で整理してみない？`;
    const parentLineUrl = buildLineShareUrl(parentMessage, appUrl);
    const parentLetter = buildParentLetter(result, appUrl);
    const letterLineUrl = buildLineShareUrl(parentLetter, appUrl);
    const style = RANK_STYLES[result.rank];

    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-primary">実家じまい力診断 結果</h1>
          <p className="text-foreground/60 mt-1">あなたの実家の危険度は…</p>
        </div>

        {/* U4: 結果をブラウザで常に表示（LINE登録不要） */}
        <div className={`rounded-2xl border-2 p-6 transition-all print-result ${style.bg} ${style.text} ${style.border}`}>
          <p className="text-sm font-medium opacity-80">診断結果</p>
          <p className="text-xl font-bold mt-1">危険度{result.rank}ランク</p>
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
          <p className="font-bold text-amber-900 mb-1">親御さんにそのまま送れる『実家の未来についてのお手紙』を生成しました</p>
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

        <div className="bg-primary-light rounded-2xl p-6 border-2 border-primary/30">
          <OwlCharacter size={90} message="この結果を親に送って、相談のきっかけにしてみて。" tone="calm" />
          <p className="text-sm text-foreground/60 mt-2 text-center">
            子供から親へ。結果を送って話し合いのきっかけに。
          </p>
          <CtaButton variant="secondary" href={parentLineUrl} className="mt-4 w-full sm:w-auto sm:inline-flex justify-center">
            親に送る（短文）
          </CtaButton>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
          <PrintResultButton toolName="実家じまい力診断" />
        </div>

        <RegionalCTASelector
          targetPage="subsidy"
          labelText="診断結果をもとに、お住まいの地域の補助金を確認しましょう"
          prefectures={prefectures}
        />

        <div className="flex flex-wrap gap-3">
          <Link href="/tools/empty-house-tax" className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition">
            空き家の維持費をシミュレーション
          </Link>
          <Link href="/articles/master-guide" className="inline-block bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition">
            はじめかたガイドを見る
          </Link>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setAnswers([]);
              setDone(false);
              setResult(null);
            }}
            className="inline-block text-foreground/60 text-sm hover:underline"
          >
            もう一度診断する
          </button>
        </div>

        <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
          ← ツール一覧へ
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-primary text-white rounded-2xl p-6 flex flex-wrap items-center gap-6 border-2 border-primary">
        <DiagnosisAnimeIllustration variant="jikka" size={100} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-white/80 text-sm mb-1">家族会議にそのまま使える</p>
          <h1 className="text-xl font-bold">【実家じまい力診断】</h1>
          <p className="text-white/90 text-sm mt-2">約10問で実家のリスク度がわかる。結果をLINEで親に送って会議を開こう</p>
        </div>
      </div>
      <PageLead text="約10問に答えるだけで、実家のリスクスコアと今すぐ取るべき対策がわかります。" />

      <div className="bg-card rounded-2xl border border-border p-6">
        <DiagnosisProgress current={step + 1} total={totalQuestions} />
        <h2 className="text-lg font-bold text-foreground/90 mb-4">{currentQ.label}</h2>
        <ul className="space-y-2">
          {currentQ.options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-primary-light hover:border-primary/40 transition"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Link href="/tools" className="inline-block text-foreground/50 text-sm hover:underline">
        ← ツール一覧へ
      </Link>
    </div>
  );
}
