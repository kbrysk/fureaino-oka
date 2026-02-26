"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  type InheritanceInputPattern,
  calculateInheritanceShares,
  getInheritanceRiskLevel,
} from "../../lib/inheritance-share";

const COLORS = ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#b7e4c7", "#d8f3dc"];

/** recharts を遅延読み込み。CLS 防止のため実コンポーネントと同高さ（h-64 md:h-80 = 320px）でスケルトン */
const InheritanceShareChart = dynamic(
  () => import("./InheritanceShareChart").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 md:h-80 min-h-[256px] rounded-xl bg-muted/30 flex items-center justify-center" aria-hidden>
        <span className="text-foreground/50 text-sm">グラフを準備しています…</span>
      </div>
    ),
  }
);

const defaultInput: InheritanceInputPattern = {
  step: 1,
  hasSpouse: false,
  childrenCount: 0,
  hasDirectAscendants: false,
  siblingsCount: 0,
};

export default function InheritanceSharePage() {
  const [input, setInput] = useState<InheritanceInputPattern>(defaultInput);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const maxStep = 4;
  const canProceed =
    (step === 1) ||
    (step === 2) ||
    (step === 3 && (input.childrenCount > 0 || input.hasDirectAscendants !== undefined)) ||
    (step === 4);

  const handleNext = () => {
    if (step < maxStep) setStep(step + 1);
    else {
      setInput((prev) => ({ ...prev, step: maxStep, submittedAt: new Date().toISOString() }));
      setDone(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const shares = done ? calculateInheritanceShares(input) : [];
  const riskLevel = done ? getInheritanceRiskLevel(input) : null;
  const chartData = shares.map((s, i) => ({ name: s.label, value: s.percent, color: COLORS[i % COLORS.length] }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">法定相続分 シミュレーター</h1>
        <p className="text-foreground/60 mt-1">家族構成を入力すると、民法に基づく法定相続分を円グラフで表示します。</p>
        <div className="mt-4 p-4 rounded-xl bg-primary-light/30 border border-primary/30">
          <p className="text-sm font-bold text-primary mb-1">このシミュレーターは誰が使うもの？</p>
          <p className="text-sm text-foreground/80">
            <strong>ご自身（生前整理をする方）</strong>が亡くなった場合を想定しています。「ご自身の配偶者・子・親・兄弟」の有無を入力すると、<strong>ご自身が亡くなったときの相続人</strong>とその割合がわかります。
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            親の相続分を知りたい場合は、親の家族構成（親の配偶者・子の人数など）を入力してください。
          </p>
        </div>
      </div>

      {!done ? (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <p className="text-sm text-foreground/50">{step} / {maxStep}</p>
          <p className="text-xs text-foreground/40">※ ご自身（または相続分を知りたい方）の家族構成を入力しています</p>
          <div className="w-full bg-border rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(step / maxStep) * 100}%` }} />
          </div>

          {step === 1 && (
            <div>
              <h2 className="font-bold text-lg mb-4">配偶者はいますか？</h2>
              <p className="text-sm text-foreground/50 mb-3">ご自身の配偶者（亡くなったときの相続人になる方）の有無です。</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setInput((p) => ({ ...p, hasSpouse: true })); handleNext(); }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-primary bg-primary-light/30 text-primary font-medium hover:opacity-90"
                >
                  いる
                </button>
                <button
                  type="button"
                  onClick={() => { setInput((p) => ({ ...p, hasSpouse: false })); handleNext(); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-primary-light/20"
                >
                  いない
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-bold text-lg mb-4">子供の人数は？（養子含む）</h2>
              <p className="text-sm text-foreground/50 mb-3">ご自身の子（実子・養子）の人数です。</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setInput((p) => ({ ...p, childrenCount: n })); handleNext(); }}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                      input.childrenCount === n ? "border-primary bg-primary-light/30 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {n}人
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && input.childrenCount === 0 && (
            <div>
              <h2 className="font-bold text-lg mb-4">両親・祖父母（直系尊属）は存命ですか？</h2>
              <p className="text-sm text-foreground/50 mb-3">ご自身の父母・祖父母の有無です。相続人になる直系尊属がいるかどうかです。</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setInput((p) => ({ ...p, hasDirectAscendants: true })); handleNext(); }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-primary bg-primary-light/30 text-primary font-medium hover:opacity-90"
                >
                  いる
                </button>
                <button
                  type="button"
                  onClick={() => { setInput((p) => ({ ...p, hasDirectAscendants: false })); handleNext(); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-primary-light/20"
                >
                  いない
                </button>
              </div>
            </div>
          )}

          {step === 3 && input.childrenCount > 0 && (
            <div>
              <p className="text-foreground/70 mb-4">子供がいるため、直系尊属・兄弟姉妹の入力はスキップします。</p>
              <button type="button" onClick={() => setDone(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90">
                結果を見る
              </button>
            </div>
          )}

          {step === 4 && input.childrenCount === 0 && !input.hasDirectAscendants && (
            <div>
              <h2 className="font-bold text-lg mb-4">兄弟姉妹の人数は？</h2>
              <p className="text-sm text-foreground/50 mb-3">ご自身の兄弟姉妹の人数です（相続人になる方）。</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setInput((p) => ({ ...p, siblingsCount: n })); setDone(true); }}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                      input.siblingsCount === n ? "border-primary bg-primary-light/30 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {n}人
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && input.childrenCount === 0 && input.hasDirectAscendants && (
            <div>
              <p className="text-foreground/70 mb-4">直系尊属がいるため、兄弟姉妹の相続分はありません。</p>
              <button type="button" onClick={() => setDone(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90">
                結果を見る
              </button>
            </div>
          )}

          {step > 1 && !done && (
            <button type="button" onClick={handleBack} className="text-foreground/50 text-sm hover:underline">
              ← 戻る
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="p-4 rounded-xl bg-primary-light/20 border border-primary/20 mb-4">
            <p className="text-sm font-bold text-primary">表示している結果について</p>
            <p className="text-sm text-foreground/70 mt-1">
              これは<strong>ご自身（入力した方）が亡くなった場合</strong>の法定相続分の割合です。相続人となる方（配偶者・子・直系尊属・兄弟姉妹）が、それぞれ遺産の何割を相続するかの民法上の目安です。実際の遺産分割では遺言や話し合いで変わる場合があります。
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">法定相続分（割合）</h2>
            <div className="h-64 md:h-80 min-h-[256px]">
              <InheritanceShareChart chartData={chartData} />
            </div>
            <ul className="mt-4 space-y-1 text-sm text-foreground/70">
              {shares.map((s) => (
                <li key={s.label}>{s.label}: {s.percent}%</li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
              <Link
                href="/guide?source=inheritance_will_kit"
                className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
              >
                この配分を実現するための「遺言書キット」を見る
              </Link>
              <Link
                href="/guide?source=inheritance_expert"
                className="inline-block border-2 border-primary text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-light/20"
              >
                専門家に相談する
              </Link>
            </div>
          </div>

          {riskLevel === "high" && (
            <div className="rounded-2xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600 dark:text-amber-200 p-5 text-amber-900">
              <p className="font-bold">遺言書がないと揉める可能性が高いパターンです</p>
              <p className="text-sm mt-1">兄弟姉妹が相続人になる場合や、相続人が多い場合、遺言がないとトラブルになりやすいです。早めの相談をおすすめします。</p>
              <Link
                href="/guide?source=inheritance_complex"
                className="mt-4 inline-block bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
              >
                司法書士・行政書士への無料相談（提携）
              </Link>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ending-note"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90"
            >
              あなたの家系図を保存する（エンディングノートへ）
            </Link>
            <button
              type="button"
              onClick={() => { setStep(1); setDone(false); setInput(defaultInput); }}
              className="inline-block border border-border px-4 py-2 rounded-xl text-sm hover:bg-primary-light/20"
            >
              もう一度計算する
            </button>
          </div>
        </>
      )}

      <Link href="/tools" className="inline-block text-primary font-medium hover:underline">← ツール一覧へ</Link>
    </div>
  );
}
