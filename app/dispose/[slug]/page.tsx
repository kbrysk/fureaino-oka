import { notFound } from "next/navigation";
import Link from "next/link";
import { getDisposeItemBySlug, getDisposeSlugs } from "../../lib/dispose-items";
import { getCategoryById } from "../../lib/dispose-categories";
import { getBuybackExamples } from "../../lib/dispose-buyback-examples";
import { pageTitle } from "../../lib/site-brand";
import DisposeItemLineCTA from "../../components/DisposeItemLineCTA";
import DisposeToCostCrossLink from "../../components/DisposeToCostCrossLink";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getDisposeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getDisposeItemBySlug(slug);
  if (!item) return { title: pageTitle("捨て方辞典") };
  return {
    title: pageTitle(`${item.name}の捨て方決定版｜費用相場・買取・供養まで解説`),
    description: `${item.name}は自治体で捨てられる？結論と処分方法3選（自治体・買取・業者）、費用の目安、買取の可能性、供養のしかたを解説。ふれあいの丘のアドバイス付き。`,
  };
}

function ConclusionBadge({ conclusion }: { conclusion: string }) {
  const isNG = conclusion === "NG";
  return (
    <span
      className={`inline-block px-4 py-2 rounded-xl font-bold text-sm ${
        isNG ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-primary-light text-primary border border-primary/30"
      }`}
    >
      {isNG ? "自治体では回収不可（専門業者が必要）" : `自治体の${conclusion}で出せる`}
    </span>
  );
}

/** 買取推奨時の「捨てるのはもったいない」注意バッジ */
function SellRecommendBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm bg-danger/10 text-danger border border-danger/30">
      <span aria-hidden className="text-base leading-none">⚠</span>
      ※捨てるのはもったいない！まずは査定を推奨
    </span>
  );
}

export default async function DisposeItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getDisposeItemBySlug(slug);
  if (!item) notFound();
  const category = getCategoryById(item.categoryId);

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/dispose" className="hover:text-primary">捨て方辞典</Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/dispose/category/${category.slug}`} className="hover:text-primary">{category.shortName}</Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span>{item.name}</span>
      </p>

      <h1 className="text-2xl font-bold text-primary">
        {item.name}の捨て方決定版｜費用相場・買取・供養まで解説
      </h1>

      {/* 結論: 自治体で捨てられるか？ */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-3">結論：自治体で捨てられる？</h2>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <ConclusionBadge conclusion={item.gomiConclusion} />
          {item.canSell && <SellRecommendBadge />}
        </div>
        <p className="text-sm text-foreground/70">{item.costNote}</p>
        {item.canSell && item.sellNote && (
          <p className="text-sm text-foreground/70 mt-2">買取：{item.sellNote}</p>
        )}
      </section>

      {/* 処分方法3選 */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">処分方法3選</h2>
        </div>
        <ul className="divide-y divide-border">
          <li className="p-6">
            <h3 className="font-bold text-foreground mb-2">A. 自治体のゴミに出す</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{item.methodA}</p>
          </li>
          <li className="p-6">
            <h3 className="font-bold text-foreground mb-2">B. 買取に出す</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{item.methodB}</p>
          </li>
          <li className="p-6">
            <h3 className="font-bold text-foreground mb-2">C. 業者に回収してもらう</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{item.methodC}</p>
          </li>
        </ul>
      </section>

      {/* 買取相場例テーブル */}
      {(() => {
        const examples = getBuybackExamples(item.slug, item.categoryId);
        if (examples.length === 0) return null;
        return (
          <section className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-accent/10">
              <h2 className="font-bold text-accent">
                実はこんなに高く売れる？買取実績例
              </h2>
              <p className="text-xs text-foreground/60 mt-1">
                相場は状態・時期により変動します。まずは査定がおすすめです。
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      品目名
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      買取相場例（概算）
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((ex, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/80 hover:bg-primary-light/20 transition"
                    >
                      <td className="py-3 px-4">{ex.itemName}</td>
                      <td className="py-3 px-4 font-medium text-primary">
                        {ex.priceRange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })()}

      {/* ふれあいの丘からのアドバイス */}
      <section className="bg-primary-light/50 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-3">「ふれあいの丘」からのアドバイス</h2>
        <p className="text-foreground/85 leading-relaxed">{item.adviceFureai}</p>
      </section>

      {item.memorialNote && (
        <section className="bg-amber-50/80 rounded-2xl border border-amber-200/60 p-6">
          <h2 className="font-bold text-amber-900/90 mb-3">供養について</h2>
          <p className="text-foreground/80 leading-relaxed">{item.memorialNote}</p>
        </section>
      )}

      <DisposeItemLineCTA itemName={item.name} ctaType={item.ctaType} />

      {/* 捨て方辞書 → 間取り別費用・診断へのクロスリンク（蜘蛛の巣） */}
      <DisposeToCostCrossLink />

      <div className="flex flex-wrap gap-3">
        {category && (
          <Link href={`/dispose/category/${category.slug}`} className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
            ← {category.shortName}一覧へ
          </Link>
        )}
        <Link href="/dispose" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          捨て方辞典トップへ
        </Link>
        <Link href="/guide" className="inline-block text-primary font-medium hover:underline">
          実家の整理をまるごと相談する
        </Link>
      </div>
    </div>
  );
}
