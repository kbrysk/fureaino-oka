"use client";

import { useState } from "react";

/**
 * 引用・データ提供キット（被リンク獲得 / 引用メディア視点で最適化した v2）
 *
 * 設計の狙い（引用する側＝メディアの心理に合わせる）:
 *  - 「引用したくなる」… 母数・定義・中央値まで明示し、ファクトチェックに耐える誠実な数値。
 *  - 「引用しやすい」… 用途別の引用文（本文／図表キャプション／参考文献）をワンクリックでコピー。
 *  - 「ためらわない」… 出典URL・ライセンス・バージョンを内包。商用CTAは混在させず中立に保つ。
 *
 * 提供する形:
 *  1. 引用文（用途別3形式コピー）
 *  2. 埋め込みカード（★iframeでなく実 <a> を含む自己完結HTML。貼った相手ページのDOMに
 *     本物のリンクが乗る＝被リンクとして機能。アンカーはブランド・説明文で過剰最適化を回避）
 *  3. オープンデータDL（CSV/JSON, CC BY 4.0）
 */

type Stats = {
  total: string; // "1,726"
  nationalTotal: string; // "1,741"
  coveragePercent: string; // "99.1"
  withSubsidy: string; // "844"
  withSubsidyPercent: string; // "48.9"
  parsedN: string; // "532"
  medianMan: string; // "50万円"
  averageMan: string; // "64万円"
  maxMan: string; // "1,550万円"
  topPref: string; // "東京都"
  topCity: string; // "品川区"
  asOf: string; // "2026年6月時点"
  credit: string; // "ふれあいの丘調べ"
  version: string; // "2026.06"
};

type Props = {
  reportUrl: string;
  csvUrl: string;
  jsonUrl: string;
  stats: Stats;
  /** 引用文・カードの地域スコープ。全国＝{name:"全国", isNational:true}、県別＝{name:"東京都", isNational:false} */
  region?: { name: string; isNational: boolean };
  /** 配布インフォグラフィック画像URL（あれば「画像で引用」を表示）。 */
  imageUrl?: string;
};

const SITE_LABEL = "生前整理支援センター ふれあいの丘";

/** コピーボタン（共通）。 */
function CopyButton({
  text,
  label,
  primary = false,
}: {
  text: string;
  label: string;
  primary?: boolean;
}) {
  const [done, setDone] = useState(false);
  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
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
    setDone(true);
    window.setTimeout(() => setDone(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          : "inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
      }
    >
      {done ? "コピーしました ✓" : label}
    </button>
  );
}

