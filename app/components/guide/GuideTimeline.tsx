import Link from "next/link";
import FukuroSpeech from "./FukuroSpeech";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  linkVariant?: "affiliate";
  fukuroMessage: string;
}

const STEPS: GuideStep[] = [
  {
    id: "step-1",
    title: "Step 1: 家族で話し合う「キッカケ」を作ろう",
    description:
      "いきなり「実家のこと、どうする？」と切り出すのは、親にとっても子供にとっても勇気がいります。まずは「あるある」を共有して、笑いながら心のハードルを下げましょう。",
    linkHref: "/senryu",
    linkLabel: "👉 家族で笑える『実家じまい川柳』を見る",
    fukuroMessage:
      "重い話題こそ、ユーモアが大事だホゥ！川柳をLINEで家族に送って、会話の糸口にするのがおすすめだよ。",
  },
  {
    id: "step-2",
    title: "Step 2: 何が・どこにあるか「現状把握」する",
    description:
      "いざという時に家族が困らないよう、まずは資産や持ち物の「目録」を作りましょう。スマホの中にあなただけのデジタル金庫を作ります。",
    linkHref: "/assets",
    linkLabel: "👉 『資産・持ち物』ツールに登録する（無料）",
    fukuroMessage:
      "『資産』って難しく聞こえるけど、最初は『通帳の場所』をメモするだけで十分だホゥ！金額は空欄でもOK！",
  },
  {
    id: "step-3",
    title: "Step 3: やるべきことを整理し、家族で「分担」する",
    description:
      "一人で抱え込むのは危険です。やるべきタスクを可視化し、兄弟や親戚と「誰が何をやるか」を決めましょう。",
    linkHref: "/checklist",
    linkLabel: "👉 『チェックリスト』を開いてLINEで家族に共有する",
    fukuroMessage:
      "『これ、お兄ちゃんにお願い！』って担当を振り分ける機能があるから、絶対に使ってみてほしいホゥ！",
  },
  {
    id: "step-4",
    title: "Step 4: 粗大ゴミの処分と、使える「補助金」の確認",
    description:
      "実家の片付けで一番お金と体力がかかるのが「ゴミの処分」です。自治体の補助金を使えば、費用を劇的に抑えられます。",
    linkHref: "/area",
    linkLabel: "👉 お住まいの地域の『粗大ゴミ・補助金情報』を検索する",
    fukuroMessage:
      "補助金は『知っている人だけが得をする』制度だホゥ。損しないように必ず自分の自治体をチェックするんだヨ！",
  },
  {
    id: "step-5",
    title: "Step 5: 負動産にしないための「価値の把握」と「査定」",
    description:
      "空き家を放置すると、固定資産税が跳ね上がり「負動産」になります。今すぐ売らなくても、「今いくらの価値があるか」を知っておくことが最大の防衛策です。",
    linkHref: "/assets",
    linkLabel: "👉 【完全無料】AIで実家の価値を一括査定する",
    linkVariant: "affiliate",
    fukuroMessage:
      "『まだ売らないから』と後回しにするのが一番危険だホゥ。価値を知るだけで、心の余裕が全然違うヨ！",
  },
];

export default function GuideTimeline() {
  return (
    <div className="relative">
      {/* 縦線（タイムライン）: 左端に配置、スマホ時も中央寄せで崩れない */}
      <div className="absolute left-[11px] sm:left-6 top-0 bottom-0 w-0.5 sm:w-1 bg-primary/20 rounded-full pointer-events-none" aria-hidden />
      <ul className="space-y-0 list-none pl-0">
        {STEPS.map((step, index) => (
          <li key={step.id} className="relative pl-10 sm:pl-14 pb-10 last:pb-0">
            {/* ノード（丸） */}
            <div
              className="absolute left-0 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 border-2 border-background"
              aria-hidden
            >
              {index + 1}
            </div>
            <section
              id={step.id}
              className="bg-card rounded-xl border border-border p-5 sm:p-6 scroll-mt-24"
              aria-labelledby={`${step.id}-title`}
            >
              <h2 id={`${step.id}-title`} className="text-lg font-bold text-primary mb-3">
                {step.title}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-sm sm:text-base mb-4">{step.description}</p>
              <div className="mb-4">
                <Link
                  href={step.linkHref}
                  className={
                    step.linkVariant === "affiliate"
                      ? "inline-block px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                      : "inline-block px-4 py-2.5 rounded-lg text-sm font-medium text-primary bg-primary-light/50 hover:bg-primary-light border border-primary/20 transition-colors"
                  }
                >
                  {step.linkLabel}
                </Link>
              </div>
              <FukuroSpeech message={step.fukuroMessage} owlSize={40} className="mt-3" />
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
}
