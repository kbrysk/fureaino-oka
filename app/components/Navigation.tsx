"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OwlCharacter from "./OwlCharacter";
import LineGuideModal from "./LineGuideModal";

const navItems: { href?: string; label: string; openLineModal?: boolean }[] = [
  { href: "/", label: "ホーム" },
  { href: "/guidebook", label: "ガイドブック" },
  { href: "/articles", label: "記事" },
  { href: "/tools", label: "ツール" },
  { href: "/guide", label: "はじめかた" },
  { href: "/checklist", label: "チェックリスト" },
  { href: "/assets", label: "資産・持ち物" },
  { href: "/ending-note", label: "エンディングノート" },
  { href: "/settings", label: "設定" },
  { href: "/contact", label: "お問い合わせ" },
  { label: "無料ガイドブック", openLineModal: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lineModalOpen, setLineModalOpen] = useState(false);

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.openLineModal) {
      setLineModalOpen(true);
      setMobileOpen(false);
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0 md:mr-6">
            <OwlCharacter size={36} className="!gap-0" />
            <span className="text-lg sm:text-xl font-bold text-primary">生前整理支援センター ふれあいの丘</span>
          </Link>

          {/* スマホ: ハンバーガーボタン */}
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
              className={`absolute top-0 right-0 w-[min(280px,85vw)] h-full bg-card shadow-xl flex flex-col pt-20 px-4 gap-1 transition-transform duration-200 ${
                mobileOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {navItems.map((item) =>
                item.openLineModal ? (
                  <button
                    key="line-guide"
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-foreground/70 hover:bg-primary-light hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-foreground/70 hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* PC: 横並びナビ */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.openLineModal ? (
                <button
                  key="line-guide"
                  type="button"
                  onClick={() => setLineModalOpen(true)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-foreground/70 hover:bg-primary-light hover:text-primary"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-foreground/70 hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
      <LineGuideModal isOpen={lineModalOpen} onClose={() => setLineModalOpen(false)} />
    </header>
  );
}
