/**
 * municipalities.json 内の和歌山県エントリのうち、UPDATES に含まれる cityId の subsidy のみ上書きする。
 * 新規追加は行わない。和歌山県以外のデータは変更しない。
 * windowUrl → officialUrl に変換して格納する。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "app/lib/data/municipalities.json");

const UPDATES = [
  // koya（高野町）
  {
    cityId: "koya",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "観光振興課 移住定住地域振興室",
      windowPhone: "0736-56-2780",
      windowUrl: "https://www.town.koya.wakayama.jp/sangyo/chiikisinnkou/19765.html",
      noSubsidyNote:
        "高野町では空き家解体補助金制度はありません。移住定住補助・空き家改修補助があります（観光振興課 移住定住地域振興室 0736-56-2780）。",
    },
  },
  // susami（すさみ町）
  {
    cityId: "susami",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "地域未来課",
      windowPhone: "0739-55-4801",
      windowUrl: "https://www.town.susami.lg.jp/kurashi/09/2021093000041.html",
      noSubsidyNote:
        "すさみ町では空き家解体補助金制度はありません。空き家改修補助（上限50万円）・家財撤去補助（上限8万円）があります（地域未来課 0739-55-4801）。",
    },
  },
  // taiji（太地町）
  {
    cityId: "taiji",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "太地町役場 総務課",
      windowPhone: "0735-59-2335",
      windowUrl: "https://www.town.taiji.wakayama.jp/lifestage/sumai/sumai003.html",
      noSubsidyNote:
        "太地町では空き家解体補助金制度はありません。詳細は総務課（0735-59-2335）へお問い合わせください。",
    },
  },
  // kozagawa（古座川町）
  {
    cityId: "kozagawa",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "古座川町役場 地域振興課",
      windowPhone: "0735-72-0180",
      windowUrl: "https://www.town.kozagawa.lg.jp/",
      noSubsidyNote:
        "古座川町では空き家解体補助金制度はありません。詳細は地域振興課（0735-72-0180）へお問い合わせください。",
    },
  },
  // kitayama（北山村）
  {
    cityId: "kitayama",
    subsidy: {
      hasSubsidy: true,
      name: "北山村老朽空き家解体事業補助金",
      maxAmount:
        "最大100万円（費用の4/5以内）※不用空き家除却の場合は最大50万円（費用の1/2以内）",
      conditions: [
        "村内の一戸建て住宅（居住用部分が床面積の1/2以上）",
        "1年以上居住その他の使用がなされていない空き家",
        "建設業許可または和歌山県登録の解体工事業者が施工",
        "補助金交付決定前に除却工事に未着手であること",
        "村税等の滞納がないこと",
        "公共事業等の補償対象でないこと",
      ],
      applicationPeriod: "令和7年度（予算がなくなり次第終了）",
      windowName: "北山村役場 地域事業課",
      windowPhone: "0735-49-8020",
      windowUrl: "https://www.vill.kitayama.wakayama.jp/jumin/2018-0910-1125-15.html",
      noSubsidyNote: null,
    },
  },
  // kushimoto（串本町）
  {
    cityId: "kushimoto",
    subsidy: {
      hasSubsidy: true,
      name: "串本町不良空家等除却補助金",
      maxAmount: "最大50万円（費用の2/3以内）",
      conditions: [
        "串本町内の1年以上未使用の住宅（延べ面積の1/2以上が住宅用途）",
        "建物の不良度測定による評点合計が100点以上",
        "串本町内に事業所を有する建設業者・解体工事業者が施工",
        "補助金交付決定後に工事着手すること",
        "令和8年2月27日までに除却工事完了すること",
        "町税の滞納がないこと",
        "暴力団員等でないこと",
      ],
      applicationPeriod:
        "令和7年4月28日〜11月28日（認定申請受付）／募集15戸程度",
      windowName: "串本町役場 建設課 空き家対策担当",
      windowPhone: "0735-67-7262",
      windowUrl: "https://www.town.kushimoto.wakayama.jp/sangyo/kensetsu/akiya-tekkyo-hojyo.html",
      noSubsidyNote: null,
    },
  },
];

function buildSubsidy(s) {
  const conditionsVal =
    Array.isArray(s.conditions) && s.conditions.length ? s.conditions : undefined;
  const subsidy = {
    hasSubsidy: s.hasSubsidy === true ? true : s.hasSubsidy === false ? false : null,
    name: s.name ?? undefined,
    maxAmount: s.maxAmount ?? undefined,
    conditions: conditionsVal,
    officialUrl: s.windowUrl ?? undefined,
    applicationPeriod: s.applicationPeriod ?? undefined,
    windowName: s.windowName ?? undefined,
    windowPhone: s.windowPhone ?? undefined,
    noSubsidyNote: s.noSubsidyNote ?? undefined,
    notes: s.notes ?? undefined,
  };
  if (!subsidy.hasSubsidy && s.noSubsidyNote) subsidy.noSubsidyNote = s.noSubsidyNote;
  if (!subsidy.hasSubsidy && s.notes && !s.noSubsidyNote) subsidy.noSubsidyNote = s.notes;
  return subsidy;
}

const updatesByCityId = new Map(UPDATES.map((u) => [u.cityId, u]));

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

let overwritten = 0;
const result = data.map((m) => {
  if (m.prefId !== "wakayama") return m;
  const update = updatesByCityId.get(m.cityId);
  if (!update) return m;
  overwritten++;
  return {
    ...m,
    subsidy: buildSubsidy(update.subsidy),
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(`Overwritten ${overwritten} Wakayama entries. Written ${jsonPath}`);
