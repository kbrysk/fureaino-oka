// S3: 実データ入力テンプレート生成スクリプト 2026-03
// 使用方法: npx tsx scripts/generate-input-template.ts > input-template.md

const PRIORITY_CITIES: { prefecture: string; city: string; name: string; prefName: string }[] = [
  { prefecture: "mie", city: "tsu", name: "津市", prefName: "三重県" },
  { prefecture: "kagoshima", city: "kagoshima", name: "鹿児島市", prefName: "鹿児島県" },
  { prefecture: "toyama", city: "toyama", name: "富山市", prefName: "富山県" },
  { prefecture: "tokyo", city: "setagaya", name: "世田谷区", prefName: "東京都" },
  { prefecture: "tokyo", city: "hachioji", name: "八王子市", prefName: "東京都" },
  { prefecture: "aichi", city: "takahama", name: "高浜市", prefName: "愛知県" },
  { prefecture: "aichi", city: "nishio", name: "西尾市", prefName: "愛知県" },
  { prefecture: "osaka", city: "ikeda", name: "池田市", prefName: "大阪府" },
  { prefecture: "fukuoka", city: "kitakyushu", name: "北九州市", prefName: "福岡県" },
  { prefecture: "hiroshima", city: "hiroshima", name: "広島市", prefName: "広島県" },
  { prefecture: "kumamoto", city: "minamata", name: "水俣市", prefName: "熊本県" },
  { prefecture: "akita", city: "kazuno", name: "鹿角市", prefName: "秋田県" },
  { prefecture: "fukuoka", city: "nakagawa", name: "那珂川市", prefName: "福岡県" },
  { prefecture: "mie", city: "yokkaichi", name: "四日市市", prefName: "三重県" },
  { prefecture: "hyogo", city: "nishinomiya", name: "西宮市", prefName: "兵庫県" },
  { prefecture: "tokyo", city: "machida", name: "町田市", prefName: "東京都" },
  { prefecture: "shizuoka", city: "fujinomiya", name: "富士宮市", prefName: "静岡県" },
  { prefecture: "shiga", city: "kusatsu", name: "草津市", prefName: "滋賀県" },
];

function main() {
  const year = new Date().getFullYear();
  const reiwa = year - 2018;

  for (const { prefecture, city, name, prefName } of PRIORITY_CITIES) {
    const searchQuery = encodeURIComponent(`${name} 空き家 解体 補助金 令和${reiwa}年`);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

    console.log(`## ${name}（${prefecture}/${city}）補助金データ入力テンプレート`);
    console.log("");
    console.log("以下の情報を市役所サイトまたは電話で確認して入力してください：");
    console.log(`- Google検索: ${googleSearchUrl}`);
    console.log("");
    console.log("```json");
    console.log(`{
  "prefId": "${prefecture}",
  "cityId": "${city}",
  "prefName": "${prefName}",
  "cityName": "${name}",
  "mascot": {
    "localRiskText": "___（地域の特性に合わせたフクロウの一言。50文字以内）"
  },
  "subsidy": {
    "hasSubsidy": true,
    "name": "___（補助金の正式名称）",
    "maxAmount": "___（例：最大100万円）",
    "conditions": "___（対象条件）",
    "officialUrl": "___（申請要綱・窓口ページのURL）"
  },
  "garbage": {
    "officialUrl": "___（粗大ゴミ案内ページURL）",
    "phone": "___（収集担当の電話番号・任意）"
  }
}`);
    console.log("```");
    console.log("");
    console.log("---");
    console.log("");
  }
}

main();
