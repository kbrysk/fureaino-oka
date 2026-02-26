import Image from "next/image";
import OwlCharacter from "../OwlCharacter";
import HeroJikkaCta from "./HeroJikkaCta";

const HERO_IMAGE = "/images/hero-couple.png";

/**
 * トップページヒーロー（Server Component）。
 * LCP 用に next/image で priority + fetchPriority="high"。
 * 画像レイヤーは z-0、グラデは z-[1]、コンテンツは z-10 でオーバーレイが潜り込まないようにする。
 */
export default function HeroSection() {
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden max-h-[600px] md:max-h-[650px] lg:max-h-[700px] xl:max-h-[800px] bg-[#FFFDF9]">
      <section className="relative w-full min-h-0 md:min-h-[520px] overflow-hidden bg-[#FFFDF9]">
        {/* 背景画像：z-0 で最背面。next/image で LCP 最適化 */}
        <div className="absolute left-0 top-0 bottom-0 w-full max-w-[1400px] h-full overflow-hidden z-0" aria-hidden>
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover object-[8%_50%] max-md:object-[3%_50%]"
            sizes="(max-width: 767px) 100vw, 1400px"
            priority
            fetchPriority="high"
          />
        </div>
        {/* グラデーションオーバーレイ：z-[1] で画像の上・コンテンツの下 */}
        <div className="hero-panorama-gradient absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden />

        {/* コンテンツ：z-10 でグラデの上に確実に表示 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:justify-end md:items-center min-h-[380px] md:min-h-[520px] pt-6 md:pt-12 pb-6 md:pb-12">
          <div className="w-full md:max-w-[58%] lg:max-w-[56%] flex flex-col items-start text-left">
            <div className="hero-glass-panorama-v2 w-full max-w-[90%] mx-auto md:max-w-full md:mx-0 bg-white/5 py-4 px-4 sm:px-6 md:py-10 md:px-8 md:pl-12 md:pr-10 flex flex-col items-start text-left">
              <div className="flex flex-row items-center gap-2 md:gap-3 w-full mb-1.5 md:mb-3">
                <OwlCharacter
                  size={42}
                  sizeMobile={32}
                  message={<>今のあなたに必要なサポートを<span className="whitespace-nowrap">無料診断</span></>}
                  tone="calm"
                  bubblePosition="above"
                  softShadow
                  priority
                />
              </div>
              <h1 className="w-full max-w-[18em] min-w-0 text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight tracking-tighter text-balance [filter:drop-shadow(0_1px_1px_rgba(255,255,255,0.9))]">
                <span className="whitespace-nowrap">生前整理のすべてを</span>
                <br />
                これひとつで
              </h1>
              <p className="mt-2 md:mt-5 text-slate-700 text-xs sm:text-sm md:text-base w-full max-w-md font-normal leading-snug md:leading-relaxed text-left">
                実家の片付けから不動産・相続まで。AIと専門家が丸ごと一括サポート。
              </p>
              <ul className="flex flex-wrap gap-1.5 md:gap-3 justify-start mt-3 md:mt-8" aria-label="対応範囲">
                <li><span className="inline-block px-2.5 py-0.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs text-slate-700 tracking-wide bg-white/50 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-colors cursor-default whitespace-nowrap leading-tight">実家の片付け・実家じまい</span></li>
                <li><span className="inline-block px-2.5 py-0.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs text-slate-700 tracking-wide bg-white/50 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-colors cursor-default whitespace-nowrap leading-tight">空き家の売却・解体</span></li>
                <li><span className="inline-block px-2.5 py-0.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs text-slate-700 tracking-wide bg-white/50 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-colors cursor-default whitespace-nowrap leading-tight">遺品・生前整理</span></li>
                <li><span className="inline-block px-2.5 py-0.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs text-slate-700 tracking-wide bg-white/50 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-colors cursor-default whitespace-nowrap leading-tight">相続手続き・税金</span></li>
                <li><span className="inline-block px-2.5 py-0.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs text-slate-700 tracking-wide bg-white/50 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-colors cursor-default whitespace-nowrap leading-tight">不動産査定・買取</span></li>
                <li><span className="inline-block px-2.5 py-0.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs text-slate-700 tracking-wide bg-white/50 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-colors cursor-default whitespace-nowrap leading-tight">エンディングノート</span></li>
              </ul>
              <HeroJikkaCta />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
