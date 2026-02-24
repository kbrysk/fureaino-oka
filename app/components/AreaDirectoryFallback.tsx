import Link from "next/link";
import DynamicFaq from "./DynamicFaq";

/**
 * municipalities.json にデータがない自治体向けのディレクトリ型インフラページ用コンテンツ。
 * 公式窓口導線・汎用ツール案内・免責を表示し、404にせずE-E-A-Tを担保する。
 */
interface AreaDirectoryFallbackProps {
  cityName: string;
  prefName: string;
  prefId: string;
  cityId: string;
}

const OFFICIAL_SEARCH_QUERY = "空き家補助金 公式サイト";

export default function AreaDirectoryFallback({
  cityName,
  prefName,
  prefId,
  cityId,
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

      <DynamicFaq prefName={prefName} cityName={cityName} hasData={false} />

      <section id="appraisal-section" className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{cityName}周辺で利用可能な不動産一括査定</h2>
        </div>
        <div className="p-6 space-y-3 text-sm text-foreground/80">
          <p>
            野村不動産グループの「ノムコム」など、複数社の一括査定で実家の適正価値を把握できます。相続空き家の3,000万円控除を検討する前に、無料で相場を確認することをおすすめします。
          </p>
          <Link
            href={`/api/affiliate/appraisal?area=${encodeURIComponent(cityId)}&type=nomu`}
            rel="nofollow"
            className="inline-block py-2.5 px-4 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition"
          >
            {cityName}の土地・建物の相場を無料で確認
          </Link>
        </div>
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
