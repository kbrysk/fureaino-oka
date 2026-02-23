import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import ContactThanksLineCTA from "../components/ContactThanksLineCTA";

export const metadata: Metadata = {
  title: pageTitle("お問い合わせ"),
  description: `${SITE_NAME_FULL}へのお問い合わせはこちら。株式会社Kogeraが運営しています。`,
};

type Props = { searchParams: Promise<{ sent?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { sent } = await searchParams;
  const showThanks = sent === "1";

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">お問い合わせ</h1>
      <p className="text-sm text-foreground/60 mb-8">
        {SITE_NAME_FULL}に関するお問い合わせは、下記よりご連絡ください。株式会社Kogeraが運営しています。
      </p>

      {showThanks ? (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <p className="text-foreground/90 font-medium">お問い合わせありがとうございます。</p>
          <p className="text-sm text-foreground/70">担当者より折り返しご連絡いたします。</p>
          <ContactThanksLineCTA />
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <p className="text-sm text-foreground/80">
            下記ボタンより、Googleフォームのお問い合わせページへ進んでください。お名前・メールアドレス・お問い合わせ内容をご記入のうえ、送信してください。
          </p>
          <p className="text-sm text-foreground/70">
            <Link href="/terms" className="text-primary hover:underline">利用規約</Link>・<Link href="/privacy" className="text-primary hover:underline">プライバシーポリシー</Link>に同意のうえ、ご利用ください。
          </p>
          <a
            href="https://forms.gle/eNJvqos72bHCaFNx6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition text-center"
          >
            お問い合わせフォームを開く（Googleフォーム）
            <span className="text-lg" aria-hidden>→</span>
          </a>
        </div>
      )}

      <p className="mt-8">
        <Link href="/" className="text-primary font-medium hover:underline">← トップへ戻る</Link>
      </p>
    </div>
  );
}
