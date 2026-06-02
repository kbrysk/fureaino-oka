"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  getChecklist,
  getAssets,
  getEndingNote,
  getTotalEstimatedValue,
  getCompletionRate,
  getReminderSettings,
} from "../../lib/storage";
import EmailCTA from "../EmailCTA";
import LineCTA from "../LineCTA";
import OwlCharacter from "../OwlCharacter";
import OwlAizuchi from "../OwlAizuchi";
import ToolCardIcon from "../ToolCardIcon";

const OWL_IMAGE = "/images/owl-character.png";

/** CLS 防止: 実コンポーネントと同程度の高さでスケルトンを確保（compact シミュレーターは約 260px） */
const EmptyHouseTaxSimulator = dynamic(
  () => import("../EmptyHouseTaxSimulator").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card rounded-2xl border border-border p-5 min-h-[260px] flex items-center justify-center">
        <span className="text-foreground/50 text-sm">読み込み中…</span>
      </div>
    ),
  }
);

/** CLS 防止: 利用者事例スライダーは見出し＋3カード分の高さを確保（約 420px） */
const UserTestimonialsSlider = dynamic(
  () => import("../UserTestimonialsSlider").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-border bg-primary-light/10 p-6 min-h-[420px] flex items-center justify-center" aria-hidden>
        <span className="text-foreground/50 text-sm">お客様の声を読み込み中…</span>
      </div>
    ),
  }
);

/** 診断ツール用：低・中・高のリスクメーター（出力プレビュー） */
function RiskMeterPreview({ meta }: { meta: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">リスク度を判定</span>
        <span className="text-slate-500">{meta}</span>
      </div>
      <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
        <div className="flex-1 bg-emerald-400" />
        <div className="flex-1 bg-amber-400" />
        <div className="flex-1 bg-rose-400" />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-400">
        <span>低</span>
        <span>中</span>
        <span>高</span>
      </div>
    </div>
  );
}

/**
 * 「調べる・相談する」用の軽量な横長行（診断ツールと視覚的に区別）。
 * 答え→結果が出る"ツール"ではなく、閲覧・相談の導線なので、リッチカードでなく
 * アイコン＋一行＋矢印の控えめなリスト表現にする＝情報の種類で見せ方を分ける。
 */
function BrowseRow({
  href,
  title,
  sub,
  children,
}: {
  href: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:ring-primary/30 hover:shadow-[0_12px_28px_-14px_rgba(15,23,42,0.18)]"
    >
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
        {children}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-snug text-slate-900">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-500">{sub}</span>
      </span>
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M7 4l6 6-6 6" />
      </svg>
    </Link>
  );
}

/**
 * 無料ツールカード（"使えるツール"が一目で伝わる版 2026-06）
 * 50〜70代でも「これは診断/試算ツールだ」と即わかるよう、
 *  ①大きく濃いアイコン ②ツール種別チップ ③出力プレビュー（結果の見える化）
 *  ④押せると分かる明確なボタン ⑤高コントラストの文字 を備える。
 * 白基調・ヘアライン・柔らかな影でApple的な上質さは維持。
 */
