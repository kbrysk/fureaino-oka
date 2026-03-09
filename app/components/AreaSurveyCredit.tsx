import Link from "next/link";

/**
 * 地域ページ（Spoke）末尾の調査責任クレジット。
 * E-E-A-T・ヘルプフルコンテンツ評価のため、運営者と一次情報源を明示する。
 */
export default function AreaSurveyCredit() {
  return (
    <footer
      className="mt-8 pt-6 border-t border-border text-sm text-foreground/70"
      role="contentinfo"
      aria-label="調査・監修クレジット"
    >
      <p className="font-medium text-foreground/80 mb-1">
        【調査・監修】実家じまい調査支援センター（運営：
        <Link
        href="/about"
        className="text-primary hover:underline"
        id="credit-about-link"
        data-ga-cta="credit_about"
        data-event-name="cta_about_click"
      >
          株式会社Kogera
        </Link>
        ）
      </p>
      <p className="mb-0">
        本ページの情報は、自治体公式データに基づき、ふれあいの丘 専門調査チームが精査したものです。
      </p>
    </footer>
  );
}
