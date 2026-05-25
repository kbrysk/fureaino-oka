import Link from "next/link";
import { getGeneralSupervisor } from "../../lib/supervisors";

/**
 * E-E-A-T: 記事末尾の監修者ブロック。
 * 監修者は app/lib/supervisors.ts の現・総合監修者を参照（現＝大久保亮佑/生前整理アドバイザー2級、
 * 村上充恵 様の許諾取得後は CURRENT_GENERAL_SUPERVISOR を切り替えるだけで全記事の表示が更新される）。
 */
export default function ArticleEeaatProfile() {
  const s = getGeneralSupervisor();
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
