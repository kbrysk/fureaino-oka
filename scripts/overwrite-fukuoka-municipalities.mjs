// overwrite-fukuoka-municipalities.mjs
// 使い方: node scripts/overwrite-fukuoka-municipalities.mjs
// 機能: 福岡県の指定 cityId の subsidy のみ上書きする（他県・新規追加は行わない）

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_PATH = resolve(ROOT, "app/lib/data/municipalities.json");

const UPDATES = [
  // ===== 補助金あり（25件）=====
  {
    cityId: "nogata",
    subsidy: {
      hasSubsidy: true,
      name: "直方市老朽危険家屋等解体撤去費補助金",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "昭和56年5月31日以前に竣工した木造または軽量鉄骨造の居住用建築物",
        "老朽危険度調査で評点100点以上",
        "市税等の滞納がないこと",
        "市内の解体業者に工事を依頼すること"
      ],
      applicationPeriod: "令和7年4月1日から（予算枠に達した時点で終了）",
      windowName: "都市計画課 住宅政策係",
      windowPhone: "0949-25-2050",
      windowUrl: "https://www.city.nogata.fukuoka.jp/kurashi/_1203/_9953.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "iizuka",
    subsidy: {
      hasSubsidy: true,
      name: "飯塚市老朽危険家屋解体撤去補助金制度",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "市内に所在する老朽危険家屋の所有者等で市税の滞納がない者",
        "居住その他の使用をしていないことが常態であること",
        "老朽危険度調査で基準を満たすこと"
      ],
      applicationPeriod: "令和7年度（予算がなくなり次第終了）",
      windowName: "都市建設部 建設政策課 空家対策係",
      windowPhone: "0948-22-5500",
      windowUrl: "https://www.city.iizuka.lg.jp/jyutakusoumu/roukyuukaoku.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "tagawa",
    subsidy: {
      hasSubsidy: true,
      name: "田川市老朽危険家屋等解体撤去補助金制度",
      maxAmount: "最大20万円（費用の1/3以内）",
      conditions: [
        "昭和56年5月31日以前に建築された木造の建築物",
        "居住の用に供していないことが常態であること",
        "市税の滞納がないこと",
        "市内の解体業者に工事を依頼すること"
      ],
      applicationPeriod: "令和7年度（毎年度3月末までに手続き完了）",
      windowName: "建設課（都市整備担当）",
      windowPhone: "0947-44-2000",
      windowUrl: "https://www.joho.tagawa.fukuoka.jp/kiji0037318/index.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "yanagawa",
    subsidy: {
      hasSubsidy: true,
      name: "柳川市老朽危険家屋等除却促進事業",
      maxAmount: "最大45万円（費用の1/2以内）",
      conditions: [
        "周辺の住環境等を悪化させ放置されている木造若しくは軽量鉄骨造の建築物",
        "柳川市の定める判定基準値を超えるもの",
        "倉庫は対象外"
      ],
      applicationPeriod: "令和7年度（予算額に達した場合終了）",
      windowName: "都市計画課 建築係",
      windowPhone: "0944-77-8544",
      windowUrl:
        "https://www.city.yanagawa.fukuoka.jp/kurashi/jutaku/jutaku_rokyukikenkaoku.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "yame",
    subsidy: {
      hasSubsidy: true,
      name: "八女市老朽危険家屋等除却促進事業補助金",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "木造若しくは軽量鉄骨造で不良度判定基準の点数が一定以上であること",
        "居住の用に供していた空き家であること",
        "市内事業者が施工する家屋全ての除却工事であること",
        "市税等の滞納がないこと"
      ],
      applicationPeriod: "令和7年度（交付決定年度2月末までに完工）",
      windowName: "防災安全課 生活安全係",
      windowPhone: "0943-24-8146",
      windowUrl:
        "https://www.city.yame.fukuoka.jp/soshiki/12/6/2/anzenanshinmachidukuri/akiyataisaku/1559196597153.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "chikugo",
    subsidy: {
      hasSubsidy: true,
      name: "筑後市老朽危険家屋等除却促進事業補助金",
      maxAmount: "最大30万円（費用の1/3以内）",
      conditions: [
        "老朽危険家屋等の所有者または所有者の相続人",
        "市税等の滞納がないこと",
        "老朽危険家屋等が法人所有でないこと",
        "補助事業完了後に当該敷地を空き家バンクに登録または利活用を図る者"
      ],
      applicationPeriod: "令和7年度",
      windowName: "防災安全課",
      windowPhone: "0942-53-4141",
      windowUrl:
        "https://www.city.chikugo.lg.jp/kurashi/_2299/_13109/_27158.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "okawa",
    subsidy: {
      hasSubsidy: true,
      name: "大川市老朽危険家屋等除却促進事業",
      maxAmount: "最大30万円（費用の1/3以内）",
      conditions: [
        "市内に所在する木造等の建築物（RC造等除く）",
        "不良度の判定基準の評点が100点以上",
        "個人の所有物で所有権以外の権利が設定されていない",
        "市税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度（先着順、予算額達成次第終了）",
      windowName: "都市計画課 住宅政策係",
      windowPhone: "0944-85-5604",
      windowUrl:
        "https://www.city.okawa.lg.jp/s049/010/010/010/20150203140820.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "yukuhashi",
    subsidy: {
      hasSubsidy: true,
      name: "行橋市老朽危険家屋除却補助",
      maxAmount: "最大30万円（費用の50%以内）",
      conditions: [
        "現に使用されていない建築物",
        "木造または鉄骨造で過半が居住用途",
        "老朽度判定基準の評点が100点以上かつ耐用年数超過",
        "市内業者による除却工事"
      ],
      applicationPeriod: "令和7年度 先着15件",
      windowName: "建築政策課 建築政策係",
      windowPhone: "0930-25-1111",
      windowUrl: "https://www.city.yukuhashi.fukuoka.jp/soshiki/24/20311.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "buzen",
    subsidy: {
      hasSubsidy: true,
      name: "豊前市老朽危険家屋等除却促進事業",
      maxAmount: "最大30万円（費用の1/3以内）",
      conditions: [
        "周辺の環境を悪化させている建築物で老朽危険家屋と判定されたもの",
        "建物所有者（または相続関係者）",
        "市税を滞納していないこと"
      ],
      applicationPeriod: "令和7年度（予算の範囲内）",
      windowName: "生活環境課 生活環境係",
      windowPhone: "0979-82-1111",
      windowUrl: "https://www.city.buzen.lg.jp/kankyo/hojo/roukyuukaoku.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "nakama",
    subsidy: {
      hasSubsidy: true,
      name: "中間市老朽危険家屋等解体補助金制度",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "家屋等の老朽度の判定基準による評点の合計が100点超",
        "昭和56年5月31日以前にしゅん工した木造または軽量鉄骨造",
        "市内業者による解体工事"
      ],
      applicationPeriod: "令和7年度（先着順、予算額達成次第終了）",
      windowName: "建設産業部 都市計画課 定住促進係",
      windowPhone: "093-246-6155",
      windowUrl: "https://www.city.nakama.lg.jp/soshiki/19/1269.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "kasuga",
    subsidy: {
      hasSubsidy: true,
      name: "春日市旧耐震基準木造建築物除却補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "昭和56年5月31日以前に建築された木造建築物",
        "耐震診断で耐震性不足と判定されたもの"
      ],
      applicationPeriod: "令和7年度",
      windowName: "都市計画課 計画担当",
      windowPhone: "092-584-1135",
      windowUrl:
        "https://www.city.kasuga.fukuoka.jp/kurashi/seikatsu/jutaku/1001327.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "onojo",
    subsidy: {
      hasSubsidy: true,
      name: "大野城市老朽危険空き家等除却促進事業",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "老朽危険度判定基準の評定100点以上の建物",
        "建物の所有者・相続人",
        "法人・市税滞納者は対象外"
      ],
      applicationPeriod: "令和7年度（予算がなくなり次第終了）",
      windowName: "経済産業部 生活安全課 生活安全担当",
      windowPhone: "092-501-2211",
      windowUrl: "https://www.city.onojo.fukuoka.jp/s059/020/020/060/13500.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "munakata",
    subsidy: {
      hasSubsidy: true,
      name: "宗像市老朽空き家等除却促進事業補助金",
      maxAmount:
        "最大60万円（空家等対策促進区域）または最大30万円（費用の1/3以内）",
      conditions: [
        "昭和56年5月31日以前に建築された老朽空き家等",
        "1年以上居住などの使用がなされていないこと",
        "倒壊や部材の落下のおそれがあるなど市の要件を満たすもの"
      ],
      applicationPeriod:
        "令和7年5月12日〜令和8年1月30日（予算枠到達次第終了）",
      windowName: "建設部 建築指導課",
      windowPhone: "0940-36-1111",
      windowUrl:
        "https://www.city.munakata.lg.jp/w059/030/010/010/20210719112337.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "ukiha",
    subsidy: {
      hasSubsidy: true,
      name: "うきは市老朽危険家屋等除却促進事業費補助金",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "市税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0943-75-3111",
      windowUrl: "https://www.city.ukiha.fukuoka.jp/kiji0036274/index.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "miyawaka",
    subsidy: {
      hasSubsidy: true,
      name: "宮若市老朽危険空家等解体撤去補助金",
      maxAmount: "最大50万円",
      conditions: [
        "市内の老朽危険空家の所有者または相続人",
        "事前（申請前）に建築都市課へ相談",
        "事後（解体工事着手済み）の申請は不可"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設都市部 建築都市課",
      windowPhone: "0949-32-0510",
      windowUrl:
        "https://www.city.miyawaka.lg.jp/teiju/kiji003447008/index.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "kama",
    subsidy: {
      hasSubsidy: true,
      name: "嘉麻市特定空家等解体撤去補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "特定空家等の所有者または相続人",
        "市税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0948-42-0914",
      windowUrl: "https://www.city.kama.lg.jp/soshiki/4/3376.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "asakura",
    subsidy: {
      hasSubsidy: true,
      name: "朝倉市不良空家等解体撤去補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "不良空家等の所有者または相続人",
        "市税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0946-52-1111",
      windowUrl:
        "https://www.city.asakura.lg.jp/www/contents/1522298697526/index.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "miyama",
    subsidy: {
      hasSubsidy: true,
      name: "みやま市老朽危険家屋等除去促進事業",
      maxAmount: "最大45万円（費用の1/2以内）",
      conditions: [
        "老朽危険家屋等の所有者若しくは所有者相続関係者等またはその委任を受けた者",
        "暴力団等でないこと",
        "対象物件が法人所有でないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0944-64-1520",
      windowUrl:
        "https://www.city.miyama.lg.jp/s041/kurashi/080/030/20200108150000.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "itoshima",
    subsidy: {
      hasSubsidy: true,
      name: "糸島市老朽空き家等解体撤去費補助金",
      maxAmount: "最大50万円（費用の1/2以内）",
      conditions: [
        "市内に所在し概ね1年以上居住使用がなされていない建築物",
        "糸島市税の滞納がないこと",
        "補助金の交付決定前に工事着手していないこと"
      ],
      applicationPeriod: "令和7年度（例年6月頃募集）",
      windowName: "総務部 危機管理課 生活安全係",
      windowPhone: "092-332-2110",
      windowUrl:
        "https://www.city.itoshima.lg.jp/s004/010/010/030/040/20230307132444.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "omuta",
    subsidy: {
      hasSubsidy: true,
      name: "大牟田市老朽危険家屋等除却促進事業",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "市税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設政策課",
      windowPhone: "0944-41-2716",
      windowUrl:
        "https://www.city.omuta.lg.jp/hpkiji/pub/detail.aspx?c_id=5&id=506",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "ashiya",
    subsidy: {
      hasSubsidy: true,
      name: "芦屋町老朽危険家屋等解体補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "093-223-3551",
      windowUrl: "https://www.town.ashiya.lg.jp/soshiki/7/1233.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "mizumaki",
    subsidy: {
      hasSubsidy: true,
      name: "水巻町老朽危険家屋等解体補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "093-201-4321",
      windowUrl:
        "https://www.town.mizumaki.lg.jp/s022/kurashi/080/070/20200109180000.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "onga",
    subsidy: {
      hasSubsidy: true,
      name: "遠賀町危険老朽家屋等解体補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "093-293-1234",
      windowUrl: "https://www.town.onga.lg.jp/soshiki/12/1361.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "chikuzen",
    subsidy: {
      hasSubsidy: true,
      name: "筑前町老朽危険空家除却促進事業補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険空家の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0946-42-6810",
      windowUrl:
        "https://www.town.chikuzen.fukuoka.jp/S015/akiya/20210719143121.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "tachiarai",
    subsidy: {
      hasSubsidy: true,
      name: "大刀洗町不良空家等除却補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "不良空家等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0942-77-2141",
      windowUrl: "https://www.town.tachiarai.fukuoka.jp/page/page_02210.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "oguki",
    subsidy: {
      hasSubsidy: true,
      name: "大木町老朽空家除却補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽空家の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0944-32-1111",
      windowUrl:
        "https://www.town.ooki.lg.jp/soshiki/sangyo/suishin/akiya/4166.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "hirokawa",
    subsidy: {
      hasSubsidy: true,
      name: "広川町老朽危険家屋等除却促進事業",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0943-32-1111",
      windowUrl:
        "https://www.town.hirokawa.fukuoka.jp/kurashi_tetsuzuki/machizukuri_kotsu/2/1855.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "kawara",
    subsidy: {
      hasSubsidy: true,
      name: "香春町空き家解体補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "空き家の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0947-32-8401",
      windowUrl:
        "https://www.town.kawara.fukuoka.jp/s001/090/010/010/20240307164923.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "itoda",
    subsidy: {
      hasSubsidy: true,
      name: "糸田町老朽危険空き家等解体撤去工事補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険空き家等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0947-26-2011",
      windowUrl:
        "https://www.town.itoda.lg.jp/news/detail/1064/year:2023/back:1",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "yoshitomi",
    subsidy: {
      hasSubsidy: true,
      name: "吉富町老朽危険空家等除却事業補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険空家等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0979-24-3511",
      windowUrl:
        "https://www.town.yoshitomi.lg.jp/gyosei/chosei/v995/y209/jumin/g864/",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "kamitsue",
    subsidy: {
      hasSubsidy: true,
      name: "上毛町老朽危険家屋等除去促進事業",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険家屋等の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0979-72-2111",
      windowUrl:
        "https://www.town.koge.lg.jp/soshiki/chocho/6/gomi/3244.html",
      noSubsidyNote: null,
      notes: null
    }
  },
  {
    cityId: "chikujo",
    subsidy: {
      hasSubsidy: true,
      name: "築上町老朽危険空き家除却費補助金",
      maxAmount: "詳細は窓口にお問い合わせください",
      conditions: [
        "老朽危険空き家の所有者または相続人",
        "町税の滞納がないこと"
      ],
      applicationPeriod: "令和7年度",
      windowName: "建設課",
      windowPhone: "0930-56-0300",
      windowUrl:
        "https://www.town.chikujo.fukuoka.jp/s038/010/080/030/070/akiya_hojo.html",
      noSubsidyNote: null,
      notes: null
    }
  },

  // ===== 補助金なし（3件）=====
  {
    cityId: "chikushino",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "建設部建築課",
      windowPhone: "092-923-1111",
      windowUrl: "https://www.city.chikushino.fukuoka.jp/soshiki/25/3167.html",
      noSubsidyNote:
        "筑紫野市では老朽危険家屋等の解体補助金制度は設けられていません。空き家の適正管理・活用相談は建設部建築課へ。",
      notes: null
    }
  },
  {
    cityId: "dazaifu",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "都市計画課",
      windowPhone: "092-921-2121",
      windowUrl: "https://www.city.dazaifu.lg.jp/soshiki/20/3566.html",
      noSubsidyNote:
        "太宰府市では老朽危険家屋等の解体補助金制度は設けられていません。空き家相談は都市計画課へ。",
      notes: null
    }
  },
  {
    cityId: "koga",
    subsidy: {
      hasSubsidy: false,
      name: null,
      maxAmount: null,
      conditions: [],
      applicationPeriod: null,
      windowName: "都市整備課",
      windowPhone: "092-942-1119",
      windowUrl:
        "https://www.city.koga.fukuoka.jp/cityhall/work/toshikeikaku/031.php",
      noSubsidyNote:
        "古賀市では老朽危険家屋等の解体補助金制度は確認できませんでした。詳細は都市整備課へお問い合わせください。",
      notes: null
    }
  }
  // ===== null維持（21件）=====
  // ogori, fukutsu, umi, sasaguri, shime, sue, shingu, hisayama,
  // kasuya, okagaki, kotake, kurate, keisen, toho, kawasaki,
  // otani, akamura, fukuchi, kanda, miyako, soeda → 変更しない
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
    if (item.prefId !== "fukuoka") continue;
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

  const fukuoka = data.filter((x) => x.prefId === "fukuoka");
  console.log("\n🎉 上書き完了！");
  console.log("─".repeat(50));
  console.log(`📊 福岡県 更新: ${updated} 件`);
  console.log(
    `   補助金あり (true) : ${fukuoka.filter((x) => x.subsidy?.hasSubsidy === true).length} 件`
  );
  console.log(
    `   補助金なし (false): ${fukuoka.filter((x) => x.subsidy?.hasSubsidy === false).length} 件`
  );
  console.log(
    `   調査中   (null)  : ${fukuoka.filter((x) => x.subsidy?.hasSubsidy === null).length} 件`
  );
  console.log("─".repeat(50));
  console.log("✅ JSON valid");
}

main();
