/**
 * 全国市区町村「空き家解体補助金」独自統計モジュール（データの堀 / Data Moat）
 *
 * `municipalities.json`（全国 1,726 自治体の補助金・粗大ゴミ情報）を集計し、
 * pSEO ページの差別化・PR 素材・AI Overview 引用源となる独自統計を生成する。
 *
 * 設計方針:
 * - すべて同期関数。ビルド時（SSG / generateStaticParams）でそのまま使える。
 * - 入力は実データ（municipalities.json）のみ。数値の捏造は一切しない。
 * - 補助金額が数値抽出できない自治体（「詳細は窓口にお問い合わせください」等）は
 *   「金額統計」からは除外し、件数統計（hasSubsidy ベース）には含める。
 * - すべての統計に「2026年6月時点・ふれあいの丘調べ・出典=各自治体公式」の注記メタを付与。
 *
 * YMYL 注意: 算出値はあくまで「目安」。最新・正確な補助金額は各自治体公式で要確認。
 */

import storeData from "./municipalities.json";
import type { MunicipalityData } from "./municipalities";

const STORE: MunicipalityData[] = storeData as MunicipalityData[];

/** 統計の調査基準時点（表示・注記用）。データ更新時はここを更新する。 */
export const STATS_AS_OF = "2026年6月時点";
/** 調査主体クレジット。 */
export const STATS_CREDIT = "ふれあいの丘調べ";
/** 出典。 */
export const STATS_SOURCE = "各自治体公式サイト";

/**
 * 全国の市区町村総数（母数の明示・カバー率算出用）。
 * 出典: 総務省「統計でみる市区町村のすがた2025」/ 全国市区町村数 = 1,741
 * （市町村1,718 + 東京都特別区23）。データ更新時に追随する。
 * これを明示することで「全国の◯%」表現の母集団を誠実に示し、
 * 引用メディアのファクトチェックに耐える（＝被リンクの信頼性）。
 */
export const NATIONAL_MUNICIPALITY_TOTAL: number = 1741;
/** 全国総数の出典表記。 */
export const NATIONAL_TOTAL_SOURCE = "総務省「統計でみる市区町村のすがた2025」";

/**
 * 各統計に添付する共通メタ情報。
 * ページ側で「いつ・誰が・何を根拠に」を必ず明示できるようにする。
 */
export interface StatsMeta {
  /** 調査基準時点（例: "2026年6月時点"） */
  asOf: string;
  /** 調査主体（例: "ふれあいの丘調べ"） */
  credit: string;
  /** 出典（例: "各自治体公式サイト"） */
  source: string;
  /** 集計対象となった自治体の総数（= STORE.length） */
  totalMunicipalities: number;
  /** 補足注記（目安である旨など） */
  note: string;
}

const STATS_NOTE =
  "金額は各自治体公式の上限額（または定額）を機械抽出した目安です。費用割合上限・面積単価・世帯条件等により実際の交付額は変動します。最新・正確な情報は必ず各自治体公式でご確認ください。";

/** 全統計共通のメタを生成する。 */
function buildMeta(): StatsMeta {
  return {
    asOf: STATS_AS_OF,
    credit: STATS_CREDIT,
    source: STATS_SOURCE,
    totalMunicipalities: STORE.length,
    note: STATS_NOTE,
  };
}

/* ============================================================
 * 1. 金額パーサ
 * ============================================================ */

/**
 * `subsidy.maxAmount`（文字列または数値）から補助金上限額を「円」の整数で抽出する。
 *
 * 対応する表記例:
 * - "最大300万円"            → 3000000
 * - "最大50万円（費用の1/2以内）" → 500000
 * - "最大1,550万円（木造：31,000円/㎡）" → 15500000（カンマ・括弧内は無視）
 * - "最大20万7千円（工事費の23%以内）"   → 207000
 * - 500000（数値型でそのまま格納されているケース） → 500000
 * - "全額（…）" / "詳細は窓口にお問い合わせください" / "延床面積1㎡あたり27,000円" → null
 *
 * 注意:
 * - 「○○円/㎡」「27,000円を限度」などの面積単価・割合は総額として信頼できないため null を返す。
 * - 抽出不能（金額が読み取れない）の場合は必ず null を返す（捏造しない）。
 *
 * @param raw `subsidy.maxAmount`（string | number | undefined）
 * @returns 上限額（円）。抽出できない場合は null。
 */
