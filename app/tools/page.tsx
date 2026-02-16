import Link from "next/link";
import ToolCardIcon from "../components/ToolCardIcon";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";

export const metadata = {
  title: pageTitle("無料ツール"),
  description:
    `空き家の維持費シミュレーション、資産・査定の目安など、生前整理に役立つ無料ツール。${SITE_NAME_FULL}。`,
};

const OWL_IMAGE = "/images/owl-character.png";

const tools = [
  {
    slug: "inheritance-share",
    title: "法定相続分シミュレーター",
    description: "家族構成を入力すると民法の法定相続分を円グラフで表示。家系図をエンディングノートへ保存。",
    href: "/tools/inheritance-share",
  },
  {
    slug: "hoji-calendar",
    title: "法要カレンダー",
    description: "命日を入力すると初七日から三十三回忌までの日程表を生成。Googleカレンダーに追加可能。",
    href: "/tools/hoji-calendar",
  },
  {
    slug: "digital-shame",
    title: "デジタル遺品リスク診断",
    description: "「見られたくないデータ」のリスクを診断。結果をXでシェア、エンディングノートへ導線。",
    href: "/tools/digital-shame",
  },
  {
    slug: "jikka-diagnosis",
    title: "実家じまい力診断",
    description: "約10問で実家のリスク度を診断。結果をLINEで家族に送って会議のきっかけに。",
    href: "/tools/jikka-diagnosis",
  },
  {
    slug: "akiya-risk",
    title: "空き家リスク診断",
    description: "約8問で実家が空き家予備軍かがわかる。結果をLINEで送って会議を開こう。",
    href: "/tools/akiya-risk",
  },
  {
    slug: "souzoku-prep",
    title: "相続準備力診断",
    description: "約10問で相続の準備度をチェック。結果を家族に送って準備のきっかけに。",
    href: "/tools/souzoku-prep",
  },
  {
    slug: "empty-house-tax",
    title: "空き家税金シミュレーター",
    description: "都道府県と建物種別で年間維持費の目安を即表示。",
    href: "/tools/empty-house-tax",
  },
  {
    slug: "appraisal",
    title: "資産・査定の目安",
    description: "持ち物の査定目安を確認。無料一括見積もりへ。",
    href: "/tools/appraisal",
  },
  {
    slug: "checklist",
    title: "チェックリスト",
    description: "生前整理の項目を確認し、進捗を可視化。",
    href: "/checklist",
  },
  {
    slug: "area",
    title: "地域別 粗大ゴミ・遺品整理",
    description: "東京23区の粗大ゴミ申し込み・遺品整理相談。無料見積もりで比較。",
    href: "/area",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">無料ツール</h1>
        <p className="text-foreground/60 mt-1">
          生前整理の進捗や資産の目安を可視化するツールです。
        </p>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link
              href={t.href}
              className="flex gap-4 bg-card rounded-2xl p-5 border border-border hover:shadow-lg hover:border-primary/40 transition overflow-hidden"
            >
              <ToolCardIcon slug={t.slug} />
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h2 className="font-bold text-base text-primary leading-tight">{t.title}</h2>
                <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{t.description}</p>
              </div>
              <div className="hidden sm:flex shrink-0 self-center w-10 h-10 rounded-xl overflow-hidden bg-primary-light/30 border border-primary/20 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={OWL_IMAGE} alt="" width={28} height={28} className="object-contain w-7 h-7" aria-hidden />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* トピッククラスター：はじめかた・費用・捨て方への送客 */}
      <section className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-3">あわせて読む</h2>
        <p className="text-sm text-foreground/70 mb-4">
          進め方の全体像、間取り別の費用相場、品目別の捨て方は以下のページでまとめています。
        </p>
        <ul className="grid gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/guide"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              実家じまいの進め方 全手順
            </Link>
          </li>
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
        </ul>
      </section>
    </div>
  );
}
