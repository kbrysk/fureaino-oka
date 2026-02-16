import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import MobileFooterBar from "./components/MobileFooterBar";
import { SITE_TITLE_TOP } from "./lib/site-brand";
import { getBaseUrl } from "./lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "生前整理の進め方から業者選びまで。「ふれあいの丘」が運営。実家じまい・遺品整理の無料相談・無料ツールをご利用ください。";

const GTM_ID = "GTM-5HKD4MVB";
const baseUrl = getBaseUrl();
const ogImageUrl = baseUrl ? `${baseUrl}/opengraph-image.png` : "/opengraph-image.png";

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : undefined,
  title: SITE_TITLE_TOP,
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    title: SITE_TITLE_TOP,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "生前整理支援センター ふれあいの丘" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_TOP,
    description: DEFAULT_DESCRIPTION,
    images: [ogImageUrl],
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
        {/* Google Tag Manager - head 内のなるべく上 */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
      </head>
      <body className={`${geistSans.variable} antialiased overflow-x-hidden`}>
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
        <div className="min-h-screen flex flex-col overflow-x-hidden" data-layout="root">
          <div className="no-print shrink-0">
            <Navigation />
          </div>
          <main className="flex-1 shrink-0 max-w-5xl mx-auto w-full px-4 py-8 pb-24" id="main-content">
            {children}
          </main>
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
