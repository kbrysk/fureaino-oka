import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/app/lib/site-url";

/**
 * 検索トレンドレポートのインデックス
 * 利用可能な月次レポートを一覧表示。最新版へのリンクを目立たせる。
 */

const REPORTS_DIR = path.join(process.cwd(), "app", "lib", "data", "trend-reports");

type IndexEntry = {
  month: string;
  monthLabel: string;
  generatedAt: string;
  trendingTop3: Array<{ keyword: string; liftPercent: number }>;
};

function formatMonth(month: string): string {
  const [y, m] = month.split("-");
  return `${y}年${parseInt(m, 10)}月`;
}

function listReports(): IndexEntry[] {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  const files = fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();
  return files.map((f) => {
    const month = f.replace(".json", "");
    const data = JSON.parse(
      fs.readFileSync(path.join(REPORTS_DIR, f), "utf-8")
    );
    return {
      month,
      monthLabel: formatMonth(month),
      generatedAt: data.generated_at,
      trendingTop3: (data.trending_top10 ?? []).slice(0, 3).map((k: { label: string; liftPercent: number }) => ({
        keyword: k.label,
        liftPercent: k.liftPercent,
      })),
    };
  });
}

export const metadata: Metadata = {
  title: "終活・生前整理 検索トレンドレポート | ふれあいの丘",
  description:
    "ふれあいの丘編集部が独自集計する、終活・生前整理・実家じまい・親世代の悩み関連キーワードのGoogle検索トレンドレポート。月次発行・CSV/JSON形式でダウンロード可能。記事執筆・自治体資料への引用歓迎（CC BY 4.0）。",
  alternates: {
    canonical: `${getCanonicalBase()}/data/seizen-seiri-trends/`,
  },
};

export default function Page() {
  const reports = listReports();
  const latest = reports[0];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>検索トレンドレポート</span>
      </nav>

      <header className="mb-10">
        <p className="mb-2 inline-block rounded bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          ふれあいの丘 編集部 独自データ
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
          終活・生前整理 検索トレンドレポート
        </h1>
        <p className="mt-4 text-gray-700">
          終活・生前整理・実家じまい・親世代の悩み・空き家補助金・遺品整理など、
          ふれあいの丘編集部が独自に観測している20語のキーワード群について、
          Google Trendsの公開データを月次で集計しています。
        </p>
        <p className="mt-3 text-gray-700">
          記事執筆、自治体・社協・地域包括支援センターの資料への引用、
          研究用途での利用を歓迎しています（CC BY 4.0、出典明記をお願いします）。
        </p>
      </header>

      {latest && (
        <section className="mb-10 rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6">
          <p className="text-sm text-indigo-700">最新版</p>
          <h2 className="mt-1 text-2xl font-bold">{latest.monthLabel}版</h2>
          <p className="mt-2 text-sm text-gray-700">今月の急上昇 TOP3:</p>
          <ul className="mt-2 space-y-1 text-sm">
            {latest.trendingTop3.map((k, i) => (
              <li key={k.keyword}>
                {i + 1}. <strong>{k.keyword}</strong>{" "}
                <span className="text-red-600">
                  {k.liftPercent > 0 ? "+" : ""}
                  {k.liftPercent.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
          <Link
            href={`/data/seizen-seiri-trends/${latest.month}/`}
            className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          >
            最新版を見る →
          </Link>
        </section>
      )}

      {reports.length > 1 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">アーカイブ</h2>
          <ul className="space-y-2">
            {reports.slice(1).map((r) => (
              <li key={r.month}>
                <Link
                  href={`/data/seizen-seiri-trends/${r.month}/`}
                  className="text-indigo-600 hover:underline"
                >
                  {r.monthLabel}版
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded border border-gray-200 bg-gray-50 p-5 text-sm">
        <h2 className="mb-2 font-bold">レポートについて</h2>
        <ul className="space-y-1 text-gray-700">
          <li>調査対象: 生前整理コア / 親世代の悩み / 親子の温度差 / 制度・お金・法律 / 処分・買取 / トラブル の6クラスタ計20語</li>
          <li>調査地域: 日本（Google Trends JP）</li>
          <li>更新頻度: 月次（毎月初旬）</li>
          <li>ライセンス: CC BY 4.0（出典明記の上、自由に引用可能）</li>
          <li>取材・解説者コメント依頼: <Link href="/contact" className="text-indigo-600 underline">お問い合わせフォーム</Link></li>
        </ul>
      </section>
    </main>
  );
}
