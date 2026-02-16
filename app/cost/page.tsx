import Link from "next/link";
import { LAYOUT_COST_LIST } from "../lib/cost-by-layout";
import { pageTitle } from "../lib/site-brand";

export const metadata = {
  title: pageTitle("間取り別 遺品整理・実家じまい 費用の目安"),
  description:
    "1K〜5LDK以上の間取り別に、遺品整理・実家じまいの費用の最安値・平均・最高値と作業時間の目安を掲載。戸建て・マンション別の相場と安く済ませるコツ。",
};

export default function CostIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">間取り別 遺品整理・実家じまい 費用の目安</h1>
        <p className="text-foreground/60 mt-1">
          戸建て・マンション別の相場と、作業時間・安く済ませるコツを間取りごとにまとめました。
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {LAYOUT_COST_LIST.map((layout) => (
          <li key={layout.slug}>
            <Link
              href={`/cost/layout/${layout.slug}`}
              className="block bg-card rounded-xl border border-border p-4 hover:border-primary/50 hover:bg-primary-light/30 transition"
            >
              <span className="font-bold text-primary">{layout.label}</span>
              <p className="text-sm text-foreground/60 mt-1">
                {layout.minYen}〜{layout.maxYen}万円程度
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-sm text-foreground/50">
        業者・荷物量・立地により変動します。詳しい見積もりは無料診断や複数社の見積もりでご確認ください。
      </p>

      {/* 実家じまいクラスター（Hub-Spoke）：費用とあわせて進め方・診断へ */}
      <section className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-3">実家じまいの進め方・診断とあわせて</h2>
        <p className="text-sm text-foreground/70 mb-4">
          費用の目安だけでなく、進め方の全体像や今の実家のリスクを診断すると、次の一歩が決めやすくなります。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/guide"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition"
          >
            実家じまいの進め方 全手順
          </Link>
          <Link
            href="/tools/jikka-diagnosis"
            className="inline-block bg-card border-2 border-primary text-primary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary hover:text-white transition"
          >
            実家じまい力診断（3分で無料）
          </Link>
        </div>
      </section>

      {/* 間取り以外の軸：回遊性・高単価ページへの誘導 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-3">間取り以外の軸で知りたい方へ</h2>
        <p className="text-sm text-foreground/70 mb-4">
          実家の状況に合わせた費用・手続きの目安をまとめたページへご案内します。
        </p>
        <ul className="space-y-3">
          <li>
            <Link
              href="/dispose/butsudan"
              className="block py-2 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90"
            >
              仏壇がある場合（供養・処分の費用と方法）
            </Link>
          </li>
          <li>
            <Link
              href="/tools/akiya-risk"
              className="block py-2 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90"
            >
              空き家期間が長い場合（1年以上・リスク診断）
            </Link>
          </li>
          <li>
            <Link
              href="/guide"
              className="block py-2 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90"
            >
              孤独死・特殊清掃が必要な場合（はじめかた・業者相談）
            </Link>
          </li>
        </ul>
      </section>

      <Link href="/tools/jikka-diagnosis" className="inline-block text-primary font-medium hover:underline">
        ← 実家じまい力診断で費用感をチェック
      </Link>
    </div>
  );
}