function ToolCard({
  slug,
  kindLabel,
  lead,
  title,
  sub,
  ctaLabel,
  preview,
  children,
}: {
  slug: string;
  kindLabel: string;
  lead?: string;
  title: string;
  sub: string;
  ctaLabel: string;
  preview?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={slug}
      className="group relative flex h-full flex-col rounded-[20px] bg-white p-5 ring-1 ring-slate-200/70 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:ring-primary/30 hover:shadow-[0_18px_40px_-16px_rgba(15,23,42,0.22)]"
    >
      {/* 上段：大きく濃いアイコン ＋ ツール種別チップ */}
      <div className="mb-3.5 flex items-start justify-between gap-2">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:ring-primary/40 group-hover:shadow-[0_10px_22px_-10px_rgba(15,23,42,0.3)]">
          {children}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/[0.08] px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary ring-1 ring-inset ring-primary/15">
          {kindLabel}
        </span>
      </div>

      {lead && <p className="text-[13px] font-medium text-slate-500">{lead}</p>}
      <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{sub}</p>

      {/* 出力プレビュー：何が得られるかを"結果の見える化"で示す＝ツール感の核 */}
      {preview && <div className="mt-3">{preview}</div>}

      {/* 押せると分かる明確なボタン（ブランドカラー・タップ領域44px以上） */}
      <span className="mt-auto pt-4">
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[15px] font-bold text-white shadow-[0_4px_12px_-4px_rgba(15,23,42,0.25)] transition group-hover:brightness-110">
          {ctaLabel}
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

function formatAmount(amount: number): string {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}億円`;
  if (amount >= 10_000) return `${Math.round(amount / 10_000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
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
        <p className="text-base text-foreground/80 mt-0.5 sm:mt-1 break-words">{description}</p>
        <div className="w-full bg-border rounded-full h-2.5 mt-2 sm:mt-3 mb-1.5 min-w-0">
          <div
            className={`${color} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-base text-foreground/75 break-words">{detail}</p>
      </div>
      {iconSlug && (
        <div className="hidden sm:flex shrink-0 self-center w-10 h-10 rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20 items-center justify-center">
          <Image src={OWL_IMAGE} alt="ふれあいの丘 マスコットキャラクター フクロウ" width={28} height={28} className="object-contain w-7 h-7" aria-hidden />
        </div>
      )}
    </Link>
  );
}

export default function HomeContentClient() {
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
    queueMicrotask(() => {
      const checklist = getChecklist();
      const assets = getAssets();
      const note = getEndingNote();
      const reminder = getReminderSettings();

      const noteFilled = [note.message, note.medicalWishes, note.funeralWishes, note.importantDocs].filter(
        (v) => v.trim().length > 0
      ).length;

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
    });
  }, []);

  const checkPercent =
    stats.checkTotal > 0 ? Math.round((stats.checkDone / stats.checkTotal) * 100) : 0;

  return (
    <>
      <EmptyHouseTaxSimulator compact />
      <div className="flex justify-end -mt-2">
        <OwlAizuchi message="なるほど、まずは数字を把握するのが大事だホー" position="right" size="m" />
      </div>

      <UserTestimonialsSlider />

      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 text-primary" aria-hidden>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
          </span>
          <h2 className="font-bold text-lg text-primary">無料ではじめて、必要なときだけ専門家へ</h2>
        </div>
        <p className="text-base text-foreground/80">まずは<strong className="text-foreground/90">無料の診断・シミュレーター</strong>で現状を確かめ、必要なときだけ専門家へ。</p>

        {/* A群：答えると結果が出る「無料診断・シミュレーター」＝リッチカード */}
        <div>
          <div className="mb-3 flex items-baseline gap-2">
            <h3 className="text-[15px] font-bold text-slate-900">30秒でわかる｜無料の診断・シミュレーター</h3>
            <span className="text-xs text-slate-400">答えるだけで結果が出ます</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            <ToolCard
              slug="/tools/jikka-diagnosis"
              kindLabel="無料診断"
              title="実家じまい力診断"
              sub="質問に答えるだけでリスク度がわかる"
              ctaLabel="診断する"
              preview={<RiskMeterPreview meta="全10問・約3分" />}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9.5 4V3h5v1" /><path d="M9 13l2 2 4-4" /></svg>
            </ToolCard>
            <ToolCard
              slug="/tools/akiya-risk"
              kindLabel="無料診断"
              title="空き家リスク診断"
              sub="質問に答えるだけでリスクをチェック"
              ctaLabel="診断する"
              preview={<RiskMeterPreview meta="全8問・約2分" />}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v10h12V10" /><path d="M12 14v3" /><path d="M12 20h.01" /></svg>
            </ToolCard>
            <ToolCard
              slug="/tools/inheritance-share"
              kindLabel="無料シミュレーター"
              title="法定相続分シミュレーター"
              sub="家族構成を選ぶだけで相続分を可視化"
              ctaLabel="計算する"
              preview={
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
                  <svg viewBox="0 0 36 36" className="h-10 w-10 shrink-0 text-primary" aria-hidden>
                    <circle cx="18" cy="18" r="16" fill="#e2e8f0" />
                    <path d="M18 18 L18 2 A16 16 0 0 1 34 18 Z" fill="currentColor" />
                    <path d="M18 18 L34 18 A16 16 0 0 1 26 31.9 Z" fill="currentColor" opacity="0.5" />
                  </svg>
                  <span className="text-[13px] leading-relaxed text-slate-600">
                    配偶者・子の<span className="font-bold text-primary">相続割合</span>を円グラフで表示
                  </span>
                </div>
              }
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12A9 9 0 1 1 12 3v9z" /><path d="M12 3a9 9 0 0 1 9 9h-9z" /></svg>
            </ToolCard>
          </div>
        </div>

        {/* B群：閲覧・相談の導線＝軽い横長行（ツールと視覚的に区別） */}
        <div>
          <div className="mb-3 mt-2">
            <h3 className="text-[15px] font-bold text-slate-900">調べる・相談する</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BrowseRow href="/area" title="地域の補助金・費用を調べる" sub="全国1,741市区町村に対応">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            </BrowseRow>
            <BrowseRow href="/assets" title="持ち物の価値を見える化" sub="無料査定・買取相場へ">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 16l5-5 4 4 8-8" /><path d="M16 7h5v5" /></svg>
            </BrowseRow>
            <BrowseRow href="/articles/master-guide" title="専門家に無料で相談" sub="匿名OK→税理士・司法書士">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 11.5a8 8 0 0 1-11.5 7.2L4 20.5l1.8-5.2A8 8 0 1 1 21 11.5z" /><path d="M9 11h6M9 8h4" /></svg>
            </BrowseRow>
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:text-primary hover:ring-primary/30 hover:shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)]"
          >
            すべての無料ツールを見る
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="flex justify-end">
        <OwlAizuchi message="無料で始めて、必要なときだけプロに頼めるのがいいですね" position="right" size="s" />
      </div>

      {stats.needsReview && (
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-accent">棚卸しの時期です</p>
            <p className="text-base text-foreground/80 mt-0.5">
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

      {stats.assetCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalValue > 0 ? formatAmount(stats.totalValue) : "---"}
            </div>
            <div className="text-sm text-foreground/75 mt-1">資産総額（推計）</div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-sm text-foreground/75 mt-1">整理完了率</div>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold">{checkPercent}%</div>
            <div className="text-sm text-foreground/75 mt-1">チェックリスト</div>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${checkPercent}%` }}
              />
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border text-center">
            <div className="text-2xl font-bold">{stats.noteProgress}%</div>
            <div className="text-sm text-foreground/75 mt-1">エンディングノート</div>
            <div className="w-full bg-border rounded-full h-2 mt-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${stats.noteProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary-light rounded-2xl p-6 border border-primary/20">
        <h2 className="font-bold text-lg text-primary mb-3">
          生前整理、何から始める？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">1</span>
            <div>
              <p className="font-medium text-sm">気持ちの整理</p>
              <p className="text-sm text-foreground/75">これからどう暮らしたいか考える</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">2</span>
            <div>
              <p className="font-medium text-sm">財産の把握</p>
              <p className="text-sm text-foreground/75">お金・書類の全体像を整理</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">3</span>
            <div>
              <p className="font-medium text-sm">持ち物の整理</p>
              <p className="text-sm text-foreground/75">残す・譲る・処分に分類</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link href="/articles/master-guide" className="text-primary text-sm font-medium hover:underline">詳しい進め方を見る →</Link>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4">無料ツール</h2>
        <p className="text-base text-foreground/80 mb-4">生前整理の進捗や資産の目安を可視化するツールです。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DashboardCard href="/tools/empty-house-tax" title="空き家税金シミュレーター" description="年間維持費の目安を即表示。固定資産税の負担を確認" progress={100} detail="都道府県を選ぶだけ" color="bg-accent" iconSlug="empty-house-tax" />
          <DashboardCard href="/tools/appraisal" title="資産・査定の目安" description="持ち物の査定目安。複数社で無料比較" progress={100} detail="無料一括見積もりへ" color="bg-primary" iconSlug="appraisal" />
        </div>
        <h2 className="font-bold text-lg mb-4">進捗管理</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <DashboardCard href="/checklist" title="チェックリスト" description="隠れ資産を見つける・項目を確認" progress={checkPercent} detail={`${stats.checkDone} / ${stats.checkTotal} 完了`} color="bg-primary" iconSlug="checklist" />
          <DashboardCard href="/assets" title="資産・持ち物" description="所有物を登録・総額を可視化" progress={stats.completionRate} detail={`${stats.assetCount} 件登録${stats.appraisalCount > 0 ? ` / ${stats.appraisalCount}件 査定希望` : ""}`} color="bg-accent" iconSlug="appraisal" />
          <DashboardCard href="/ending-note" title="エンディングノート" description="想い・相談・連絡先" progress={stats.noteProgress} detail={`${stats.noteProgress}% 記入済み`} color="bg-primary" iconSlug="checklist" />
        </div>
        <p className="text-base text-foreground/75 mt-4 text-center">
          <Link href="/tools" className="text-primary font-medium hover:underline">すべての無料ツールを見る →</Link>
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-primary">家族を招待すると有料級ガイドをプレゼント</h3>
          <p className="text-base text-foreground/80 mt-0.5">招待した家族も進捗を共有できると、生前整理がスムーズに。</p>
        </div>
        <Link href="/settings" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shrink-0">家族を招待する</Link>
      </div>

      <LineCTA />

      <div className="bg-primary-light rounded-2xl p-6 sm:p-8 border border-primary/20">
        <h2 className="text-xl font-bold mb-4 text-primary">運営者情報</h2>
        <p className="text-foreground/80 leading-relaxed mb-4">
          「ふれあいの丘」は株式会社Kogeraが運営しています。運営会社の所在地・お問い合わせ先のほか、センター長からのメッセージをご覧いただけます。
        </p>
        <Link href="/about" className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition">運営者情報を見る</Link>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border flex flex-wrap items-center gap-6">
        <OwlCharacter size={100} message="あるある、詠むホー" tone="calm" bubblePosition="right" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-primary">実家じまい川柳</h3>
          <p className="text-base text-foreground/80 mt-0.5">ふれあいの丘のフクロウが詠む、あるある・哀愁。共感したら「わかる！」「座布団一枚！」を。</p>
        </div>
        <Link href="/senryu" className="bg-primary-light text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition shrink-0">川柳を見る</Link>
      </div>

      <EmailCTA variant="banner" heading="生前整理 完全ガイドブック（無料PDF）" description="優先順位チェックシート・財産一覧テンプレート・エンディングノートの書き方をまとめた資料を無料でお届けします。" />

      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
        <h2 className="text-xl font-bold mb-6 text-primary">よくある質問</h2>
        <dl className="space-y-6">
          <div>
            <dt className="font-bold text-foreground mb-1">本当に無料ですか？後から請求されませんか？</dt>
            <dd className="text-base text-foreground/80 pl-0">完全無料です。当センターは提携事業者からの紹介料で運営されているため、ご利用者様から費用を頂くことはありません。</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground mb-1">まだ整理するか決めていませんが、利用できますか？</dt>
            <dd className="text-base text-foreground/80 pl-0">もちろんです。むしろ「判断するため」にご利用ください。診断やシミュレーターで現状を把握してから、ご自身のペースで検討できます。</dd>
          </div>
          <div>
            <dt className="font-bold text-foreground mb-1">個人情報は守られますか？</dt>
            <dd className="text-base text-foreground/80 pl-0">はい。プライバシーポリシーに基づき厳重に管理し、同意なく業者に渡すことはありません。</dd>
          </div>
        </dl>
      </div>

      <div className="bg-card rounded-2xl p-8 border border-border">
        <h2 className="text-xl font-bold mb-4 text-primary">生前整理とは？</h2>
        <div className="space-y-3 text-foreground/70 leading-relaxed">
          <p>
            生前整理とは、元気なうちに自分の持ち物や財産を整理し、大切な人への想いを形にしておくことです。
            「終わり」の準備ではなく、<strong>残りの人生をより豊かにする</strong>前向きな取り組みです。
          </p>
          <div className="mt-4">
            <Link href="/articles/master-guide" className="inline-block bg-primary-light text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">詳しい進め方ガイドを見る</Link>
          </div>
        </div>
      </div>
    </>
  );
}
