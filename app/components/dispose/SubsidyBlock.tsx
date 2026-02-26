import Link from "next/link";

export interface SubsidyBlockProps {
  /** 見出し（省略時はデフォルト文言） */
  heading?: string;
}

const DEFAULT_HEADING = "お住まいの地域の空き家補助金を探す";

export default function SubsidyBlock({ heading = DEFAULT_HEADING }: SubsidyBlockProps) {
  return (
    <section className="bg-card rounded-2xl border border-border p-6" aria-labelledby="dispose-subsidy-heading">
      <h2 id="dispose-subsidy-heading" className="font-bold text-primary mb-2">
        {heading}
      </h2>
      <p className="text-sm text-foreground/70 mb-3">
        実家の片付けや空き家対策で補助金・助成金を利用したい場合は、お住まいの地域ページからご確認ください。
      </p>
      <Link
        href="/area"
        className="inline-block bg-primary-light text-primary border border-primary/30 px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary hover:text-white transition"
      >
        地域一覧で空き家補助金を探す
      </Link>
    </section>
  );
}
