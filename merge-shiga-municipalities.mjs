// merge-shiga-municipalities.mjs
// 使い方: node merge-shiga-municipalities.mjs
// 機能: 滋賀県の新規市区町村データを municipalities.json に安全に追加する
//       - 既存 cityId との重複はスキップ
//       - 既存データは一切変更・削除しない
//       - スキーマ変換: windowUrl→officialUrl, mascotデフォルト, garbage→officialUrl/phone

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, 'app/lib/data/municipalities.json');

const newShigaData = [
  {
    "prefId": "shiga",
    "cityId": "otsu",
    "cityName": "大津市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "住宅政策課",
      "windowPhone": "077-528-2679",
      "windowUrl": "https://www.city.otsu.lg.jp/soshiki/035/1810/",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。定住促進リフォーム補助金（市外転入者向け）は存在するが解体補助ではない。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "hikone",
    "cityName": "彦根市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "都市政策部住宅課",
      "windowPhone": "0749-30-6123",
      "windowUrl": "https://www.city.hikone.lg.jp/kakuka/toshi_seisaku/4/2/2/2981.html",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。空き家リノベーション補助金（改修のみ）は存在。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "nagahama",
    "cityName": "長浜市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": false,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "住宅課",
      "windowPhone": "0749-65-6533",
      "windowUrl": "https://www.city.nagahama.lg.jp/0000006656.html",
      "noSubsidyNote": "長浜市では現在、個人向け空き家解体を対象とした独自の補助金制度は設けられていません。自治会・市民活動団体向けの空き家活用地域活性化事業助成金（除却含む）はありますが個人申請は対象外です。詳細は住宅課（0749-65-6533）にお問い合わせください。",
      "notes": null
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "omihachiman",
    "cityName": "近江八幡市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "住宅施策推進室",
      "windowPhone": "0748-36-5787",
      "windowUrl": "https://www.city.omihachiman.lg.jp/soshiki/jyutakusesaku/akiyataisaku/20501.html",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "moriyama",
    "cityName": "守山市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "建設部住宅課",
      "windowPhone": "077-582-1124",
      "windowUrl": "https://www.city.moriyama.lg.jp/kurashitetsuzuki/juken/1001868/1001882.html",
      "noSubsidyNote": null,
      "notes": "※要確認：個人向け空き家解体補助金は確認できず。空き家活用推進補助金（公益施設への改修のみ、上限400万円）は存在。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "ritto",
    "cityName": "栗東市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "建設部建築課",
      "windowPhone": "077-551-0130",
      "windowUrl": "https://www.city.ritto.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。窓口へ直接お問い合わせください。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "koka",
    "cityName": "甲賀市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "甲賀市空き家住宅等除却事業補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "甲賀市内の空き家住宅等であること",
        "市税等の滞納がないこと",
        "募集期間内に申請すること（毎年度公募）"
      ],
      "applicationPeriod": "令和7年度（令和7年度受付は終了。次年度は公式サイトで確認）",
      "windowName": "住宅建築課 空家対策室",
      "windowPhone": "0748-69-2214",
      "windowUrl": "https://www.city.koka.lg.jp/13175.htm",
      "noSubsidyNote": null,
      "notes": "※要確認：令和7年度の補助率・上限額は公式サイトで募集要項確認のこと。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "yasu",
    "cityName": "野洲市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "建築住宅課",
      "windowPhone": "077-587-6322",
      "windowUrl": "https://www.city.yasu.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "konan",
    "cityName": "湖南市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "住宅課",
      "windowPhone": "0748-71-2349",
      "windowUrl": "https://www.city.konan.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：空家活用支援事業補助金（事業所等への改修のみ）は存在するが個人向け解体補助は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "takashima",
    "cityName": "高島市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "市民協働課",
      "windowPhone": "0740-25-8526",
      "windowUrl": "https://www.city.takashima.lg.jp/soshiki/shiminseikatsubu/shiminkyodoka/7/1/index.html",
      "noSubsidyNote": null,
      "notes": "※要確認：若者定住リフォーム補助や空き家活用モデル事業補助はあるが、個人向け解体補助は確認できず。空き家率高め（9.8%）のため窓口へ要確認。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "higashiomi",
    "cityName": "東近江市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "東近江市空家等解体費補助金",
      "maxAmount": "最大50万円（工事費の1/5以内）",
      "conditions": [
        "築40年を超えていること",
        "住居・倉庫等として使用されていないことが常態であること",
        "東近江市内の解体事業者が施工する工事であること",
        "敷地内の建築物・動産等をすべて解体・撤去し、原則更地にすること",
        "市税等の滞納がないこと"
      ],
      "applicationPeriod": "令和7年度（毎年7月頃の数日間のみ受付・予算超過時は抽選）",
      "windowName": "都市整備部住宅課 空家対策推進係",
      "windowPhone": "0748-24-5669",
      "windowUrl": "https://www.city.higashiomi.shiga.jp/kurashi_tetsuzuki/sumai/1003600/1003605.html",
      "noSubsidyNote": null,
      "notes": "申請は毎年7月頃の約2週間のみ受付。予算超過時は公開抽選。市内業者による施工が必須。令和7年度募集状況は公式サイトで確認を。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": "0748-24-5660",
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "maibara",
    "cityName": "米原市",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "経済環境部商工観光課",
      "windowPhone": "0749-58-2154",
      "windowUrl": "https://www.city.maibara.lg.jp/soshiki/keizai_kankyo/shoko_kanko/ijyu/20931.html",
      "noSubsidyNote": null,
      "notes": "※要確認：空き家リフォーム補助金（移住者向け上限100万円）はあるが解体補助は確認できず。県内最高の空き家率（12.2%）のため窓口へ要確認。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "hino",
    "cityName": "日野町",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "産業振興課",
      "windowPhone": "0748-52-6567",
      "windowUrl": "https://www.town.shiga-hino.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：住宅リフォーム等促進事業助成金（空き家居住開始時は費用の20%、上限20万円）はあるが解体補助は確認できず。空き家率が県内2位（12.0%）のため窓口へ要確認。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "ryuo",
    "cityName": "竜王町",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "まちづくり振興課",
      "windowPhone": "0748-58-3716",
      "windowUrl": "https://www.town.ryuoh.shiga.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：若者定住のための住まい補助金（リフォーム等）はあるが解体補助は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "aisho",
    "cityName": "愛荘町",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "産業建設課",
      "windowPhone": "0749-29-9046",
      "windowUrl": "https://www.town.aisho.shiga.jp/soshiki/shokokanko/2/3/4935.html",
      "noSubsidyNote": null,
      "notes": "※要確認：愛荘町空家等利活用推進補助金（改修工事のみ）はあるが、解体補助は確認できず。空き家率が高め（9.8%）のため窓口へ要確認。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "toyosato",
    "cityName": "豊郷町",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "豊郷町役場 建設課",
      "windowPhone": "0749-35-8112",
      "windowUrl": "https://www.town.toyosato.shiga.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "kora",
    "cityName": "甲良町",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "甲良町役場 建設課",
      "windowPhone": "0749-38-5061",
      "windowUrl": "https://www.town.kora.shiga.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：公式サイトで空き家解体補助金の独自制度は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  },
  {
    "prefId": "shiga",
    "cityId": "taga",
    "cityName": "多賀町",
    "prefName": "滋賀県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "建設農林課",
      "windowPhone": "0749-48-8122",
      "windowUrl": "https://www.town.taga.shiga.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認：住宅リフォーム促進事業補助金（施工費10%、上限20万円）はあるが解体補助は確認できず。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": null,
      "applicationPhone": null,
      "notes": null
    }
  }
];

