"use client";

export default function CaseStudyCtaButton() {
  return (
    <a
      href="#optimizer-section"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("optimizer-section")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
    >
      👉 あなたの実家の損失リスクも無料で診断する
    </a>
  );
}
