import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl } from "../../lib/site-url";
import {
  shigoTetsuzukiGuideTitle,
  shigoTetsuzukiGuideSubtitle,
} from "../../../content/guidebook/shigo-tetsuzuki";

export const metadata: Metadata = {
  title: pageTitle(shigoTetsuzukiGuideTitle),
  description: `${shigoTetsuzukiGuideSubtitle}。印刷してPDFとして保存し、役所や家族との共有にお使いいただけます。本記事は一般的な情報提供です。`,
  alternates: { canonical: getCanonicalUrl("/guidebook/shigo-tetsuzuki") },
};

function getGuideContent(): string {
  const filePath = path.join(process.cwd(), "content", "guidebook", "shigo-tetsuzuki-checklist.md");
  return fs.readFileSync(filePath, "utf-8");
}

export default function ShigoTetsuzukiGuidePage() {
  const content = getGuideContent();

  return (
    <div className="guidebook shigo-tetsuzuki-guide">
      <p className="print:hidden text-sm text-foreground/70 mb-4 p-3 bg-primary-light/50 rounded-lg">
        👉 このページを<strong>印刷</strong>し、「PDFに保存」を選ぶと、チェックリストをPDFとして保存できます。
      </p>
      <article className="shigo-tetsuzuki-prose article-prose prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl md:text-3xl font-bold text-primary mt-0 mb-4 pb-2 border-b-2 border-primary">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-bold mt-8 mb-3 pb-1 border-b border-border">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg md:text-xl font-semibold mt-6 mb-2 text-foreground">
                {children}
              </h3>
            ),
            p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="my-3 pl-6 list-disc space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="my-3 pl-6 list-decimal space-y-1">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto">
                <table className="min-w-full border border-border border-collapse text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-primary-light">{children}</thead>,
            th: ({ children }) => (
              <th className="border border-border px-3 py-2 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-3 py-2">{children}</td>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            hr: () => <hr className="my-6 border-border" />,
            blockquote: ({ children }) => (
              <blockquote className="my-4 border-l-4 border-primary/40 bg-primary-light/30 pl-4 py-2 text-sm text-foreground/80">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
      <p className="print:hidden mt-8 text-sm text-foreground/60">
        本チェックリストは一般的な情報提供であり、個別の相続・年金・税・登記の手続きは、各公的窓口および弁護士・司法書士・税理士にご確認ください。
      </p>
    </div>
  );
}
