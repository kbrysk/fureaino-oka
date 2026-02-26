import Link from "next/link";
import { DISPOSE_CATEGORIES } from "../lib/dispose-categories";
import { getItemsByCategoryId, DISPOSE_ITEMS } from "../lib/dispose-items";
import { getDisposalCategoryById } from "../../data/disposalItems";
import { pageTitle } from "../lib/site-brand";
import SearchBar from "../components/dispose/SearchBar";

export const metadata = {
  title: pageTitle("捨て方辞典｜品目別 処分方法・供養・買取相場"),
  description:
    "仏壇・金庫・布団・タンス・着物など、品目別の捨て方・費用相場・買取・供養を解説。供養・大型家具・家電・処理困難物・趣味・日用品のカテゴリ別一覧。",
};

export default function DisposeIndexPage() {
  const searchSuggestions = DISPOSE_ITEMS.map((i) => ({ slug: i.slug, name: i.name }));
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">捨て方辞典</h1>
        <p className="text-foreground/60 mt-1">
          品目別の処分方法・供養・買取の目安。自治体で捨てられるか、費用、業者依頼の選び方まで。気になるモノの捨て方を調べられます。
        </p>
      </div>

      <SearchBar
        placeholder="品目名で検索（例：仏壇、布団、パソコン）"
        suggestions={searchSuggestions}
        ariaLabel="捨て方辞典の品目を検索"
        showSuggestions={true}
      />

      {/* カテゴリートップ（トピッククラスター） */}
      <section>
        <h2 className="font-bold text-lg text-foreground/90 mb-4">カテゴリ別一覧</h2>
        <ul className="space-y-6">
          {DISPOSE_CATEGORIES.map((cat) => {
            const items = getItemsByCategoryId(cat.id);
            const masterCat = getDisposalCategoryById(cat.id);
            const masterItems = masterCat?.items ?? [];
            const hasDetailPages = items.length > 0;
            const hasMasterOnly = !hasDetailPages && masterItems.length > 0;
            if (!hasDetailPages && !hasMasterOnly) return null;
            return (
              <li key={cat.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-primary-light/20">
                  <Link href={`/dispose/category/${cat.slug}`} className="font-bold text-primary hover:underline">
                    {cat.name}
                  </Link>
                  <p className="text-sm text-foreground/60 mt-0.5">{cat.description}</p>
                </div>
                <ul className="p-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {hasDetailPages
                    ? items.slice(0, 8).map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/dispose/${item.slug}`}
                            className="block py-2 px-3 rounded-lg text-sm font-medium text-foreground/90 hover:bg-primary-light/40 hover:text-primary transition"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))
                    : masterItems.slice(0, 8).map((name) => (
                        <li key={name}>
                          <span className="block py-2 px-3 rounded-lg text-sm font-medium text-foreground/80">
                            {name}
                          </span>
                        </li>
                      ))}
                  {(hasDetailPages ? items.length > 8 : masterItems.length > 8) && (
                    <li className="sm:col-span-2 md:col-span-3 lg:col-span-4 flex items-center">
                      <Link
                        href={`/dispose/category/${cat.slug}`}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        {hasDetailPages
                          ? `このカテゴリの全${items.length}品目を見る →`
                          : `このカテゴリの全${masterItems.length}品目を見る →`}
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="bg-primary-light/40 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-2">実家まるごと片付けたい方へ</h2>
        <p className="text-sm text-foreground/80 mb-4">
          品目ごとの処分だけでなく、家全体の遺品整理・実家じまいの進め方や業者選びは「はじめかた」から。無料診断で実家の荷物量やリスクを把握できます。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tools/jikka-diagnosis"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition"
          >
            3分で無料診断する
          </Link>
          <Link
            href="/guide"
            className="inline-block bg-primary-light text-primary border border-primary/30 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary hover:text-white transition"
          >
            実家じまいのはじめかたを見る
          </Link>
        </div>
      </div>

      <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
        ← 無料ツール一覧へ
      </Link>
    </div>
  );
}
