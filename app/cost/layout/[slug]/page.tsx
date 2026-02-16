import { notFound } from "next/navigation";
import Link from "next/link";
import { getLayoutBySlug, getLayoutSlugs } from "../../../lib/cost-by-layout";
import { pageTitle } from "../../../lib/site-brand";
import CostLayoutLineCTA from "../../../components/CostLayoutLineCTA";
import CostLayoutChecklistCTA from "../../../components/CostLayoutChecklistCTA";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getLayoutSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const layout = getLayoutBySlug(slug);
  if (!layout) return { title: pageTitle("間取り別 費用") };
  return {
    title: pageTitle(`${layout.label}の遺品整理費用相場｜トラック何台？安くするコツと作業時間`),
    description: `${layout.label}の遺品整理・実家じまいの費用相場（最安${layout.minYen}万円〜最高${layout.maxYen}万円）。トラックの台数・費用が変わる3つの要因・松竹梅の料金モデル・安くするコツ・作業時間を解説。`,
  };
}

function formatYen(n: number): string {
  if (n >= 10000) return `${n / 10000}万円`;
  return `${n.toLocaleString()}円`;
}

export default async function CostLayoutPage({ params }: Props) {
  const { slug } = await params;
  const layout = getLayoutBySlug(slug);
  if (!layout) notFound();

  const maxYen = layout.maxYen;
  const scale = (v: number) => (v / maxYen) * 100;

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/cost" className="hover:text-primary">間取り別費用一覧</Link>
        <span className="mx-2">/</span>
        <span>{layout.label}</span>
      </p>

      <h1 className="text-2xl font-bold text-primary">
        [{layout.label}]の遺品整理費用相場｜トラック何台？安くするコツと作業時間
      </h1>

      {/* 相場グラフ */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">[{layout.label}]の片付け費用の相場</h2>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-foreground/70">
            {layout.buildingTypes.join("・")}いずれも、荷物量・業者・立地（親の家・団地・エレベーターなし等）で変動します。目安としてご参照ください。
          </p>
          <div className="space-y-3" aria-label="費用の最安値・平均値・最高値">
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium text-foreground/80 shrink-0">最安値</span>
              <div className="flex-1 h-8 bg-background rounded-lg overflow-hidden">
                <div
                  className="h-full bg-green-500/80 rounded-lg min-w-[2rem]"
                  style={{ width: `${Math.max(scale(layout.minYen), 15)}%` }}
                />
              </div>
              <span className="w-20 text-right font-bold text-primary shrink-0">{layout.minYen}万円</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium text-foreground/80 shrink-0">平均値</span>
              <div className="flex-1 h-8 bg-background rounded-lg overflow-hidden">
                <div
                  className="h-full bg-primary rounded-lg min-w-[2rem]"
                  style={{ width: `${Math.max(scale(layout.avgYen), 15)}%` }}
                />
              </div>
              <span className="w-20 text-right font-bold text-primary shrink-0">{layout.avgYen}万円</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium text-foreground/80 shrink-0">最高値</span>
              <div className="flex-1 h-8 bg-background rounded-lg overflow-hidden">
                <div
                  className="h-full bg-amber-500/80 rounded-lg min-w-[2rem]"
                  style={{ width: `${Math.max(scale(layout.maxYen), 15)}%` }}
                />
              </div>
              <span className="w-20 text-right font-bold text-primary shrink-0">{layout.maxYen}万円</span>
            </div>
          </div>
          <p className="text-xs text-foreground/50">
            業者・作業内容により異なります。必ず無料見積もりでご確認ください。
          </p>

          {/* グラフ直下：診断CTA（最安値に近い？最高値？） */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-bold text-primary mb-2 text-center">
              あなたの実家は「最安値」に近い？それとも「最高値」？
            </p>
            <p className="text-sm text-foreground/70 text-center mb-4">
              荷物量・階段・処分品の質で位置が変わります。3分で目安を判定できます。
            </p>
            <div className="flex justify-center">
              <Link
                href="/tools/jikka-diagnosis"
                className="inline-block bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
              >
                3分で判定する（無料診断）
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 費用が変わる3つの要因 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-4">なぜその価格幅なの？費用が変わる3つの要因</h2>
        <p className="text-sm text-foreground/70 mb-4">
          最安値と最高値で差が出る理由を理解すると、見積もりを取る前に「自分はどれに近いか」がイメージしやすくなります。
        </p>
        <ul className="space-y-4">
          <li>
            <h3 className="font-bold text-foreground/90 mb-1">1. 搬出条件（1階か？5階階段か？）</h3>
            <p className="text-sm text-foreground/75">{layout.factorCarry}</p>
          </li>
          <li>
            <h3 className="font-bold text-foreground/90 mb-1">2. 処分品の質（リサイクルできる家電が多いか、混載ゴミばかりか）</h3>
            <p className="text-sm text-foreground/75">{layout.factorQuality}</p>
          </li>
          <li>
            <h3 className="font-bold text-foreground/90 mb-1">3. トラックの台数（軽トラ1台で済むか、2トン車が必要か）</h3>
            <p className="text-sm text-foreground/75">{layout.factorTruck}</p>
          </li>
        </ul>
      </section>

      {/* トラックの大きさ・台数 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-4">[{layout.label}]の片付けに必要なトラックの大きさ・台数は？</h2>
        <p className="text-sm text-foreground/70 mb-4">
          荷物量の目安で、軽トラックと2トントラックのどちらが現実的かが変わります。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/30 bg-primary-light/20 p-4">
            <p className="font-bold text-primary text-sm mb-1">荷物少なめの場合</p>
            <p className="text-sm text-foreground/80">{layout.truckLight}</p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary-light/20 p-4">
            <p className="font-bold text-primary text-sm mb-1">標準的な荷物量の場合</p>
            <p className="text-sm text-foreground/80">{layout.truckTwoTon}</p>
          </div>
        </div>
        <p className="text-xs text-foreground/50 mt-3">
          荷物多い・ゴミ屋敷に近い場合は2トン車が複数台必要なことも。無料診断で「何台分か」の目安を把握できます。
        </p>
      </section>

      {/* 作業時間 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-2">目安となる作業時間</h2>
        <p className="text-foreground/80">
          {layout.label}の場合、おおよそ<strong>{layout.workHoursMin}〜{layout.workHoursMax}時間</strong>程度が目安です。荷物の量・作業員の人数・階段の有無で前後します。
        </p>
      </section>

      {/* 安く済ませるコツ + チェックリストCTA */}
      <section className="space-y-4">
        <div className="bg-primary-light/40 rounded-2xl border border-primary/20 p-6">
          <h2 className="font-bold text-primary mb-2">安く済ませるコツ</h2>
          <p className="text-foreground/80">{layout.tipShort}</p>
        </div>
        <CostLayoutChecklistCTA layoutLabel={layout.label} />
      </section>

      {/* 松・竹・梅 料金モデル（事例表） */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">[{layout.label}]の料金イメージ：松・竹・梅の3パターン</h2>
        </div>
        <p className="p-6 pt-4 text-sm text-foreground/70">
          架空のモデルケースです。「自分の場合はどれに近いか」の参考にしてください。内訳は業者・条件により異なります。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-background border-y border-border">
                <th className="text-left p-3 font-bold text-foreground/90">パターン</th>
                <th className="text-left p-3 font-bold text-foreground/90">想定条件</th>
                <th className="text-right p-3 font-bold text-foreground/90">総額の目安</th>
                <th className="text-left p-3 font-bold text-foreground/90">内訳の例</th>
              </tr>
            </thead>
            <tbody>
              {layout.modelCases.map((mc) => (
                <tr key={mc.name} className="border-b border-border">
                  <td className="p-3 font-bold text-primary">{mc.name}</td>
                  <td className="p-3 text-foreground/80">{mc.scenario}</td>
                  <td className="p-3 text-right font-bold text-primary">{formatYen(mc.totalYen)}</td>
                  <td className="p-3 text-foreground/70">{mc.breakdown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 業者に頼むメリット・デメリット */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-4">[{layout.label}]の遺品整理を業者に頼むメリット・デメリット</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">メリット</h3>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
              <li>時間と体力をかけずに一括で片付けられる</li>
              <li>粗大ゴミの申し込み・運搬・処分を代行してもらえる</li>
              <li>階段・高所など自分では難しい搬出も依頼できる</li>
              <li>買取可能品の査定を依頼できる業者もある</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-2">デメリット</h3>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
              <li>自分で出すより費用がかかる</li>
              <li>業者選びを間違えるとトラブルのリスクがある</li>
              <li>見積もり・立ち会いの日程調整が必要</li>
              <li>複数社比較で手間がかかる（無料診断で目安を把握すると効率的）</li>
            </ul>
          </div>
        </div>
      </section>

      <CostLayoutLineCTA layoutLabel={layout.label} />

      <div className="flex flex-wrap gap-3">
        <Link href="/cost" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 間取り別費用一覧へ
        </Link>
        <Link href="/tools/jikka-diagnosis" className="inline-block text-primary font-medium hover:underline">
          実家じまい力診断（3分で目安を確認）
        </Link>
      </div>
    </div>
  );
}
