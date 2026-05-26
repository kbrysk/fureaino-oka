// _clusters.json -> content/pipeline/keyword-clusters.md（人間可読クラスタ表＋執筆推奨順）
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./read-kw-csv.mjs";

const OUT = path.join(ROOT, "content", "pipeline");
const d = JSON.parse(fs.readFileSync(path.join(OUT, "_clusters.json"), "utf8"));

// keywords.csv から keyword -> kw_id を取得（先頭2列のみ必要・簡易CSVパース）
const KWID = new Map();
{
  const csv = fs.readFileSync(path.join(OUT, "keywords.csv"), "utf8").split(/\r?\n/).slice(1);
  for (const line of csv) {
    if (!line) continue;
    // 先頭2フィールドを取得（kw_id, keyword いずれもカンマ・引用なし想定）
    const m = line.match(/^([^,]+),("(?:[^"]|"")*"|[^,]*),/);
    if (!m) continue;
    const id = m[1];
    const kw = m[2].replace(/^"|"$/g, "").replace(/""/g, '"');
    KWID.set(kw, id);
  }
}
const kwid = (head) => KWID.get(head) || "—";

const CV_LABEL = {
  lead_pdf: "無料PDF/メール登録(リード)",
  fudosan_satei: "不動産査定 A8",
  ihin_soukyaku: "遺品整理業者 送客",
  kaitori_soukyaku: "買取業者 送客",
  fuyohin_soukyaku: "不用品回収業者 送客",
  souzoku_soudan: "相続相談/専門家 送客",
};
const SUP_LABEL = { general: "総合監修(大久保→村上)", specialist: "専門家要(未確保)", none: "一般情報+専門家相談" };
// クラスタ→所属ピラー表示順
const ORDER = ["P1", "P2", "P3", "P4", "C5", "C6", "C7", "C8", "C9", "C10", "C11"];
const PILLAR_HEAD = {
  P1: "■ PILLAR 1 ── 実家じまい完全ロードマップ（進め方ハブ / F1・上流共感）",
  P2: "■ PILLAR 2 ── 費用・総額シミュレーター（横断ツールページ / F2・差別化の核）",
  P3: "■ PILLAR 3 ── 実家の売却 × 解体補助金（F3・高単価CV / YMYL）",
  P4: "■ PILLAR 4 ── 親への切り出し方・家族の感情（F1・最上流 / 競合が手薄）",
  C5: "■ HUB C5 ── 終活・エンディングノート（F1・リード獲得の主力）",
  C6: "■ HUB C6 ── 遺品整理・デジタル遺品（F2・送客）",
  C7: "■ HUB C7 ── 品目別 処分・供養・買取（F2・買取送客 / 独自性）",
  C8: "■ HUB C8 ── 不用品・粗大ごみ・ゴミ屋敷（F2・送客 / pSEO連携）",
  C9: "■ HUB C9 ── 相続・税・生前贈与・信託（F3・YMYL / 専門家確保まで保留）",
  C10: "■ HUB C10 ── 生前整理 総論（F1・サイトの主題ハブ）",
  C11: "■ HUB C11 ── 死後の手続き・諸手続きロードマップ（F3・高intent / チェックリストPDFでリード獲得）",
};
const arts = d.articles;
const byCluster = {};
for (const a of arts) (byCluster[a.cluster] ||= []).push(a);
for (const c in byCluster) byCluster[c].sort((x, y) => y.priority - x.priority);

const num = (n) => Number(n).toLocaleString();
let md = "";
md += "# キーワード・クラスタ台帳（生前整理支援センター ふれあいの丘）\n\n";
md += `生成: ${d.generatedAt} / ユニークKW ${num(d.totals.uniq)}件・editorial記事候補 ${d.totals.articles}本・pSEOハブ ${d.totals.pseoHubs}本\n\n`;
md += "> **読み方**: 1行=1記事(=1URL)。`主KW`=クラスタ代表(最大ボリューム)。`想定Vol合計`は束ねた副次KWの月間検索数の合算（※ラッコの表記ゆれ継承により過大、傾向把握用）。ランク S>A>B は優先度スコア（log10(Vol)×CV近接×勝てる見込み÷YMYL工数、立ち上げ期=専門家未確保クラスタを減点）のパーセンタイル。\n\n";
md += "**4層意図モデル**: F1=共感/進め方(リード) → F2=処分/買取(送客) → F3=不動産/相続(高単価CV) → F4=指名。\n\n";
md += "---\n\n";

// 凡例的なピラー俯瞰表
md += "## 0. ピラー/ハブ 俯瞰\n\n";
md += "| ID | ピラー/ハブ | phase | 記事候補数 | 主CV先 | 監修 |\n|---|---|---|---|---|---|\n";
for (const c of ORDER) {
  if (c === "P2") { md += `| P2 | 費用・総額シミュレーター | F2 | 1(ツール) | ${CV_LABEL.lead_pdf} | 総合監修 |\n`; continue; }
  const list = byCluster[c] || [];
  const meta = d.clusterMeta[c];
  md += `| ${c} | ${meta.name} | ${meta.phase} | ${list.length} | ${CV_LABEL[meta.cv]} | ${SUP_LABEL[meta.sup]} |\n`;
}
md += "\n---\n\n";

