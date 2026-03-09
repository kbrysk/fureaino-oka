/**
 * 176地域JSONの empatheticLead と marketPriceText を
 * 地域特性マトリクスに基づき個別最適化リライトするスクリプト。
 * facilities / faqs / localDisposalRules 等は一切変更しない。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "area-contents");

// 地域タイプ: slope=坂・階段・路地, snow=豪雪・極寒, estate=北関東・中部・内陸の大邸宅, urban=都市部・住宅密集地
function getRegionType(pref, city) {
  const key = `${pref}/${city}`;
  const slopeCities = [
    "nagasaki/nagasaki", "nagasaki/sasebo",
    "hiroshima/onomichi", "hiroshima/kure", "hiroshima/hiroshima", "hiroshima/edajima", "hiroshima/hatsukaichi", "hiroshima/mihara",
    "hyogo/kobe", "kanagawa/kamakura", "okayama/kurashiki", "shizuoka/numazu", "shizuoka/mishima"
  ];
  const snowPrefs = ["hokkaido", "niigata", "toyama", "fukui", "nagano", "miyagi"];
  const estatePrefs = ["tochigi", "gunma", "ibaraki", "gifu", "nara"];
  const estateCities = ["saitama/kawagoe", "saitama/kumagaya", "saitama/tokorozawa", "chiba/kashiwa", "chiba/sakura", "nagano/matsumoto", "nagano/nagano"];
  const urbanPrefs = ["tokyo", "osaka"];
  const urbanCities = ["kanagawa/yokohama", "kanagawa/kawasaki", "kanagawa/sagamihara", "aichi/nagoya", "fukuoka/fukuoka", "fukuoka/kitakyushu", "kyoto/kyoto", "chiba/chiba", "chiba/funabashi", "saitama/saitama", "saitama/kawaguchi", "hyogo/nishinomiya", "hyogo/amagasaki", "hokkaido/sapporo", "miyagi/sendai"];

  if (slopeCities.includes(key)) return "slope";
  if (snowPrefs.includes(pref) || estateCities.includes(key)) return snowPrefs.includes(pref) ? "snow" : "estate";
  if (estatePrefs.includes(pref) && !urbanCities.includes(key)) return "estate";
  if (urbanPrefs.includes(pref) || urbanCities.includes(key)) return "urban";
  if (estatePrefs.includes(pref)) return "estate";
  if (snowPrefs.includes(pref)) return "snow";
  return "urban"; // その他は都市扱いでフォールバック
}

function genSlopeLead(cityName, prefName, index) {
  const variants = [
    `坂と階段の多い${cityName}で、車が横付けできず数百段の階段を往復する絶望感を抱えていらっしゃいませんか。実家の片付けや空き家処分において、プロの搬出技術がないと家財一つ運び出せない物理的限界がある地域です。${cityName}では粗大ごみのルールが自治体で定められております。生前整理・遺品整理を進める前に、解体費用や公的支援の有無もあわせて、このページで流れをご確認いただければと存じます。`,
    `${cityName}は路地が狭く、車が横付けできず階段を何度も往復する搬出の大変さをよく承知しております。実家の片付けを一人で終わらせるのは難しいと感じていらっしゃる方へ。空き家処分や生前整理を業者に依頼する前に、粗大ゴミの出し方と遺品整理の相場を当ページで把握していただければ幸いです。解体費用の目安も市区町村の補助制度とあわせてご案内しております。`,
    `斜面と路地の${cityName}で、家財を一階に降ろすだけでも途方に暮れることはございませんか。実家の片付け・空き家処分において、プロでなければ搬出が困難な地域とされております。生前整理や遺品整理を検討される際は、${cityName}の粗大ごみルールとあわせ、解体費用を軽減する公的制度の有無もぜひご確認ください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName).replace(/\$\{prefName\}/g, prefName);
}

function genSlopeMarket(cityName, index) {
  const variants = [
    `${cityName}は坂や階段が多く、搬出に専門業者をお頼りになるご家庭が少なくありません。生前整理・遺品整理の費用相場は、部屋数や荷物量により異なりますが、2LDKで20～40万円程度が目安となることが多いです。実家の片付けや空き家処分を検討される際は、解体費用も含め、複数社の無料見積もりで比較されることをおすすめいたします。`,
    `路地や階段のため自力搬出が難しい${cityName}では、遺品整理・生前整理を業者に依頼するケースが多くございます。実家の片付けの費用は、荷物の量や建物の条件で変動します。2LDKでおおよそ20～40万円、空き家処分まで含めると解体費用との合わせ査定も可能です。ぜひ無料見積もりでお確かめください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName);
}

function genSnowLead(cityName, prefName, index) {
  const variants = [
    `豪雪・厳寒の${cityName}で、雪の重みで屋根が抜ける前の決断を迫られていらっしゃいませんか。冬が来るたびに募る、空き家倒壊への近隣トラブルの恐怖はよく承知しております。実家の片付けや生前整理、空き家処分をお考えの方は、遺品整理の流れとあわせ、粗大ゴミのルールや解体費用を軽減する公的制度を当ページでぜひご確認いただければと存じます。`,
    `雪に覆われる${cityName}では、空き家の放置が近隣への不安につながりかねません。実家の片付けを「いつか」と先延ばしにされている方へ。生前整理・遺品整理の第一歩として、${cityName}の粗大ごみ出し方と、空き家処分や解体費用の支援制度をこのページにまとめました。冬を迎える前に、公的支援の有無をご確認ください。`,
    `${cityName}は冬期の積雪で、空き家の維持にご不安を抱えていらっしゃる方も多いと存じます。実家の片付けや遺品整理を進めるにあたり、粗大ゴミのルールと併せ、空き家処分・解体費用を軽減する補助の有無を早めに窓口で確認されることをおすすめいたします。当ページで流れをご案内しております。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName).replace(/\$\{prefName\}/g, prefName);
}

function genSnowMarket(cityName, index) {
  const variants = [
    `${cityName}では積雪期の搬出が難しく、生前整理・遺品整理を業者に依頼される方が多くございます。実家の片付けの費用相場は、部屋数・荷物量により異なりますが、2LDKで20～40万円程度が目安となることが多いです。空き家処分や解体費用を検討される際は、複数社の無料見積もりで比較されることをおすすめいたします。`,
    `豪雪地帯の${cityName}では、冬場の作業を避けて春～秋に遺品整理・生前整理を依頼するケースが一般的です。実家の片付けの費用は2LDKで20～40万円程度が目安となることが多く、空き家処分まで含める場合は解体費用の見積もりもあわせてご検討ください。ぜひ無料見積もりでお確かめください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName);
}

function genEstateLead(cityName, prefName, index) {
  const variants = [
    `代々の農機具や巨大な蔵、桐箪笥の圧倒的な物量に、一人では一生終わらないと感じていらっしゃいませんか。${cityName}の実家の片付け・空き家処分は、生前整理や遺品整理の計画が欠かせません。粗大ゴミのルールとあわせ、解体費用を軽減する公的制度の有無を当ページでぜひご確認いただければと存じます。無理のないペースで、まずは一歩から。`,
    `広い敷地と蔵に眠る荷物の多さに、どこから手をつければよいかお悩みの${cityName}の方へ。実家の片付けは、生前整理・遺品整理の順序立てが大切です。空き家処分や解体費用の負担を減らす自治体の制度もございますので、粗大ごみの出し方とあわせ、このページで流れをご覧いただければ幸いです。`,
    `${cityName}のような広い邸宅では、実家の片付けに途方のなさを感じる方も少なくございません。遺品整理・生前整理を計画的に進めるため、まずは粗大ゴミのルールと、空き家処分や解体費用の公的支援の有無を当ページでご確認ください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName).replace(/\$\{prefName\}/g, prefName);
}

function genEstateMarket(cityName, index) {
  const variants = [
    `${cityName}では蔵や広い家が多く、生前整理・遺品整理を業者に依頼する場合、部屋数・荷物の量で費用が大きく変わります。実家の片付けの目安は2LDKで20～40万円程度となることが多く、空き家処分まで含めると解体費用の見積もりも必要です。複数社の無料見積もりで比較されることをおすすめいたします。`,
    `広い邸宅の多い${cityName}では、遺品整理・実家の片付けを専門業者に頼むケースが多くございます。生前整理の費用相場は、荷物量により20～40万円～となることが一般的です。空き家処分や解体費用もあわせ、ぜひ無料見積もりでお確かめください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName);
}

function genUrbanLead(cityName, prefName, index) {
  const variants = [
    `新幹線や帰省で限られた時間のなかで、実家の片付けを終わらせたいとお考えではありませんか。${cityName}は狭い前面道路や隣家との距離ゆえ、解体・搬出の難易度が高い地域もございます。生前整理や遺品整理、空き家処分の流れと、粗大ゴミのルール・解体費用の目安を当ページにまとめました。スピード感を持って、賢く整理を進めましょう。`,
    `${cityName}ではマンションの廊下が狭く、戸建ても路地が細いため、大きな家具の搬出にご苦労される方が多くいらっしゃいます。実家の片付け・遺品整理を短期間で進めたい方へ。空き家処分や解体費用の公的支援の有無とあわせ、粗大ごみの出し方をこのページでご確認いただければ幸いです。`,
    `帰省のたびに「いつか」と先延ばしになりがちな実家の片付け。${cityName}のような住宅密集地では、解体・搬出の手間が費用にも反映されます。生前整理・遺品整理の第一歩として、粗大ゴミのルールと、空き家処分・解体費用の制度を当ページでぜひご覧ください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName).replace(/\$\{prefName\}/g, prefName);
}

function genUrbanMarket(cityName, index) {
  const variants = [
    `${cityName}では狭い道路やマンションの経路により、生前整理・遺品整理の搬出費用が変動することがございます。実家の片付けの相場は、1K・2DKで20～40万円程度、3LDK以上で40万円～が目安となることが多いです。空き家処分や解体費用を検討される際は、複数社の無料見積もりで比較されることをおすすめいたします。`,
    `住宅が密集する${cityName}では、遺品整理・実家の片付けを業者に依頼する際、搬出経路で費用が変わります。生前整理の費用相場は2LDKで20～40万円程度が目安となることが多く、空き家処分まで含める場合は解体費用の見積もりもぜひお取りください。`,
  ];
  return variants[index % variants.length].replace(/\$\{cityName\}/g, cityName);
}

const prefNames = {
  aichi: "愛知県", chiba: "千葉県", ehime: "愛媛県", fukui: "福井県", fukuoka: "福岡県",
  gifu: "岐阜県", gunma: "群馬県", hiroshima: "広島県", hokkaido: "北海道", hyogo: "兵庫県",
  ibaraki: "茨城県", ishikawa: "石川県", kagawa: "香川県", kagoshima: "鹿児島県",
  kanagawa: "神奈川県", kochi: "高知県", kumamoto: "熊本県", kyoto: "京都府",
  miyagi: "宮城県", miyazaki: "宮崎県", nagano: "長野県", nagasaki: "長崎県",
  nara: "奈良県", niigata: "新潟県", oita: "大分県", okayama: "岡山県",
  okinawa: "沖縄県", osaka: "大阪府", saitama: "埼玉県", shizuoka: "静岡県",
  tochigi: "栃木県", tokushima: "徳島県", tokyo: "東京都", toyama: "富山県",
  wakayama: "和歌山県"
};

function main() {
  const files = [];
  const prefs = fs.readdirSync(DATA_DIR);
  for (const pref of prefs) {
    const prefPath = path.join(DATA_DIR, pref);
    if (!fs.statSync(prefPath).isDirectory()) continue;
    const cities = fs.readdirSync(prefPath).filter((f) => f.endsWith(".json"));
    for (const cityFile of cities) {
      const city = cityFile.replace(".json", "");
      files.push({ pref, city, filePath: path.join(prefPath, cityFile) });
    }
  }

  let done = 0;
  for (let i = 0; i < files.length; i++) {
    const { pref, city, filePath } = files[i];
    const raw = fs.readFileSync(filePath, "utf-8");
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse error:", filePath, e.message);
      continue;
    }

    const cityName = data.cityName || city;
    const prefName = prefNames[pref] || pref;
    const regionType = getRegionType(pref, city);

    let empatheticLead, marketPriceText;
    if (regionType === "slope") {
      empatheticLead = genSlopeLead(cityName, prefName, i);
      marketPriceText = genSlopeMarket(cityName, i);
    } else if (regionType === "snow") {
      empatheticLead = genSnowLead(cityName, prefName, i);
      marketPriceText = genSnowMarket(cityName, i);
    } else if (regionType === "estate") {
      empatheticLead = genEstateLead(cityName, prefName, i);
      marketPriceText = genEstateMarket(cityName, i);
    } else {
      empatheticLead = genUrbanLead(cityName, prefName, i);
      marketPriceText = genUrbanMarket(cityName, i);
    }

    data.empatheticLead = empatheticLead;
    data.marketPriceText = marketPriceText;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    done++;
  }
  console.log(`Done: ${done} files updated.`);
}

main();
