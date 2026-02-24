import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import MobileFooterBar from "./components/MobileFooterBar";
import JsonLdBreadcrumb from "./components/JsonLdBreadcrumb";
import AreaNavigation from "./components/AreaNavigation";
import { SITE_TITLE_TOP, SITE_NAME_LOGO, SITE_NAME_SHORT } from "./lib/site-brand";
import { getBaseUrl, getCanonicalBase, getCanonicalUrl } from "./lib/site-url";

/** Google AdSense 審査用パブリッシャーID（next/third-parties に GoogleAdSense はないため next/script で同等の読み込み） */
const GOOGLE_ADSENSE_PUBLISHER_ID = "ca-pub-8324936850324481";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "生前整理の進め方から業者選びまで。「ふれあいの丘」が運営。実家じまい・遺品整理の無料相談・無料ツールをご利用ください。";

const GTM_ID = "GTM-5HKD4MVB";
/** 正規ドメイン（Canonical・OG の基準）。NEXT_PUBLIC_BASE_URL 未設定時は https://www.fureaino-oka.com */
const canonicalOrigin = getCanonicalBase();
/** メタ・OGP・ファビコンは必ず絶対URLで出す（ツール・SNSが相対URLを解決しないため） */
const siteOrigin = getBaseUrl() || canonicalOrigin;

/** メタデータ画像（public/ 直下・Config-based 単一管理）。Cache Busting 用 ?v=2 */
const FAVICON_PATH = "/favicon.png?v=2";
const APPLE_TOUCH_ICON_PATH = "/apple-touch-icon.png?v=1";
/** OGP・Twitter Card 用画像（必ず .png を参照） */
const OG_IMAGE_PATH = "/og-image.png?v=2";

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: SITE_TITLE_TOP,
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: FAVICON_PATH,
    apple: APPLE_TOUCH_ICON_PATH,
  },
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "./",
    siteName: SITE_NAME_SHORT,
    title: SITE_TITLE_TOP,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "生前整理支援センター ふれあいの丘",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_TOP,
    description: DEFAULT_DESCRIPTION,
    images: OG_IMAGE_PATH,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="overflow-x-hidden">
      <head>
        {/* ファビコン・Apple Touch Icon・OGP（public/ 直下・絶対URLで SNS/ツールに確実に読ませる） */}
        <link rel="icon" href={`${canonicalOrigin}${FAVICON_PATH}`} type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href={`${canonicalOrigin}${APPLE_TOUCH_ICON_PATH}`} sizes="180x180" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteOrigin} />
        <meta property="og:title" content={SITE_TITLE_TOP} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:image" content={`${canonicalOrigin}${OG_IMAGE_PATH}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="生前整理支援センター ふれあいの丘" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE_TOP} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={`${canonicalOrigin}${OG_IMAGE_PATH}`} />
        {/* JSON-LD: Organization（Google推奨の構造化データ） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME_LOGO,
              url: canonicalOrigin,
              logo: `${canonicalOrigin}${APPLE_TOUCH_ICON_PATH}`,
            }),
          }}
        />
        {/* Google Tag Manager - head 内のなるべく上 */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
        {/* Google AdSense 審査コード（初期HTMLに含めクローラーに確実に読ませる） */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} antialiased overflow-x-hidden`}>
        {/* 4,000+ 地域ページ含む全ページで BreadcrumbList を出力し、クローラー効率と検索結果のパンくず表示を強化 */}
        <JsonLdBreadcrumb baseUrl={canonicalOrigin} />
        {/* Google Tag Manager (noscript) - body 開始直後 */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <div className="min-h-screen flex flex-col" data-layout="root">
          <div className="no-print shrink-0">
            <Navigation />
          </div>
          <main className="flex-1 shrink-0 max-w-5xl mx-auto w-full px-4 py-8 pb-24 overflow-x-visible" id="main-content">
            {children}
          </main>
          <div className="no-print shrink-0">
            <AreaNavigation />
          </div>
          <div className="no-print shrink-0">
            <Footer />
          </div>
          <div className="no-print" aria-hidden>
            <MobileFooterBar />
          </div>
        </div>
      </body>
    </html>
  );
}
