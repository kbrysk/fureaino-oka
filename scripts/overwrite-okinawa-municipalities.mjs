// overwrite-okinawa-municipalities.mjs
// 使い方: node scripts/overwrite-okinawa-municipalities.mjs
// 機能: 沖縄県の指定 cityId の subsidy のみ上書きする（他県・新規追加は行わない）

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_PATH = resolve(ROOT, "app/lib/data/municipalities.json");

const UPDATES = [
  {
    cityId: "kadena",
    subsidy: {
      hasSubsidy: true,
      name: "嘉手納町住宅除却支援補助金",
      maxAmount: "最大50万円",
      conditions: [
        "税制上の耐用年数（RC造47年・木造22年）を経過した住宅",
        "町課税台帳に登録されている住宅",
        "除却建物に所有権以外の権利が設定されていないこと",
        "原則として門・塀等を含めた敷地全体を更地にする工事",
        "町税を滞納していないこと",
        "店舗・事務所・共同住宅は対象外"
      ],
      applicationPeriod:
        "令和7年度（令和7年6月2日〜11月28日、先着順・予算終了次第締切）",
      windowName: "企画財政課 定住対策係",
      windowPhone: "098-956-1111",
      windowUrl: "https://www.town.kadena.okinawa.jp/life/kur8040.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "ginowan",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "宜野湾市役所",
      windowPhone: null,
      windowUrl: "https://www.city.ginowan.okinawa.jp",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "urasoe",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "都市計画部住宅課",
      windowPhone: "098-876-1234",
      windowUrl: "https://www.city.urasoe.lg.jp/",
      noSubsidyNote:
        "浦添市では空き家解体（除却）補助金制度は確認されていません。",
      notes: null
    }
  },
  {
    cityId: "nago",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "建設部建築住宅課建築相談係",
      windowPhone: "0980-53-1212",
      windowUrl: "https://www.city.nago.okinawa.jp/kurashi/2018102500029/",
      noSubsidyNote:
        "名護市では空き家解体（除却）補助金制度は確認されていません。空き家住宅改修支援事業（リフォーム補助・上限50万円）は実施中です。",
      notes: null
    }
  },
  {
    cityId: "tomigusuku",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "都市計画部都市計画課",
      windowPhone: "098-850-5332",
      windowUrl: "https://www.city.tomigusuku.lg.jp/",
      noSubsidyNote:
        "豊見城市では空き家解体（除却）補助金制度は確認されていません。住宅リフォーム支援事業（改修補助・上限20万円）は実施中です。",
      notes: null
    }
  },
  {
    cityId: "uruma",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "都市建設部住宅課",
      windowPhone: "098-898-1111",
      windowUrl: "https://www.city.uruma.lg.jp/",
      noSubsidyNote:
        "うるま市では空き家解体（除却）補助金制度は確認されていません。島しょ地域空き家改修補助金（改修のみ・上限50万円）は存在します。",
      notes: null
    }
  },
  {
    cityId: "miyakojima",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "建設部建築課",
      windowPhone: "0980-79-9671",
      windowUrl:
        "https://www.city.miyakojima.lg.jp/soshiki/shityo/kensetsu/kenchiku/",
      noSubsidyNote:
        "宮古島市では空き家解体（除却）補助金制度は確認されていません。緊急経済対策住宅ストック活用支援事業（リフォーム補助・工事費20%・上限40万円）は実施中です。",
      notes: null
    }
  },
  {
    cityId: "nanjo",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "まちづくり推進課",
      windowPhone: "098-917-5394",
      windowUrl: "https://www.city.nanjo.okinawa.jp/kurashi/sumai/",
      noSubsidyNote:
        "南城市では空き家解体（除却）補助金制度は確認されていません。",
      notes: null
    }
  },
  {
    cityId: "yomitan",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "土木建築課 施設整備係",
      windowPhone: "098-982-9217",
      windowUrl:
        "https://www.vill.yomitan.okinawa.jp/soshiki/dobokukenchiku/gyomu/sumai/",
      noSubsidyNote:
        "読谷村では空き家解体（除却）補助金制度は確認されていません。住宅リフォーム支援事業（改修補助）は実施中です。",
      notes: null
    }
  },
  {
    cityId: "nishihara",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "建設課",
      windowPhone: "098-945-5033",
      windowUrl: "https://www.town.nishihara.okinawa.jp/",
      noSubsidyNote:
        "西原町では空き家解体（除却）補助金制度は確認されていません。",
      notes: null
    }
  },
  {
    cityId: "yonabaru",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "まちづくり課",
      windowPhone: "098-945-7244",
      windowUrl: "https://www.town.yonabaru.okinawa.jp/soshiki/13/1505.html",
      noSubsidyNote:
        "与那原町では空き家解体（除却）補助金制度は確認されていません。住宅リフォーム支援事業（改修補助）は実施中です。",
      notes: null
    }
  },

  // ── 追記: 補助なし・離島（8件）────────────────────────
  {
    cityId: "haebaru",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "経済建設部 まちづくり振興課 計画・建築班",
      windowPhone: "098-889-4412",
      windowUrl: "https://www.town.haebaru.lg.jp/soshiki/14/",
      noSubsidyNote:
        "南風原町では空き家解体補助金制度はありません（住宅リフォーム支援事業のみ）。",
      notes: null
    }
  },
  {
    cityId: "tokashiki",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "渡嘉敷村役場",
      windowPhone: "098-987-2311",
      windowUrl: "https://www.vill.tokashiki.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  },
  {
    cityId: "zamami",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "座間味村役場",
      windowPhone: "098-987-2311",
      windowUrl: "https://www.vill.zamami.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  },
  {
    cityId: "tonaki",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "渡名喜村役場",
      windowPhone: "098-989-2021",
      windowUrl: "https://www.vill.tonaki.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  },
  {
    cityId: "minamidaito",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "南大東村役場",
      windowPhone: "09802-2-2241",
      windowUrl: "https://www.vill.minamidaito.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  },
  {
    cityId: "kitadaito",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "北大東村役場",
      windowPhone: "09802-3-2011",
      windowUrl: "https://www.vill.kitadaito.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  },
  {
    cityId: "iheya",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "伊平屋村役場",
      windowPhone: "0980-46-2001",
      windowUrl: "https://www.vill.iheya.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  },
  {
    cityId: "izena",
    subsidy: {
      hasSubsidy: null,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "伊是名村役場",
      windowPhone: "0980-45-2001",
      windowUrl: "https://www.vill.izena.okinawa.jp/",
      noSubsidyNote: null,
      notes: "※離島のため制度詳細は各村役場に直接お問い合わせください。"
    }
  }
];

function main() {
  console.log("📂 municipalities.json を読み込み中...");
  let data;
  try {
    data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  } catch (e) {
    console.error("❌ municipalities.json の読み込みに失敗しました:", e.message);
    process.exit(1);
  }

  const byCityId = new Map(UPDATES.map((u) => [u.cityId, u.subsidy]));

  let updated = 0;
  for (const item of data) {
    if (item.prefId !== "okinawa") continue;
    const subsidy = byCityId.get(item.cityId);
    if (subsidy === undefined) continue;
    item.subsidy = subsidy;
    updated++;
  }

  try {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
  } catch (e) {
    console.error("❌ ファイルの書き込みに失敗しました:", e.message);
    process.exit(1);
  }

  const okinawa = data.filter((x) => x.prefId === "okinawa");
  console.log("\n🎉 上書き完了！");
  console.log("─".repeat(50));
  console.log(`📊 沖縄県 更新: ${updated} 件`);
  console.log(
    `   補助金あり (true) : ${okinawa.filter((x) => x.subsidy?.hasSubsidy === true).length} 件`
  );
  console.log(
    `   補助金なし (false): ${okinawa.filter((x) => x.subsidy?.hasSubsidy === false).length} 件`
  );
  console.log(
    `   調査中   (null)  : ${okinawa.filter((x) => x.subsidy?.hasSubsidy === null).length} 件`
  );
  console.log("─".repeat(50));
  console.log("✅ JSON valid");
}

main();
