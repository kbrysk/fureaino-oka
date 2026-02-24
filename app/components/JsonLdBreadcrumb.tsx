"use client";

import { usePathname } from "next/navigation";

/** パスセグメント → 表示ラベル（SEO: パンくずJSON-LD用） */
const SEGMENT_LABELS: Record<string, string> = {
  area: "地域別 粗大ゴミ・遺品整理",
  cost: "間取り別 片付け費用",
  dispose: "捨て方辞典",
  tools: "無料ツール一覧",
  guide: "生前整理のはじめかた",
  guidebook: "ガイドブック",
  "jikka-jimai": "実家じまい",
  about: "運営者情報",
  "about-site": "ふれあいの丘とは",
  articles: "記事一覧",
  checklist: "チェックリスト",
  "ending-note": "エンディングノート",
  senryu: "実家じまい川柳",
  submit: "投稿",
  assets: "資産・持ち物",
  contact: "お問い合わせ",
  terms: "利用規約",
  privacy: "プライバシーポリシー",
  settings: "設定",
  region: "地域",
  "jikka-diagnosis": "実家じまい力診断",
  "akiya-risk": "空き家リスク診断",
  "souzoku-prep": "相続準備力診断",
  "empty-house-tax": "空き家税金シミュレーター",
  appraisal: "資産・査定の目安",
  "inheritance-share": "法定相続分シミュレーター",
  "hoji-calendar": "法要カレンダー",
  "digital-shame": "デジタル遺品リスク診断",
  category: "カテゴリ",
  tag: "タグ",
};

function getLabel(segment: string, index: number, segments: string[]): string {
  const decoded = decodeURIComponent(segment);
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (SEGMENT_LABELS[decoded]) return SEGMENT_LABELS[decoded];
  if (segments[0] === "articles" && index === 1) return "記事";
  if (segments[0] === "dispose" && index === 1) return "捨て方";
  if (segments[0] === "cost" && segments[1] === "layout" && index === 2) return decoded;
  if (segments[0] === "area" && index >= 1) return decoded;
  if (segments[0] === "region" && index >= 1) return decoded;
  if (segments[0] === "tax-simulator" && index >= 1) return decoded;
  return decoded;
}

interface JsonLdBreadcrumbProps {
  /** 絶対URLのベース（例: https://www.fureaino-oka.com） */
  baseUrl: string;
}

/**
 * 現在パスから BreadcrumbList の JSON-LD を生成（SEO: 検索結果のパンくず表示・クローラー巡回効率）
 * layout で1回だけ読み込み、4,000+ 地域ページ含む全ページに出力。item はパラメータなし絶対URLで評価を正規URLに集約。
 */
export default function JsonLdBreadcrumb({ baseUrl }: JsonLdBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items: { name: string; path: string }[] = [{ name: "ホーム", path: "/" }];
  let acc = "";
  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    items.push({
      name: getLabel(segments[i], i, segments),
      path: acc,
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path === "/" ? "" : item.path}`.replace(/\?.*$/, ""),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
