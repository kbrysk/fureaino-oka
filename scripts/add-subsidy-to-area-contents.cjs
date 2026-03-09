/**
 * data/area-contents 配下の全JSONに subsidyInfo を追加し、
 * localDisposalRules 末尾に解体補助金の見出し・解説を、
 * faqs に解体補助金FAQを1件追加する。
 * 実行: node scripts/add-subsidy-to-area-contents.cjs
 */
const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(process.cwd(), "data", "area-contents");

// 公式情報で確認した補助金データ（path: prefecture/city の形式）
const KNOWN_SUBSIDIES = {
  "hokkaido/sapporo": {
    name: "令和7年度札幌市危険空家等除却補助制度",
    maxAmount: "通常型は上限50万円、地域連携型は上限150万円（いずれも条件あり）",
    condition: "市が危険空家等と判定した空き家の除却が対象。個人の申請で、市税の滞納がなく、事前の確認手続きが必要。建設業許可業者に依頼すること。",
    contact: "札幌市都市局建築指導部建築安全推進課空き家対策担当",
  },
};

function getSubsidyInfo(prefId, cityId, cityName) {
  const key = `${prefId}/${cityId}`;
  if (KNOWN_SUBSIDIES[key]) return KNOWN_SUBSIDIES[key];
  return {
    name: "詳細確認中（自治体へ直接お問い合わせください）",
    maxAmount: "—",
    condition: "お住まいの市区町村の空き家対策窓口へお問い合わせください。条件や上限は自治体により異なります。",
    contact: "建築指導課・都市整備課・空き家対策担当など（窓口名は自治体により異なります）",
  };
}

function buildSubsidyParagraph(cityName, subsidy) {
  const hasAmount = subsidy.maxAmount && subsidy.maxAmount !== "—";
  if (hasAmount) {
    return `実家の片付けだけでなく、建物の解体まで検討されているなら、${cityName}の補助金制度（${subsidy.maxAmount}）を活用しない手はありません。空き家処分にかかる自己負担を減らせる可能性があります。解体費用が気になる方は、遺品整理と並行して、早めに窓口へ相談することをおすすめします。解体補助金の要件は自治体の案内でご確認ください。`;
  }
  return `実家の片付けだけでなく、建物の解体まで検討されているなら、${cityName}の補助金制度を活用しない手はありません。空き家処分にかかる自己負担を減らせる自治体制度があるかもしれません。解体費用の負担を軽くするため、早めに窓口へ相談することをおすすめします。解体補助金の有無や条件は市区町村により異なります。`;
}

function buildSubsidyFaq(cityName, subsidy) {
  const isUnknown = subsidy.name.startsWith("詳細確認中");
  if (isUnknown) {
    return {
      question: "解体補助金は誰でももらえますか？",
      answer: "主に昭和56年（1981年）以前の老朽化した建物や、危険と判断された空き家が対象となる自治体が多いです。条件や上限額は市区町村により異なりますので、お住まいの自治体の建築指導課・空き家対策窓口へお問い合わせください。",
    };
  }
  return {
    question: "解体補助金は誰でももらえますか？",
    answer: `${cityName}の場合は、市が「危険空家等」に該当すると判定した空き家の除却が対象です。個人が申請者で、市税の滞納がなく、事前の確認手続きが必要です。詳細は${subsidy.contact}へお問い合わせください。`,
  };
}

function processFile(filePath) {
  const relative = path.relative(CONTENT_DIR, filePath);
  const parts = relative.replace(/\.json$/, "").split(path.sep);
  const prefId = parts[0];
  const cityId = parts[1];
  if (!prefId || !cityId) return false;

  let data;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(raw);
  } catch (e) {
    console.error("Parse error:", filePath, e.message);
    return false;
  }

  const cityName = data.cityName || "お住まいの市区町村";
  const subsidy = getSubsidyInfo(prefId, cityId, cityName);

  data.subsidyInfo = subsidy;

  const heading = `### ${cityName}の解体補助金・空き家助成金について`;
  const paragraph = buildSubsidyParagraph(cityName, subsidy);
  if (!data.localDisposalRules) data.localDisposalRules = [];
  if (!data.localDisposalRules.some((s) => s.includes("解体補助金・空き家助成金について"))) {
    data.localDisposalRules.push(heading);
    data.localDisposalRules.push(paragraph);
  }

  if (!data.faqs) data.faqs = [];
  const subsidyFaq = buildSubsidyFaq(cityName, subsidy);
  if (!data.faqs.some((f) => f.question && f.question.includes("解体補助金"))) {
    data.faqs.push(subsidyFaq);
  }

  const out = JSON.stringify(data, null, 2);
  try {
    JSON.parse(out);
  } catch (e) {
    console.error("Output validation failed:", filePath, e.message);
    return false;
  }
  fs.writeFileSync(filePath, out + "\n", "utf-8");
  return true;
}

function walk(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, list);
    else if (e.isFile() && e.name.endsWith(".json")) list.push(full);
  }
  return list;
}

function main() {
  const files = walk(CONTENT_DIR);
  let ok = 0;
  for (const f of files) {
    if (processFile(f)) ok++;
  }
  console.log("Updated", ok, "/", files.length, "files");
}

main();
