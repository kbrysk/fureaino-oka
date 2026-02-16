import Link from "next/link";
import { SENRYU_CATEGORIES, getSenryuByCategory } from "../lib/senryu-data";
import { pageTitle } from "../lib/site-brand";
import OwlCharacter from "../components/OwlCharacter";
import SenryuCard from "../components/SenryuCard";

export const metadata = {
  title: pageTitle("実家じまい川柳｜ふれあいの丘"),
  description:
    "実家じまい・遺品整理のあるあるや哀愁を、ふれあいの丘のフクロウが川柳で詠みました。共感ボタンで「わかる！」「座布団一枚！」を。みんなの川柳も募集中。",
};

export default function SenryuPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <OwlCharacter size={80} className="shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-primary">実家じまい川柳</h1>
          <p className="text-foreground/60 mt-1">
            ふれあいの丘のフクロウが詠む、実家じまい・遺品整理の「あるある」と哀愁。休憩がてら、共感したらボタンを押してみてください。
          </p>
        </div>
      </div>

      {SENRYU_CATEGORIES.map((cat) => {
        const items = getSenryuByCategory(cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} className="space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-2">
              {cat.name}
            </h2>
            <p className="text-sm text-foreground/60">{cat.description}</p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item.id}>
                  <SenryuCard id={item.id} text={item.text} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* みんなの実家じまい川柳 投稿キャンペーン */}
      <section className="bg-primary-light/40 rounded-2xl border border-primary/20 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-primary mb-2">みんなの実家じまい川柳を募集しています</h2>
        <p className="text-sm text-foreground/70 mb-4">
          あなたの「あるある」やエピソードを川柳で送ってください。採用された方には<strong>Amazonギフト券500円分</strong>または<strong>特製エンディングノート</strong>をプレゼント。サイトに掲載させていただきます。
        </p>
        <p className="text-xs text-foreground/60 mb-4">
          投稿にはメールアドレスまたはLINE登録が必要です。採用の連絡のみに使用し、営業メールは送りません。
        </p>
        <Link
          href="/senryu/submit"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
        >
          川柳を投稿する
        </Link>
      </section>

      <p className="text-sm text-foreground/50">
        <Link href="/" className="text-primary hover:underline">トップへ戻る</Link>
      </p>
    </div>
  );
}
