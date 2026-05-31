"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MicroCmsBlogPost } from "../../lib/microcms-types";

interface Props {
  /** 検索対象の全記事（軽量フィールドのみ） */
  posts: Pick<MicroCmsBlogPost, "id" | "title" | "description" | "category" | "thumbnail">[];
}

/**
 * クライアントサイド絞り込み検索バー
 *
 * UI/UX設計：
 * - ファーストビュー上部に常駐
 * - リアルタイムフィルタ（入力即反映）
 * - キーワードはタイトル＋description＋カテゴリ名で検索
 * - 結果は最大8件のドロップダウンで表示
 * - シニア配慮: 入力フィールド大きめ (h-12) / フォント16px
 */
export default function ArticleSearchBar({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // パフォーマンス: 検索インデックスを事前計算
  const searchIndex = useMemo(() => {
    return posts.map((p) => ({
      ...p,
      _searchText: `${p.title} ${p.description ?? ""} ${p.category?.name ?? ""}`.toLowerCase(),
    }));
  }, [posts]);

  const trimmed = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!trimmed) return [];
    return searchIndex.filter((p) => p._searchText.includes(trimmed)).slice(0, 8);
  }, [searchIndex, trimmed]);

  // ESCで閉じる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocused(false);
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const showResults = isFocused && trimmed.length >= 1;

  return (
    <div className="relative">
      <label htmlFor="article-search" className="sr-only">
        記事を検索
      </label>
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          id="article-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // ドロップダウンのクリック検出のため少し遅延
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder="キーワード・状況で検索（例：相続税、空き家、介護）"
          className="w-full h-12 sm:h-14 pl-12 pr-10 text-base bg-card border-2 border-border focus:border-primary focus:outline-none rounded-2xl shadow-sm placeholder:text-foreground/40 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="検索をクリア"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-border rounded-full"
          >
            ✕
          </button>
        )}
      </div>

      {/* 検索結果ドロップダウン */}
      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-2xl shadow-xl z-50 max-h-[60vh] overflow-y-auto"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="p-6 text-center text-foreground/60">
              <p className="text-sm">「{trimmed}」に一致する記事はありません</p>
              <p className="text-xs mt-1">
                別のキーワードや、下のカテゴリから探してみてください
              </p>
            </div>
          ) : (
            <>
              <p className="px-4 py-2 text-xs font-bold text-foreground/50 border-b border-border">
                {results.length}件の記事が見つかりました
              </p>
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/articles/${p.id}`}
                      className="flex gap-3 p-3 hover:bg-primary-light/20 transition border-b border-border last:border-b-0"
                      role="option"
                    >
                      {p.thumbnail?.url ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-border shrink-0">
                          <Image
                            src={p.thumbnail.url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary-light/40 shrink-0 flex items-center justify-center text-2xl">
                          📄
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {p.category?.name && (
                          <span className="text-[10px] text-primary font-bold">
                            {p.category.name}
                          </span>
                        )}
                        <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
                          {p.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
