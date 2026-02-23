import Link from "next/link";
import { getBlogList, getCategories, getTags } from "../lib/microcms";
import type { MicroCmsBlogPost } from "../lib/microcms-types";
import { pageTitle } from "../lib/site-brand";
import ArticleCardMicroCms from "../components/articles/ArticleCardMicroCms";
import AdSlotInfeed from "../components/articles/AdSlotInfeed";

export const metadata = {
  title: pageTitle("記事一覧"),
  description:
    "生前整理・実家の片付け・終活に関する記事。進め方、処分、資産、デジタル遺品まで。",
};

const INFEED_AD_POSITIONS = [3, 7];

type GridItem =
  | { type: "card"; post: MicroCmsBlogPost }
  | { type: "ad"; key: string };

function buildGridItems(contents: MicroCmsBlogPost[]): GridItem[] {
  const items: GridItem[] = [];
  let cardIndex = 0;
  for (let pos = 1; pos <= contents.length + INFEED_AD_POSITIONS.length; pos++) {
    if (INFEED_AD_POSITIONS.includes(pos)) {
      items.push({ type: "ad", key: `ad-${pos}` });
    } else if (cardIndex < contents.length) {
      items.push({ type: "card", post: contents[cardIndex] });
      cardIndex++;
    }
  }
  return items;
}

export default async function ArticlesPage() {
  const [{ contents }, categories, tags] = await Promise.all([
    getBlogList(24, 0),
    getCategories(),
    getTags(),
  ]);
  const gridItems = buildGridItems(contents);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">記事一覧</h1>
        <p className="text-foreground/60 mt-1">
          生前整理の進め方やお悩みに役立つコラムです。
        </p>
      </div>

      {/* カテゴリ（縦軸）ナビ：microCMS の categories API */}
      {categories.length > 0 && (
        <section className="bg-card rounded-2xl border border-border p-4 sm:p-6">
          <h2 className="text-sm font-bold text-foreground/70 mb-3">カテゴリから探す</h2>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/articles/category/${c.id}`}
                  className="inline-block px-4 py-2 rounded-xl bg-primary-light/20 border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition text-sm font-medium text-foreground/90"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 状況に近いものは？（横軸タグ）：microCMS の tags API */}
      {tags.length > 0 && (
        <section className="bg-primary-light/20 rounded-2xl border border-primary/20 p-4 sm:p-6">
          <h2 className="text-sm font-bold text-primary mb-2">今のあなたの状況に近いものは？</h2>
          <p className="text-xs text-foreground/60 mb-3">
            ボタンを押すと、その状況に合った記事まとめページへ移動します。
          </p>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/articles/tag/${tag.id}`}
                  className="inline-block px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary-light/30 transition text-sm font-medium text-foreground/90"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="grid gap-6 md:grid-cols-2">
        {gridItems.map((item) =>
          item.type === "ad" ? (
            <li key={item.key} className="md:col-span-2">
              <AdSlotInfeed />
            </li>
          ) : (
            <ArticleCardMicroCms key={item.post.id} post={item.post} />
          )
        )}
      </ul>
      {contents.length === 0 && gridItems.length === 0 && (
        <p className="text-foreground/50">記事は準備中です。</p>
      )}

      {/* トピッククラスター：費用・捨て方・はじめかた・診断への送客 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-3">あわせて役立つコンテンツ</h2>
        <p className="text-sm text-foreground/70 mb-4">
          間取り別の費用相場、品目別の捨て方、進め方の全体像、無料診断ができます。
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <Link
              href="/cost"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              間取り別 遺品整理費用相場
            </Link>
          </li>
          <li>
            <Link
              href="/dispose"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              捨て方辞典（品目別）
            </Link>
          </li>
          <li>
            <Link
              href="/guide"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              実家じまいの進め方 全手順
            </Link>
          </li>
          <li>
            <Link
              href="/tools/jikka-diagnosis"
              className="block py-3 px-4 rounded-xl border-2 border-primary bg-primary-light/30 hover:bg-primary hover:text-white transition font-medium text-primary text-sm"
            >
              実家じまい力診断（3分）
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
