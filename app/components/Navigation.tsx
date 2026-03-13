"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OwlCharacter from "./OwlCharacter";
import { SiteSearch } from "./ui/SiteSearch";

const navItems: { href: string; label: string }[] = [
  { href: "/", label: "ホーム" },
  { href: "/guidebook", label: "ガイドブック" },
  { href: "/articles", label: "記事" },
  { href: "/tools", label: "ツール" },
  { href: "/articles/master-guide", label: "はじめかた" },
  { href: "/checklist", label: "チェックリスト" },
  { href: "/assets", label: "資産・持ち物" },
  { href: "/ending-note", label: "エンディングノート" },
  { href: "/settings", label: "設定" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0 md:mr-2">
            <OwlCharacter size={36} className="!gap-0" />
            <span className="text-lg sm:text-xl font-bold text-primary">生前整理支援センター ふれあいの丘</span>
          </Link>

          {/* PC: 検索アイコンのみ表示、クリックでドロップダウン展開（U6-FIX） */}
          <div className="hidden md:block relative">
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary-light text-foreground/70 hover:text-primary transition-colors"
              aria-label="検索"
              aria-expanded={searchOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {searchOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  aria-hidden
                  onClick={() => setSearchOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-80 z-50 bg-card shadow-lg rounded-lg border border-border p-3">
                  <SiteSearch />
                </div>
              </>
            )}
          </div>

          {/* スマホ: ハンバーガーボタンのみ（検索はメニュー内に移動・U6-FIX） */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 -mr-2 rounded-lg text-foreground/70 hover:bg-primary-light hover:text-primary"
            aria-label="メニューを開く"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">メニュー</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* スマホ: ドロワー */}
          <div
            className={`fixed inset-0 z-30 md:hidden ${mobileOpen ? "visible" : "invisible"}`}
            aria-hidden={!mobileOpen}
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <nav
              className={`absolute top-0 right-0 w-[min(280px,85vw)] h-full bg-card shadow-xl flex flex-col pt-20 gap-1 transition-transform duration-200 ${
                mobileOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* スマホ: メニュー最上部に検索ボックス（U6-FIX） */}
              <div className="px-4 py-3 border-b border-border">
                <SiteSearch />
              </div>
              <div className="px-4 flex flex-col gap-1">
              {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-foreground/70 hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* PC: 横並びナビ */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-foreground/70 hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
