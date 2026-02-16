"use client";

import Link from "next/link";

/**
 * 利用者事例（お客様の声）3件
 * PC：3列横並び / スマホ：横スクロール
 * 悩み → きっかけ → 解決後・CTA
 */
const CASES = [
  {
    id: "case1",
    label: "遠方の実家を心配する娘",
    persona: "50代女性、パート勤務。実家は新幹線で3時間の距離。",
    before: "親は「まだ大丈夫」と言うが、家中にモノが溢れ、転倒や火災が不安。",
    point: "「ふれあいの丘」のシミュレーターで具体的なリスクを数値化して親に見せたところ、親自身が「これはまずい」と納得。",
    after: "喧嘩せずに片付けがスタートした。",
    visualHint: "スマホを操作しながら、少し安心した表情の女性",
    icon: "phone",
  },
  {
    id: "case2",
    label: "家族に迷惑をかけたくない父",
    persona: "70代男性、定年退職後。",
    before: "自分が亡くなった後、この大量の蔵書や家財を子供たちが処分する苦労を思うと夜も眠れない。",
    point: "チェックリストを使って「残すもの」と「手放すもの」を可視化したことで、気持ちが軽くなった。",
    after: "モノを捨てるのではなく、整理することが「家族への最後の贈り物」だと気づけた。",
    visualHint: "エンディングノートや写真整理をしている、シワのある温かみのある手元",
    icon: "notebook",
  },
  {
    id: "case3",
    label: "効率重視の息子",
    persona: "40代男性、都内勤務の会社員。",
    before: "忙しくて帰省する暇がない。ネットで業者を探すと怪しいサイトばかりで、どこを信じていいか分からない。",
    point: "公的な信頼感がある「ふれあいの丘」経由で、地元の優良業者とマッチング。",
    after: "Web完結で進められたため、仕事への支障もなく最短距離で完了した。",
    visualHint: "カフェやオフィスで、PCやタブレットをスマートに操作する男性の手元",
    icon: "laptop",
  },
];

type Case = (typeof CASES)[number];

/** 1件目用：公園ベンチ・スマホの実写画像（右下の生成マークはトリミングで非表示） */
function Case1Image() {
  return (
    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/fv-park-bench.png"
        alt="公園のベンチでスマートフォンを手にリラックスする女性"
        className="h-full w-full object-cover object-top"
        width={640}
        height={480}
      />
    </div>
  );
}

/** 2件目用：公園のベンチで古い写真とノートを見る男性（右下の生成マークはトリミングで非表示） */
function Case2Image() {
  return (
    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/testimonial-case2-photos.png"
        alt="公園のベンチで古い写真とノートを手に穏やかに見つめる男性"
        className="h-full w-full object-cover object-top"
        width={640}
        height={480}
      />
    </div>
  );
}

/** 3件目用：公園のベンチでタブレットを操作する男性（上下の白枠を拡大トリミングで除去） */
function Case3Image() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/testimonial-case3-tablet.png"
        alt="公園のベンチでタブレットを手に集中して操作する男性"
        className="absolute inset-0 h-full w-full object-cover object-center block min-h-full min-w-full scale-[1.15]"
        width={640}
        height={480}
      />
    </div>
  );
}

function VisualPlaceholder({ icon, alt }: { icon: string; alt: string }) {
  const base = "w-full aspect-[4/3] rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-light/60 to-primary/10 border border-primary/20";
  return (
    <div className={base} aria-hidden>
      {icon === "phone" && (
        <svg className="w-16 h-16 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )}
      {icon === "notebook" && (
        <svg className="w-16 h-16 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      {icon === "laptop" && (
        <svg className="w-16 h-16 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
      <span className="sr-only">{alt}</span>
    </div>
  );
}

function TestimonialCard({ case_: c }: { case_: Case }) {
  return (
    <article className="h-full flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="mb-4">
          {c.id === "case1" && <Case1Image />}
          {c.id === "case2" && <Case2Image />}
          {c.id === "case3" && <Case3Image />}
        </div>
        <p className="text-xs text-foreground/50 mb-3">
          ※個人の感想です　※特定を避けるため一部内容を加工しています
        </p>
        <h3 className="text-base font-bold text-primary mb-2">{c.label}</h3>
        <p className="text-xs text-foreground/60 mb-3">（{c.persona}）</p>
        <dl className="space-y-3 text-sm flex-1">
          <div>
            <dt className="font-medium text-foreground/80 mb-0.5">悩み</dt>
            <dd className="text-foreground/70 pl-0">{c.before}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground/80 mb-0.5">きっかけ</dt>
            <dd className="text-foreground/70 pl-0">{c.point}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground/80 mb-0.5">解決後</dt>
            <dd className="text-foreground/70 pl-0">{c.after || "—"}</dd>
          </div>
        </dl>
        <div className="mt-5 pt-4 border-t border-border">
          <Link
            href="/tools/jikka-diagnosis"
            className="inline-block text-sm font-medium text-accent hover:underline"
          >
            私もまずは診断してみる →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function UserTestimonialsSlider() {
  return (
    <section className="space-y-4" aria-label="利用者事例">
      <h2 className="text-center text-lg sm:text-xl font-bold text-primary">
        これまで数多くの方が、家族の未来を整理されました
      </h2>

      {/* PC：3列横並び / スマホ：横スクロール */}
      <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex md:grid md:grid-cols-3 gap-4 pb-2 md:pb-0 min-w-0">
          {CASES.map((c) => (
            <div
              key={c.id}
              className="flex-shrink-0 w-[85vw] min-w-[280px] md:w-auto md:min-w-0"
            >
              <TestimonialCard case_={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
