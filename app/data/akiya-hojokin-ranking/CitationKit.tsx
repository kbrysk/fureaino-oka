"use client";

import { useState } from "react";

/**
 * 引用・データ提供キット（被リンク獲得用）
 *
 * 目的:
 * - 「良いデータページ」を「被リンク磁石」に変える。
 * - 記者・ブロガー・研究者が "そのまま貼れる" 形を提供し、自然な被リンク／サイテーションを誘発する。
 *
 * 提供する3つの形:
 *  1. 出典クレジット（コピー）… 文章中の引用に
 *  2. 埋め込みカード（HTMLコピー）… ★iframeではなく実 <a> を含む自己完結HTML。
 *     貼った相手ページのDOMに本物のリンクが乗る＝被リンクとして機能する（iframe内リンクは host に効かない）。
 *     アンカーは商用KWではなくブランド／説明文にして過剰最適化を避ける（Google安全）。
 *  3. オープンデータDL（CSV/JSON, CC BY 4.0）… 二次利用・研究用
 */

type Props = {
  reportUrl: string;
  csvUrl: string;
  jsonUrl: string;
  /** 見出し統計（埋め込みカードに焼き込む実数値） */
  stats: {
    total: string; // "1,726"
    withSubsidy: string; // "844"
    withSubsidyPercent: string; // "48.9"
    averageMan: string; // "64万円"
    maxMan: string; // "1,550万円"
    topPref: string; // "東京都"
    topCity: string; // "品川区"
    asOf: string; // "2026年6月時点"
    credit: string; // "ふれあいの丘調べ"
  };
};

const SITE_LABEL = "生前整理支援センター ふれあいの丘";

export function CitationKit({ reportUrl, csvUrl, jsonUrl, stats }: Props) {
  const [copied, setCopied] = useState<null | "cite" | "embed">(null);

  const citationText = `全国${stats.total}自治体 空き家解体補助金 調査データ（${stats.asOf}・${stats.credit}）／ ${SITE_LABEL}（${reportUrl}）`;

  // 自己完結の埋め込みHTML（インラインスタイルのみ・外部CSS/JS不要・実 <a> リンク入り）
  const embedHtml =
    `<div style="max-width:520px;margin:16px 0;padding:16px 18px;border:1px solid #e5e1d8;border-radius:14px;` +
    `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#33312e;background:#fffdf8;">` +
    `<div style="font-size:13px;color:#9a8f7d;margin-bottom:6px;">空き家の解体補助金 全国調査（${stats.asOf}）</div>` +
    `<div style="font-size:16px;font-weight:700;">解体補助金がある自治体は<span style="color:#2f7d5b;">全国の${stats.withSubsidyPercent}%</span>` +
    `（${stats.withSubsidy}／${stats.total}自治体）。上限額の全国平均は約${stats.averageMan}、最高は${stats.topPref}${stats.topCity}の${stats.maxMan}。</div>` +
    `<div style="font-size:12px;color:#9a8f7d;margin-top:10px;">出典：` +
    `<a href="${reportUrl}" target="_blank" rel="noopener" style="color:#2f7d5b;text-decoration:underline;">全国${stats.total}自治体 空き家解体補助金 調査（${stats.credit}）</a>` +
    `｜${SITE_LABEL}</div>` +
    `</div>`;

  async function copy(text: string, which: "cite" | "embed") {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // フォールバック（古い環境）
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
    setCopied(which);
    window.setTimeout(() => setCopied((c) => (c === which ? null : c)), 2000);
  }

  return (
    <div className="space-y-6">
      {/* 1. 出典クレジット */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-2 text-base font-bold">① 記事で引用する（出典クレジット）</h3>
        <p className="mb-3 text-sm text-foreground/70">
          本データは出典を明記の上、記事・報道・研究・自治体資料などに自由にご利用いただけます（CC BY 4.0）。
        </p>
        <div className="rounded-lg bg-primary-light/15 p-3 text-xs leading-relaxed text-foreground/80">
          {citationText}
        </div>
        <button
          type="button"
          onClick={() => copy(citationText, "cite")}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
        >
          {copied === "cite" ? "コピーしました ✓" : "出典をコピー"}
        </button>
      </div>

      {/* 2. 埋め込みカード */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-2 text-base font-bold">② サイト・ブログに貼る（埋め込みカード）</h3>
        <p className="mb-3 text-sm text-foreground/70">
          下のHTMLをコピーして記事に貼ると、このカードがそのまま表示されます（画像・外部スクリプト不要）。出典リンクが自動で入ります。
        </p>

        {/* プレビュー */}
        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold text-foreground/50">プレビュー</div>
          <div
            className="overflow-hidden rounded-lg border border-dashed border-border p-1"
            // 埋め込みHTMLと完全一致のプレビュー（コピーされる内容と同一）
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        </div>

        {/* コード */}
        <div className="mb-1 text-xs font-semibold text-foreground/50">埋め込みコード（HTML）</div>
        <textarea
          readOnly
          value={embedHtml}
          onFocus={(e) => e.currentTarget.select()}
          rows={5}
          className="w-full resize-y rounded-lg border border-border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground/80"
        />
        <button
          type="button"
          onClick={() => copy(embedHtml, "embed")}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          {copied === "embed" ? "コピーしました ✓" : "埋め込みコードをコピー"}
        </button>
      </div>

      {/* 3. オープンデータDL */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-2 text-base font-bold">③ データで使う（オープンデータDL）</h3>
        <p className="mb-3 text-sm text-foreground/70">
          全{stats.total}自治体の明細を機械可読データで配布しています（CC BY 4.0）。表計算・分析・再配布にどうぞ。
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={csvUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
          >
            CSVをダウンロード
            <span aria-hidden>↓</span>
          </a>
          <a
            href={jsonUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
          >
            JSONをダウンロード
            <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </div>
  );
}
