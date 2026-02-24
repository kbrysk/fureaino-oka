import Link from "next/link";
import data from "../lib/data/municipalities.json";

type MunicipalityRow = {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  subsidy: {
    hasSubsidy: boolean;
    maxAmount?: string;
    name?: string;
  };
  garbage: {
    officialUrl: string;
    phone?: string;
  };
};

const municipalities = data as MunicipalityRow[];

/** maxAmount 文字列から金額（万円）を抽出して数値化。ソート用 */
function parseMaxAmountYenMan(str: string | undefined): number {
  if (!str) return 0;
  const match = str.match(/(\d+)\s*万/);
  if (match) return parseInt(match[1], 10);
  const matchComma = str.match(/(\d{1,3}(?:,\d{3})*)/);
  if (matchComma) return Math.floor(parseInt(matchComma[1].replace(/,/g, ""), 10) / 10000);
  return 0;
}

interface PrefectureSummaryProps {
  /** 都道府県ID（例: tokyo） */
  prefId: string;
  /** 都道府県名（表示用。省略時はデータから取得） */
  prefName?: string;
}

/**
 * 都道府県別サマリー（地域ポータル用）
 * municipalities.json から prefId に属する市区町村を抽出し、
 * 補助金上位3件と不用品処分クイックリンクを表示する。
 */
export default function PrefectureSummary({ prefId, prefName: prefNameProp }: PrefectureSummaryProps) {
  const list = municipalities.filter((m) => m.prefId.toLowerCase() === prefId.toLowerCase());
  const prefName = prefNameProp ?? list[0]?.prefName ?? prefId;

  if (list.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-foreground/60">
          {prefName}の市区町村データは現在準備中です。全国一覧からお探しの地域をご確認ください。
        </p>
        <Link href="/area" className="mt-3 inline-block text-primary font-medium hover:underline text-sm">
          ← 地域一覧へ
        </Link>
      </section>
    );
  }

  const withSubsidy = list.filter((m) => m.subsidy?.hasSubsidy);
  const sortedByAmount = [...withSubsidy].sort(
    (a, b) => parseMaxAmountYenMan(b.subsidy?.maxAmount) - parseMaxAmountYenMan(a.subsidy?.maxAmount)
  );
  const top3 = sortedByAmount.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 補助金が手厚い自治体ピックアップ */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden" aria-labelledby="pref-summary-subsidy">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 id="pref-summary-subsidy" className="font-bold text-primary">
            補助金が手厚い自治体ピックアップ
          </h2>
        </div>
        <div className="p-6">
          {top3.length > 0 ? (
            <ul className="space-y-4">
              {top3.map((m) => (
                <li key={m.cityId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 last:pb-0 border-b border-border last:border-b-0">
                  <div>
                    <span className="font-medium text-foreground">{m.cityName}</span>
                    {m.subsidy?.maxAmount && (
                      <span className="ml-2 text-sm text-primary font-medium">{m.subsidy.maxAmount}</span>
                    )}
                  </div>
                  <Link
                    href={`/area/${m.prefId}/${m.cityId}/subsidy`}
                    className="inline-flex items-center justify-center rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition shrink-0"
                  >
                    補助金ページを見る
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/60">
              {prefName}で補助金制度を公開している自治体のデータは現在準備中です。
            </p>
          )}
        </div>
      </section>

      {/* 地域別の不用品処分情報 */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden" aria-labelledby="pref-summary-garbage">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 id="pref-summary-garbage" className="font-bold text-primary">
            地域別の不用品処分情報
          </h2>
        </div>
        <div className="p-6">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {list
              .sort((a, b) => a.cityName.localeCompare(b.cityName, "ja"))
              .map((m) => (
                <li key={m.cityId}>
                  <a
                    href={m.garbage?.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <span>{m.cityName}</span>
                    <span className="text-foreground/50" aria-hidden>→</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* 市区町村別補助金・粗大ゴミ一覧への導線 */}
      <section className="rounded-2xl border border-primary/20 bg-primary-light/20 p-6">
        <h2 className="font-bold text-primary mb-3">{prefName}の市区町村別ページ</h2>
        <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {list
            .sort((a, b) => a.cityName.localeCompare(b.cityName, "ja"))
            .map((m) => (
              <li key={m.cityId} className="flex flex-col gap-1">
                <Link href={`/area/${m.prefId}/${m.cityId}`} className="text-foreground/90 font-medium hover:text-primary hover:underline">
                  {m.cityName}の粗大ゴミ・遺品整理
                </Link>
                <div className="flex gap-2 text-xs">
                  <Link href={`/area/${m.prefId}/${m.cityId}/subsidy`} className="text-primary hover:underline">
                    補助金
                  </Link>
                  <Link href={`/area/${m.prefId}/${m.cityId}/cleanup`} className="text-primary hover:underline">
                    相場
                  </Link>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
