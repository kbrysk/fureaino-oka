#!/usr/bin/env node
/**
 * 地域データ管理CLI（無料AIをデータ抽出エンジンとして使うワークフロー用）
 *
 * 機能A: prompt - 無料AI用のMarkdownプロンプトを生成
 *   node scripts/manage-data.mjs prompt "北海道" "札幌市, 函館市, 旭川市"
 *
 * 機能B: merge - AIが出力したJSONを既存データにマージ
 *   node scripts/manage-data.mjs merge scripts/temp.json
 *
 * ワークフロー: プロンプト生成 → ブラウザのChatGPT/Claudeにコピペ → 出力JSONをtemp.jsonに保存 → merge
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_JSON = path.join(ROOT, "app", "lib", "data", "municipalities.json");

const MUNICIPALITY_DATA_INTERFACE = `export interface MunicipalityData {
  prefId: string;        // 例: "hokkaido"
  cityId: string;       // 例: "sapporo"
  prefName: string;     // 例: "北海道"
  cityName: string;     // 例: "札幌市"
  mascot: {
    localRiskText: string;  // 例: "積雪による倒壊リスクが高い地域だホー！…"
  };
  subsidy: {
    hasSubsidy: boolean;
    name?: string;      // 例: "札幌市危険空家等除却補助制度"
    maxAmount?: string; // 例: "最大300万円"
    conditions?: string;
    officialUrl?: string;  // 自治体公式案内URL
  };
  garbage: {
    officialUrl: string;   // 粗大ゴミ受付ページの公式URL（必須）
    phone?: string;
  };
}`;

function buildPrompt(prefecture, cityList) {
  const cities = cityList.split(",").map((s) => s.trim()).filter(Boolean);
  const cityBlock = cities.map((c) => `- ${c}`).join("\n");

  return `# 自治体データリサーチ依頼

あなたは優秀な自治体データリサーチャーです。以下の市区町村についてWeb検索（または知識）を行い、指定されたTypeScriptの \`MunicipalityData\` 型に**完全に合致する**JSON配列を作成してください。

## 対象

- **都道府県:** ${prefecture}
- **市区町村:**
${cityBlock}

## 型定義（厳守）

\`\`\`typescript
${MUNICIPALITY_DATA_INTERFACE}
\`\`\`

- \`prefId\` / \`cityId\` はローマ字のスラッグ（例: hokkaido, sapporo）で統一してください。
- \`prefName\` / \`cityName\` は正式名称（例: 北海道, 札幌市）です。

## 厳格なルール

1. **ハルシネーション（嘘の情報）を絶対に避けること。** 実在しない補助金を \`hasSubsidy: true\` にしないでください。
2. **各自治体の公式ページを検索し、実在する補助金のみを \`true\` とすること。** 不明な場合は \`hasSubsidy: false\` にしてください。
3. **URLは必ず自治体の公式サイトのURLとすること。** 粗大ゴミ受付ページ・補助金案内ページの公式URLを取得してください。
4. \`mascot.localRiskText\` は、その地域の特性（雪害・耐震・空き家リスク等）に合わせた「モグ隊長（フクロウ）のひとこと」として、1〜2文で作成してください。語尾は「だホー」「だホー！」で統一してください。

## 出力形式

- **マークダウンのコードブロックで、純粋なJSON配列のみを出力すること。**
- 説明文は不要です。\`\`\`json から \`\`\` までのJSON配列だけを出力してください。

\`\`\`json
[
  { "prefId": "...", "cityId": "...", ... },
  ...
]
\`\`\`
`;
}

function promptCmd(prefecture, cityList) {
  const md = buildPrompt(prefecture, cityList);
  const outPath = path.join(ROOT, "scripts", "generated-prompt.md");
  fs.writeFileSync(outPath, md, "utf-8");
  console.log("Generated: scripts/generated-prompt.md\n");
  console.log("--- Preview ---\n");
  console.log(md);
}

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  const tryParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };
  const direct = tryParse(raw);
  if (direct !== null) return direct;
  const stripped = raw.replace(/^[\s\S]*?```(?:json)?\s*/, "").replace(/\s*```[\s\S]*$/, "").trim();
  return JSON.parse(stripped);
}

function mergeCmd(tempPath) {
  const absoluteTemp = path.isAbsolute(tempPath) ? tempPath : path.join(ROOT, tempPath);
  if (!fs.existsSync(absoluteTemp)) {
    console.error("Error: File not found:", absoluteTemp);
    process.exit(1);
  }

  let incoming;
  try {
    incoming = loadJson(absoluteTemp);
  } catch (e) {
    console.error("Error: Invalid JSON in", absoluteTemp, e.message);
    process.exit(1);
  }

  const array = Array.isArray(incoming) ? incoming : incoming.data ?? incoming.municipalities ?? [];
  if (!Array.isArray(array) || array.length === 0) {
    console.error("Error: No array found in JSON (expected root array or { data: [...] })");
    process.exit(1);
  }

  let existing = [];
  if (fs.existsSync(DATA_JSON)) {
    try {
      existing = JSON.parse(fs.readFileSync(DATA_JSON, "utf-8"));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
  }

  const byKey = new Map();
  for (const item of existing) {
    const key = `${(item.prefId || "").toLowerCase()}|${(item.cityId || "").toLowerCase()}`;
    if (key !== "|") byKey.set(key, item);
  }
  for (const item of array) {
    const key = `${(item.prefId || "").toLowerCase()}|${(item.cityId || "").toLowerCase()}`;
    if (key !== "|") byKey.set(key, item);
  }

  const merged = Array.from(byKey.values());
  fs.writeFileSync(DATA_JSON, JSON.stringify(merged, null, 2), "utf-8");
  console.log("Merged", array.length, "item(s) into", DATA_JSON);
  console.log("Total entries:", merged.length);
}

function main() {
  const [,, cmd, ...rest] = process.argv;
  if (cmd === "prompt") {
    const [prefecture, cityList] = rest;
    if (!prefecture || !cityList) {
      console.error('Usage: node scripts/manage-data.mjs prompt "都道府県" "市区町村1, 市区町村2, ..."');
      process.exit(1);
    }
    promptCmd(prefecture, cityList);
    return;
  }
  if (cmd === "merge") {
    const [tempPath] = rest;
    if (!tempPath) {
      console.error("Usage: node scripts/manage-data.mjs merge <path-to-temp.json>");
      process.exit(1);
    }
    mergeCmd(tempPath);
    return;
  }
  console.error("Usage:");
  console.error('  node scripts/manage-data.mjs prompt "都道府県" "市区町村1, 市区町村2, ..."');
  console.error("  node scripts/manage-data.mjs merge scripts/temp.json");
  process.exit(1);
}

main();
