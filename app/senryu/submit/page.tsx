"use client";

import { useState } from "react";
import Link from "next/link";
import { pageTitle } from "../../lib/site-brand";

/**
 * 川柳投稿フォーム（UGC募集）
 * 採用でAmazonギフト券500円 or 特製エンディングノート
 * メール or LINE でリスト獲得
 */
export default function SenryuSubmitPage() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡易：送信は未実装。準備中メッセージ or 後でAPI連携
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/senryu" className="hover:text-primary">実家じまい川柳</Link>
        <span className="mx-2">/</span>
        <span>投稿する</span>
      </p>

      <h1 className="text-2xl font-bold text-primary">みんなの実家じまい川柳を投稿</h1>
      <p className="text-foreground/70">
        採用された方にAmazonギフト券500円分または特製エンディングノートをプレゼント。投稿にはメールアドレスが必要です。
      </p>

      {submitted ? (
        <div className="bg-primary-light/40 rounded-2xl border border-primary/20 p-6 text-center">
          <p className="font-medium text-primary mb-2">送信ありがとうございます</p>
          <p className="text-sm text-foreground/70">
            投稿の受付は準備中です。しばらくお待ちください。お問い合わせフォームから「川柳投稿」とご記入いただいても結構です。
          </p>
          <Link href="/contact" className="inline-block mt-4 text-primary font-medium hover:underline">
            お問い合わせフォームへ
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label htmlFor="senryu-text" className="block text-sm font-medium text-foreground/80 mb-1">
              川柳（17音目安・自由律も可）
            </label>
            <input
              id="senryu-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例：実家から　謎の壺出た　価値はゼロ"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground/40"
              maxLength={50}
            />
          </div>
          <div>
            <label htmlFor="senryu-email" className="block text-sm font-medium text-foreground/80 mb-1">
              メールアドレス（採用連絡用・必須）
            </label>
            <input
              id="senryu-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
            />
          </div>
          <p className="text-xs text-foreground/50">
            採用の連絡のみに使用します。営業メールは送りません。プライバシーポリシーに同意のうえご投稿ください。
          </p>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            投稿する
          </button>
        </form>
      )}

      <p className="text-sm">
        <Link href="/senryu" className="text-primary hover:underline">← 川柳一覧へ戻る</Link>
      </p>
    </div>
  );
}
