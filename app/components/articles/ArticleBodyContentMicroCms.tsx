"use client";

import parse from "html-react-parser";
import OwlAizuchi from "../OwlAizuchi";

const OWL_REGEX = /【フクロウ:\s*([^】]+)】/g;

type Segment = { type: "html"; content: string } | { type: "owl"; message: string };

function splitByOwl(body: string): Segment[] {
  const str = body ?? "";
  const segments: Segment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  OWL_REGEX.lastIndex = 0;
  while ((m = OWL_REGEX.exec(str)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: "html", content: str.slice(lastIndex, m.index).trim() });
    }
    segments.push({ type: "owl", message: m[1].trim() });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < str.length) {
    segments.push({ type: "html", content: str.slice(lastIndex).trim() });
  }
  return segments;
}

interface ArticleBodyContentMicroCmsProps {
  body: string;
}

export default function ArticleBodyContentMicroCms({ body }: ArticleBodyContentMicroCmsProps) {
  const segments = splitByOwl(body ?? "");

  return (
    <div className="article-prose prose prose-neutral max-w-none prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-ul:my-4 prose-li:my-1">
      {segments.map((seg, i) =>
        seg.type === "owl" ? (
          <div key={`owl-${i}`} className="my-6 flex justify-end">
            <OwlAizuchi message={seg.message} position="right" size="s" />
          </div>
        ) : seg.content ? (
          <div key={`html-${i}`}>{parse(seg.content)}</div>
        ) : null
      )}
    </div>
  );
}
