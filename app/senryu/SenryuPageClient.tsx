"use client";

import { useMemo } from "react";
import Link from "next/link";
import OwlCharacter from "../components/OwlCharacter";
import SenryuCard from "../components/SenryuCard";
import { useSenryu } from "../hooks/useSenryu";
import { SENRYU_CATEGORIES, SENRYU_ITEMS, getSenryuByCategory } from "../lib/senryu-data";

export default function SenryuPageClient() {
  const { isMounted, setUserVote, getRankingTop3 } = useSenryu();

  const top3 = useMemo(() => {
    if (!isMounted) return [];
    const list = SENRYU_ITEMS ?? [];
    if (!Array.isArray(list) || list.length === 0) return [];
    return getRankingTop3(list);
  }, [isMounted, getRankingTop3]);

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

      {/* 🔥今週の共感トップ3 */}
      {isMounted && top3.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-2">
            🔥 今週の共感トップ3
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {top3.map((item, index) => (
              <li key={item.id}>
                <div className="relative bg-orange-50 rounded-xl border border-orange-200/80 pt-7 px-5 pb-5">
                  <span className="absolute top-2 left-2 text-sm font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded">
                    {index === 0 && "👑 1位"}
                    {index === 1 && "👑 2位"}
                    {index === 2 && "👑 3位"}
                  </span>
                  <SenryuCard
                    id={item.id}
                    text={item.text}
                    solutionLink={item.solutionLink}
                    onVote={setUserVote}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {SENRYU_CATEGORIES.map((cat) => {
        const items = getSenryuByCategory(cat.id);
        if (!items?.length) return null;
        return (
          <section key={cat.id} className="space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-2">
              {cat.name}
            </h2>
            <p className="text-sm text-foreground/60">{cat.description}</p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item.id}>
                  <SenryuCard
                    id={item.id}
                    text={item.text}
                    solutionLink={item.solutionLink}
                    onVote={setUserVote}
                  />
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
