import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { siteName, organization } from "../lib/constants/site-metadata";
import { getCanonicalUrl } from "../lib/site-url";

export const metadata: Metadata = {
  title: "運営会社情報 | 生前整理支援センター ふれあいの丘",
  description: "生前整理支援センター ふれあいの丘を運営する株式会社Kogeraの会社概要です。",
  alternates: { canonical: getCanonicalUrl("/corporate") },
};

export default function CorporatePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "株式会社Kogera",
    url: "https://www.fureaino-oka.com",
    foundingDate: "2023-05",
    address: {
      "@type": "PostalAddress",
      streetAddress: "銀座1丁目12番4号 N&E BLD.6F",
      addressLocality: "中央区",
      addressRegion: "東京都",
      postalCode: "104-0061",
      addressCountry: "JP",
    },
    employee: {
      "@type": "Person",
      name: "大久保亮佑",
      jobTitle: "代表取締役社長",
    },
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Script
        id="corporate-organization-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <p className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">トップ</Link>
        <span className="mx-2">＞</span>
        <Link href="/company" className="hover:text-primary transition">会社概要・運営者情報</Link>
        <span className="mx-2">＞</span>
        <span>運営会社情報</span>
      </p>

      <header className="mb-10">
        <h1 className="text-2xl font-bold text-primary mb-2">運営会社情報</h1>
        <p className="text-foreground/70">
          生前整理支援センター ふれあいの丘を運営する株式会社Kogeraの会社概要です。
        </p>
      </header>

      <section className="mt-12 pt-10 border-t border-border bg-gray-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-primary mb-6">会社概要</h2>
        <dl className="space-y-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">運営法人</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">{organization.name}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">代表者</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">代表取締役社長 大久保亮佑</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">設立</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">2023年5月</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">サービス名</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">{siteName}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">所在地</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">
              〒104-0061
              <br />
              東京都中央区銀座1丁目12番4号 N&E BLD.6F
              <p className="mt-1.5 text-sm text-foreground/70">※サービスはオンラインにて全国対応しております</p>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">事業内容</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">
              <ul className="space-y-1">
                <li>(1) 各種マーケティングリサーチ業務</li>
                <li>(2) 企業の営業に関するコンサルティング業務</li>
                <li>(3) 広告代理業及び各種の宣伝に関する業務</li>
                <li>(4) 営業代行業</li>
                <li>(5) インターネットを利用した各種情報提供サービス</li>
                <li>(6) Webサイトの企画、制作、販売、運営及び管理</li>
                <li>(7) 前各号に附帯又は関連する一切の事業</li>
              </ul>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">お問い合わせ</dt>
            <dd className="mt-0.5 sm:mt-0">
              <Link href="/contact" className="text-primary font-medium underline hover:no-underline">
                お問い合わせフォームはこちら
              </Link>
            </dd>
          </div>
        </dl>
      </section>

      <div className="mt-10 pt-8 border-t border-border">
        <Link
          href="/"
          className="inline-block bg-primary-light text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
