import Link from "next/link";
import HeroSection from "./components/home/HeroSection";
import HomeContentClient from "./components/home/HomeContentClient";

export default function Home() {
  return (
    <div className="space-y-8">
      <HeroSection />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" aria-label="今の悩みに合わせて選ぶ">
        <Link
          href="/area"
          className="group flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] rounded-2xl border-2 border-primary/30 bg-card p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/15 text-primary mb-3 group-hover:bg-primary/25 transition" aria-hidden>
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </span>
          <span className="font-bold text-base md:text-lg text-foreground">実家を片付けたい</span>
          <span className="text-base text-foreground/85 mt-1 block">生前整理・遺品整理</span>
        </Link>
        <Link
          href="/tools/empty-house-tax"
          className="group flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] rounded-2xl border-2 border-primary/30 bg-card p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/15 text-primary mb-3 group-hover:bg-primary/25 transition" aria-hidden>
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </span>
          <span className="font-bold text-base md:text-lg text-foreground">空き家・不動産をなんとかしたい</span>
          <span className="text-base text-foreground/85 mt-1 block">売却・税金・維持費</span>
        </Link>
        <Link
          href="/ending-note"
          className="group flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] rounded-2xl border-2 border-primary/30 bg-card p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/15 text-primary mb-3 group-hover:bg-primary/25 transition" aria-hidden>
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </span>
          <span className="font-bold text-base md:text-lg text-foreground">自分の財産や想いを整理したい</span>
          <span className="text-base text-foreground/85 mt-1 block">エンディングノート</span>
        </Link>
      </section>

      <section className="w-full rounded-2xl bg-gradient-to-b from-primary-light/10 to-transparent border border-primary/10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 w-full">
            <div className="relative flex-1 flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
              <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">Step 1</span>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
                <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0" aria-hidden>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </span>
                <h2 className="font-bold text-primary text-sm sm:text-base md:text-lg">【考える】エンディングノート</h2>
              </div>
              <p className="text-base text-foreground/85 leading-relaxed flex-1">
                自分の想いや資産を整理。デジタル版ノートや書き方ガイドで、将来の不安を解消します。
              </p>
              <Link href="/ending-note" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                エンディングノートを書く <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center shrink-0 text-primary/40" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </div>
            <div className="relative flex-1 flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
              <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">Step 2</span>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
                <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0" aria-hidden>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </span>
                <h2 className="font-bold text-primary text-sm sm:text-base md:text-lg">【片付ける】生前整理・遺品整理</h2>
              </div>
              <p className="text-base text-foreground/85 leading-relaxed flex-1">
                体力があるうちの整理も、親族の遺品整理も。プロの選別で大切な思い出を守ります。
              </p>
              <Link href="/area" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                地域別の案内を見る <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center shrink-0 text-primary/40" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </div>
            <div className="relative flex-1 flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
              <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">Step 3</span>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
                <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0" aria-hidden>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </span>
                <h2 className="font-bold text-primary text-sm sm:text-base md:text-lg">【解決する】実家じまい・空き家活用</h2>
              </div>
              <p className="text-base text-foreground/85 leading-relaxed flex-1">
                補助金の活用から売却査定まで。損をしない家のしまい方を専門家がサポート。
              </p>
              <Link href="/guide" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                専門家に相談する <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeContentClient />
    </div>
  );
}
