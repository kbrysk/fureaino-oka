"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DIGITAL_SHAME_QUESTIONS,
  getShameResult,
  type ShameResult,
} from "../../lib/digital-shame-diagnosis";

function buildShareUrl(result: ShameResult): string {
  const text = encodeURIComponent(
    `私のデジタル遺品リスクは...【${result.shareLabel}】でした💀 あなたのスマホは大丈夫？ #デジタル遺品隠滅シミュレーター #ふれあいの丘`
  );
  return `https://twitter.com/intent/tweet?text=${text}`;
}

export default function DigitalShamePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const totalQ = DIGITAL_SHAME_QUESTIONS.length;
  const isLast = step === totalQ - 1;
  const current = DIGITAL_SHAME_QUESTIONS[step];

  const handleAnswer = (value: number) => {
    const next = [...answers, value];
    setAnswers(next);
    if (isLast) setDone(true);
    else setStep(step + 1);
  };

  if (done && answers.length === totalQ) {
    const total = answers.reduce((a, b) => a + b, 0);
    const result = getShameResult(total);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">デジタル遺品リスク診断 結果</h1>
          <p className="text-foreground/60 mt-1">あなたの「見られたくないデータ」リスクを診断しました</p>
        </div>

        <div className="rounded-2xl border-2 border-primary/40 bg-card p-6">
          <p className="text-2xl font-bold text-primary mb-2">{result.title}</p>
          <p className="text-foreground/70 mb-4">Shame Score: {result.score}点</p>
          <p className="text-foreground/80 leading-relaxed">{result.message}</p>
        </div>

        <div className="bg-primary rounded-2xl p-6 text-white text-center">
          <p className="font-bold mb-4">X（Twitter）で結果をシェア</p>
          <a
            href={buildShareUrl(result)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
          >
            Xで結果をシェアする
          </a>
          <p className="text-xs text-white/60 mt-2">#デジタル遺品隠滅シミュレーター #ふれあいの丘</p>
        </div>

        <div className="bg-primary-light/50 rounded-2xl border border-primary/30 p-6">
          <p className="font-bold text-primary mb-2">「見られたくないデータ」を守るには</p>
          <p className="text-sm text-foreground/70 mb-4">
            無料のデジタルエンディングノートに、パスワードの扱いや「消してほしいもの」を記録しておくと、家族が迷わず対応できます。
          </p>
          <Link
            href="/ending-note"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90"
          >
            エンディングノートでパスワード処理方法を記録する
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => { setStep(0); setAnswers([]); setDone(false); }}
            className="text-foreground/50 text-sm hover:underline"
          >
            もう一度診断する
          </button>
          <Link href="/tools" className="text-primary font-medium hover:underline">← ツール一覧へ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">デジタル遺品リスク診断</h1>
        <p className="text-foreground/60 mt-1">スマホやPCに残った「見られたくないデータ」のリスクを、ちょっとユーモラスに診断します。</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <p className="text-sm text-foreground/50 mb-2">{step + 1} / {totalQ}</p>
        <div className="w-full bg-border rounded-full h-2 mb-6">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((step + 1) / totalQ) * 100}%` }} />
        </div>
        <h2 className="text-lg font-bold mb-4">{current.label}</h2>
        <ul className="space-y-2">
          {current.options.map((opt) => (
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

      <Link href="/tools" className="inline-block text-foreground/50 text-sm hover:underline">← ツール一覧へ</Link>
    </div>
  );
}
