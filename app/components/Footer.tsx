import Link from "next/link";
import { organization } from "../lib/constants/site-metadata";
import OwlCharacter from "./OwlCharacter";

/** 必須リンク（コンプライアンス・運営者情報）。site-metadata と整合するパス。 */
const REQUIRED_LINKS: { href: string; label: string }[] = [
  { href: "/company", label: "運営会社情報" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
];

/**
 * フッター内部リンク（SEO: クロール効率・重要ページへのリンクジュース配分）
 * - ツール一覧をハブとして最上部に配置
 * - 全無料ツールを掲載し、各ページを1クリックで発見可能に
 * - コンテンツ・進捗系と法的情報でセクション分け
 */
const FOOTER_TOOLS: { href: string; label: string }[] = [
  { href: "/tools", label: "無料ツール一覧" },
  { href: "/tools/inheritance-share", label: "法定相続分シミュレーター" },
  { href: "/tools/hoji-calendar", label: "法要カレンダー" },
  { href: "/tools/digital-shame", label: "デジタル遺品リスク診断" },
  { href: "/tools/jikka-diagnosis", label: "実家じまい力診断" },
  { href: "/tools/akiya-risk", label: "空き家リスク診断" },
  { href: "/tools/souzoku-prep", label: "相続準備力診断" },
  { href: "/tools/empty-house-tax", label: "空き家税金シミュレーター" },
  { href: "/tools/appraisal", label: "資産・査定の目安" },
];

const FOOTER_GUIDE_AND_CONTENT: { href: string; label: string }[] = [
  { href: "/about-site", label: "ふれあいの丘とは" },
  { href: "/guide", label: "生前整理のはじめかた" },
  { href: "/guidebook", label: "ガイドブック（無料PDF）" },
  { href: "/about", label: "運営者情報" }, // 旧「運営者の想い」から名称変更
  { href: "/articles", label: "記事一覧" },
  { href: "/cost", label: "間取り別 片付け費用" },
  { href: "/dispose", label: "捨て方辞典" },
  { href: "/senryu", label: "実家じまい川柳" },
];

const FOOTER_PROGRESS: { href: string; label: string }[] = [
  { href: "/checklist", label: "チェックリスト" },
  { href: "/assets", label: "資産・持ち物" },
  { href: "/ending-note", label: "エンディングノート" },
  { href: "/area", label: "地域別 粗大ゴミ・遺品整理" },
];

/** 法的情報セクション（必須リンクを先頭に） */
const FOOTER_LEGAL: { href: string; label: string }[] = [
  ...REQUIRED_LINKS,
];

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-bold text-foreground/70 mb-3">{title}</h3>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="text-sm text-primary hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-muted/25 py-8 px-4"
      role="contentinfo"
      aria-label="サイトフッター"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <FooterLinkList title="無料ツール" links={FOOTER_TOOLS} />
          <FooterLinkList title="はじめ方・コンテンツ" links={FOOTER_GUIDE_AND_CONTENT} />
          <FooterLinkList title="進捗・管理" links={FOOTER_PROGRESS} />
          <FooterLinkList title="運営・法的情報" links={FOOTER_LEGAL} />
        </div>
        <div className="text-center pt-6 border-t border-border">
          <OwlCharacter size={40} className="mb-3 mx-auto opacity-90" aria-hidden />
          <p className="text-sm text-foreground/80">
            &copy; {currentYear} {organization.name} All Rights Reserved.
          </p>
          <p className="text-xs text-foreground/60 mt-1">実家じまい・遺品整理の無料相談</p>
        </div>
      </div>
    </footer>
  );
}
