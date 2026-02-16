import Link from "next/link";
import EmptyHouseTaxSimulator from "../../components/EmptyHouseTaxSimulator";
import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("空き家税金シミュレーター"),
  description: "空き家の固定資産税・維持費の目安を無料でシミュレーション。",
};

export default function EmptyHouseTaxPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          空き家税金シミュレーター
        </h1>
        <p className="text-foreground/60 mt-1">
          空き家の固定資産税・維持費の目安を無料でシミュレーション。都道府県と建物種別で概算します。
        </p>
        <p className="text-sm text-foreground/70 mt-2">
          お住まいの地域別のシミュレーションは
          <Link href="/area" className="text-primary hover:underline ml-1">地域一覧</Link>
          から市区町村を選ぶと、その地域の維持費目安が初期値で表示されます。
        </p>
      </div>
      <EmptyHouseTaxSimulator compact={false} />
      <div className="bg-card rounded-xl p-5 border border-border">
        <p className="text-sm text-foreground/60">
          実際の税額は評価額・自治体により異なります。空き家の場合は特例措置（更地より軽減など）の対象になる場合もあります。売却・活用のご相談は
          <Link href="/guide" className="text-primary hover:underline ml-1">はじめかた</Link>
          から提携サービスをご案内しています。
        </p>
      </div>
      <Link
        href="/tools"
        className="inline-block text-primary font-medium hover:underline"
      >
        ← ツール一覧へ
      </Link>
    </div>
  );
}
