"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SearchBarProps } from "@/app/lib/dispose/types";

const DEFAULT_PLACEHOLDER = "品目名で検索（例：仏壇、布団、パソコン）";
const DEFAULT_ARIA_LABEL = "捨て方辞典の品目を検索";

export default function SearchBar({
  placeholder = DEFAULT_PLACEHOLDER,
  suggestions = [],
  ariaLabel = DEFAULT_ARIA_LABEL,
  onSearch,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = useCallback(
    (slug: string) => {
      if (onSearch) {
        onSearch(slug);
      } else {
        router.push(`/dispose/${slug}`);
      }
      setQuery("");
      setIsExpanded(false);
    },
    [onSearch, router]
  );

  const filtered =
    showSuggestions && query.trim().length > 0 && suggestions.length > 0
      ? suggestions
          .filter(
            (s) =>
              s.name.includes(query.trim()) ||
              s.slug.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 8)
      : [];

  return (
    <section aria-label="捨て方検索" className="w-full">
      <div className="relative">
        <label htmlFor="dispose-search-input" className="sr-only">
          {ariaLabel}
        </label>
        <input
          id="dispose-search-input"
          type="search"
          role="searchbox"
          aria-label={ariaLabel}
          aria-expanded={isExpanded && filtered.length > 0}
          aria-autocomplete="list"
          aria-controls="dispose-search-suggestions"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsExpanded(true);
          }}
          onFocus={() => filtered.length > 0 && setIsExpanded(true)}
          onBlur={() => setTimeout(() => setIsExpanded(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length > 0) {
              e.preventDefault();
              handleSearch(filtered[0].slug);
            }
          }}
          className="w-full max-w-xl mx-auto block rounded-2xl border-2 border-primary/40 bg-background px-5 py-4 text-base text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm"
        />
        {isExpanded && filtered.length > 0 && (
          <ul
            id="dispose-search-suggestions"
            role="listbox"
            className="absolute z-10 top-full left-0 right-0 mt-1 max-w-xl mx-auto bg-card border-2 border-primary/30 rounded-xl shadow-lg overflow-hidden divide-y divide-border"
          >
            {filtered.map((s) => (
              <li key={s.slug} role="option">
                <button
                  type="button"
                  className="w-full text-left px-5 py-3 text-sm font-medium text-foreground hover:bg-primary-light/40 transition"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSearch(s.slug)}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
