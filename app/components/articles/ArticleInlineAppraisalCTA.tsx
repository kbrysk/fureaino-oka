import Image from "next/image";

/** ノムコム（野村不動産ソリューションズ）A8 — 既に成果実証済（2026/04: 5,000円） */
const NOMU_CLICK_URL = "https://px.a8.net/svt/ejp?a8mat=4AXE4D+D2CGOI+5M76+BX3J6";
const NOMU_IMP_URL = "https://www17.a8.net/0.gif?a8mat=4AXE4D+D2CGOI+5M76+BX3J6";

interface Props {
  /** 文脈に合わせて見出しをカスタマイズしたいケース用（オプション） */
  variant?: "default" | "inheritance" | "jikka" | "akiya";
}

const HEADING_BY_VARIANT: Record<NonNullable<Props["variant"]>, string> = {
  default: "実家の『今の価値』、知っていますか？",
  inheritance: "相続した不動産、まずは『売却したらいくら？』を知る",
  jikka: "実家じまいの前に、実家の『現在価値』を1分で把握",
  akiya: "空き家を保有し続けると、固定資産税は最大6倍に",
};

const DESCRIPTION_BY_VARIANT: Record<NonNullable<Props["variant"]>, string> = {
  default:
    "片付けや解体、リフォームを考える前に。大手・野村不動産グループ「ノムコム」が、あなたの実家・空き家の適正価値を無料で算出します。",
  inheritance:
    "相続した実家を売却するか、保有するかの判断は『現在価値』を知ることから。野村不動産グループ「ノムコム」が無料で査定します。",
  jikka:
    "片付け費用を相殺できるかどうかは、まず『売却したらいくらになるか』を知ること。野村不動産グループ「ノムコム」が無料で算出します。",
  akiya:
    "解体費用を払う前に、『そのまま売却した方が手元に残る』ケースが少なくありません。野村不動産グループ「ノムコム」が無料で査定します。",
};

/**
 * 記事本文中に挿入する不動産査定CTA（インライン）
 *
 * - LINE誘導CTAは記事本文に含めない（ガイドライン）→ 代わりにアフィCTAを文脈別に配置
 * - ノムコム = A8で唯一実証済（2026/04 5,000円成果）の不動産売却査定アフィ
 * - 完全公開（rel="nofollow sponsored noopener noreferrer"）
 *
 * 想定使用箇所：
 * - 記事末尾（本文後・関連記事前）：variant="default"
 * - 相続系記事内：variant="inheritance"
 * - 実家じまい系記事内：variant="jikka"
 * - 空き家系記事内：variant="akiya"
 */
export default function ArticleInlineAppraisalCTA({
  variant = "default",
}: Props) {
  const heading = HEADING_BY_VARIANT[variant];
  const description = DESCRIPTION_BY_VARIANT[variant];

  return (
    <aside
      className="relative my-8 rounded-2xl border-2 border-orange-400 bg-orange-50 shadow-sm p-6 overflow-hidden"
      aria-label="不動産無料査定（広告）"
    >
      <p className="text-xs font-bold text-foreground/60 uppercase tracking-wide mb-2">
        広告 / 提携サービス
      </p>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 leading-tight">
        {heading}
      </h3>
      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
        {description}
      </p>

      <div className="flex flex-col items-center">
        <span className="text-red-600 font-bold text-sm mb-3 animate-pulse">
          ＼ 3,000万円控除の特例期限（相続から3年） ／
        </span>
        <a
          href={NOMU_CLICK_URL}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="w-full md:w-4/5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base sm:text-lg py-4 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-center flex justify-center items-center"
        >
          実家・空き家の相場を無料で確認 👉
        </a>
        <span className="text-gray-500 text-xs mt-3 text-center">
          ※ノムコム（野村不動産ソリューションズ）の公式サイトへ移動します。完全無料・60秒入力。
        </span>
      </div>

      {/* A8 インプレッション計測（非表示） */}
      <Image
        src={NOMU_IMP_URL}
        alt=""
        width={1}
        height={1}
        className="absolute bottom-0 left-0 w-px h-px opacity-0 pointer-events-none"
        unoptimized
      />
    </aside>
  );
}
