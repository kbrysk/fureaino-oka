"use client";

import Link from "next/link";

interface SituationGuideProps {
  prefName: string;
  cityName: string;
}

const SCENARIOS = [
  {
    id: "remote",
    icon: (
      <svg className="w-6 h-6 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    titleKey: "remote",
    textKey: "remote",
    buttonText: "片付け・遺品整理の相場を見る ↓",
    href: "#cleanup-section",
  },
  {
    id: "butsudan",
    icon: (
      <svg className="w-6 h-6 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    titleKey: "butsudan",
    textKey: "butsudan",
    buttonText: "片付け・遺品整理の相場を見る ↓",
    href: "#cleanup-section",
  },
  {
    id: "gomi",
    icon: (
      <svg className="w-6 h-6 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    titleKey: "gomi",
    textKey: "gomi",
    buttonText: "ノムコムで現状の価値を査定する ↓",
    href: "#appraisal-section",
  },
  {
    id: "farm",
    icon: (
      <svg className="w-6 h-6 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    titleKey: "farm",
    textKey: "farm",
    buttonText: "ワケガイ等の専門業者に買取査定を依頼 ↓",
    href: "#appraisal-section",
  },
] as const;

/**
 * 状況別実家じまいトラブルシューティング＋ページ内アンカーCTA（Helpful Content・CVR導線）。
 */
export default function SituationGuide({ prefName, cityName }: SituationGuideProps) {
  const titles: Record<string, string> = {
    remote: `遠方にお住まいで${cityName}の実家を片付ける場合`,
    butsudan: "残された仏壇や神棚、遺影の処分について",
    gomi: "足の踏み場もないほど荷物が多い・ゴミ屋敷の場合",
    farm: "実家に農地（田畑）や山林が付属している場合",
  };
  const texts: Record<string, string> = {
    remote: `県外など遠方にお住まいの場合、何度も帰省して片付けるのは交通費と時間の大きな負担になります。最近は『立ち会い不要』で作業から処分まで一括対応してくれる業者も増えています。${cityName}の地元業者に任せるのが最も効率的です。`,
    butsudan: `実家に残った仏壇や神棚をそのまま粗大ゴミに出すことは精神的な抵抗が大きいものです。${cityName}の菩提寺がある場合は『閉眼供養（魂抜き）』の相談をしましょう。お寺がわからない場合は、供養提携のある専門業者に依頼すると安心です。`,
    gomi: `長年の荷物が積み重なり、ご家族だけでは手がつけられないケースも珍しくありません。無理に自力で片付けようとせず、${cityName}の不動産会社に『残置物あり（現状渡し）』のまま売却できないか査定を依頼し、片付け費用を売却益から相殺するのも一つの手です。`,
    farm: `${cityName}の郊外などで実家に農地が含まれる場合、『農地法』の制限により一般的な売却が非常に難しくなります。こうした特殊な物件は、一般的な仲介ではなく、訳あり物件に強い専門の買取業者へ早めに相談し、手放すルートを確保することが最優先です。`,
  };

  return (
    <section className="space-y-4" aria-labelledby="situation-guide-heading">
      <h2 id="situation-guide-heading" className="text-xl font-bold text-primary">
        よくあるケース別：{prefName}{cityName}の実家じまい・空き家処分ガイド
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            className="bg-card rounded-2xl border border-border overflow-hidden p-5 flex flex-col"
          >
            <div className="flex gap-3 mb-2">
              <span className="shrink-0" aria-hidden>{s.icon}</span>
              <h3 className="text-base font-bold text-foreground">{titles[s.titleKey]}</h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed flex-1">
              {texts[s.textKey]}
            </p>
            <Link
              href={s.href}
              className="bg-primary text-white rounded-md px-4 py-2 text-center text-sm font-bold hover:bg-primary/90 transition-colors mt-3 block"
            >
              {s.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