export function parseMaxAmount(raw: string | number | undefined | null): number | null {
  if (raw == null) return null;

  // 数値型でそのまま格納されているケース（紀美野町=500000 等）
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : null;
  }

  let s = String(raw).trim();
  if (!s) return null;

  // 全角数字を半角へ正規化
  s = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

  // 「億」を含む高額表記（例: 1億2000万円）
  const okuMatch = s.match(/([0-9,]+)\s*億(?:\s*([0-9,]+)\s*万)?\s*円/);
  if (okuMatch) {
    const oku = parseInt(okuMatch[1].replace(/,/g, ""), 10);
    const man = okuMatch[2] ? parseInt(okuMatch[2].replace(/,/g, ""), 10) : 0;
    if (Number.isFinite(oku)) return oku * 100_000_000 + man * 10_000;
  }

  // 「○万○千円」（例: 20万7千円 → 207000）
  const manSenMatch = s.match(/([0-9,]+)\s*万\s*([0-9,]+)\s*千\s*円/);
  if (manSenMatch) {
    const man = parseInt(manSenMatch[1].replace(/,/g, ""), 10);
    const sen = parseInt(manSenMatch[2].replace(/,/g, ""), 10);
    if (Number.isFinite(man)) return man * 10_000 + sen * 1_000;
  }

  // 「○万円」（最初に出現する万円表記を上限額とみなす。例: 最大1,550万円 → 15500000）
  const manMatch = s.match(/([0-9,]+(?:\.[0-9]+)?)\s*万\s*円/);
  if (manMatch) {
    const v = parseFloat(manMatch[1].replace(/,/g, ""));
    if (Number.isFinite(v) && v > 0) return Math.round(v * 10_000);
  }

  // 純粋な数値文字列（例: "500000"）
  if (/^[0-9,]+$/.test(s)) {
    const v = parseInt(s.replace(/,/g, ""), 10);
    if (Number.isFinite(v) && v > 0) return v;
  }

  // 「○○円/㎡」「27,000円を限度」等の面積単価・割合表記は総額として信頼できない → null
  return null;
}

