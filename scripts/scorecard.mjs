/**
 * 週次スコアカード自動集計（毎週金曜に実行）
 *
 * 使い方: node scripts/scorecard.mjs
 * 出力: docs/strategy/WEEKLY_SCORECARD.md に貼る1行分の実測値を表示
 *
 * 集計元:
 *  - GSCクリック: logs/gsc/daily.csv または gsc_daily_*.tsv（直近7日合計。要 npm run gsc:report）
 *  - B2B接触/商談: docs/b2b/B2B_SALES_LOG.csv
 *  - 被リンクアウトリーチ: content/pipeline/outreach.csv（sent/replied）
 *  - Indexing送信: logs/indexing-status.json（参考値）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => { try { return fs.readFileSync(path.join(ROOT, p), "utf8"); } catch { return null; } };
const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 86400 * 1000);
const iso = (d) => d.toISOString().slice(0, 10);

function parseCsvLine(line) {
  const out = []; let cur = ""; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else { if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c; }
  }
  out.push(cur); return out;
}

// ① GSCクリック（直近7日）
let gscClicks = "要gsc:report実行";
const gscFiles = ["logs/gsc/date.csv", "logs/gsc/gsc_daily_jun01.tsv"];
for (const f of gscFiles) {
  const raw = read(f);
  if (!raw) continue;
  const sep = f.endsWith(".tsv") ? "\t" : ",";
  const rows = raw.split("\n").slice(1).filter(Boolean).map((l) => l.split(sep));
  const recent = rows.filter((r) => r[0] >= iso(weekAgo));
  if (recent.length > 0) {
    gscClicks = recent.reduce((s, r) => s + (parseFloat(r[1]) || 0), 0) + `（${recent.length}日分）`;
    break;
  } else if (rows.length > 0) {
    gscClicks = `データが古い（最終 ${rows[rows.length - 1][0]}）→ npm run gsc:report を実行`;
  }
}

// ② B2B営業
let b2bContacts = 0, b2bMeetings = 0;
{
  const raw = read("docs/b2b/B2B_SALES_LOG.csv");
  if (raw) {
    const rows = raw.split("\n").slice(1).filter((l) => l.trim() && !l.startsWith(",")).map(parseCsvLine);
    b2bContacts = rows.length;
    b2bMeetings = rows.filter((r) => /商談|meeting|mtg/i.test(r[7] || "")).length;
  }
}

// ③ 被リンクアウトリーチ
let sent = 0, replied = 0;
{
  const raw = read("content/pipeline/outreach.csv");
  if (raw) {
    const lines = raw.split("\n").filter((l) => l.trim());
    const cols = parseCsvLine(lines[0]);
    const st = cols.indexOf("status");
    const rows = lines.slice(1).map(parseCsvLine);
    sent = rows.filter((r) => ["sent", "replied", "pr_submitted"].includes(r[st])).length;
    replied = rows.filter((r) => r[st] === "replied").length;
  }
}

// ④ Indexing累計（参考）
let indexed = "-";
{
  const raw = read("logs/indexing-status.json");
  if (raw) {
    const s = JSON.parse(raw);
    indexed = Object.values(s.urls).filter((v) => v.status === "SUCCESS").length;
  }
}

console.log("=== 週次スコアカード（" + iso(today) + "）===");
console.log("①GSCクリック/週:", gscClicks);
console.log("②B2B接触(累計):", b2bContacts, "/ 商談:", b2bMeetings);
console.log("③被リンクアウトリーチ送信済(累計):", sent, "/ 返信:", replied);
console.log("④Indexing API送信成功(累計・参考):", indexed);
console.log("\nWEEKLY_SCORECARD.md の行形式:");
console.log(`| ${iso(today)}週 | ${typeof gscClicks === "number" ? gscClicks : "?"} | ${b2bContacts} | ${b2bMeetings} | ? | ? | ${sent} | |`);