export function CitationKit({
  reportUrl,
  csvUrl,
  jsonUrl,
  stats,
  region = { name: "全国", isNational: true },
  imageUrl,
}: Props) {
  // 地域スコープに応じた見出し・出典名・調査名
  const surveyName = region.isNational
    ? `全国${stats.total}自治体 空き家解体補助金 調査`
    : `${region.name} 空き家解体補助金 調査`;
  const scopePrefix = region.isNational
    ? `全国${stats.nationalTotal}市区町村の約${stats.coveragePercent}%にあたる${stats.total}自治体`
    : `${region.name}の${stats.total}自治体`;
  const headline = region.isNational
    ? `調査した${stats.total}自治体のうち、解体補助金を確認できたのは`
    : `${region.name}で調査した${stats.total}自治体のうち、解体補助金を確認できたのは`;

  // 用途別の引用文（誠実な母数・定義つき）
  const citeInline =
    `${scopePrefix}を調査したところ、` +
    `空き家の解体補助金を確認できたのは${stats.withSubsidy}自治体（${stats.withSubsidyPercent}%）で、` +
    `上限額の中央値は${stats.medianMan}だった（${stats.credit}・${stats.asOf}）。`;
  const citeCaption = `出典：${surveyName}（${stats.credit}・${stats.asOf}）／ ${SITE_LABEL}`;
  const citeReference = `${SITE_LABEL}（2026）「${surveyName}データ」v${stats.version}. ${reportUrl}`;

  // 最高額の注記（県別では特例の有無が一概でないため簡潔に）
  const maxNote = region.isNational
    ? `（平均 約${stats.averageMan}／最高は${stats.topPref}${stats.topCity}・特例含む ${stats.maxMan}）`
    : `（平均 約${stats.averageMan}／県内最高 ${stats.maxMan}）`;

  // 自己完結の埋め込みカード（インラインスタイルのみ・外部CSS/JS不要・実 <a> リンク入り・ビジュアルバー付き）
  const embedHtml =
    `<div style="max-width:540px;margin:16px 0;padding:16px 18px;border:1px solid #e5e1d8;border-radius:14px;` +
    `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Hiragino Sans',Meiryo,sans-serif;line-height:1.7;color:#33312e;background:#fffdf8;">` +
    `<div style="font-size:12px;color:#9a8f7d;margin-bottom:6px;">${surveyName}（${stats.asOf}・${stats.credit}）</div>` +
    `<div style="font-size:16px;font-weight:700;">${headline}` +
    `<span style="color:#2f7d5b;">${stats.withSubsidy}自治体（${stats.withSubsidyPercent}%）</span>。</div>` +
    `<div style="margin:10px 0 6px;height:10px;border-radius:5px;background:#eee7da;overflow:hidden;">` +
    `<div style="width:${stats.withSubsidyPercent}%;height:100%;background:#2f7d5b;"></div></div>` +
    `<div style="font-size:13px;color:#5b574f;">上限額の中央値 <strong>${stats.medianMan}</strong>` +
    `${maxNote}。金額確認 ${stats.parsedN}自治体。</div>` +
    `<div style="font-size:12px;color:#9a8f7d;margin-top:10px;">出典：` +
    `<a href="${reportUrl}" target="_blank" rel="noopener" style="color:#2f7d5b;text-decoration:underline;">${surveyName}（${stats.credit}）</a>` +
    `｜${SITE_LABEL}</div>` +
    `</div>`;

  // 画像で引用する場合の埋め込みコード（img＋出典リンク）
  const imageEmbedHtml = imageUrl
    ? `<figure style="max-width:600px;margin:16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Hiragino Sans',Meiryo,sans-serif;">` +
      `<a href="${reportUrl}" target="_blank" rel="noopener">` +
      `<img src="${imageUrl}" alt="${surveyName}（${stats.asOf}・${stats.credit}）" style="width:100%;height:auto;border:1px solid #e5e1d8;border-radius:12px;" loading="lazy"></a>` +
      `<figcaption style="font-size:12px;color:#9a8f7d;margin-top:6px;">出典：` +
      `<a href="${reportUrl}" target="_blank" rel="noopener" style="color:#2f7d5b;">${surveyName}（${stats.credit}）</a>｜${SITE_LABEL}</figcaption>` +
      `</figure>`
    : "";

  return (
    <div className="space-y-6">
      {/* 1. 引用文（用途別） */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-1 text-base font-bold">① 記事で引用する（用途別にコピー）</h3>
        <p className="mb-4 text-sm text-foreground/70">
          出典を明記の上、記事・報道・研究・自治体資料などに自由にご利用いただけます（CC BY 4.0）。
        </p>

        <div className="space-y-4">
          <div>
            <div className="mb-1 text-xs font-semibold text-foreground/50">本文中の引用（要点つき）</div>
            <div className="rounded-lg bg-primary-light/15 p-3 text-xs leading-relaxed text-foreground/80">
              {citeInline}
            </div>
            <div className="mt-2">
              <CopyButton text={citeInline} label="本文用をコピー" />
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-foreground/50">図表のキャプション（短）</div>
            <div className="rounded-lg bg-primary-light/15 p-3 text-xs leading-relaxed text-foreground/80">
              {citeCaption}
            </div>
            <div className="mt-2">
              <CopyButton text={citeCaption} label="キャプション用をコピー" />
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-foreground/50">参考文献・出典一覧（バージョンつき）</div>
            <div className="rounded-lg bg-primary-light/15 p-3 text-xs leading-relaxed text-foreground/80">
              {citeReference}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <CopyButton text={citeReference} label="参考文献用をコピー" />
              <CopyButton text={reportUrl} label="このページのURLをコピー" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 埋め込みカード */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-1 text-base font-bold">② サイト・ブログに貼る（埋め込みカード）</h3>
        <p className="mb-3 text-sm text-foreground/70">
          下のHTMLをコピーして記事に貼ると、このカードがそのまま表示されます（画像・外部スクリプト不要）。出典リンクが自動で入ります。
        </p>

        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold text-foreground/50">プレビュー</div>
          <div
            className="overflow-hidden rounded-lg border border-dashed border-border p-1"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        </div>

        <div className="mb-1 text-xs font-semibold text-foreground/50">埋め込みコード（HTML）</div>
        <textarea
          readOnly
          value={embedHtml}
          onFocus={(e) => e.currentTarget.select()}
          rows={6}
          className="w-full resize-y rounded-lg border border-border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground/80"
        />
        <div className="mt-3">
          <CopyButton text={embedHtml} label="埋め込みコードをコピー" primary />
        </div>
      </div>

      {/* 2.5 画像で引用（インフォグラフィック）。imageUrl がある場合のみ表示。 */}
      {imageUrl && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-base font-bold">③ 画像で引用する（インフォグラフィック）</h3>
          <p className="mb-3 text-sm text-foreground/70">
            記事に"図版"として置けるインフォグラフィックです。画像クリックで出典ページに戻るリンク付き。下のHTMLを貼るか、画像を直接ダウンロードしてご利用ください（出典明記でCC BY 4.0）。
          </p>
          <div className="mb-3">
            <a href={imageUrl} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`${surveyName}（${stats.asOf}・${stats.credit}）`}
                className="w-full max-w-md rounded-lg border border-border"
                loading="lazy"
              />
            </a>
          </div>
          <div className="mb-1 text-xs font-semibold text-foreground/50">画像の埋め込みコード（HTML）</div>
          <textarea
            readOnly
            value={imageEmbedHtml}
            onFocus={(e) => e.currentTarget.select()}
            rows={4}
            className="w-full resize-y rounded-lg border border-border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground/80"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={imageEmbedHtml} label="画像の埋め込みコードをコピー" primary />
            <a
              href={imageUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
            >
              画像をダウンロード
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      )}

      {/* 4. オープンデータDL */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-1 text-base font-bold">{imageUrl ? "④" : "③"} データで使う（オープンデータDL）</h3>
        <p className="mb-3 text-sm text-foreground/70">
          全{stats.total}自治体の明細を機械可読データで配布しています（CC BY 4.0／全件に出典の公式URL付き）。表計算・分析・再配布にどうぞ。
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
