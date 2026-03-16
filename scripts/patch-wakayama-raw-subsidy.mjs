/**
 * wakayama-raw.json の指定 cityId の subsidy を調査データで差し替える（1回限り実行用）。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawPath = path.join(__dirname, "wakayama-raw.json");

const survey = [
  { cityId: "kimino", subsidy: { hasSubsidy: true, name: "老朽危険空家除却工事補助金", maxAmount: 500000, conditions: ["1年以上居住の用に供されていない建物", "延べ面積の1/2以上が居住用", "不良度評点100点以上、または敷地境界から5m以内に他建築物がある等", "世帯員全員の市町村税滞納なし・暴力団員でないこと", "建設業許可またはリサイクル法登録業者による建物全体の除却", "交付決定後に着手・一敷地につき1回限り"], applicationPeriod: "予算の範囲内（なくなり次第終了）", windowName: "住民課", windowPhone: "073-489-5903", windowUrl: "https://www.town.kimino.wakayama.jp/sagasu/juminka/2207.html" } },
  { cityId: "katsuragi", subsidy: { hasSubsidy: true, name: "不良空家除却補助事業", maxAmount: 500000, conditions: ["事前に不良空家認定申請が必要", "おおむね1年以上空き家", "延べ面積の1/2以上が居住用", "個人所有（法人不可）", "所有権以外の権利設定なし（権利者の同意があれば可）", "同一敷地での過去受給なし", "建設業法許可業者による全体除却・交付決定後着手"], applicationPeriod: "年度ごと募集（令和7年度の受付期間は役場に要確認）", windowName: "建設課 工務係", windowPhone: "0736-22-0300", windowUrl: "https://www.town.katsuragi.wakayama.jp/010/040/2021061001.html" } },
  { cityId: "kudoyama", subsidy: { hasSubsidy: false, noSubsidyNote: "公式サイトに空き家解体専用の補助金は確認できない。空き家購入・定住促進補助金は存在するが解体補助は別制度。詳細は企画公室（0736-54-2019）に要確認。" } },
  { cityId: "koya", subsidy: { hasSubsidy: null, name: null, maxAmount: null, conditions: [], applicationPeriod: null, windowName: null, windowPhone: null, windowUrl: null } },
  { cityId: "yuasa", subsidy: { hasSubsidy: true, name: "老朽危険空家除却補助事業", maxAmount: 800000, conditions: ["おおむね年間を通じて居住実態なく、今後も居住見込みなし", "延べ面積の1/2以上が居住用", "特定空家判断基準による判定100点以上", "個人所有・所有権以外の権利設定なし（同意あれば可）", "同一敷地での過去受給なし", "町税滞納なし・暴力団員でないこと", "建設業許可・リサイクル法登録業者による全体除却", "交付決定後着手・建て替え目的の工事は対象外"], applicationPeriod: "予算の範囲内（なくなり次第終了）", windowName: "産業建設課 管理係（役場2階18番窓口）", windowPhone: "0737-64-1124", windowUrl: "https://www.town.yuasa.wakayama.jp/soshiki/9/3613.html" } },
  { cityId: "hirokawa", subsidy: { hasSubsidy: true, name: "広川町空き家解体処理費補助金", maxAmount: 500000, conditions: ["広川町内の解体撤去業者に依頼すること（町内業者限定）", "町内空き家の所有者（死亡の場合は法定相続人代表）", "個人所有物件（借地の場合は土地所有者の同意要）", "公共補償費対象外かつ重複補助なし", "おおむね5年以上居住していないことを区長または民生児童委員が証明", "町税・使用料等を滞納していないこと", "補助対象者1人につき1回限り"], applicationPeriod: "予算の範囲内（要事前相談・企画政策課へ直接来訪）", windowName: "企画政策課", windowPhone: "0737-23-7731", windowUrl: "https://www.town.hirogawa.wakayama.jp/soumu/akiyakaitai.html" } },
  { cityId: "aridagawa", subsidy: { hasSubsidy: true, name: "有田川町不良空家除却補助金", maxAmount: 500000, conditions: ["使用がなくなった日から概ね1年経過", "延べ面積の1/2以上が居住用", "不良空家判定基準による評点100点以上", "周辺建築物・公共施設に著しい悪影響あり、またはそのおそれあり", "個人所有", "町内に本店・事業所を有する建設業者または解体工事業者による工事", "補助金交付決定後90日以内に着手・令和8年2月28日までに完了", "募集予定戸数15戸程度（申請受付順）"], applicationPeriod: "令和7年5月7日〜令和7年12月19日（予算上限到達次第終了）", windowName: "建設課（吉備庁舎）または清水行政局建設環境室", windowPhone: "0737-22-3281", windowUrl: "https://www.town.aridagawa.lg.jp/top/kakuka/kibi/4/1/2/2/935.html" } },
  { cityId: "mihama", subsidy: { hasSubsidy: true, name: "古家解体支援事業", maxAmount: null, conditions: ["防災まちづくりみらい課への事前申請が必要", "年度内申請期限あり（令和6年度：2月2日まで）"], applicationPeriod: "年度ごとに設定（令和7年度の詳細は役場に要確認）", windowName: "防災まちづくりみらい課", windowPhone: "0738-22-4123", windowUrl: "http://www.town.mihama.wakayama.jp/docs/2015042700038/" } },
  { cityId: "hidaka", subsidy: { hasSubsidy: true, name: "空き家解体撤去費補助事業", maxAmount: 500000, conditions: ["個人所有物件（借地の場合は土地所有者の同意要）", "公的補償費対象外かつ重複補助なし", "アパート等の事業用でないこと", "主として生活していたと見なされる建物", "申請時おおむね1年以上居住していないこと", "申請時点で築40年以上経過していること", "町税・使用料等を滞納していないこと", "1人1回限り"], applicationPeriod: "要確認（役場に問い合わせ）", windowName: "日高町役場", windowPhone: "0738-22-9910", windowUrl: "http://www.town.wakayama-hidaka.lg.jp/docs/2022062100021/" } },
  { cityId: "yura", subsidy: { hasSubsidy: true, name: "空家等の解体に係る補助金", maxAmount: null, conditions: ["1年以上空き家", "老朽化し周辺に危険を及ぼす可能性がある空家"], applicationPeriod: "要確認（役場に問い合わせ）", windowName: "由良町役場", windowPhone: "0738-65-0001", windowUrl: "http://www.town.yura.wakayama.jp/" } },
  { cityId: "inami", subsidy: { hasSubsidy: true, name: "特定空家等除却補助金", maxAmount: 750000, conditions: ["延べ面積の1/2以上が居住用で1年以上空き家", "印南町から特定空家等の認定を受けた空家", "公共事業による補償契約締結なし", "工事費または国の標準除却費の少ない方 × 3/4", "ブロック塀等耐震対策補助事業との併用不可", "募集戸数10件（予算なくなり次第終了）"], applicationPeriod: "令和6年4月1日〜募集戸数到達次第終了（令和7年度は役場に要確認）", windowName: "企画産業課", windowPhone: "0738-42-1737", windowUrl: "https://www.town.wakayama-inami.lg.jp/" } },
  { cityId: "minabe", subsidy: { hasSubsidy: true, name: "不良空き家・その他空き家等の除去に係る補助金", maxAmount: 600000, conditions: ["1年以上居住がなくなった個人専用住宅", "延べ面積の1/2以上が居住用", "アパート等事業用でないこと", "公共補償費対象外かつ重複補助なし", "所有権以外の権利設定なし（同意あれば可）", "みなべ町内業者（建設業許可・解体工事業登録）による全体除却", "交付決定後着手"], applicationPeriod: "予算の範囲内（要確認）", windowName: "建設課", windowPhone: "0739-72-2015", windowUrl: "https://www.town.minabe.lg.jp/kurashi/04/03/2017041100017.html" } },
  { cityId: "hidakagawa", subsidy: { hasSubsidy: true, name: "日高川町空家解体事業補助金", maxAmount: 800000, conditions: ["1年以上使用されていない町内個人所有居住建物", "空家の認定（判定基準による認定調査）を受けた建物", "町内の入札参加資格者名簿登録業者で解体工事業許可を有する業者による工事", "公的補償費対象外かつ重複補助なし", "付属建物（風呂・トイレ・台所）は対象／倉庫・納屋・離れ・ブロック塀等は対象外", "所有者または法定相続人で町税・使用料等を滞納していないこと", "判定評点100点以上：補助率4/5（上限80万円）／100点未満：補助率2/5（上限40万円）"], applicationPeriod: "要確認（役場総務課へ問い合わせ）", windowName: "総務課", windowPhone: "0738-22-1700", windowUrl: "https://www.town.hidakagawa.lg.jp/bousai/bousai_shienseido/subsidy-of-a-vacant-house.html" } },
  { cityId: "kamitonda", subsidy: { hasSubsidy: true, name: "上富田町不良空家等除却補助金", maxAmount: null, conditions: ["1年以上居住・使用がなされていない建物", "延べ面積の1/2以上が居住用（またはそれ以外で隣地境界から2階建て以下3m以内等）", "町税完納・法人・団体は対象外", "事前に不良空家等認定申請が必要", "複数共有の場合は全共有者の同意が必要", "過去に同補助金を受給してから最初の3月31日を経過していない者は対象外", "補助額：実支出額または国標準単価×延床面積の少ない方"], applicationPeriod: "要確認（産業建設課へ問い合わせ）", windowName: "産業建設課", windowPhone: "0739-34-2374", windowUrl: "http://www.town.kamitonda.lg.jp/soshiki/sangyokensetsu/2969.html" } },
  { cityId: "susami", subsidy: { hasSubsidy: null, name: null, maxAmount: null, conditions: [], applicationPeriod: null, windowName: null, windowPhone: null, windowUrl: null } },
  { cityId: "taiji", subsidy: { hasSubsidy: null, name: null, maxAmount: null, conditions: [], applicationPeriod: null, windowName: null, windowPhone: null, windowUrl: null } },
  { cityId: "kozagawa", subsidy: { hasSubsidy: null, name: null, maxAmount: null, conditions: [], applicationPeriod: null, windowName: null, windowPhone: null, windowUrl: null } },
  { cityId: "kitayama", subsidy: { hasSubsidy: false, noSubsidyNote: "公式サイトに空き家改修事業補助金は存在するが、解体専用補助金は確認できない。詳細は政策推進室（0735-49-2331）に要確認。" } },
  { cityId: "kushimoto", subsidy: { hasSubsidy: true, name: "串本町不良空家等除却補助金", maxAmount: 500000, conditions: ["おおむね1年以上使用されていない建物", "延べ面積の1/2以上が住宅用", "不良度測定評点合計100点以上", "公共補償費対象外かつ重複補助なし", "故意な損壊でないこと", "所有権以外の権利設定なし（同意あれば可）", "串本町内に事業所を有する建設業者・解体工事業者による全体除却（門・塀は含まず）", "交付決定後着手・年度内完了", "町税滞納なし・暴力団員でないこと"], applicationPeriod: "年度ごとに設定（令和7年度の受付期間は役場に要確認）", windowName: "建設課 空き家対策担当", windowPhone: "0735-67-7262", windowUrl: "https://www.town.kushimoto.wakayama.jp/sangyo/kensetsu/akiya-tekkyo-hojyo.html" } },
];

const patchByCityId = new Map(survey.map((s) => [s.cityId, s.subsidy]));

function mergeSubsidy(existing, patch) {
  const base = { hasSubsidy: null, name: null, maxAmount: null, conditions: [], applicationPeriod: null, windowName: null, windowPhone: null, windowUrl: null, noSubsidyNote: null, notes: null };
  const merged = { ...base, ...patch };
  if (merged.notes === undefined && existing.notes != null) merged.notes = existing.notes;
  return merged;
}

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
for (const entry of raw) {
  const patch = patchByCityId.get(entry.cityId);
  if (!patch) continue;
  entry.subsidy = mergeSubsidy(entry.subsidy, patch);
}

fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2) + "\n", "utf8");
console.log("Patched wakayama-raw.json for", survey.length, "cityIds.");
