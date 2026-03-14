// S3: _isDefaultページ一括確認スクリプト 2026-03
// 使用方法: npx tsx scripts/check-default-pages.ts

import * as fs from "fs";
import * as path from "path";

const PRIORITY_CITIES = [
  { prefecture: "mie", city: "tsu", name: "津市" },
  { prefecture: "kagoshima", city: "kagoshima", name: "鹿児島市" },
  { prefecture: "toyama", city: "toyama", name: "富山市" },
  { prefecture: "tokyo", city: "setagaya", name: "世田谷区" },
  { prefecture: "tokyo", city: "hachioji", name: "八王子市" },
  { prefecture: "aichi", city: "takahama", name: "高浜市" },
  { prefecture: "aichi", city: "nishio", name: "西尾市" },
  { prefecture: "osaka", city: "ikeda", name: "池田市" },
  { prefecture: "fukuoka", city: "kitakyushu", name: "北九州市" },
  { prefecture: "hiroshima", city: "hiroshima", name: "広島市" },
  { prefecture: "kumamoto", city: "minamata", name: "水俣市" },
  { prefecture: "akita", city: "kazuno", name: "鹿角市" },
  { prefecture: "fukuoka", city: "nakagawa", name: "那珂川市" },
  { prefecture: "mie", city: "yokkaichi", name: "四日市市" },
  { prefecture: "hyogo", city: "nishinomiya", name: "西宮市" },
  { prefecture: "tokyo", city: "machida", name: "町田市" },
  { prefecture: "shizuoka", city: "fujinomiya", name: "富士宮市" },
  { prefecture: "shiga", city: "kusatsu", name: "草津市" },
];

interface MunicipalityRow {
  prefId: string;
  cityId: string;
  prefName?: string;
  cityName?: string;
  subsidy?: { hasSubsidy?: boolean; name?: string; maxAmount?: string };
}

function main() {
  const jsonPath = path.join(process.cwd(), "app", "lib", "data", "municipalities.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const store: MunicipalityRow[] = JSON.parse(raw);

  const hasData = (prefId: string, cityId: string) =>
    store.some(
      (m) => m.prefId.toLowerCase() === prefId.toLowerCase() && m.cityId.toLowerCase() === cityId.toLowerCase()
    );

  let withData = 0;
  let needInput = 0;

  console.log("========================================");
  console.log("優先18市区町村 データ入力状況");
  console.log("========================================");

  for (const { prefecture, city, name } of PRIORITY_CITIES) {
    const isDefault = !hasData(prefecture, city);
    if (isDefault) {
      needInput++;
      console.log(`❌ ${name}（${prefecture}/${city}）: _isDefault=true【要入力】`);
    } else {
      withData++;
      console.log(`✅ ${name}（${prefecture}/${city}）: 実データあり`);
    }
  }

  console.log("========================================");
  console.log(`実データあり: ${withData}/18市区町村`);
  console.log(`要入力: ${needInput}/18市区町村`);
  console.log("========================================");

  const totalInStore = store.length;
  const totalDefault = totalInStore ? "（municipalities.json 登録数: " + totalInStore + "件）" : "";
  console.log("");
  console.log("※ 上記は優先18市区町村のみ。全体の登録数は municipalities.json を参照。" + totalDefault);
}

main();
