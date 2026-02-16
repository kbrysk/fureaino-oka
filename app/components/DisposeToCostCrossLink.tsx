import Link from "next/link";

/**
 * 捨て方辞典 → 間取り別費用・実家じまい診断へのクロスリンク（トピッククラスター・蜘蛛の巣）
 * 「点」（品目処分）を「面」（家全体の整理）に引き上げ、診断・相談へ送客
 */
export default function DisposeToCostCrossLink() {
  return (
    <section className="bg-card rounded-2xl border border-border p-6">
      <h2 className="font-bold text-primary mb-2">これ1つだけなら粗大ゴミですが、もし部屋ごと片付けるなら</h2>
      <p className="text-sm text-foreground/70 mb-4">
        家全体の遺品整理・実家じまいの相場や、今の実家のリスクを無料で診断できます。
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/cost"
          className="block p-4 rounded-xl border-2 border-primary/30 bg-primary-light/30 hover:border-primary/60 hover:bg-primary-light/50 transition"
        >
          <span className="font-bold text-primary block">間取り別 片付け費用相場</span>
          <span className="text-xs text-foreground/60">1K〜5LDKの相場・トラック台数・松竹梅の料金例</span>
        </Link>
        <Link
          href="/tools/jikka-diagnosis"
          className="block p-4 rounded-xl border-2 border-primary/30 bg-primary-light/30 hover:border-primary/60 hover:bg-primary-light/50 transition"
        >
          <span className="font-bold text-primary block">実家じまい力診断（3分で無料）</span>
          <span className="text-xs text-foreground/60">今の実家のリスク度をチェック・結果をLINEで受け取る</span>
        </Link>
      </div>
    </section>
  );
}