// 各ピラー詳細
for (const c of ORDER) {
  md += `## ${PILLAR_HEAD[c]}\n\n`;
  if (c === "P2") {
    md += "**横断ツールページ。専用シードKWは無く、各クラスタの「費用」意図を集約して総額シミュレーターへ内部リンクで権威集約する。**\n\n";
    md += "- 推奨記事タイトル案: 「実家じまい・生前整理の総額はいくら？品目別 費用シミュレーター【2026年版】」\n";
    md += "- 流入元(内部リンク)候補: P1-cost(実家じまい費用) / C6-cost(遺品整理費用) / P3-demolition(空き家解体費用) / C8-fuyohin_cost(不用品回収費用) / C7-butsudan(仏壇処分費用)\n";
    md += `- CV先: ${CV_LABEL.lead_pdf}＋各送客 / 監修: 総合監修 / 優先度ランク: **S**（差別化の核・全クラスタのCVハブ）\n\n`;
    md += "---\n\n";
    continue;
  }
  const list = byCluster[c] || [];
  md += "| ランク | 推奨記事タイトル案(intent) | 主KW(Vol) | 副次KW例 | 想定Vol合計 | 難/競 | CV先 | 監修 | kw_id |\n";
  md += "|---|---|---|---|---|---|---|---|---|\n";
  list.forEach((a, i) => {
    const subs = a.subs.slice(0, 4).join(" / ") || "—";
    md += `| **${a.rank}** | ${a.label} (\`${a.bucket}\`) | ${a.headKw}(${num(a.volMax)}) | ${subs} | ≒${num(a.volSum)} | ${a.diff}/${a.comp} | ${CV_LABEL[a.cv]} | ${SUP_LABEL[a.sup]} | ${kwid(a.headKw)} |\n`;
  });
  md += "\n";
}

// pSEO
md += "---\n\n## ★ pSEOハブ（地名×サービス：既存 /area/[都道府県]/[市区町村]/ で自動生成）\n\n";
md += "> 地名付きKWは手書き記事化せず既存pSEOで生成（scaled content abuse回避）。下表は **pSEOデータ拡充の優先根拠**。合計Volはラッコ表記ゆれ継承により過大、相対比較用。\n\n";
md += "| ルート状況 | pSEOハブ | route | 地名KW数 | 想定Vol合計 | CV先 | 監修 |\n|---|---|---|---|---|---|---|\n";
for (const p of d.pseo) {
  md += `| ${p.routeStatus} | ${p.title} | \`${p.route}\` | ${num(p.cities)} | ≒${num(p.volSum)} | ${CV_LABEL[p.cv]} | ${SUP_LABEL[p.sup]} |\n`;
}
md += "\n**示唆**: 既存ルート(subsidy/cleanup)に加え、`遺品整理×地名`(≒10万)・`品目別×地名`(≒8万)はpSEO新ルート化の最有力候補（流入分散・防御性＝エグジット価値に直結）。\n\n";

// 執筆推奨順 TOP30
md += "---\n\n## ✍ 執筆推奨順 TOP30（立ち上げ期キュー）\n\n";
md += "選定基準: 大久保監修で書ける(general) × 競合弱 × CV近い を上位化。専門家要(C9相続税/贈与/信託)は専門家確保まで下位に据え置き。\n\n";
md += "| # | ランク | クラスタ | 推奨記事 | 主KW(Vol) | 難/競 | CV先 | 監修 |\n|---|---|---|---|---|---|---|---|\n";
arts.slice(0, 30).forEach((a, i) => {
  md += `| ${i + 1} | ${a.rank} | ${a.cluster} | ${a.label} | ${a.headKw}(${num(a.volMax)}) | ${a.diff}/${a.comp} | ${CV_LABEL[a.cv]} | ${SUP_LABEL[a.sup]} |\n`;
});
md += "\n---\n\n## 次フェーズ（本スレッド対象外）\n\n";
md += "- `misc/総合ハブ`行は各クラスタの代表ハブ＋長尾KWプールを内包。第2フェーズで個別クラスタ記事へ分割可能（status=backlogのまま温存）。\n";
md += "- C9(相続税・生前贈与・家族信託)は専門家(税理士/司法書士)確保後にlaunch_gate解除→優先度再計算で上位昇格。\n";
md += "- pSEO拡充候補(遺品整理×地名・品目別×地名)のルート新設可否を本体開発と要相談。\n";

fs.writeFileSync(path.join(OUT, "keyword-clusters.md"), md, "utf8");
console.log("wrote keyword-clusters.md (", md.length, "chars )");