/** 既存スキーマに合わせて変換（officialUrl, mascot, garbage） */
function transform(entry) {
  const { prefId, cityId, cityName, prefName, subsidy: s, garbage: g } = entry;
  const mascot =
    entry.mascot && entry.mascot.localRiskText
      ? { localRiskText: entry.mascot.localRiskText }
      : { localRiskText: `${cityName}の補助金・粗大ゴミの詳細は自治体の案内で確認してみてね。` };

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

  const officialUrl =
    (g && g.applicationUrl) ||
    s.windowUrl ||
    `https://www.google.com/search?q=${encodeURIComponent(cityName + " 粗大ゴミ")}`;
  const garbage = {
    officialUrl,
    phone: (g && g.applicationPhone) || s.windowPhone || undefined,
  };
  if (garbage.phone === null) delete garbage.phone;

  return { prefId, cityId, cityName, prefName, mascot, subsidy, garbage };
}

function main() {
  console.log('📂 municipalities.json を読み込み中...');

  let existing;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    existing = JSON.parse(raw);
  } catch (e) {
    console.error('❌ ファイルの読み込みに失敗しました:', e.message);
    process.exit(1);
  }

  const existingShigaIds = new Set(
    existing
      .filter(item => item.prefId === 'shiga')
      .map(item => item.cityId)
  );

  console.log(`\n📋 既存の滋賀県データ: ${existingShigaIds.size} 件`);
  console.log('  既存 cityId:', [...existingShigaIds].join(', '));

  const toAdd = [];
  const skipped = [];

  for (const item of newShigaData) {
    if (existingShigaIds.has(item.cityId)) {
      skipped.push(item.cityId);
    } else {
      toAdd.push(transform(item));
    }
  }

  console.log(`\n✅ 追加対象: ${toAdd.length} 件`);
  toAdd.forEach(item => console.log(`  + ${item.cityName}（${item.cityId}）`));

  if (skipped.length > 0) {
    console.log(`\n⏭️  スキップ（既存）: ${skipped.length} 件`);
    skipped.forEach(id => console.log(`  - ${id}`));
  }

  if (toAdd.length === 0) {
    console.log('\n⚠️  追加するデータがありません。処理を終了します。');
    process.exit(0);
  }

  const merged = [...existing, ...toAdd];

  try {
    writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
  } catch (e) {
    console.error('❌ ファイルの書き込みに失敗しました:', e.message);
    process.exit(1);
  }

  let verified;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    verified = JSON.parse(raw);
  } catch (e) {
    console.error('❌ 書き込み後のJSON検証に失敗しました:', e.message);
    process.exit(1);
  }

  const shigaAfter = verified.filter(x => x.prefId === 'shiga');
  console.log('\n🎉 マージ完了！');
  console.log('─'.repeat(40));
  console.log(`📊 滋賀県 合計: ${shigaAfter.length} 件`);
  console.log(`   補助金あり (true) : ${shigaAfter.filter(x => x.subsidy.hasSubsidy === true).length} 件`);
  console.log(`   補助金なし (false): ${shigaAfter.filter(x => x.subsidy.hasSubsidy === false).length} 件`);
  console.log(`   調査中   (null)  : ${shigaAfter.filter(x => x.subsidy.hasSubsidy === null).length} 件`);
  console.log(`📁 全体件数: ${existing.length} → ${verified.length} 件`);
  console.log('─'.repeat(40));
  console.log('✅ JSON valid');
}

main();
