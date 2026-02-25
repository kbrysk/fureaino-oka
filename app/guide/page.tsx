import { pageTitle } from "../lib/site-brand";
import { SITE_NAME_FULL } from "../lib/site-brand";
import GuideTriage from "../components/guide/GuideTriage";
import GuideTimeline from "../components/guide/GuideTimeline";

export const metadata = {
  title: pageTitle("実家じまい・生前整理の完全ロードマップ"),
  description: `実家じまい・生前整理をすごろく式で進めよう。家族で話し合うキッカケから、資産の把握・分担・処分・査定まで。${SITE_NAME_FULL}。`,
};

export default function GuidePage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          実家じまい・生前整理の完全ロードマップ
        </h1>
        <p className="text-foreground/60 mt-2 max-w-2xl">
          何から手をつけていいか分からない方へ。すごろく式のステップで、今の状況に合わせて進められます。
        </p>
      </header>

      <GuideTriage />

      <div>
        <h2 className="sr-only">ロードマップのステップ一覧</h2>
        <GuideTimeline />
      </div>
    </div>
  );
}
