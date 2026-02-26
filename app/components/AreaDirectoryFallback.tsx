import Link from "next/link";
import DynamicFaq from "./DynamicFaq";
import type { FaqItem } from "@/app/lib/faq/schema";

/** ノムコム（野村不動産ソリューションズ）A8 */
const NOMU_CLICK_URL = "https://px.a8.net/svt/ejp?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";
const NOMU_IMP_URL = "https://www12.a8.net/0.gif?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";

/**
 * municipalities.json にデータがない自治体向けのディレクトリ型インフラページ用コンテンツ。
 * 公式窓口導線・汎用ツール案内・免責を表示し、404にせずE-E-A-Tを担保する。
 * faqItems は Page で buildDynamicFaqItems を 1 回だけ呼んだ結果を渡す（1 ページ 1 FAQPage のため）。
 */
interface AreaDirectoryFallbackProps {
  cityName: string;
  prefName: string;
  prefId: string;
  cityId: string;
  /** DynamicFaq に表示する Q&A（Page で生成した同じ配列を渡す） */
  faqItems: FaqItem[];
}

const OFFICIAL_SEARCH_QUERY = "空き家補助金 公式サイト";

export default function AreaDirectoryFallback({
  cityName,
  prefName,
  prefId,
  cityId,
  faqItems,
}: AreaDirectoryFallbackProps) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${prefName} ${cityName} ${OFFICIAL_SEARCH_QUERY}`)}`;

  return (
    <>
      <div className="rounded-2xl border-2 border-primary/20 bg-primary-light/20 p-6">
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center gap-2 w-full py-4 px-5 rounded-xl font-bold text-primary bg-white border-2 border-primary/40 hover:bg-primary-light/40 transition"
        >
          <span>{cityName}公式サイトで補助金・ゴミ出し情報を確認する</span>
          <span aria-hidden>→</span>
        </a>
      </div>

      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">相続空き家の3,000万円特別控除の基本条件</h2>
        </div>
        <div className="p-6 space-y-3 text-sm text-foreground/80">
          <ul className="list-disc list-inside space-y-1">
            <li>相続または遺贈により取得した家屋・その敷地であること</li>
            <li>相続の開始の日から3年を経過する日までの間に譲渡すること</li>
            <li>被相続人の居住の用に供されていた家屋であること（一定の要件あり）</li>
            <li>譲渡対価の額が1億円以下であること</li>
          </ul>
          <p className="text-xs text-foreground/60">
            詳細・適用可否は税理士または所轄の税務署にご確認ください。
          </p>
          <Link
            href="/tools/empty-house-tax"
            className="inline-block text-primary font-medium hover:underline"
          >
            空き家の維持費シミュレーターで確認する →
          </Link>
        </div>
      </section>

      <DynamicFaq
        items={faqItems}
        heading={`${cityName}の実家・空き家に関するよくある質問`}
      />

      <section id="appraisal-section" className="relative bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{cityName}周辺で利用可能な不動産査定（大手1社）</h2>
        </div>
        <div className="p-6 space-y-3 text-sm text-foreground/80">
          <p>
            野村不動産グループの「ノムコム」が、実家の適正価値を無料で算出。売却すれば片付け費用を相殺できるかもしれません。
          </p>
          <p>
            相続空き家の3,000万円控除を検討する前に、まずは無料で相場を確認することをおすすめします。
          </p>
          <a
            href={NOMU_CLICK_URL}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block py-2.5 px-4 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition"
          >
            {cityName}の土地・建物の相場を無料で確認
          </a>
          <p className="text-xs text-foreground/60">
            ※ノムコム（野村不動産ソリューションズ）の公式サイトへ移動します
          </p>
        </div>
        {/* A8 インプレッション（レイアウトに影響しないよう絶対配置・非表示） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={NOMU_IMP_URL}
          alt=""
          width={1}
          height={1}
          style={{ border: 0 }}
          className="absolute bottom-0 left-0 w-px h-px opacity-0 pointer-events-none"
        />
      </section>

      <section id="cleanup-section" className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">自治体で回収できない不用品の処分フロー</h2>
        </div>
        <div className="p-6 space-y-3 text-sm text-foreground/80">
          <ol className="list-decimal list-inside space-y-2">
            <li>自治体の粗大ゴミ・不燃物のルールを確認する</li>
            <li>家電リサイクル法対象（冷蔵庫・洗濯機等）は指定取引場所以外へ</li>
            <li>大量・困難な場合は不用品回収・遺品整理の一括見積もりを利用する</li>
          </ol>
          <Link
            href={`/api/affiliate/cleanup?area=${encodeURIComponent(cityId)}`}
            rel="nofollow"
            className="inline-block text-primary font-medium hover:underline"
          >
            一括見積もり・相談する →
          </Link>
        </div>
      </section>

      <p className="text-xs text-foreground/60 rounded-xl bg-muted/50 p-4 border border-border/60">
        ※この地域の詳細データは現在精査中です。正確な情報は各自治体の公式窓口へお問い合わせください。
      </p>
    </>
  );
}
