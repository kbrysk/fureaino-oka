import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import { organization } from "../lib/constants/site-metadata";
import { getCanonicalUrl } from "../lib/site-url";

export const metadata: Metadata = {
  title: pageTitle("編集指針"),
  description: `${SITE_NAME_FULL}の編集指針。情報の正確性・調査手法・透明性について、Googleヘルプフルコンテンツに沿った方針を明示しています。`,
  alternates: { canonical: getCanonicalUrl("/editorial-policy") },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 border-b-2 border-primary/30 pb-3">
        編集指針
      </h1>
      <p className="text-sm text-foreground/60 mb-10">
        当サイトは、信頼できる情報提供のため、以下の指針に基づいてコンテンツを制作・更新しています。
      </p>

      <article className="space-y-10 text-foreground/90">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4">情報の正確性</h2>
          <ul className="space-y-3 text-sm sm:text-base list-disc pl-6">
            <li>
              <strong>一次情報源の優先</strong>
              <br />
              <span className="text-foreground/80">
                自治体が公表する公式ドメイン（.lg.jp）を一次情報源とし、補助金・空き家対策・粗大ゴミルール等の制度情報を参照しています。
              </span>
            </li>
            <li>
              <strong>年度・予算の明示</strong>
              <br />
              <span className="text-foreground/80">
                2026年度（令和8年度）の最新予算案・実施要綱に基づき情報を更新し、制度変更がある場合は随時見直しを行います。
              </span>
            </li>
            <li>
              <strong>専門家監修</strong>
              <br />
              <span className="text-foreground/80">
                整理収納・生前整理に関する記載は整理収納アドバイザー、税制・補助金に関する記載は税理士の監修を受けており、YMYL領域の情報は特に慎重に管理しています。
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4">調査手法</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            {organization.name}の専門調査チームが、各自治体の広報・建築指導課・空き家対策担当等の窓口情報を個別に精査しています。
          </p>
          <ul className="space-y-2 text-sm sm:text-base list-disc pl-6">
            <li>自治体公式サイトおよび公表資料の確認</li>
            <li>補助金の上限額・申請条件・窓口の整理と平易な言葉への「翻訳」</li>
            <li>不用品回収・遺品整理の相場は、複数ソースに基づく統計的な目安として提示</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4">透明性</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            広告や特定の業者紹介に偏ることなく、算出された統計相場および自治体公式データを客観的に提示することを心がけています。
          </p>
          <ul className="space-y-2 text-sm sm:text-base list-disc pl-6">
            <li>提携サービス（査定・見積もり導線）がある場合は、コンテンツの文脈で分かるように表示しています。</li>
            <li>制度の詳細・申請の可否は、必ずお住まいの市区町村窓口または専門家にご確認いただくよう案内しています。</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary-light/20 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-primary mb-4">お問い合わせ・運営者</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            編集指針やコンテンツに関するご指摘・ご質問は、
            <Link href="/contact" className="text-primary font-medium hover:underline mx-1">
              お問い合わせ
            </Link>
            よりお送りください。運営者情報は
            <Link href="/about" className="text-primary font-medium hover:underline mx-1">
              運営者情報
            </Link>
            をご覧ください。
          </p>
        </section>
      </article>

      <nav className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
        <Link href="/about" className="text-primary font-medium hover:underline">
          運営者情報
        </Link>
        <Link href="/contact" className="text-primary font-medium hover:underline">
          お問い合わせ
        </Link>
        <Link href="/" className="text-foreground/60 hover:text-primary hover:underline">
          ← トップへ戻る
        </Link>
      </nav>
    </div>
  );
}
