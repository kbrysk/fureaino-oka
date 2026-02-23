import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogList, getCategories } from "../../../lib/microcms";
import type { MicroCmsBlogPost } from "../../../lib/microcms-types";
import { pageTitle } from "../../../lib/site-brand";
import ArticleCardMicroCms from "../../../components/articles/ArticleCardMicroCms";
import AdSlotInfeed from "../../../components/articles/AdSlotInfeed";

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

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categorySlug: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.id === categorySlug);
  if (!category) return { title: pageTitle("記事一覧") };
  return {
    title: pageTitle(`${category.name}｜記事一覧`),
    description: `${category.name}の記事一覧。生前整理・実家じまいに関するコラムです。`,
  };
}

export default async function ArticlesCategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const [categories, listRes] = await Promise.all([
    getCategories(),
    getBlogList(100, 0, { categoryId: categorySlug }),
  ]);
  const contents = listRes.contents ?? [];
  const category = categories.find((c) => c.id === categorySlug);
  if (!category) notFound();
  const gridItems = buildGridItems(contents);

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/articles" className="hover:text-primary">記事一覧</Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </p>
      <div>
        <h1 className="text-2xl font-bold text-primary">{category.name}</h1>
        <p className="text-foreground/60 mt-1">
          {category.name}に関する記事一覧です。
        </p>
      </div>
      {contents.length === 0 ? (
        <p className="text-foreground/50">このカテゴリの記事はまだありません。</p>
      ) : (
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
      )}
      <div className="flex flex-wrap gap-3">
        <Link href="/articles" className="inline-block text-primary font-medium hover:underline">
          ← 記事一覧へ
        </Link>
        <Link href="/guide" className="inline-block text-primary font-medium hover:underline">
          実家じまいの進め方 全手順
        </Link>
      </div>
    </div>
  );
}
