import Link from "next/link";
import EmailCTA from "./EmailCTA";
import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

interface ArticleFooterCTAProps {
  slug: string;
  /** 記事カテゴリ（相続・葬儀・終活で関連ツールのバナーを出し分け） */
  category?: string;
}

const TOOL_BY_CATEGORY: { pattern: RegExp; href: string; title: string; description: string }[] = [
  { pattern: /相続|遺言|遺産|法定相続/, href: "/tools/inheritance-share", title: "法定相続分シミュレーター", description: "家族構成で法定相続分を円グラフ表示。家系図をエンディングノートへ。" },
  { pattern: /葬儀|法要|四十九日|一周忌|香典/, href: "/tools/hoji-calendar", title: "法要カレンダー", description: "命日から三十三回忌までの日程表を自動生成。Googleカレンダーに追加可。" },
  { pattern: /終活|デジタル遺品|スマホ|パスワード/, href: "/tools/digital-shame", title: "デジタル遺品リスク診断", description: "「見られたくないデータ」のリスクを診断。結果をXでシェア。" },
];

function getToolForCategory(category: string) {
  return TOOL_BY_CATEGORY.find((t) => t.pattern.test(category));
}

/**
 * 記事フッター用：記事下LINE CTA ＋ 無料ガイド登録 ＋ 関連ツールバナー ＋ アフィ導線
 */
export default function ArticleFooterCTA({ slug, category = "" }: ArticleFooterCTAProps) {
  const tool = getToolForCategory(category);

  return (
    <div className="space-y-8">
      {/* 記事最下部：大きめLINEバナー */}
      <section className="rounded-2xl border-2 border-[#06C755]/30 bg-[#06C755]/5 p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold text-primary mb-2">「何から始めればいいか」もう迷わない。</h3>
        <p className="text-sm text-foreground/80 mb-4">
          累計10,000人がダウンロードした「実家じまい・相続のやることリスト」を配布しています。
        </p>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-white py-4 px-8 rounded-xl font-bold hover:opacity-90 transition"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <span aria-hidden>LINE</span>
          LINEで友達追加して特典をもらう
        </a>
        <p className="text-xs text-foreground/55 mt-3">※しつこい営業チャットは一切送りません。</p>
        <p className="text-xs text-foreground/50 mt-1">※完全無料　※いつでもブロック可能</p>
      </section>

      {tool && (
        <section className="bg-card rounded-2xl p-6 border border-border">
          <p className="text-sm font-bold text-foreground/60 mb-2">この記事に関連するツール</p>
          <Link href={tool.href} className="block p-4 rounded-xl bg-primary-light/30 border border-primary/20 hover:border-primary/50 transition">
            <p className="font-bold text-primary">{tool.title}</p>
            <p className="text-sm text-foreground/60 mt-1">{tool.description}</p>
          </Link>
        </section>
      )}
      <section className="bg-primary-light rounded-2xl p-6 border border-primary/20">
        <EmailCTA
          variant="inline"
          heading="生前整理 完全ガイドブック（無料PDF）"
          description="優先順位チェックシート・財産一覧テンプレート・エンディングノートの書き方をまとめたガイドを無料でお届けします。"
          source="article"
          sourceSlug={slug}
        />
      </section>
      <section>
        <p className="text-sm text-foreground/60 mb-3">このあとできること</p>
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link
              href="/guide"
              className="inline-block px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition text-sm font-medium"
            >
              はじめかたガイド
            </Link>
          </li>
          <li>
            <Link
              href="/cost"
              className="inline-block px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition text-sm font-medium"
            >
              間取り別 費用相場
            </Link>
          </li>
          <li>
            <Link
              href="/dispose"
              className="inline-block px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition text-sm font-medium"
            >
              捨て方辞典
            </Link>
          </li>
          <li>
            <Link
              href="/tools/jikka-diagnosis"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition text-sm font-medium"
            >
              実家じまい力診断
            </Link>
          </li>
          <li>
            <Link
              href="/checklist"
              className="inline-block px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition text-sm font-medium"
            >
              チェックリスト
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:text-primary transition text-sm font-medium"
            >
              トップへ
            </Link>
          </li>
        </ul>
        <p className="text-xs text-foreground/50 mt-3">
          不用品の見積もり・買取の相談は
          <Link href="/guide" className="text-primary hover:underline">
            はじめかた
          </Link>
          からご案内しています。
        </p>
      </section>
    </div>
  );
}
