import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pageTitle } from "../../lib/site-brand";
import { jikkaJimaiGuideTitle, jikkaJimaiGuideSubtitle } from "../../../content/guidebook/jikka-jimai";

export const metadata: Metadata = {
  title: pageTitle(jikkaJimaiGuideTitle),
  description: `${jikkaJimaiGuideSubtitle}。チェック項目・実行フロー・注意点を網羅。PDFとして保存できます。`,
};

function getGuideContent(): string {
  const filePath = path.join(process.cwd(), "content", "guidebook", "jikka-jimai-complete-guide.md");
  return fs.readFileSync(filePath, "utf-8");
}

export default function JikkaJimaiGuidePage() {
  const content = getGuideContent();

  return (
    <div className="guidebook jikka-jimai-guide">
      <p className="print:hidden text-sm text-foreground/70 mb-4 p-3 bg-primary-light/50 rounded-lg">
        👉 このページを<strong>印刷</strong>し、「PDFに保存」を選ぶと、ガイドブックをPDFとして保存できます。
      </p>
      <article className="jikka-jimai-prose article-prose prose max-w-none">
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
            pre: ({ children }) => (
              <pre className="my-4 p-4 bg-card border border-border rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                {children}
              </pre>
            ),
            code: ({ className, children }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) return <code className={className}>{children}</code>;
              return (
                <code className="px-1.5 py-0.5 bg-primary-light/50 rounded text-sm">
                  {children}
                </code>
              );
            },
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
      <p className="print:hidden mt-8 text-sm text-foreground/60">
        本ガイドは情報提供であり、個別の法律・税務・相続の手続きは弁護士・司法書士・税理士にご相談ください。
      </p>
    </div>
  );
}
