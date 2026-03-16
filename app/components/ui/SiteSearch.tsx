"use client";

// U6: サイト内検索UI 2026-03
// U6-ARIA-FIX: aria-haspopup削除・aria-controls追加 2026-03

import React from "react";
import Link from "next/link";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  area: "地域情報",
  tool: "無料ツール",
  article: "記事",
  guide: "ガイド",
  static: "ページ",
};

export function SiteSearch() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trackSearch = React.useCallback((searchQuery: string) => {
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as unknown as { gtag: (a: string, b: string, c: object) => void }).gtag("event", "search", { search_term: searchQuery });
    }
  }, []);

  React.useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => trackSearch(query), 1000);
      return () => clearTimeout(timer);
    }
  }, [query, trackSearch]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="ページを検索する"
          className={[
            "w-full min-h-[48px] pl-10 pr-4 py-2",
            "rounded-lg border border-gray-300",
            "text-base text-gray-700",
            "focus:outline-none focus:ring-2",
            "focus:ring-primary focus:border-primary",
            "bg-white",
          ].join(" ")}
          aria-label="サイト内検索"
          aria-expanded={isOpen && results.length > 0}
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-results-listbox"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && query.trim() && (
        <div
          id="search-results-listbox"
          className={[
            "absolute top-full left-0 right-0 mt-1 z-50",
            "bg-white border border-gray-200 rounded-lg shadow-lg",
            "max-h-96 overflow-y-auto",
          ].join(" ")}
          role="listbox"
          aria-label="検索結果"
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500">
              検索中...
            </div>
          )}
          {!isLoading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              「{query}」の検索結果が見つかりませんでした
            </div>
          )}
          {!isLoading &&
            results.map((result) => (
              <Link
                key={result.id}
                href={result.url}
                className={[
                  "block px-4 py-3",
                  "hover:bg-gray-50",
                  "border-b border-gray-100 last:border-0",
                ].join(" ")}
                role="option"
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={[
                      "text-xs px-2 py-0.5 rounded-full mt-0.5 shrink-0",
                      "bg-primary/10 text-primary font-medium",
                    ].join(" ")}
                  >
                    {CATEGORY_LABEL[result.category] ?? result.category}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {result.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