/** 円を「○○万円」表記の文字列に整形（端数は切り捨てず四捨五入万円）。 */
export function formatYenAsMan(yen: number): string {
  const man = Math.round(yen / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}

/* ============================================================
 * 2. 内部ユーティリティ（補助金の有無・金額付き一覧）
 * ============================================================ */

/** 補助金ありと判定された自治体のみを返す。 */
function subsidizedMunicipalities(): MunicipalityData[] {
  return STORE.filter((m) => m.subsidy?.hasSubsidy === true);
}

/** 金額付き（数値抽出に成功した）自治体エントリ。 */
export interface AmountEntry {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  /** 補助金制度名（あれば） */
  subsidyName?: string;
  /** 元の上限額表記（例: "最大300万円（費用の1/2以内）"） */
  rawMaxAmount: string;
  /** 抽出した上限額（円） */
  amountYen: number;
  /** 公式URL（あれば） */
  officialUrl?: string;
}

/** 金額抽出に成功した全自治体を金額降順で返す（内部用ベースリスト）。 */
function amountEntries(): AmountEntry[] {
  const entries: AmountEntry[] = [];
  for (const m of subsidizedMunicipalities()) {
    const amountYen = parseMaxAmount(m.subsidy?.maxAmount);
    if (amountYen == null) continue;
    entries.push({
      prefId: m.prefId,
      cityId: m.cityId,
      prefName: m.prefName,
      cityName: m.cityName,
      subsidyName: m.subsidy?.name,
      rawMaxAmount: String(m.subsidy?.maxAmount ?? ""),
      amountYen,
      officialUrl: m.subsidy?.officialUrl,
    });
  }
  return entries.sort((a, b) => b.amountYen - a.amountYen);
}

/* ============================================================
 * 3. 件数・割合サマリ
 * ============================================================ */

/** 補助金カバレッジの全国サマリ。 */
export interface CoverageSummary {
  /** 集計対象（調査済み）の自治体総数（= 全1,726） */
  total: number;
  /** 全国の市区町村総数（母数の明示用 = 1,741） */
  nationalTotal: number;
  /** 全国に対する調査カバー率（%・小数1桁。例: 99.1） */
  coveragePercent: number;
  /** 解体補助金を「確認できた」自治体数（hasSubsidy=true） */
  withSubsidy: number;
  /** 確認できなかった自治体数（＝不在の断定ではなく「確認できず」） */
  withoutSubsidy: number;
  /** 調査済み自治体のうち補助金を確認できた割合（%・小数1桁） */
  withSubsidyPercent: number;
  /** うち金額を数値抽出できた自治体数 */
  withParsedAmount: number;
  meta: StatsMeta;
}

/**
 * 解体補助金を「確認できた」自治体の総数・割合を集計する。
 * AI Overview / ページ冒頭の「主要数値」として最初に提示する基幹サマリ。
 *
 * 【誠実性の原則】hasSubsidy=false は「補助金が無い」の断定ではなく
 * 「公式情報で確認できなかった」を意味する。表現は必ず「確認できた」に統一し、
 * 不在の断定（◯%には無い）を避ける。母数は調査済み総数（=total）であり、
 * 全国1,741市区町村に対するカバー率（coveragePercent）も併記する。
 */
export function getCoverageSummary(): CoverageSummary {
  const total = STORE.length;
  const withSubsidy = subsidizedMunicipalities().length;
  const withParsedAmount = amountEntries().length;
  return {
    total,
    nationalTotal: NATIONAL_MUNICIPALITY_TOTAL,
    coveragePercent:
      NATIONAL_MUNICIPALITY_TOTAL === 0
        ? 0
        : Math.round((total / NATIONAL_MUNICIPALITY_TOTAL) * 1000) / 10,
    withSubsidy,
    withoutSubsidy: total - withSubsidy,
    withSubsidyPercent: total === 0 ? 0 : Math.round((withSubsidy / total) * 1000) / 10,
    withParsedAmount,
    meta: buildMeta(),
  };
}

/* ============================================================
 * 4. 金額ランキング（全国 / 都道府県別）
 * ============================================================ */

/** ランキング1行。 */
export interface RankingRow extends AmountEntry {
  /** 順位（1始まり。同額でも連番） */
  rank: number;
}

/** 補助金額ランキング結果（メタ付き）。 */
export interface AmountRanking {
  rows: RankingRow[];
  /** 母数（金額抽出に成功した自治体数） */
  poolSize: number;
  meta: StatsMeta;
}

/**
 * 補助金額（上限額）の全国ランキングを返す。
 * @param limit 取得件数（既定30 = TOP30）
 */
export function getNationalAmountRanking(limit = 30): AmountRanking {
  const all = amountEntries();
  const rows = all.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
  return { rows, poolSize: all.length, meta: buildMeta() };
}

/**
 * 指定都道府県「内」の市区町村を補助金額順に並べたランキングを返す。
 * （都道府県別の“平均額”ランキングは getPrefectureAmountRanking を参照）
 * @param prefId 都道府県スラッグ（例: "tokyo"）。大文字小文字は無視。
 * @param limit 取得件数（既定30）
 */
export function getCitiesAmountRankingInPrefecture(prefId: string, limit = 30): AmountRanking {
  const norm = prefId.toLowerCase().trim();
  const all = amountEntries().filter((e) => e.prefId.toLowerCase() === norm);
  const rows = all.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
  return { rows, poolSize: all.length, meta: buildMeta() };
}

/* ============================================================
 * 5. 都道府県別「補助金がある市区町村数」ランキング
 * ============================================================ */

/** 都道府県別の補助金充実度1行。 */
export interface PrefCoverageRow {
  prefId: string;
  prefName: string;
  /** その都道府県でデータがある自治体総数 */
  total: number;
  /** うち補助金ありの自治体数 */
  withSubsidy: number;
  /** 補助金ありの割合（%・小数1桁） */
  coveragePercent: number;
  /** 金額抽出できた自治体の平均上限額（円。抽出ゼロなら null） */
  averageAmountYen: number | null;
  /** 順位（withSubsidy 降順、同数は coveragePercent 降順、1始まり） */
  rank: number;
}

/** 都道府県別カバレッジランキング結果（メタ付き）。 */
export interface PrefCoverageRanking {
  rows: PrefCoverageRow[];
  meta: StatsMeta;
}

/**
 * 都道府県別に「補助金がある市区町村数」を集計しランキング化する。
 * 「補助金が充実している都道府県」を可視化する PR 素材・回遊導線に使う。
 */
export function getPrefectureCoverageRanking(): PrefCoverageRanking {
  type Acc = {
    prefId: string;
    prefName: string;
    total: number;
    withSubsidy: number;
    amounts: number[];
  };
  const map = new Map<string, Acc>();

  for (const m of STORE) {
    const key = m.prefId.toLowerCase();
    let acc = map.get(key);
    if (!acc) {
      acc = { prefId: m.prefId, prefName: m.prefName, total: 0, withSubsidy: 0, amounts: [] };
      map.set(key, acc);
    }
    acc.total += 1;
    if (m.subsidy?.hasSubsidy === true) {
      acc.withSubsidy += 1;
      const v = parseMaxAmount(m.subsidy?.maxAmount);
      if (v != null) acc.amounts.push(v);
    }
  }

  const rows: Omit<PrefCoverageRow, "rank">[] = Array.from(map.values()).map((a) => ({
    prefId: a.prefId,
    prefName: a.prefName,
    total: a.total,
    withSubsidy: a.withSubsidy,
    coveragePercent: a.total === 0 ? 0 : Math.round((a.withSubsidy / a.total) * 1000) / 10,
    averageAmountYen:
      a.amounts.length === 0
        ? null
        : Math.round(a.amounts.reduce((s, n) => s + n, 0) / a.amounts.length),
  }));

  rows.sort((x, y) => y.withSubsidy - x.withSubsidy || y.coveragePercent - x.coveragePercent);

  return {
    rows: rows.map((r, i) => ({ ...r, rank: i + 1 })),
    meta: buildMeta(),
  };
}

/* ============================================================
 * 6. 補助金額の分布
 * ============================================================ */

/** 金額分布の1区分。 */
export interface DistributionBucket {
  /** 区分ラベル（例: "100〜200万円"） */
  label: string;
  /** 区分の下限（円・以上） */
  minYen: number;
  /** 区分の上限（円・未満。最上位区分は Infinity） */
  maxYen: number;
  /** 該当自治体数 */
  count: number;
  /** 母数に対する割合（%・小数1桁） */
  percent: number;
}

/** 金額分布の集計結果（メタ付き）。 */
export interface AmountDistribution {
  buckets: DistributionBucket[];
  /** 母数（金額抽出できた自治体数） */
  total: number;
  meta: StatsMeta;
}

/**
 * 補助金額（上限額）の分布を集計する。
 * 区分: 〜30万 / 30-50万 / 50-100万 / 100-200万 / 200万超。
 */
export function getAmountDistribution(): AmountDistribution {
  const M = 10_000;
  const defs: Array<{ label: string; minYen: number; maxYen: number }> = [
    { label: "30万円未満", minYen: 0, maxYen: 30 * M },
    { label: "30〜50万円", minYen: 30 * M, maxYen: 50 * M },
    { label: "50〜100万円", minYen: 50 * M, maxYen: 100 * M },
    { label: "100〜200万円", minYen: 100 * M, maxYen: 200 * M },
    { label: "200万円超", minYen: 200 * M, maxYen: Number.POSITIVE_INFINITY },
  ];

  const values = amountEntries().map((e) => e.amountYen);
  const total = values.length;

  const buckets: DistributionBucket[] = defs.map((d) => {
    const count = values.filter((v) => v >= d.minYen && v < d.maxYen).length;
    return {
      label: d.label,
      minYen: d.minYen,
      maxYen: d.maxYen,
      count,
      percent: total === 0 ? 0 : Math.round((count / total) * 1000) / 10,
    };
  });

  return { buckets, total, meta: buildMeta() };
}

/* ============================================================
 * 7. 全国の平均・中央値・最高/最低
 * ============================================================ */

/** 金額の代表値サマリ。 */
export interface AmountStatsSummary {
  /** 母数（金額抽出できた自治体数） */
  count: number;
  /** 平均上限額（円） */
  averageYen: number | null;
  /** 中央値上限額（円） */
  medianYen: number | null;
  /** 最高額（円） */
  maxYen: number | null;
  /** 最低額（円） */
  minYen: number | null;
  /** 最高額の自治体 */
  topEntry: AmountEntry | null;
  meta: StatsMeta;
}

/**
 * 補助金上限額の全国平均・中央値・最高/最低を算出する。
 * ページ冒頭の「主要数値」（AI Overview 引用想定）に使う。
 */
export function getAmountStatsSummary(): AmountStatsSummary {
  const entries = amountEntries();
  const values = entries.map((e) => e.amountYen).sort((a, b) => a - b);
  const count = values.length;
  if (count === 0) {
    return {
      count: 0,
      averageYen: null,
      medianYen: null,
      maxYen: null,
      minYen: null,
      topEntry: null,
      meta: buildMeta(),
    };
  }
  const sum = values.reduce((s, n) => s + n, 0);
  const median =
    count % 2 === 1
      ? values[(count - 1) / 2]
      : Math.round((values[count / 2 - 1] + values[count / 2]) / 2);
  return {
    count,
    averageYen: Math.round(sum / count),
    medianYen: median,
    maxYen: values[count - 1],
    minYen: values[0],
    // entries は金額降順ソート済みなので先頭が最高額
    topEntry: entries[0] ?? null,
    meta: buildMeta(),
  };
}

/* ============================================================
 * 8. 補助金額が全国上位/下位の都道府県
 * ============================================================ */

/** 都道府県別の平均補助金額1行。 */
export interface PrefAmountRow {
  prefId: string;
  prefName: string;
  /** 金額抽出できた自治体数（=母数） */
  sampleSize: number;
  /** 平均上限額（円） */
  averageYen: number;
  /** 最高額（円） */
  maxYen: number;
  /** 順位（averageYen 降順、1始まり） */
  rank: number;
}

/** 都道府県別 平均補助金額ランキング結果。 */
export interface PrefAmountRanking {
  /** 平均額が高い順（全件） */
  rows: PrefAmountRow[];
  /** 上位（既定5件） */
  highest: PrefAmountRow[];
  /** 下位（既定5件・サンプル数が極端に少ない県を避けるため minSample 以上のみ） */
  lowest: PrefAmountRow[];
  meta: StatsMeta;
}

/**
 * 都道府県ごとの「平均補助金上限額」を算出し、上位/下位ランキングを返す。
 * 統計の信頼性のため、金額抽出できた自治体が minSample 未満の県は上位/下位の抽出対象から除外する
 * （rows には全件含める）。
 *
 * @param topN 上位/下位の件数（既定5）
 * @param minSample 上位/下位対象に含める最小サンプル数（既定3）
 */
export function getPrefectureAmountRanking(topN = 5, minSample = 3): PrefAmountRanking {
  type Acc = { prefId: string; prefName: string; amounts: number[] };
  const map = new Map<string, Acc>();

  for (const e of amountEntries()) {
    const key = e.prefId.toLowerCase();
    let acc = map.get(key);
    if (!acc) {
      acc = { prefId: e.prefId, prefName: e.prefName, amounts: [] };
      map.set(key, acc);
    }
    acc.amounts.push(e.amountYen);
  }

  const all: Omit<PrefAmountRow, "rank">[] = Array.from(map.values()).map((a) => ({
    prefId: a.prefId,
    prefName: a.prefName,
    sampleSize: a.amounts.length,
    averageYen: Math.round(a.amounts.reduce((s, n) => s + n, 0) / a.amounts.length),
    maxYen: Math.max(...a.amounts),
  }));

  all.sort((x, y) => y.averageYen - x.averageYen);
  const rows: PrefAmountRow[] = all.map((r, i) => ({ ...r, rank: i + 1 }));

  const eligible = rows.filter((r) => r.sampleSize >= minSample);
  const highest = eligible.slice(0, topN);
  const lowest = [...eligible].sort((a, b) => a.averageYen - b.averageYen).slice(0, topN);

  return { rows, highest, lowest, meta: buildMeta() };
}

/* ============================================================
 * 9. 個別ページ用「全国比較コンテキスト」
 * ============================================================ */

/** 個別の市区町村ページで表示する全国比較データ。 */
export interface NationalContext {
  prefName: string;
  cityName: string;
  /** この自治体に補助金があるか */
  hasSubsidy: boolean;
  /** この自治体の上限額（円。抽出できない/補助金なしは null） */
  cityAmountYen: number | null;
  /** この自治体の元の上限額表記 */
  cityRawAmount: string | null;
  /** 全国順位（金額抽出できた自治体内での順位。対象外は null） */
  nationalRank: number | null;
  /** 同順位母数（= 金額抽出できた自治体数） */
  nationalRankPool: number;
  /** 都道府県内順位（対象外は null） */
  prefectureRank: number | null;
  /** 都道府県内母数 */
  prefectureRankPool: number;
  /** 全国平均上限額（円） */
  nationalAverageYen: number | null;
  /** 全国で補助金がある自治体の割合（%） */
  nationalCoveragePercent: number;
  /** 補助金がある自治体の総数 */
  nationalWithSubsidy: number;
  /** 全国の自治体総数 */
  nationalTotal: number;
  meta: StatsMeta;
}

/**
 * 個別市区町村ページ（/area/[pref]/[city]/subsidy）で
 * 「この市の補助金は全国◯位／全国平均は△△万円／補助金がある自治体は全体の□%」
 * を表示するためのコンテキストを返す。
 *
 * これにより各 pSEO ページが固有データを持ち、「市名差し替えテスト」に合格する。
 *
 * @param prefId 都道府県スラッグ
 * @param cityId 市区町村スラッグ
 */
export function getNationalContextForCity(prefId: string, cityId: string): NationalContext {
  const normPref = prefId.toLowerCase().trim();
  const normCity = cityId.toLowerCase().trim();

  const target = STORE.find(
    (m) => m.prefId.toLowerCase() === normPref && m.cityId.toLowerCase() === normCity
  );

  const coverage = getCoverageSummary();
  const amountSummary = getAmountStatsSummary();

  const cityAmountYen = target ? parseMaxAmount(target.subsidy?.maxAmount) : null;
  const cityRawAmount =
    target?.subsidy?.maxAmount != null ? String(target.subsidy.maxAmount) : null;

  // 全国順位（金額抽出できたプール内での順位）
  const nationalPool = amountEntries();
  let nationalRank: number | null = null;
  if (cityAmountYen != null) {
    const idx = nationalPool.findIndex(
      (e) => e.prefId.toLowerCase() === normPref && e.cityId.toLowerCase() === normCity
    );
    nationalRank = idx >= 0 ? idx + 1 : null;
  }

  // 都道府県内順位
  const prefPool = nationalPool.filter((e) => e.prefId.toLowerCase() === normPref);
  let prefectureRank: number | null = null;
  if (cityAmountYen != null) {
    const idx = prefPool.findIndex((e) => e.cityId.toLowerCase() === normCity);
    prefectureRank = idx >= 0 ? idx + 1 : null;
  }

  return {
    prefName: target?.prefName ?? "",
    cityName: target?.cityName ?? "",
    hasSubsidy: target?.subsidy?.hasSubsidy === true,
    cityAmountYen,
    cityRawAmount,
    nationalRank,
    nationalRankPool: nationalPool.length,
    prefectureRank,
    prefectureRankPool: prefPool.length,
    nationalAverageYen: amountSummary.averageYen,
    nationalCoveragePercent: coverage.withSubsidyPercent,
    nationalWithSubsidy: coverage.withSubsidy,
    nationalTotal: coverage.total,
    meta: buildMeta(),
  };
}

/* ============================================================
 * 9.5 オープンデータ書き出し（被リンク獲得用・CC BY 4.0）
 * ============================================================ */

/** オープンデータ1行（全自治体・CSV/JSON 書き出し用）。 */
export interface OpenDataRow {
  prefId: string;
  prefName: string;
  cityId: string;
  cityName: string;
  /** 補助金あり=true */
  hasSubsidy: boolean;
  /** 制度名（あれば） */
  subsidyName: string;
  /** 元の上限額表記（例: "最大300万円（費用の1/2以内）"） */
  maxAmountRaw: string;
  /** 機械抽出した上限額（円。抽出できない/補助金なしは null） */
  maxAmountYen: number | null;
  /** 公式URL（あれば） */
  officialUrl: string;
}

/**
 * 全自治体（1,726件）を1行=1自治体のフラットな配列で返す。
 * オープンデータ（CSV/JSON）書き出しの基礎データ。捏造なし・実データのみ。
 */
export function getFullSubsidyRows(): OpenDataRow[] {
  return STORE.map((m) => ({
    prefId: m.prefId,
    prefName: m.prefName,
    cityId: m.cityId,
    cityName: m.cityName,
    hasSubsidy: m.subsidy?.hasSubsidy === true,
    subsidyName: m.subsidy?.name ?? "",
    maxAmountRaw: m.subsidy?.maxAmount != null ? String(m.subsidy.maxAmount) : "",
    maxAmountYen: parseMaxAmount(m.subsidy?.maxAmount),
    officialUrl: m.subsidy?.officialUrl ?? "",
  }));
}

/**
 * 引用・報道・研究用に配布するオープンデータ一式（JSON 書き出し用）。
 * 「メタ＋全国サマリ＋分布＋都道府県別＋TOP30＋全自治体明細」を1オブジェクトにまとめる。
 * ライセンスは CC BY 4.0（出典明記で自由利用可）。
 */
export function getOpenDataset() {
  const coverage = getCoverageSummary();
  const amountSummary = getAmountStatsSummary();
  return {
    meta: {
      title: "全国 空き家解体補助金 調査データ（1,726自治体）",
      asOf: STATS_AS_OF,
      credit: STATS_CREDIT,
      source: STATS_SOURCE,
      nationalTotal: coverage.nationalTotal,
      nationalTotalSource: NATIONAL_TOTAL_SOURCE,
      coveragePercent: coverage.coveragePercent,
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: STATS_NOTE,
      definitionNote:
        "withSubsidy は『公式情報で解体補助金を確認できた自治体数』。確認できなかった自治体は補助金の不在を意味しない。amount 統計は金額を一意に数値抽出できた自治体（withParsedAmount）のみが母数。",
    },
    summary: {
      totalMunicipalities: coverage.total,
      nationalMunicipalityTotal: coverage.nationalTotal,
      coveragePercent: coverage.coveragePercent,
      withSubsidyConfirmed: coverage.withSubsidy,
      withSubsidyConfirmedPercent: coverage.withSubsidyPercent,
      withParsedAmount: coverage.withParsedAmount,
      averageYen: amountSummary.averageYen,
      medianYen: amountSummary.medianYen,
      maxYen: amountSummary.maxYen,
      minYen: amountSummary.minYen,
    },
    distribution: getAmountDistribution().buckets,
    prefectureCoverage: getPrefectureCoverageRanking().rows,
    nationalRankingTop30: getNationalAmountRanking(30).rows.map((r) => ({
      rank: r.rank,
      prefName: r.prefName,
      cityName: r.cityName,
      amountYen: r.amountYen,
      subsidyName: r.subsidyName ?? "",
    })),
    rows: getFullSubsidyRows(),
  };
}

/* ============================================================
 * 9.7 都道府県別レポート（pSEO 47面・地方メディア引用面）
 * ============================================================ */

/** 都道府県スラッグ一覧（generateStaticParams / sitemap / ハブ用）。prefName昇順。 */
export function getAllPrefectureSlugs(): { prefId: string; prefName: string }[] {
  const seen = new Map<string, string>();
  for (const m of STORE) {
    if (!seen.has(m.prefId)) seen.set(m.prefId, m.prefName);
  }
  return Array.from(seen.entries())
    .map(([prefId, prefName]) => ({ prefId, prefName }))
    .sort((a, b) => a.prefName.localeCompare(b.prefName, "ja"));
}

/** 数値配列の中央値（円）。空なら null。 */
function medianOf(values: number[]): number | null {
  if (values.length === 0) return null;
  const v = [...values].sort((a, b) => a - b);
  const n = v.length;
  return n % 2 === 1 ? v[(n - 1) / 2] : Math.round((v[n / 2 - 1] + v[n / 2]) / 2);
}

/** 都道府県レポート1件分のデータ。 */
export interface PrefectureReport {
  prefId: string;
  prefName: string;
  /** 県内で調査した自治体数 */
  total: number;
  /** うち解体補助金を確認できた数 */
  withSubsidy: number;
  /** 確認できた割合（県内調査数に対する%） */
  withSubsidyPercent: number;
  /** 金額を数値化できた自治体数（金額統計の母数） */
  withParsedAmount: number;
  /** 県内の上限額：中央値/平均/最高/最低（円。母数0なら null） */
  medianYen: number | null;
  averageYen: number | null;
  maxYen: number | null;
  minYen: number | null;
  /** 県内の最高額自治体 */
  topEntry: AmountEntry | null;
  /** 県内の市区町村 金額ランキング（金額化できたもの） */
  cityRanking: RankingRow[];
  /** 全国比較コンテキスト */
  national: {
    withSubsidyPercent: number;
    medianYen: number | null;
    averageYen: number | null;
    coveragePercent: number;
    /** 県の平均額が全国の都道府県中 何位か（金額母数3以上の県内での順位。対象外は null） */
    prefAmountRank: number | null;
    prefAmountTotalRanked: number;
  };
  meta: StatsMeta;
}

/**
 * 指定都道府県の「空き家解体補助金」レポートデータを返す（pSEO 47面用）。
 * 各県の実統計（確認できた数・中央値・市区町村ランキング・全国比較）で裏付け、
 * テンプレだけの薄いページにしない。誠実性の原則（「確認できた」表現）を踏襲。
 */
export function getPrefectureReport(prefId: string): PrefectureReport | null {
  const norm = prefId.toLowerCase().trim();
  const inPref = STORE.filter((m) => m.prefId.toLowerCase() === norm);
  if (inPref.length === 0) return null;
  const prefName = inPref[0].prefName;

  const withSubsidyList = inPref.filter((m) => m.subsidy?.hasSubsidy === true);
  const ranking = getCitiesAmountRankingInPrefecture(prefId, 50);
  const amounts = ranking.rows.map((r) => r.amountYen);

  const coverage = getCoverageSummary();
  const amountSummary = getAmountStatsSummary();
  const prefAmountRanking = getPrefectureAmountRanking(5, 3);
  // 金額母数3以上の県のみで（平均額降順の）順位を付け直す。
  const rankedPrefs = prefAmountRanking.rows.filter((r) => r.sampleSize >= 3);
  const prefRankIdx = rankedPrefs.findIndex((r) => r.prefId.toLowerCase() === norm);

  return {
    prefId: inPref[0].prefId,
    prefName,
    total: inPref.length,
    withSubsidy: withSubsidyList.length,
    withSubsidyPercent:
      inPref.length === 0 ? 0 : Math.round((withSubsidyList.length / inPref.length) * 1000) / 10,
    withParsedAmount: amounts.length,
    medianYen: medianOf(amounts),
    averageYen: amounts.length === 0 ? null : Math.round(amounts.reduce((s, n) => s + n, 0) / amounts.length),
    maxYen: amounts.length === 0 ? null : Math.max(...amounts),
    minYen: amounts.length === 0 ? null : Math.min(...amounts),
    topEntry: ranking.rows[0] ?? null,
    cityRanking: ranking.rows,
    national: {
      withSubsidyPercent: coverage.withSubsidyPercent,
      medianYen: amountSummary.medianYen,
      averageYen: amountSummary.averageYen,
      coveragePercent: coverage.coveragePercent,
      prefAmountRank: prefRankIdx >= 0 ? prefRankIdx + 1 : null,
      prefAmountTotalRanked: rankedPrefs.length,
    },
    meta: buildMeta(),
  };
}

/* ============================================================
 * 10. ページ一括取得ヘルパー
 * ============================================================ */

/** データジャーナリズム型ページが必要とする統計一式。 */
export interface RankingPageData {
  coverage: CoverageSummary;
  amountSummary: AmountStatsSummary;
  nationalRanking: AmountRanking;
  prefCoverageRanking: PrefCoverageRanking;
  distribution: AmountDistribution;
  prefAmountRanking: PrefAmountRanking;
  meta: StatsMeta;
}

/**
 * /data/akiya-hojokin-ranking ページ用に、必要な統計をまとめて1回で取得する。
 * SSG（ビルド時）で1度だけ呼ばれる想定。
 */
export function getRankingPageData(): RankingPageData {
  return {
    coverage: getCoverageSummary(),
    amountSummary: getAmountStatsSummary(),
    nationalRanking: getNationalAmountRanking(30),
    prefCoverageRanking: getPrefectureCoverageRanking(),
    distribution: getAmountDistribution(),
    prefAmountRanking: getPrefectureAmountRanking(5, 3),
    meta: buildMeta(),
  };
}
