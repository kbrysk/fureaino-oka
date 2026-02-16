"use client";

import { useState } from "react";

interface EmailCTAProps {
  variant: "inline" | "banner" | "floating";
  heading: string;
  description: string;
  /** 流入元（API の source に送る）。例: home_cta, article */
  source?: string;
  /** 記事の slug など（任意） */
  sourceSlug?: string;
}

export default function EmailCTA({
  variant,
  heading,
  description,
  source = "home_cta",
  sourceSlug,
}: EmailCTAProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegistered =
    typeof window !== "undefined" && localStorage.getItem("seizenseiri_email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("正しいメールアドレスを入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          source_slug: sourceSlug ?? undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "送信に失敗しました。しばらくしてからお試しください。");
        return;
      }

      localStorage.setItem("seizenseiri_email", email.trim());
      localStorage.setItem("seizenseiri_email_date", new Date().toISOString());
      setSubmitted(true);
    } catch {
      setError("送信に失敗しました。しばらくしてからお試しください。");
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered && variant !== "floating") {
    return null; // Already registered, don't show inline/banner CTAs
  }

  if (submitted) {
    const isBanner = variant === "banner";
    return (
      <div
        className={`rounded-2xl p-8 text-center ${
          isBanner ? "bg-primary text-white" : "bg-primary-light border border-border"
        }`}
      >
        <div className="text-2xl mb-2">&#10003;</div>
        <h3 className="text-lg font-bold mb-1">ご登録ありがとうございます！</h3>
        <p className={`text-sm ${isBanner ? "text-white/80" : "text-foreground/60"}`}>
          ガイドブックをメールでお送りしました。ご確認ください。
        </p>
        <p className={`text-sm font-medium mt-4 ${isBanner ? "text-white/90" : "text-foreground/70"}`}>
          次のステップ
        </p>
        <ul className="flex flex-wrap justify-center gap-3 mt-2">
          <li>
            <a
              href="/guide"
              className={`inline-block px-4 py-2 rounded-lg font-medium text-sm transition ${
                isBanner
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              進め方ガイドを見る
            </a>
          </li>
          <li>
            <a
              href="/checklist"
              className={`inline-block px-4 py-2 rounded-lg font-medium text-sm transition ${
                isBanner
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              チェックリストを始める
            </a>
          </li>
          <li>
            <a
              href="/settings"
              className={`inline-block px-4 py-2 rounded-lg font-medium text-sm transition ${
                isBanner
                  ? "bg-accent text-white hover:opacity-90"
                  : "bg-accent/20 text-accent hover:bg-accent/30"
              }`}
            >
              家族を招待してガイドブックをプレゼント
            </a>
          </li>
        </ul>
        <p className={`text-xs mt-3 ${isBanner ? "text-white/60" : "text-foreground/50"}`}>
          不用品の見積もり・買取の相談は
          <a href="/guide" className="underline ml-1">はじめかた</a>
          からご案内しています。
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-primary rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-xl font-bold">{heading}</h3>
          <p className="text-white/80">{description}</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              className="flex-1 px-4 py-3 rounded-xl text-foreground bg-white border-0 text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition whitespace-nowrap disabled:opacity-70"
            >
              {loading ? "送信中…" : "無料で受け取る"}
            </button>
          </form>
          {error && <p className="text-sm text-red-200">{error}</p>}
          <p className="text-xs text-white/50">
            登録は無料です。いつでも配信停止できます。
          </p>
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-card rounded-2xl shadow-2xl border border-border p-6 w-80">
        <h3 className="font-bold text-base mb-1">{heading}</h3>
        <p className="text-sm text-foreground/60 mb-3">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium text-sm hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? "送信中…" : "無料ガイドを受け取る"}
          </button>
        </form>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <p className="text-xs text-foreground/40 mt-2">
          無料・配信停止はいつでも可能
        </p>
      </div>
    );
  }

  // inline variant
  return (
    <div className="bg-primary-light rounded-2xl p-8 border border-primary/20">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
            &#128218;
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">{heading}</h3>
            <p className="text-sm text-foreground/60 mt-1">{description}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition whitespace-nowrap disabled:opacity-70"
          >
            {loading ? "送信中…" : "無料で受け取る"}
          </button>
        </form>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-xs text-foreground/40">
          登録は無料です。いつでも配信停止できます。
        </p>
      </div>
    </div>
  );
}
