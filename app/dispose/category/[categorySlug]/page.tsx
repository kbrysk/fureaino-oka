import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "../../../lib/dispose-categories";
import { getItemsByCategoryId } from "../../../lib/dispose-items";
import { pageTitle } from "../../../lib/site-brand";

type Props = { params: Promise<{ categorySlug: string }> };

const CATEGORY_SLUGS = ["memorial", "furniture", "appliance", "difficult", "hobby", "daily"];

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return { title: pageTitle("捨て方辞典") };
  return {
    title: pageTitle(category.name + "一覧"),
    description: `${category.description} ${category.name}の品目一覧。各品目の捨て方・費用相場・買取・供養を解説。`,
  };
}

export default async function DisposeCategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();
  const items = getItemsByCategoryId(category.id);

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/dispose" className="hover:text-primary">捨て方辞典</Link>
        <span className="mx-2">/</span>
        <span>{category.shortName}</span>
      </p>

      <div>
        <h1 className="text-2xl font-bold text-primary">{category.name}一覧</h1>
        <p className="text-foreground/60 mt-1">{category.description}</p>
      </div>

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
