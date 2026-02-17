"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getChecklist,
  getAssets,
  getEndingNote,
  getTotalEstimatedValue,
  getCompletionRate,
  getReminderSettings,
} from "./lib/storage";
import EmailCTA from "./components/EmailCTA";
import LineCTA from "./components/LineCTA";
import EmptyHouseTaxSimulator from "./components/EmptyHouseTaxSimulator";
import OwlCharacter from "./components/OwlCharacter";
import OwlAizuchi from "./components/OwlAizuchi";
import ToolCardIcon from "./components/ToolCardIcon";
import UserTestimonialsSlider from "./components/UserTestimonialsSlider";

const OWL_IMAGE = "/images/owl-character.png";

/** 無料ツールカード：無料バッジ＋オレンジCTAでツール感を出す */
function ToolCard({
  slug,
  lead,
  title,
  sub,
  ctaLabel,
  children,
}: {
  slug: string;
  lead: string;
  title: string;
  sub: string;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={slug}
      className="group relative block bg-primary text-white rounded-2xl p-5 hover:opacity-95 hover:shadow-xl transition shadow-lg border-2 border-primary text-center"
    >
      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold text-white backdrop-blur-sm" aria-label="無料で利用可能">無料</span>
      <div className="flex justify-center mb-2">
        <span className="inline-block w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition text-white">
          {children}
        </span>
      </div>
      <p className="text-sm text-white/80 mb-0.5">{lead}</p>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-white/80 mt-1">{sub}</p>
      <span className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white group-hover:bg-accent/90 transition">
        {ctaLabel}
        <span className="inline-block transition group-hover:translate-x-0.5" aria-hidden>→</span>
      </span>
    </Link>
  );
}

