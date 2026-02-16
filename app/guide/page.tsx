"use client";

import Link from "next/link";
import EmailCTA from "../components/EmailCTA";
import OwlAizuchi from "../components/OwlAizuchi";

const STEPS = [
  {
    number: 1,
    title: "気持ちの整理をする",
    priority: "最優先",
    description:
      "生前整理は「捨てる作業」ではありません。まず、自分がこれからどう暮らしたいかを考えることから始めます。何を大切にしたいか、誰に何を残したいか。気持ちの整理が、物の整理の指針になります。",
    tips: [
      "「これからの暮らしで本当に必要なもの」を考える",
      "家族と話し合い、想いを共有する",
      "一度にすべてやろうとせず、少しずつ進める",
    ],
    link: "/ending-note",
    linkLabel: "エンディングノートに書き出す",
  },
  {
    number: 2,
    title: "財産・お金の全体像を把握する",
    priority: "最優先",
    description:
      "預貯金、不動産、保険、年金など、お金に関することを一覧にします。家族があとで困らないよう、どこに何があるかを明確にしておくことが最も重要です。",
    tips: [
      "通帳・証書・権利証の保管場所を記録する",
      "ローンや借入金も含めて書き出す",
      "クレジットカード・サブスクを棚卸しする",
      "遺言書の作成を検討する",
    ],
    link: "/checklist",
    linkLabel: "チェックリストで確認する",
  },
  {
    number: 3,
    title: "デジタル資産を整理する",
    priority: "重要",
    description:
      "メール、SNS、ネットバンキング、サブスクリプション。現代ではデジタルの整理も欠かせません。パスワードやアカウント情報を安全に記録しておきましょう。",
    tips: [
      "メール・SNSのアカウント一覧を作る",
      "パスワードを信頼できる方法で記録する",
      "不要なサブスクリプションを解約する",
      "スマホ・PCの写真やデータを整理する",
    ],
    link: "/checklist",
    linkLabel: "デジタル整理の項目を確認",
  },
  {
    number: 4,
    title: "持ち物を分類・整理する",
    priority: "大切",
    description:
      "衣類、書籍、趣味の品、家具など、身の回りの物を「残す・譲る・処分する」に分類します。思い出の品は写真に残すのも良い方法です。",
    tips: [
      "部屋ごとに少しずつ進める",
      "「1年以上使っていないもの」を基準にする",
      "思い出の品は写真で記録してから手放す",
      "譲りたい人がいれば、元気なうちに渡す",
    ],
    link: "/assets",
    linkLabel: "資産・持ち物を登録する",
  },
  {
    number: 5,
    title: "医療・葬儀の希望を伝える",
    priority: "大切",
    description:
      "延命治療や臓器提供の意思、葬儀の形式やお墓のこと。元気なうちに考え、書き残し、家族に伝えておくことで、いざという時に家族が迷いません。",
    tips: [
      "延命治療について自分の考えを整理する",
      "かかりつけ医や常備薬を記録する",
      "葬儀の規模や形式の希望を書く",
      "お墓の場所や管理について確認する",
    ],
    link: "/ending-note",
    linkLabel: "エンディングノートに記入する",
  },
  {
    number: 6,
    title: "人間関係を大切にする",
    priority: "いつでも",
    description:
      "お世話になった方へのお礼、家族への感謝。生前整理は「終わり」の準備ではなく、残りの人生をより豊かにするための取り組みです。",
    tips: [
      "連絡先リストを作成する",
      "会いたい人に会いに行く",
      "感謝の気持ちを手紙や言葉で伝える",
      "家族と定期的に話し合う機会をつくる",
    ],
    link: "/ending-note",
    linkLabel: "連絡先リストを作成する",
  },
];

