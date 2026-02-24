import Link from "next/link";
import { organization } from "../lib/constants/site-metadata";

/**
 * ユーザー向け「視覚的E-E-A-T」運営者情報ブロック。
 * 記事末尾に配置し、専門法人運営の安心感を伝える。電話番号は非公開のため記載しない。
 */
export default function OperatorTrustBlock() {
  return (
    <section
      className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6"
      aria-labelledby="operator-trust-heading"
    >
      <h2
        id="operator-trust-heading"
        className="text-base font-bold text-foreground mb-2 flex items-center gap-2"
      >
        <span className="text-primary" aria-hidden>
          ✓
        </span>
        運営・監修：{organization.name}
      </h2>
      <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
        当サイトは実家じまい・空き家問題の解決を専門とする法人が運営しています。制度・費用・手続きの情報は随時見直しを行い、信頼性の高いコンテンツ提供に努めています。
      </p>
      <p className="text-sm">
        <Link
          href={organization.contactUrl}
          className="text-primary font-medium hover:underline inline-flex items-center gap-1"
        >
          お問い合わせ・ご相談はこちら
          <span aria-hidden>→</span>
        </Link>
      </p>
    </section>
  );
}
