import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import { organization } from "../lib/constants/site-metadata";
import { getCanonicalUrl } from "../lib/site-url";

export const metadata: Metadata = {
  title: pageTitle("運営者情報"),
  description: `株式会社Kogera（Kogera Inc.）が運営する実家じまい調査支援センター「${SITE_NAME_FULL}」の運営者情報。事業内容・信念をご説明します。`,
  alternates: { canonical: getCanonicalUrl("/about") },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 border-b-2 border-primary/30 pb-3">
        運営者情報
      </h1>
      <p className="text-sm text-foreground/60 mb-10">
        実家じまい・遺品整理の情報は、信頼できる運営元から。
      </p>

      <article className="space-y-10 text-foreground/90">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4">組織概要</h2>
          <dl className="space-y-3 text-sm sm:text-base">
            <div>
              <dt className="font-semibold text-foreground/70 mb-0.5">組織名</dt>
              <dd className="font-medium">{organization.name}</dd>
              <dd className="text-foreground/60 text-sm">Kogera Inc.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground/70 mb-0.5">プロジェクト</dt>
              <dd>実家じまい調査支援センター「ふれあいの丘」</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4">事業内容</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            {organization.name}は、実家じまい・空き家対策に特化した情報基盤の構築と提供を行っています。
          </p>
          <ul className="space-y-3 text-sm sm:text-base list-disc pl-6">
            <li>
              <strong>不用品回収・遺品整理相場の定点観測</strong>
              <br />
              <span className="text-foreground/80">
                日本全国844エリアにおよぶ不用品回収・遺品整理の相場を継続的に調査・更新し、ご家族が安心して業者選びができるようデータを公開しています。
              </span>
            </li>
            <li>
              <strong>解体補助金・空き家対策情報のデータベース化</strong>
              <br />
              <span className="text-foreground/80">
                国内176主要自治体の解体補助金・空き家対策情報を収集・解析し、自治体公式ドメイン（.lg.jp）を一次情報源として、制度の要点を分かりやすくお届けしています。
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary-light/20 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-primary mb-4">私たちの信念</h2>
          <blockquote className="text-base sm:text-lg leading-relaxed italic text-foreground/90 border-l-4 border-primary pl-4">
            「実家じまいの複雑な行政手続きや不透明な費用相場を、データとテクノロジーの力で民主化し、ご家族の不安を安心に変える。」
          </blockquote>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4">信頼性への取り組み</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            当サイトの地域別情報は、自治体の公式発表および窓口情報に基づき、{organization.name}の専門調査チームが精査したものです。編集指針・情報の更新方針については、以下のページで詳しく定めています。
          </p>
          <Link
            href="/editorial-policy"
            className="inline-block bg-primary text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition"
          >
            編集指針を読む
          </Link>
        </section>
      </article>

      <nav className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
        <Link href="/contact" className="text-primary font-medium hover:underline">
          お問い合わせ
        </Link>
        <Link href="/editorial-policy" className="text-primary font-medium hover:underline">
          編集指針
        </Link>
        <Link href="/articles/master-guide" className="text-primary font-medium hover:underline">
          生前整理のはじめかた
        </Link>
        <Link href="/" className="text-foreground/60 hover:text-primary hover:underline">
          ← トップへ戻る
        </Link>
      </nav>
    </div>
  );
}
