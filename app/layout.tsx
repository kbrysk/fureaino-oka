import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import MobileFooterBar from "./components/MobileFooterBar";
import { SITE_TITLE_TOP } from "./lib/site-brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_TITLE_TOP,
  description:
    "生前整理の進め方から業者選びまで。「ふれあいの丘」が運営。実家じまい・遺品整理の無料相談・無料ツールをご利用ください。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="overflow-x-hidden">
      <body className={`${geistSans.variable} antialiased overflow-x-hidden`}>
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