function formatAmount(amount: number): string {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}億円`;
  if (amount >= 10_000) return `${Math.round(amount / 10_000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

export default function Home() {
  const [stats, setStats] = useState({
    checkTotal: 0,
    checkDone: 0,
    assetCount: 0,
    totalValue: 0,
    completionRate: 0,
    appraisalCount: 0,
    noteProgress: 0,
    needsReview: false,
    lastReviewDate: "",
  });

  useEffect(() => {
    const checklist = getChecklist();
    const assets = getAssets();
    const note = getEndingNote();
    const reminder = getReminderSettings();

    const noteFilled = [note.message, note.medicalWishes, note.funeralWishes, note.importantDocs].filter(
      (v) => v.trim().length > 0
    ).length;

    // Check if review is needed
    let needsReview = false;
    if (reminder.enabled && reminder.lastReviewDate) {
      const last = new Date(reminder.lastReviewDate);
      const now = new Date();
      const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
      const thresholds = { monthly: 30, quarterly: 90, yearly: 365 };
      needsReview = diffDays > thresholds[reminder.frequency];
    }

    setStats({
      checkTotal: checklist.length,
      checkDone: checklist.filter((i) => i.checked).length,
      assetCount: assets.length,
      totalValue: getTotalEstimatedValue(),
      completionRate: getCompletionRate(),
      appraisalCount: assets.filter((a) => a.wantsAppraisal).length,
      noteProgress: Math.round((noteFilled / 4) * 100),
      needsReview,
      lastReviewDate: reminder.lastReviewDate,
    });
  }, []);

  const checkPercent =
    stats.checkTotal > 0 ? Math.round((stats.checkDone / stats.checkTotal) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero：フクロウ＋トータルサポート訴求＋3ステップカード＋CTA（スマホでコンパクトに） */}
      <section className="w-full rounded-2xl bg-gradient-to-b from-primary-light/15 to-primary-light/5 border border-primary/10 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 sm:gap-6 text-center">
          <p className="inline-flex items-center rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold tracking-wide text-amber-800 bg-amber-100 border border-amber-300/80" aria-hidden>
            完全無料
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
            モノの整理だけでなく、心の整理も。<br className="hidden sm:inline" />
            エンディングノートから始まる生前整理。
          </h1>
          <p className="text-foreground/80 text-sm sm:text-base md:text-lg max-w-2xl">
            『何から始める？』の計画作りから、実家の片付け、不動産売却まで。あなたのペースで進めるトータルサポート。
          </p>

          {/* フクロウと吹き出し：横並び（スマホでは小さめでフローが見切れないように） */}
          <div className="w-full flex flex-row flex-nowrap justify-center items-center gap-0 sm:gap-3">
            <OwlCharacter
              size={72}
              message="まずは「考える」からで大丈夫。一歩ずつ、ふれあいの丘がサポートするホー！"
              tone="calm"
              bubblePosition="right"
              className="shrink-0"
            />
          </div>

          {/* 3つのサービス領域（Stepカード＋矢印） */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 w-full mt-2 sm:mt-4">
            {/* Step 1 */}
            <div className="relative flex-1 flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
              <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">Step 1</span>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
                <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0" aria-hidden>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </span>
                <h2 className="font-bold text-primary text-sm sm:text-base md:text-lg">【考える】エンディングノート</h2>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                自分の想いや資産を整理。デジタル版ノートや書き方ガイドで、将来の不安を解消します。
              </p>
              <Link href="/ending-note" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                エンディングノートを書く <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="hidden sm:flex items-center justify-center shrink-0 text-primary/40" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </div>

            {/* Step 2 */}
            <div className="relative flex-1 flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
              <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">Step 2</span>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
                <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0" aria-hidden>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </span>
                <h2 className="font-bold text-primary text-sm sm:text-base md:text-lg">【片付ける】生前整理・遺品整理</h2>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                体力があるうちの整理も、親族の遺品整理も。プロの選別で大切な思い出を守ります。
              </p>
              <Link href="/area" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                地域別の案内を見る <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="hidden sm:flex items-center justify-center shrink-0 text-primary/40" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </div>

            {/* Step 3 */}
            <div className="relative flex-1 flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
              <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">Step 3</span>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
                <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0" aria-hidden>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </span>
                <h2 className="font-bold text-primary text-sm sm:text-base md:text-lg">【解決する】実家じまい・空き家活用</h2>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                補助金の活用から売却査定まで。損をしない家のしまい方を専門家がサポート。
              </p>
              <Link href="/guide" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                専門家に相談する <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-2 w-full mt-4 sm:mt-6">
            <Link
              href="/tools"
              className="inline-block bg-accent text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:opacity-90 transition shadow-lg"
            >
              今のあなたに必要なサポートを無料診断
            </Link>
            <p className="text-sm text-foreground/60">
              エンディングノート / 生前整理 / 空き家相談 対応
            </p>
          </div>
        </div>
      </section>

      {/* FV：ログインなしで触れるシミュレーター簡易版 */}
      <EmptyHouseTaxSimulator compact />
      <div className="flex justify-end -mt-2">
        <OwlAizuchi message="なるほど、まずは数字を把握するのが大事だホー" position="right" size="m" />
      </div>

      {/* 利用者事例スライダー（実績ベース見出し・共感→診断CTA） */}
      <UserTestimonialsSlider />

      {/* FirstView：無料ツールを6本表示（ツール感・無料感がパッと伝わるビジュアル） */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 text-primary" aria-hidden>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
          </span>
          <h2 className="font-bold text-lg text-primary">無料ではじめて、必要なときだけ専門家へ</h2>
        </div>
        <p className="text-sm text-foreground/60">実家・生前整理の診断やシミュレーターなど、<strong className="text-foreground/80">無料で使えるツール</strong>がたくさんあります。</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ToolCard slug="/assets" lead="持ち物を登録すると総額がわかる" title="資産・査定の見える化" sub="無料査定・買取相場へそのまま導線" ctaLabel="見える化してみる">
            <svg viewBox="0 0 140 140" className="w-12 h-12" fill="none"><path d="M30 90 L50 50 L70 70 L90 30 L110 50" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="70" cy="75" r="25" fill="currentColor" opacity="0.3" /></svg>
          </ToolCard>
          <ToolCard slug="/area" lead="全国の市区町村ごとに掲載" title="地域別・粗大ゴミ・遺品整理" sub="検索→見積もり・回収業者導線" ctaLabel="詳しく見てみる">
            <svg viewBox="0 0 140 140" className="w-12 h-12" fill="none"><path d="M25 85 Q70 25 115 85 L115 115 L25 115 Z" fill="currentColor" opacity="0.8" /><circle cx="70" cy="65" r="12" fill="currentColor" opacity="0.5" /></svg>
          </ToolCard>
          <ToolCard slug="/guide" lead="相続・不動産・デジタル遺品など" title="専門家への無料相談" sub="匿名で質問→税理士・司法書士紹介" ctaLabel="無料相談してみる">
            <svg viewBox="0 0 140 140" className="w-12 h-12" fill="none"><rect x="45" y="35" width="50" height="65" rx="4" fill="currentColor" opacity="0.9" /><path d="M58 55 L82 55 M58 65 L78 65 M58 75 L75 75" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
          </ToolCard>
          <ToolCard slug="/tools/jikka-diagnosis" lead="家族会議にそのまま使える" title="実家じまい力診断" sub="約10問でリスク度がわかる" ctaLabel="診断してみる">
            <svg viewBox="0 0 140 140" className="w-12 h-12" fill="none"><rect x="40" y="60" width="60" height="50" rx="4" fill="currentColor" opacity="0.9" /><path d="M70 38 L98 60 L70 60 L42 60 Z" fill="currentColor" opacity="0.7" /></svg>
          </ToolCard>
          <ToolCard slug="/tools/akiya-risk" lead="空き家予備軍かがわかる" title="空き家リスク診断" sub="約8問でリスクをチェック" ctaLabel="診断してみる">
            <svg viewBox="0 0 140 140" className="w-12 h-12" fill="none"><rect x="35" y="55" width="70" height="55" rx="4" fill="currentColor" opacity="0.9" /><circle cx="105" cy="45" r="18" fill="currentColor" opacity="0.6" /></svg>
          </ToolCard>
          <ToolCard slug="/tools/inheritance-share" lead="家族構成で割合がわかる" title="法定相続分シミュレーター" sub="円グラフで相続分を可視化" ctaLabel="シミュレーションしてみる">
            <svg viewBox="0 0 140 140" className="w-12 h-12" fill="none"><circle cx="70" cy="70" r="55" stroke="currentColor" strokeWidth="4" fill="none" /><path d="M70 70 L70 15 L120 70 Z" fill="currentColor" opacity="0.6" /><path d="M70 70 L70 125 L20 70 Z" fill="currentColor" opacity="0.4" /></svg>
          </ToolCard>
        </div>
        <p className="text-sm text-foreground/50 text-center">
          <Link href="/tools" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
            ほかにも無料ツールがたくさん → ツール一覧
          </Link>
        </p>
      </div>
      <div className="flex justify-end">
        <OwlAizuchi message="無料で始めて、必要なときだけプロに頼めるのがいいですね" position="right" size="s" />
      </div>

      {/* Review Reminder Alert */}
      {stats.needsReview && (
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-accent">棚卸しの時期です</p>
            <p className="text-sm text-foreground/60 mt-0.5">
              資産状況や気持ちに変化はありませんか？定期的な見直しで情報を最新に保ちましょう。
              {stats.lastReviewDate && (
                <span className="ml-1">
                  （前回：{new Date(stats.lastReviewDate).toLocaleDateString("ja-JP")}）
                </span>
              )}
            </p>
          </div>
          <Link
            href="/settings"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap hover:opacity-90 transition shrink-0"
          >
            見直しを始める
          </Link>
        </div>
      )}

      {/* KPI Dashboard */}
      {stats.assetCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalValue > 0 ? formatAmount(stats.totalValue) : "---"}
            </div>
            <div className="text-xs text-foreground/50 mt-1">資産総額（推計）</div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-xs text-foreground/50 mt-1">整理完了率</div>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold">{checkPercent}%</div>
            <div className="text-xs text-foreground/50 mt-1">チェックリスト</div>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${checkPercent}%` }}
              />
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold">{stats.noteProgress}%</div>
            <div className="text-xs text-foreground/50 mt-1">エンディングノート</div>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${stats.noteProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Guide Summary */}
      <div className="bg-primary-light rounded-2xl p-6 border border-primary/20">
        <h2 className="font-bold text-lg text-primary mb-3">
          生前整理、何から始める？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">
              1
            </span>
            <div>
              <p className="font-medium text-sm">気持ちの整理</p>
              <p className="text-xs text-foreground/50">
                これからどう暮らしたいか考える
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">
              2
            </span>
            <div>
              <p className="font-medium text-sm">財産の把握</p>
              <p className="text-xs text-foreground/50">
                お金・書類の全体像を整理
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">
              3
            </span>
            <div>
              <p className="font-medium text-sm">持ち物の整理</p>
              <p className="text-xs text-foreground/50">
                残す・譲る・処分に分類
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/guide"
            className="text-primary text-sm font-medium hover:underline"
          >
            詳しい進め方を見る →
          </Link>
        </div>
      </div>

      {/* 無料ツール・進捗管理（ツール一覧と同様のイラスト＋フクロウ） */}
      <div>
        <h2 className="font-bold text-lg mb-4">無料ツール</h2>
        <p className="text-sm text-foreground/60 mb-4">生前整理の進捗や資産の目安を可視化するツールです。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DashboardCard
            href="/tools/empty-house-tax"
            title="空き家税金シミュレーター"
            description="年間維持費の目安を即表示。固定資産税の負担を確認"
            progress={100}
            detail="都道府県を選ぶだけ"
            color="bg-accent"
            iconSlug="empty-house-tax"
          />
          <DashboardCard
            href="/tools/appraisal"
            title="資産・査定の目安"
            description="持ち物の査定目安。複数社で無料比較"
            progress={100}
            detail="無料一括見積もりへ"
            color="bg-primary"
            iconSlug="appraisal"
          />
        </div>
        <h2 className="font-bold text-lg mb-4">進捗管理</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <DashboardCard
            href="/checklist"
            title="チェックリスト"
            description="隠れ資産を見つける・項目を確認"
            progress={checkPercent}
            detail={`${stats.checkDone} / ${stats.checkTotal} 完了`}
            color="bg-primary"
            iconSlug="checklist"
          />
          <DashboardCard
            href="/assets"
            title="資産・持ち物"
            description="所有物を登録・総額を可視化"
            progress={stats.completionRate}
            detail={`${stats.assetCount} 件登録${stats.appraisalCount > 0 ? ` / ${stats.appraisalCount}件 査定希望` : ""}`}
            color="bg-accent"
            iconSlug="appraisal"
          />
          <DashboardCard
            href="/ending-note"
            title="エンディングノート"
            description="想い・相談・連絡先"
            progress={stats.noteProgress}
            detail={`${stats.noteProgress}% 記入済み`}
            color="bg-primary"
            iconSlug="checklist"
          />
        </div>
        <p className="text-sm text-foreground/50 mt-4 text-center">
          <Link href="/tools" className="text-primary font-medium hover:underline">すべての無料ツールを見る →</Link>
        </p>
      </div>

      {/* 家族招待（PLG：n倍のバイラル係数） */}
      <div className="bg-card rounded-2xl p-6 border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-primary">家族を招待すると有料級ガイドをプレゼント</h3>
          <p className="text-sm text-foreground/60 mt-0.5">
            招待した家族も進捗を共有できると、生前整理がスムーズに。
          </p>
        </div>
        <Link
          href="/settings"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shrink-0"
        >
          家族を招待する
        </Link>
      </div>

      {/* LINE登録CTA（リスト取り・ガイドブック特典） */}
      <LineCTA />

      {/* ご利用の流れ（問い合わせハードル除去） */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
        <h2 className="text-xl font-bold mb-6 text-primary">ご利用の流れ</h2>
        <p className="text-sm text-foreground/60 mb-6">匿名OK・電話勧誘なし。必要な時だけ専門家につなぎます。</p>
        <ol className="space-y-6">
          <li className="flex gap-4">
            <span className="flex shrink-0 w-10 h-10 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">1</span>
            <div>
              <h3 className="font-bold text-primary">スマホで3分診断</h3>
              <p className="text-sm text-foreground/70 mt-0.5">匿名OK・電話勧誘なし。今の実家のリスクがわかります。</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex shrink-0 w-10 h-10 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">2</span>
            <div>
              <h3 className="font-bold text-primary">結果・アドバイスを確認</h3>
              <p className="text-sm text-foreground/70 mt-0.5">今の実家のリスクと、取るべき対策がひと目でわかります。</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex shrink-0 w-10 h-10 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">3</span>
            <div>
              <h3 className="font-bold text-primary">必要な時だけ専門家に相談</h3>
              <p className="text-sm text-foreground/70 mt-0.5">希望者のみマッチング。業者への紹介はご希望の方だけです。</p>
            </div>
          </li>
        </ol>
      </div>

      {/* 運営者の想い（信頼・差別化）→ 専用ページへ */}
      <div className="bg-primary-light rounded-2xl p-6 sm:p-8 border border-primary/20">
        <h2 className="text-xl font-bold mb-4 text-primary">モノを捨てるのではなく、家族の心を整えるために</h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          「ふれあいの丘」という名前には、地域と家族とのふれあいを大切にしたいという想いを込めています。
          生前整理は、モノを捨てることが目的ではありません。残される家族が迷わず、心を整えて次の一歩を踏み出せるよう、情報とツールを無料でお届けしています。
        </p>
        <Link
          href="/about"
          className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition"
        >
          運営者の想いを読む
        </Link>
      </div>

      {/* 川柳：休憩コンテンツ・箸休め（川柳を読むフクロウ） */}
      <div className="bg-card rounded-2xl p-6 border border-border flex flex-wrap items-center gap-6">
        <OwlCharacter
          size={100}
          message="あるある、詠むホー"
          tone="calm"
          bubblePosition="right"
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-primary">実家じまい川柳</h3>
          <p className="text-sm text-foreground/60 mt-0.5">
            ふれあいの丘のフクロウが詠む、あるある・哀愁。共感したら「わかる！」「座布団一枚！」を。
          </p>
        </div>
        <Link
          href="/senryu"
          className="bg-primary-light text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition shrink-0"
        >
          川柳を見る
        </Link>
      </div>

      {/* Email CTA */}
      <EmailCTA
        variant="banner"
        heading="生前整理 完全ガイドブック（無料PDF）"
        description="優先順位チェックシート・財産一覧テンプレート・エンディングノートの書き方をまとめた資料を無料でお届けします。"
      />

      {/* よくある質問（反論処理） */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
        <h2 className="text-xl font-bold mb-6 text-primary">よくある質問</h2>
        <dl className="space-y-6">
          <div>
            <dt className="font-bold text-foreground mb-1">本当に無料ですか？後から請求されませんか？</dt>
            <dd className="text-sm text-foreground/70 pl-0">
              完全無料です。当センターは提携事業者からの紹介料で運営されているため、ご利用者様から費用を頂くことはありません。
            </dd>
          </div>
          <div>
            <dt className="font-bold text-foreground mb-1">まだ整理するか決めていませんが、利用できますか？</dt>
            <dd className="text-sm text-foreground/70 pl-0">
              もちろんです。むしろ「判断するため」にご利用ください。診断やシミュレーターで現状を把握してから、ご自身のペースで検討できます。
            </dd>
          </div>
          <div>
            <dt className="font-bold text-foreground mb-1">個人情報は守られますか？</dt>
            <dd className="text-sm text-foreground/70 pl-0">
              はい。プライバシーポリシーに基づき厳重に管理し、同意なく業者に渡すことはありません。
            </dd>
          </div>
        </dl>
      </div>

      {/* About Section */}
      <div className="bg-card rounded-2xl p-8 border border-border">
        <h2 className="text-xl font-bold mb-4 text-primary">生前整理とは？</h2>
        <div className="space-y-3 text-foreground/70 leading-relaxed">
          <p>
            生前整理とは、元気なうちに自分の持ち物や財産を整理し、
            大切な人への想いを形にしておくことです。
            「終わり」の準備ではなく、<strong>残りの人生をより豊かにする</strong>
            前向きな取り組みです。
          </p>
          <div className="mt-4">
            <Link
              href="/guide"
              className="inline-block bg-primary-light text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              詳しい進め方ガイドを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  href,
  title,
  description,
  progress,
  detail,
  color,
  iconSlug,
}: {
  href: string;
  title: string;
  description: string;
  progress: number;
  detail: string;
  color: string;
  iconSlug?: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-card rounded-2xl p-4 sm:p-5 border border-border hover:shadow-lg hover:border-primary/40 transition overflow-hidden"
    >
      {iconSlug && (
        <div className="shrink-0 w-12 h-12 sm:w-[72px] sm:h-[72px] overflow-hidden rounded-xl">
          <ToolCardIcon slug={iconSlug} />
        </div>
      )}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <h3 className="font-bold text-base text-primary leading-tight">{title}</h3>
        <p className="text-sm text-foreground/60 mt-0.5 sm:mt-1 break-words">{description}</p>
        <div className="w-full bg-border rounded-full h-2.5 mt-2 sm:mt-3 mb-1.5 min-w-0">
          <div
            className={`${color} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-foreground/50 break-words">{detail}</p>
      </div>
      {iconSlug && (
        <div className="hidden sm:flex shrink-0 self-center w-10 h-10 rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={OWL_IMAGE} alt="" width={28} height={28} className="object-contain w-7 h-7" aria-hidden />
        </div>
      )}
    </Link>
  );
}
