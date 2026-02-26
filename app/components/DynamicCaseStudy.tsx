import CaseStudyCtaButton from "./CaseStudyCtaButton";
import type { CaseItem } from "@/app/lib/faq/area-faq-data";

export interface DynamicCaseStudyProps {
  cityName: string;
  /** 表示するケース一覧（Page で generateCases を呼んで取得） */
  cases: CaseItem[];
}

/**
 * 地域固有の決定論的ケーススタディ（Pure UI）。
 * データは Page が generateCases で生成し、cases として渡す。
 */
export default function DynamicCaseStudy({ cityName, cases }: DynamicCaseStudyProps) {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden" aria-labelledby="case-study-heading">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h2 id="case-study-heading" className="text-lg font-bold text-slate-800">
          {cityName}での最近の実家じまい・診断事例
        </h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {cases.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs font-bold text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
                🚨 判明した放置リスク：年間約 {item.annualRiskYen.toLocaleString()} 円
              </p>
              <p className="text-sm text-slate-600 mb-2">
                {item.attribute} / {item.layout} / 荷物量: {item.itemLevel}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.proComment}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <CaseStudyCtaButton />
        </div>
      </div>
    </section>
  );
}
