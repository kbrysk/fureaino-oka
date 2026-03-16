// merge-yamaguchi-municipalities.mjs
// 使い方: node merge-yamaguchi-municipalities.mjs
// 機能: 山口県の新規市区町村データを municipalities.json に安全に追加する
//       - 既存 cityId との重複はスキップ
//       - 既存データは一切変更・削除しない
//       - スキーマ変換: windowUrl→officialUrl, mascotデフォルト, garbage→officialUrl/phone

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, 'app/lib/data/municipalities.json');

const newYamaguchiData = [
  {
    "prefId": "yamaguchi",
    "cityId": "shimonoseki",
    "cityName": "下関市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "下関市危険家屋除却推進事業補助金",
      "maxAmount": "最大40万円（重点対象地区は60万円）（費用の1/2以内）",
      "conditions": [
        "年間を通して使用実績のない常時無人の一戸建て住宅",
        "不良度判定評点が100点以上であること",
        "木造または鉄骨造であること",
        "下関市税の滞納がないこと",
        "市内の解体業者に依頼すること"
      ],
      "applicationPeriod": "令和7年5月1日〜5月16日（令和7年度募集終了）",
      "windowName": "建設部 住宅政策課",
      "windowPhone": "083-231-1941",
      "windowUrl": "https://www.city.shimonoseki.lg.jp/soshiki/70/2600.html",
      "noSubsidyNote": null,
      "notes": "重点対象地区（中心市街地斜面地周辺地区）は上限60万円。自治会長が除却する場合は上限80万円（費用の2/3）。20件程度・抽選あり。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.shimonoseki.lg.jp/soshiki/33/",
      "applicationPhone": "083-231-1840",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "ube",
    "cityName": "宇部市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "宇部市空家等跡地活用促進事業補助金",
      "maxAmount": "最大100万円（地域活性化事業・費用の2/3以内）または最大50万円（住宅新築事業・費用の2/3以内）",
      "conditions": [
        "居住誘導区域内にある管理不全な一戸建て空き家であること",
        "年間を通じて使用実績のない建築物（居住用部分2分の1以上）",
        "不良度測定評点が100点以上であること",
        "解体後に跡地を活用すること（新築住宅建設または5年以上の地域活性化利用）",
        "市内業者による解体工事であること"
      ],
      "applicationPeriod": "令和7年度（予算がなくなり次第終了）",
      "windowName": "都市整備部 建築指導課",
      "windowPhone": "0836-34-8341",
      "windowUrl": "https://www.city.ube.yamaguchi.jp/kurashi/sumai/sumai/1002190/1002191.html",
      "noSubsidyNote": null,
      "notes": "解体のみ行い跡地活用されない場合は対象外。居住誘導区域内の物件のみ対象。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.ube.yamaguchi.jp/kurashi/gomi/",
      "applicationPhone": "0836-34-8237",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "yamaguchi",
    "cityName": "山口市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "山口市老朽危険空家等除却促進事業補助金",
      "maxAmount": "最大50万円（費用の1/3以内）",
      "conditions": [
        "木造または軽量鉄骨造の空家で延べ面積1/2以上が居住用",
        "不良度・危険度の評点合計が100点以上かつ周囲への影響度100点以上",
        "概ね1年間使用されていないことが常態",
        "山口市税の滞納がないこと",
        "補助金交付決定前に着手していないこと"
      ],
      "applicationPeriod": "令和7年5月7日〜5月30日（予算の範囲内・評点高いものから選定）",
      "windowName": "地域生活部 生活安全課 空家対策室",
      "windowPhone": "083-934-2915",
      "windowUrl": "https://www.city.yamaguchi.lg.jp/soshiki/27/136012.html",
      "noSubsidyNote": null,
      "notes": "評点の合計が高い順に選定。申請前に事前連絡が必要。令和7年度の募集期間後も申請できる場合あり（要問合せ）。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.yamaguchi.lg.jp/life/sub/6/",
      "applicationPhone": "083-934-2911",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "hagi",
    "cityName": "萩市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "萩市老朽危険空き家除却促進事業補助金",
      "maxAmount": "最大100万円（費用の8/10×2/3以内）",
      "conditions": [
        "不良度判定評点が100点以上で周囲への危険性があること",
        "1年以上使用されておらず今後も使用見込みがない",
        "申請者世帯の総所得金額が500万円未満であること",
        "世帯全員が萩市の市税を滞納していないこと",
        "木造または軽量鉄骨造・個人所有であること",
        "市内に事業所がある解体業者に依頼すること"
      ],
      "applicationPeriod": "令和7年4月1日〜令和7年12月12日（10件程度・先着順）",
      "windowName": "建築課 住宅管理係",
      "windowPhone": "0838-25-2314",
      "windowUrl": "https://www.city.hagi.lg.jp/soshiki/54/h63895.html",
      "noSubsidyNote": null,
      "notes": "事前審査が必要。除却費×8/10×2/3（標準除却費との低い方）。上限100万円。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.hagi.lg.jp/life/2/5/",
      "applicationPhone": "0838-25-3131",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "hofu",
    "cityName": "防府市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "防府市危険空き家等解体費補助金",
      "maxAmount": "最大50万円（危険空き家）／最大25万円（老朽空き家）（費用の1/2以内）",
      "conditions": [
        "市が行う判定で危険空き家等と認定されること",
        "1年以上使用実績がない一戸建てまたは長屋建て住宅",
        "市内の解体業者が実施する工事であること",
        "防府市税の滞納がないこと",
        "補助金交付決定前に着手していないこと"
      ],
      "applicationPeriod": "令和7年4月23日〜（令和7年度受付終了）",
      "windowName": "都市計画課 空き家対策室",
      "windowPhone": "0835-25-2238",
      "windowUrl": "https://www.city.hofu.yamaguchi.jp/site/akiya/hojokin-kaitai.html",
      "noSubsidyNote": null,
      "notes": "交付申請前に危険空き家等判定申請が必要。危険空き家：上限50万円、老朽空き家：上限25万円。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.hofu.yamaguchi.jp/soshiki/26/",
      "applicationPhone": "0835-25-2238",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "kudamatsu",
    "cityName": "下松市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "下松市危険空き家除却促進事業補助金",
      "maxAmount": "最大50万円（費用の1/3以内）",
      "conditions": [
        "不良度測定・周辺への危険度判定で危険と判定された空き家",
        "個人所有の年間使用実績のない一戸建て・長屋建て住宅",
        "居住用面積が延べ床面積の1/2以上",
        "市内に本店・支店等がある解体業者による工事",
        "補助金交付決定前に着手していないこと"
      ],
      "applicationPeriod": "令和7年5月7日〜令和7年10月31日（10戸程度・先着順）",
      "windowName": "住宅建築課",
      "windowPhone": "0833-45-1840",
      "windowUrl": "https://www.city.kudamatsu.lg.jp/jyuuken/jyokyaku.html",
      "noSubsidyNote": null,
      "notes": null
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.kudamatsu.lg.jp/",
      "applicationPhone": "0833-45-1840",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "iwakuni",
    "cityName": "岩国市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "岩国市老朽危険空き家除却促進事業費補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "市内に所在する老朽危険空き家であること",
        "1年以上使用実績のない一戸建て住宅",
        "市が行う認定調査で補助対象と認定されること",
        "市税の滞納がないこと",
        "市内業者による解体工事であること"
      ],
      "applicationPeriod": "令和7年度（予算がなくなり次第終了）",
      "windowName": "建築住宅課 住宅政策班",
      "windowPhone": "0827-29-5138",
      "windowUrl": "https://www.city.iwakuni.lg.jp/soshiki/50/2256.html",
      "noSubsidyNote": null,
      "notes": "申請前に老朽危険空き家認定申請が必要。郵送申請可。※補助上限額は要確認"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.iwakuni.lg.jp/",
      "applicationPhone": "0827-29-5000",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "hikari",
    "cityName": "光市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "光市危険空き家除却促進事業補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "危険空き家と市が判定した空き家であること",
        "1年以上使用実績のない一戸建て住宅",
        "市税の滞納がないこと",
        "補助金交付決定前に着手していないこと"
      ],
      "applicationPeriod": "令和7年5月1日〜令和7年10月31日（3件程度・予算額達し次第終了）",
      "windowName": "環境市民部 生活安全課 市民相談係",
      "windowPhone": "0833-72-1452",
      "windowUrl": "https://www.city.hikari.lg.jp/soshiki/3/seikatsu/kurashi/2/12572.html",
      "noSubsidyNote": null,
      "notes": "令和7年度3件程度の少数枠のため早めの相談推奨。※補助上限額は要確認"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.hikari.lg.jp/",
      "applicationPhone": "0833-72-1452",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "nagato",
    "cityName": "長門市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "長門市危険空き家等除却事業補助金",
      "maxAmount": "最大100万円（延べ床面積200㎡未満）／最大150万円（200〜500㎡）（費用の1/2以内）",
      "conditions": [
        "1年以上無人状態にある長門市内の居住用建築物",
        "不良度判定100点以上であること（市職員が現地確認）",
        "世帯の前年所得金額の総計が500万円未満であること",
        "市税等の滞納がないこと",
        "除却後5年間は土地の建設・譲渡・営利目的使用不可",
        "市内に本店所在地がある施工業者に発注すること"
      ],
      "applicationPeriod": "令和7年4月1日〜令和7年11月28日",
      "windowName": "建築住宅課 住宅班",
      "windowPhone": "0837-23-1186",
      "windowUrl": "https://www.city.nagato.yamaguchi.jp/soshiki/62/52794.html",
      "noSubsidyNote": null,
      "notes": "令和7年度より所得要件が500万円未満に緩和。事前に現地確認申請が必要。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.nagato.yamaguchi.jp/",
      "applicationPhone": "0837-22-2111",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "yanai",
    "cityName": "柳井市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "柳井市空き家除却補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "年間を通して使用実績のない常時無人の戸建て住宅",
        "空き家の所有者または敷地所有者（相続人含む）",
        "市内に本店を有する解体業者に依頼すること",
        "市税の滞納がないこと",
        "補助金交付決定前に着手していないこと"
      ],
      "applicationPeriod": "令和8年4月以降受付予定（令和7年度は予算上限到達で終了）",
      "windowName": "建設部 建築住宅課",
      "windowPhone": "0820-22-2111",
      "windowUrl": "https://www.city-yanai.jp/soshiki/63/akiyajokyakujigyouhojoseido.html",
      "noSubsidyNote": null,
      "notes": "令和7年度は予算上限到達のため受付終了。令和8年度は4月以降受付予定。3年間の事業。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city-yanai.jp/",
      "applicationPhone": "0820-22-2111",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "mine",
    "cityName": "美祢市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "美祢市危険家屋除却推進事業補助金",
      "maxAmount": "詳細は窓口にお問い合わせください（費用の1/2以内）",
      "conditions": [
        "危険空家と認定された建築物であること",
        "空き家の所有者・相続人が申請すること（法人可）",
        "全所有者の同意があること",
        "美祢市税に滞納がないこと",
        "全部除却（一部除却は対象外）"
      ],
      "applicationPeriod": "令和7年度（予算がなくなり次第終了）",
      "windowName": "建設部 建設課",
      "windowPhone": "0837-52-5222",
      "windowUrl": "https://www2.city.mine.lg.jp/soshiki/norinbu/kensetsuka/sangyo/1952.html",
      "noSubsidyNote": null,
      "notes": "法人も申請可能。補助上限額は要確認。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www2.city.mine.lg.jp/",
      "applicationPhone": "0837-52-5234",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "shunan",
    "cityName": "周南市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "周南市危険空き家解体事業補助金",
      "maxAmount": "詳細は窓口にお問い合わせください（費用の8/10相当・上限あり）",
      "conditions": [
        "不良度測定評点100点以上で危険と判定された空き家",
        "居住の用に供しなくなって概ね1年以上経過",
        "延べ床面積の1/2以上が居住用であること",
        "市内に事務所等を有する解体業者による工事",
        "市税の滞納がないこと"
      ],
      "applicationPeriod": "令和7年度（現地確認受付中）",
      "windowName": "住宅課 空き家対策室",
      "windowPhone": "0834-22-8211",
      "windowUrl": "https://www.city.shunan.lg.jp/soshiki/36/83697.html",
      "noSubsidyNote": null,
      "notes": "申請前に市による現地確認が必要。補助額は延べ面積×標準除却費×8/10で算定。補助上限額は要確認。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.shunan.lg.jp/",
      "applicationPhone": "0834-22-8211",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "sanyo-onoda",
    "cityName": "山陽小野田市",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "山陽小野田市老朽危険空家等除却促進補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "年間使用実績がない常時無人の主に居住用の老朽危険空家",
        "不良度測定評点100点以上かつ周囲への危険度判定基準に該当",
        "店舗等併用の場合は1/2以上が居住用",
        "市税の滞納がないこと",
        "事前相談・事前調査申請が必要"
      ],
      "applicationPeriod": "令和7年4月1日〜令和7年12月12日",
      "windowName": "生活安全課",
      "windowPhone": "0836-82-1111",
      "windowUrl": "https://www.city.sanyo-onoda.lg.jp/soshiki/84/reiwa7zyokyakusokusin1027.html",
      "noSubsidyNote": null,
      "notes": "事前相談・現地調査が必須。補助上限額は要確認。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.city.sanyo-onoda.lg.jp/",
      "applicationPhone": "0836-82-1111",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "suo-oshima",
    "cityName": "周防大島町",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "周防大島町危険空家等除去事業補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "特定空家等またはこれに準ずる空家（不良度100点以上）",
        "空家等の所有者・相続人であること",
        "命令を受けていない空家であること",
        "暴力団関係者でないこと",
        "事前に窓口への相談が必要"
      ],
      "applicationPeriod": "令和7年度（予算がなくなり次第終了）",
      "windowName": "空家定住対策課",
      "windowPhone": "0820-74-1033",
      "windowUrl": "https://www.town.suo-oshima.lg.jp/soshiki/19/1957.html",
      "noSubsidyNote": null,
      "notes": "※島嶼部のため制度詳細は周防大島町役場に直接お問い合わせください。補助上限額は要確認。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.town.suo-oshima.lg.jp/",
      "applicationPhone": "0820-74-1000",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "waki",
    "cityName": "和木町",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "和木町役場",
      "windowPhone": "0827-52-2111",
      "windowUrl": "https://www.town.waki.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認。和木町は小規模工業町のため独自の空き家解体補助制度の有無は直接役場にお問い合わせください。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": "https://www.town.waki.lg.jp/",
      "applicationPhone": "0827-52-2111",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "kaminoseki",
    "cityName": "上関町",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "上関町役場",
      "windowPhone": "0820-62-0311",
      "windowUrl": "https://www.town.kaminoseki.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認。公式サイトで補助制度の確認ができませんでした。詳細は上関町役場に直接お問い合わせください。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": "https://www.town.kaminoseki.lg.jp/",
      "applicationPhone": "0820-62-0311",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "tabuse",
    "cityName": "田布施町",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": null,
      "name": null,
      "maxAmount": null,
      "conditions": [],
      "applicationPeriod": null,
      "windowName": "田布施町役場 経済課 地域振興係",
      "windowPhone": "0820-52-5805",
      "windowUrl": "https://www.town.tabuse.lg.jp/",
      "noSubsidyNote": null,
      "notes": "※要確認。田布施町は空き家バンクのリフォーム補助は確認できたが、解体補助制度は公式サイトで未確認。直接役場にお問い合わせください。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": "https://www.town.tabuse.lg.jp/",
      "applicationPhone": "0820-52-5805",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "hirao",
    "cityName": "平生町",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "平生町危険空家解体費補助金",
      "maxAmount": "詳細は窓口にお問い合わせください",
      "conditions": [
        "危険な空家であること（町が行う不良度判定で認定）",
        "町内の空き家の所有者または相続人",
        "町税の滞納がないこと",
        "補助金交付決定前に着手していないこと"
      ],
      "applicationPeriod": "令和7年度（予算がなくなり次第終了）",
      "windowName": "環境課",
      "windowPhone": "0820-56-7125",
      "windowUrl": "https://www.town.hirao.lg.jp/soshiki/kankyo/akiya/index.html",
      "noSubsidyNote": null,
      "notes": "※要確認。公式サイトで「危険な空家の解体費用を補助します」ページの存在を確認。補助率・上限額の詳細は直接お問い合わせください。"
    },
    "garbage": {
      "hasService": true,
      "applicationUrl": "https://www.town.hirao.lg.jp/kurashi/gomi_kankyo/gomi/index.html",
      "applicationPhone": "0820-56-7125",
      "notes": null
    }
  },
  {
    "prefId": "yamaguchi",
    "cityId": "abu",
    "cityName": "阿武町",
    "prefName": "山口県",
    "mascot": null,
    "subsidy": {
      "hasSubsidy": true,
      "name": "阿武町老朽危険空き家除去推進事業補助金",
      "maxAmount": "最大100万円（費用の2/3以内）",
      "conditions": [
        "放置すれば周辺の住環境に悪影響を及ぼすおそれのある危険空き家",
        "不良度・危険度等の基準を満たすこと（申請後町が調査・判定）",
        "空き家の所有者またはその相続人（町外者も可）",
        "町内の資格ある業者に発注し敷地を更地にする工事",
        "除去工事に着手前に申請すること"
      ],
      "applicationPeriod": "令和7年度（予算がなくなり次第終了）",
      "windowName": "阿武町役場 総務課",
      "windowPhone": "08388-2-3111",
      "windowUrl": "https://www.town.abu.yamaguchi.jp/",
      "noSubsidyNote": null,
      "notes": "町外の所有者も申請可能。補助率2/3・上限100万円（令和6年度実績）。令和7年度詳細は要確認。"
    },
    "garbage": {
      "hasService": null,
      "applicationUrl": "https://www.town.abu.yamaguchi.jp/",
      "applicationPhone": "08388-2-3111",
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

  const existingYamaguchiIds = new Set(
    existing
      .filter(item => item.prefId === 'yamaguchi')
      .map(item => item.cityId)
  );

  console.log(`\n📋 既存の山口県データ: ${existingYamaguchiIds.size} 件`);
  console.log('  既存 cityId:', [...existingYamaguchiIds].join(', '));

  const toAdd = [];
  const skipped = [];

  for (const item of newYamaguchiData) {
    if (existingYamaguchiIds.has(item.cityId)) {
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

  const yamaguchiAfter = verified.filter(x => x.prefId === 'yamaguchi');
  console.log('\n🎉 マージ完了！');
  console.log('─'.repeat(40));
  console.log(`📊 山口県 合計: ${yamaguchiAfter.length} 件`);
  console.log(`   補助金あり (true) : ${yamaguchiAfter.filter(x => x.subsidy.hasSubsidy === true).length} 件`);
  console.log(`   補助金なし (false): ${yamaguchiAfter.filter(x => x.subsidy.hasSubsidy === false).length} 件`);
  console.log(`   調査中   (null)  : ${yamaguchiAfter.filter(x => x.subsidy.hasSubsidy === null).length} 件`);
  console.log(`📁 全体件数: ${existing.length} → ${verified.length} 件`);
  console.log('─'.repeat(40));
  console.log('✅ JSON valid');
}

main();
