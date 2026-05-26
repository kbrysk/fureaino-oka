import Link from "next/link";
import { resolveArticleSupervisor } from "../../lib/supervisors";

/**
 * E-E-A-T: 記事末尾の監修者ブロック。
 *
 * 記事の supervisor 区分（microCMS の supervisor フィールド）に応じて表示を切り替える:
 *  - 人物（general/okubo/murakami・未設定）… 現・総合監修者の人物バイラインを表示
 *    （現＝大久保亮佑/生前整理アドバイザー2級。村上充恵 様の許諾取得後は
 *      CURRENT_GENERAL_SUPERVISOR を切り替えるだけで全記事の表示が更新される）。
 *  - "none"（相続税・年金・登記・不動産など総合監修の対象外の専門家領域）…
 *    人物監修バイラインを出さず、中立の運営者表記＋一般情報の注記に切り替える。
 *    2級アドバイザーが法務・税務を監修したかのような誤認を防ぐためのガード。
 */
export default function ArticleEeaatProfile({ supervisor }: { supervisor?: string }) {
  const s = resolveArticleSupervisor(supervisor);

  // supervisor="none": 専門家領域。人物監修バイラインを出さず中立の運営者表記にする。
  if (!s) {
    return (
      <div className="mt-10 pt-8 border-t border-border rounded-2xl bg-card border border-border p-5">
        <p className="text-sm font-medium text-foreground/70 mb-3">この記事について</p>
        <p className="text-sm text-foreground/70 leading-relaxed">
          本記事は一般的な情報提供を目的としたものです。相続・年金・税・登記などの手続きは、
          個別の状況や法改正によって取り扱いが異なります。具体的な手続きや判断は、各市区町村窓口・
          年金事務所・法務局・税務署、および司法書士・税理士・弁護士などの専門家に必ずご確認ください。
        </p>
        <p className="text-sm text-foreground/60 mt-3 leading-relaxed">
          編集・運営：株式会社Kogera「生前整理支援センター ふれあいの丘」。
          実家じまい・遺品整理・生前整理の進め方を、当事者とご家族の目線でわかりやすくお届けしています。
        </p>
      </div>
    );
  }

  // 人物監修バイライン（従来表示）
  return (
    <div className="mt-10 pt-8 border-t border-border rounded-2xl bg-card border border-border p-5">
      <p className="text-sm font-medium text-foreground/70 mb-3">この記事の監修者</p>
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center shrink-0"
          aria-hidden
        >
          <svg width="36" height="36" viewBox="0 0 64 64">
            <circle cx="32" cy="24" r="13" fill="#cfe0d6" />
            <path d="M14 54 a18 16 0 0 1 36 0 z" fill="#cfe0d6" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-primary text-lg leading-tight">
            <Link href={s.profileHref} className="hover:underline">
              {s.name}
            </Link>
          </p>
          <p className="text-sm text-foreground/70 mt-1">{s.credentials.join("／")}</p>
          <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
            株式会社Kogera「生前整理支援センター ふれあいの丘」運営。実家じまい・遺品整理・生前整理の進め方を、当事者とご家族の目線でわかりやすくお届けしています。
            <Link href={s.profileHref} className="text-primary hover:underline ml-1">
              監修者プロフィール →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
