import Link from "next/link";

/**
 * 記事 → 収益ページ（/area pSEO・/tax-simulator・診断ツール・ピラー）への
 * カテゴリ別「次の一歩」内部リンクブロック。
 *
 * 【戦略的意図 — 収束2「3つの孤立島の結合」】
 * docs/strategy/PANEL_02_SEO_STRUCTURE.md の中核指摘:
 *   「記事104本は収益ページへ1ミリもリンクしていない。テンプレ1箇所の改修で
 *    数千本のリンクに増幅でき、クロール網・トピカルオーソリティ・CV動線が
 *    同時に立ち上がる」
 *
 * このコンポーネントを記事テンプレに1度差すだけで、全記事から
 * /area（地域pSEO）・/tax-simulator系・各ツールへの文脈リンクが一括で張られる。
 * アンカーは「説明的（送り先トピックを正確に表す）」にして2026年SEOに最適化。
 */

type CategoryId =
  | "guide"
  | "cleanup"
  | "inheritance"
  | "real-estate"
  | "digital"
  | "mental";

interface ContextLink {
  href: string;
  label: string;
  sub: string;
  icon: string;
  /** 収益直結リンクは強調表示 */
  emphasis?: boolean;
}

/** カテゴリ別の「次の一歩」リンクセット（最大3本）。全カテゴリが必ず /area を含む＝島の結合。 */
const LINKS_BY_CATEGORY: Record<CategoryId, ContextLink[]> = {
  // 空き家・不動産 → 収益の心臓部（固定資産税試算＋解体補助金＋売却査定へ）
  "real-estate": [
    { href: "/tools/empty-house-tax", label: "空き家の固定資産税を試算する", sub: "お住まいの地域・建物で1分シミュレーション", icon: "🏠", emphasis: true },
    { href: "/area", label: "地域の解体補助金を調べる", sub: "全国1,700超の市区町村別データ", icon: "📍" },
    { href: "/articles/master-guide", label: "実家じまい完全ガイド", sub: "片付け・補助金・売却の全手順", icon: "🧭" },
  ],
  // 相続・お金・手続き → 地域補助金＋相続シミュレーター＋固定資産税
  inheritance: [
    { href: "/area", label: "お住まいの地域の補助金・費用を調べる", sub: "市区町村別の解体補助金・粗大ゴミ情報", icon: "📍", emphasis: true },
    { href: "/tools/inheritance-share", label: "相続分シミュレーター", sub: "法定相続分の目安を計算（無料）", icon: "📊" },
    { href: "/tools/empty-house-tax", label: "相続した実家の固定資産税を試算", sub: "維持コストの目安を把握", icon: "🏠" },
  ],
  // 基礎・段取り → 地域費用＋実家じまい力診断＋ピラー
  guide: [
    { href: "/area", label: "地域の片付け費用・補助金を調べる", sub: "全国の市区町村別データ", icon: "📍", emphasis: true },
    { href: "/tools/jikka-diagnosis", label: "実家じまい力診断（約10問）", sub: "今のリスク度と次の一歩がわかる", icon: "✅" },
    { href: "/articles/master-guide", label: "実家じまい完全ガイド", sub: "何から始めるかが3ステップでわかる", icon: "🧭" },
  ],
  // 片付け・不用品処分 → 地域費用＋実家じまい力診断＋ピラー
  cleanup: [
    { href: "/area", label: "地域の片付け費用・粗大ゴミ情報を調べる", sub: "市区町村別の処分ルール・補助金", icon: "📍", emphasis: true },
    { href: "/tools/jikka-diagnosis", label: "実家じまい力診断（約10問）", sub: "片付けの進め方の指針に", icon: "✅" },
    { href: "/articles/master-guide", label: "実家じまい完全ガイド", sub: "片付け・買取・処分の全手順", icon: "🧭" },
  ],
  // 心・供養・終活 → エンディングノート＋ピラー＋地域
  mental: [
    { href: "/ending-note", label: "デジタルエンディングノートを書く", sub: "想いと情報を整理（無料・PIIは保存しません）", icon: "📓", emphasis: true },
    { href: "/articles/master-guide", label: "実家じまい・生前整理のはじめかた", sub: "何から始めるかがわかる完全ガイド", icon: "🧭" },
    { href: "/area", label: "お住まいの地域のサポート情報", sub: "市区町村別の補助金・費用相場", icon: "📍" },
  ],
  // デジタル遺品・契約 → デジタル診断＋エンディングノート＋地域
  digital: [
    { href: "/tools/digital-shame", label: "デジタル遺品リスク診断", sub: "見られたくないデータのリスクを診断", icon: "🔒", emphasis: true },
    { href: "/ending-note", label: "エンディングノートでアカウント整理", sub: "ID・サブスクを安全に書き残す", icon: "📓" },
    { href: "/area", label: "お住まいの地域の片付け・処分情報", sub: "市区町村別データ", icon: "📍" },
  ],
};

const DEFAULT_LINKS: ContextLink[] = [
  { href: "/area", label: "お住まいの地域の補助金・費用を調べる", sub: "全国1,700超の市区町村別データ", icon: "📍", emphasis: true },
  { href: "/tools/empty-house-tax", label: "空き家の固定資産税を試算する", sub: "1分でシミュレーション（無料）", icon: "🏠" },
  { href: "/articles/master-guide", label: "実家じまい完全ガイド", sub: "何から始めるかがわかる", icon: "🧭" },
];

interface Props {
  categoryId?: string;
}

export default function ArticleContextualLinks({ categoryId }: Props) {
  const links =
    (categoryId && LINKS_BY_CATEGORY[categoryId as CategoryId]) || DEFAULT_LINKS;

  return (
    <section
      aria-labelledby="contextual-links-heading"
      className="mt-10 rounded-2xl border border-primary/20 bg-primary-light/10 p-5 sm:p-6"
    >
      <h2
        id="contextual-links-heading"
        className="text-base sm:text-lg font-bold text-foreground mb-1 flex items-center gap-2"
      >
        <span aria-hidden>👇</span> 次の一歩：あなたの地域で調べる・試算する
      </h2>
      <p className="text-xs sm:text-sm text-foreground/60 mb-4 leading-relaxed">
        記事を読んだら、お住まいの市区町村の具体的な情報や費用の目安を確かめてみましょう。
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`group flex h-full flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                l.emphasis
                  ? "border-primary/40 bg-white"
                  : "border-border bg-white/70"
              }`}
            >
              <span className="text-2xl mb-2 leading-none select-none" aria-hidden>
                {l.icon}
              </span>
              <span className="text-sm font-bold text-foreground group-hover:text-primary leading-snug">
                {l.label}
              </span>
              <span className="mt-1 text-xs text-foreground/55 leading-relaxed flex-1">
                {l.sub}
              </span>
              <span className="mt-2 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                見る <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