const PRINCIPLES = [
  {
    title: "完璧を目指さない",
    description:
      "すべてを一度に終わらせる必要はありません。今日できることを1つやるだけで十分です。",
  },
  {
    title: "「捨てる」ではなく「選ぶ」",
    description:
      "何を捨てるかではなく、何を残したいかを考えましょう。前向きな気持ちで進められます。",
  },
  {
    title: "家族と一緒に",
    description:
      "一人で抱え込まず、家族や信頼できる人と話し合いながら進めましょう。",
  },
  {
    title: "定期的に見直す",
    description:
      "状況や気持ちは変わるもの。年に一度は見直して、内容を更新しましょう。",
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  最優先: "bg-red-100 text-red-700",
  重要: "bg-orange-100 text-orange-700",
  大切: "bg-blue-100 text-blue-700",
  いつでも: "bg-green-100 text-green-700",
};

export default function GuidePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-primary">
          生前整理のはじめかた
        </h1>
        <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
          何から始めればいいか分からない方へ。
          <br />
          考え方・優先順位・具体的なステップをご案内します。
        </p>
      </div>

      {/* What is 生前整理 */}
      <div className="bg-card rounded-2xl p-8 border border-border">
        <h2 className="text-xl font-bold text-primary mb-4">
          そもそも生前整理とは？
        </h2>
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <p>
            生前整理とは、<strong>元気なうちに</strong>
            自分の持ち物・財産・想いを整理し、
            大切な人が困らないよう準備をしておくことです。
          </p>
          <p>
            「終活」という言葉にネガティブな印象を持つ方もいますが、
            生前整理の本質は<strong>「残りの人生をより良くする」</strong>
            ための前向きな取り組みです。
          </p>
          <div className="bg-primary-light rounded-xl p-5 mt-4">
            <p className="font-medium text-primary">
              整理を終えた方の多くが語ること：
            </p>
            <ul className="mt-2 space-y-1 text-foreground/70">
              <li>「気持ちがすっきりして、毎日が楽になった」</li>
              <li>「家族と話すきっかけができた」</li>
              <li>「本当に大切なものが分かった」</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <OwlAizuchi message="その通りだホー。前向きな取り組みです" position="right" size="m" />
        </div>
      </div>

      {/* Principles */}
      <div>
        <h2 className="text-xl font-bold text-primary mb-4">
          大切にしたい4つの考え方
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-foreground/60 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <OwlAizuchi message="いいですね。無理せず、一つずつで大丈夫です" position="right" size="m" />
        </div>
      </div>

      {/* Email CTA - mid page */}
      <EmailCTA
        variant="inline"
        heading="生前整理 完全ガイドブック（無料）"
        description="優先順位チェックシート・財産一覧テンプレート・家族への手紙の書き方など、すぐ使える資料をメールでお届けします。"
      />

      {/* Steps */}
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">
          6つのステップで進めよう
        </h2>
        <p className="text-foreground/50 mb-6">
          上から順に進めるのがおすすめですが、どこから始めても大丈夫です
        </p>

        <div className="space-y-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[step.priority]}`}
                      >
                        {step.priority}
                      </span>
                    </div>
                    <p className="text-foreground/60 leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="bg-background rounded-xl p-4 mb-4">
                      <p className="text-sm font-medium mb-2">
                        具体的にやること：
                      </p>
                      <ul className="space-y-1.5">
                        {step.tips.map((tip) => (
                          <li
                            key={tip}
                            className="text-sm text-foreground/60 flex items-start gap-2"
                          >
                            <span className="text-primary mt-0.5">&#10003;</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={step.link}
                      className="inline-block bg-primary-light text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      {step.linkLabel}
                    </Link>
                  </div>
                </div>
              </div>
              {/* ステップのあとにふくろうが相槌（2つごと） */}
              {step.number % 2 === 0 && (
                <div className="px-6 pb-4 flex justify-end">
                  <OwlAizuchi
                    message={step.number === 2 ? "なるほど、ここまでできたら安心ですね" : step.number === 4 ? "うんうん、少しずつで大丈夫です" : "その調子だホー"}
                    position="right"
                    size="s"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Flow */}
      <div className="bg-card rounded-2xl p-8 border border-border">
        <h2 className="text-xl font-bold text-primary mb-4">
          おすすめの進め方
        </h2>
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">
                まずはこのサイトのチェックリストを眺める（5分）
              </p>
              <p className="text-sm">
                全体像を把握するだけで、漠然とした不安が和らぎます
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">
                エンディングノートに気持ちを書いてみる（15分）
              </p>
              <p className="text-sm">
                完璧でなくていいので、思いつくことから書き始めましょう
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">
                財産・持ち物を1つだけ登録してみる（5分）
              </p>
              <p className="text-sm">
                使い方に慣れたら、少しずつ追加していきましょう
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold shrink-0">
              4
            </div>
            <div>
              <p className="font-medium text-foreground">
                週に1回、15分だけ続ける
              </p>
              <p className="text-sm">
                無理なく続けることが一番大切です。進捗はダッシュボードで確認できます
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <OwlAizuchi message="週に15分から、まずは一歩だホー" position="right" size="m" />
        </div>
      </div>

      {/* トピッククラスター：費用・捨て方・診断への送客 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-3">費用・品目別の情報もあわせて</h2>
        <p className="text-sm text-foreground/70 mb-4">
          間取り別の片付け相場、品目ごとの捨て方、今の実家のリスク診断ができます。
        </p>
        <ul className="grid gap-3 sm:grid-cols-3">
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
              href="/tools/jikka-diagnosis"
              className="block py-3 px-4 rounded-xl border-2 border-primary bg-primary-light/30 hover:bg-primary hover:text-white transition font-medium text-primary text-sm"
            >
              実家じまい力診断（3分）
            </Link>
          </li>
        </ul>
      </section>

      {/* Bottom CTA */}
      <EmailCTA
        variant="banner"
        heading="無料ガイドブックで、もっと詳しく"
        description="生前整理の進め方を50ページにまとめた完全ガイド（PDF）を無料でお届けします。"
      />

      {/* Start Button */}
      <div className="text-center">
        <Link
          href="/checklist"
          className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition"
        >
          さっそく始めてみる
        </Link>
      </div>
    </div>
  );
}
