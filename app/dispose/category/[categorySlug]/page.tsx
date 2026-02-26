import { notFound } from "next/navigation";
import Link from "next/link";
import { DISPOSE_CATEGORIES, getCategoryBySlug } from "../../../lib/dispose-categories";
import { getItemsByCategoryId } from "../../../lib/dispose-items";
import { getDisposalCategoryById } from "../../../../data/disposalItems";
import { getCategoryDetail } from "../../../../data/disposalCategoryDetails";
import { pageTitle } from "../../../lib/site-brand";
import SearchBar from "../../../components/dispose/SearchBar";

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateStaticParams() {
  return DISPOSE_CATEGORIES.map((cat) => ({ categorySlug: cat.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return { title: pageTitle("捨て方辞典") };
  const detail = getCategoryDetail(category.id);
  const title = detail?.title ?? category.name + "一覧";
  const description = detail?.lead ?? `${category.description} ${category.name}の品目一覧。各品目の捨て方・費用相場・買取・供養を解説。`;
  return {
    title: pageTitle(title),
    description,
  };
}

export default async function DisposeCategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const items = getItemsByCategoryId(category.id);
  const masterCategory = getDisposalCategoryById(category.id);
  const masterItemNames = masterCategory?.items ?? [];
  const detail = getCategoryDetail(category.id);

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/dispose" className="hover:text-primary">捨て方辞典</Link>
        <span className="mx-2">/</span>
        <span>{category.shortName}</span>
      </p>

      <SearchBar
        placeholder="このカテゴリ内で検索"
        suggestions={items.map((i) => ({ slug: i.slug, name: i.name }))}
        ariaLabel="捨て方辞典の品目を検索"
        showSuggestions={true}
      />

      {/* 解説コンテンツ（SEO・訴求用）：データがあるカテゴリのみ表示 */}
      {detail ? (
        <article className="space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-primary md:text-3xl">{detail.title}</h1>
            <p className="mt-3 text-foreground/80 leading-relaxed">{detail.lead}</p>
          </header>

          {detail.points.length > 0 && (
            <section className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-primary mb-4">処分の鉄則3選</h2>
              <ul className="space-y-4">
                {detail.points.map((point, i) => (
                  <li key={i}>
                    <h3 className="font-medium text-foreground">{point.title}</h3>
                    <p className="text-sm text-foreground/70 mt-0.5">{point.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {detail.priceTable.length > 0 && (
            <section className="bg-card rounded-2xl border border-border overflow-hidden">
              <h2 className="font-bold text-primary p-6 pb-0">費用相場・買取相場の目安</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px] text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-foreground">品目・内容</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">目安</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.priceTable.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-foreground/90">{row.item}</td>
                        <td className="py-3 px-4 text-foreground/90">{row.price}</td>
                        <td className="py-3 px-4 text-foreground/60">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <p className="text-sm text-foreground/60">
            以下に、このカテゴリの品目一覧を掲載しています。各品目の捨て方・費用・買取は個別ページで詳しく解説しています。
          </p>
        </article>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-primary">{category.name}一覧</h1>
          <p className="text-foreground/60 mt-1">{category.description}</p>
        </div>
      )}

      {items.length > 0 && (
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/dispose/${item.slug}`}
              className="block bg-card rounded-xl border border-border p-4 hover:border-primary/50 hover:bg-primary-light/30 transition"
            >
              <span className="font-bold text-primary">{item.name}</span>
              <p className="text-xs text-foreground/50 mt-1">
                {item.gomiConclusion === "NG" ? "自治体回収不可" : `自治体の${item.gomiConclusion}で出せる`}
              </p>
              {item.canSell && (
                <span className="inline-block mt-2 text-xs bg-primary-light text-primary px-2 py-0.5 rounded">買取あり</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      )}

      {items.length === 0 && masterItemNames.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-primary mb-3">このカテゴリの品目一覧</h2>
          <p className="text-sm text-foreground/60 mb-4">
            以下の品目について、捨て方・費用・買取の詳細ページを順次追加していきます。まとめて処分したい方は「実家の整理をまるごと相談」からご相談ください。
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {masterItemNames.map((name) => (
              <li key={name} className="py-2 px-3 rounded-lg bg-muted/40 text-sm text-foreground/90">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 部屋ごと片付けるなら：費用・診断へのクロスリンク（トピッククラスター） */}
      <section className="bg-primary-light/40 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-2">部屋ごと・家全体を片付けたい方へ</h2>
        <p className="text-sm text-foreground/70 mb-4">
          品目別の処分だけでなく、間取り別の費用相場や無料診断で実家の荷物量・リスクを把握できます。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cost"
            className="inline-block bg-card border-2 border-primary/30 text-primary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary hover:text-white transition"
          >
            間取り別 遺品整理費用相場
          </Link>
          <Link
            href="/tools/jikka-diagnosis"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition"
          >
            実家じまい力診断（3分で無料）
          </Link>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/dispose" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 捨て方辞典トップへ
        </Link>
        <Link href="/guide" className="inline-block text-primary font-medium hover:underline">
          実家の整理をまるごと相談する
        </Link>
      </div>
    </div>
  );
}
