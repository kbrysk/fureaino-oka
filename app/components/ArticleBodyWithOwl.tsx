"use client";

import Image from "next/image";
import OwlAizuchi from "./OwlAizuchi";
import type { ArticleImage } from "../lib/articles";

const DEFAULT_OWL_MESSAGES = [
  "うんうん",
  "なるほど",
  "そうなんですね",
  "その通りだホー",
  "いいですね",
  "わかります",
  "まずは一歩からで大丈夫です",
  "その調子です",
];

interface ArticleBodyWithOwlProps {
  body: string;
  owlMessages?: string[];
  images?: ArticleImage[];
}

/**
 * 本文を段落ごとに分割し、各段落の直後にフクロウの相槌を表示。
 * 指定された段落の直後には記事内画像も挿入する。
 */
export default function ArticleBodyWithOwl({
  body,
  owlMessages = [],
  images = [],
}: ArticleBodyWithOwlProps) {
  const segments = body
    .split(/<\/p>\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="article-prose prose prose-neutral max-w-none prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-ul:my-4 prose-li:my-1">
      {segments.map((segment, index) => {
        const html = segment.includes("<p") ? `${segment}</p>` : segment;
        const message =
          owlMessages[index] ?? DEFAULT_OWL_MESSAGES[index % DEFAULT_OWL_MESSAGES.length];
        const imageAtThis = images.find((img) => img.afterIndex === index);

        return (
          <div key={index} className="space-y-4">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {imageAtThis && (
              <figure className="my-6">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-border">
                  <Image
                    src={imageAtThis.src}
                    alt={imageAtThis.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                </div>
                <figcaption className="text-sm text-foreground/50 mt-2 text-center">
                  {imageAtThis.alt}
                </figcaption>
              </figure>
            )}
            <div className="flex justify-end">
              <OwlAizuchi message={message} position="right" size="s" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
