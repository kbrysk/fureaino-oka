// キーワード・クラスタリング・エンジン
// 入力: ルート直下のラッコCSV 92本（read-kw-csv.mjs でパース）
// 出力:
//   content/pipeline/keywords.csv        … 台帳（1行=1記事候補 / pSEOハブ行を含む）
//   content/pipeline/_clusters.json       … clusters.md 生成用 中間データ
// 方針:
//   ・表記ゆれ正規化で重複除去（suggest×related, シード間）
//   ・地名付きKWは手書き記事化せず pSEOハブ行に集約（既存 /area/.../{subsidy,cleanup} pSEO）
//   ・地名なし head 語のみ ピラー/クラスタの通常記事に
//   ・優先度 = log10(vol+1) × cv_weight × winnability ÷ ymyl_effort、launch_gate 反映
import fs from "node:fs";
import path from "node:path";
import { listRakkoFiles, parseRakkoFile, normKey, ROOT } from "./read-kw-csv.mjs";

const OUT_DIR = path.join(ROOT, "content", "pipeline");

// ---------- シード → クラスタ ----------
const SEED_CLUSTER = {
  // P1 実家じまいロードマップ
  "実家じまい": "P1", "家じまい": "P1", "実家 片付け": "P1", "老前整理": "P1",
  "身辺整理": "P1", "生前整理 やり方": "P1",
  // P3 売却×解体補助金
  "家 売却": "P3", "家 査定": "P3", "不動産 査定": "P3", "空き家解体": "P3",
  "解体 補助金": "P3", "空き家 補助金": "P3", "空き家活用": "P3", "特定空き家": "P3",
  "実家 売れない": "P3", "実家売れない": "P3", "空き家処分": "P3", "空き家 維持費": "P3",
  "実家 固定資産税": "P3", "実家 補助金": "P3",
  // P4 家族・感情
  "生前 親": "P4", "生前 兄弟": "P4", "親 物を捨てない": "P4", "片付けられない 親": "P4",
  "終活 親": "P4", "親 介護": "P4", "介護離職": "P4", "生前整理 親": "P4",
  // C5 終活・エンディングノート
  "終活": "C5", "終活ノート": "C5", "エンディングノート": "C5",
  // C6 遺品整理・デジタル遺品
  "遺品整理": "C6", "デジタル遺品": "C6", "スマホ 死後": "C6",
  // C7 品目別 処分・供養・買取
  "仏壇 処分": "C7", "仏壇 じまい": "C7", "着物 処分": "C7", "着物 買取": "C7",
  "骨董品 買取": "C7", "形見分け": "C7",
  // C8 不用品・粗大ごみ・ゴミ屋敷
  "粗大ごみ": "C8", "不用品回収": "C8", "ゴミ屋敷 片付け": "C8",
  // C9 相続税・贈与・信託
  "実家 相続": "C9", "生前贈与": "C9", "家族信託": "C9",
  // C10 生前整理 総論
  "生前整理": "C10",
  // --- 追加シード(2026-05-25 第2弾) ---
  "ぬいぐるみ 捨てられない": "C7",          // 人形・ぬいぐるみ供養
  "ゴミ屋敷 片付け 費用": "C8",
  "実家 物が多い ストレス": "P1",
  "サブスク 解約 死後": "C6", "故人 スマホ ロック解除": "C6", // デジタル死後
  "遺品整理 費用 アパート": "C6", "遺品整理 費用 マンション": "C6", "遺品整理 費用 一軒家": "C6", // 住居別費用
  // C11 死後の手続き・諸手続き（新設）
  "死後 手続き 一覧": "C11", "親が亡くなったら やること": "C11",
  "年金 死後 手続き": "C11", "銀行口座 凍結 解除": "C11",
};

// ---------- クラスタ・メタ ----------
const CLUSTER = {
  P1: { name: "実家じまい完全ロードマップ", phase: "F1", journey: "P1", cv: "lead_pdf",     sup: "general",    ymyl: 1.0 },
  P3: { name: "実家の売却×解体補助金",     phase: "F3", journey: "P3", cv: "fudosan_satei",  sup: "none",       ymyl: 1.5 },
  P4: { name: "親への切り出し方・家族の感情", phase: "F1", journey: "P0", cv: "lead_pdf",     sup: "general",    ymyl: 1.0 },
  C5: { name: "終活・エンディングノート",   phase: "F1", journey: "P1", cv: "lead_pdf",       sup: "general",    ymyl: 1.0 },
  C6: { name: "遺品整理・デジタル遺品",     phase: "F2", journey: "P2", cv: "ihin_soukyaku",  sup: "general",    ymyl: 1.2 },
  C7: { name: "品目別 処分・供養・買取",    phase: "F2", journey: "P2", cv: "kaitori_soukyaku", sup: "general",  ymyl: 1.2 },
  C8: { name: "不用品・粗大ごみ・ゴミ屋敷", phase: "F2", journey: "P2", cv: "fuyohin_soukyaku", sup: "general",  ymyl: 1.2 },
  C9: { name: "相続・税・生前贈与・信託",   phase: "F3", journey: "P3", cv: "souzoku_soudan",  sup: "specialist", ymyl: 2.0 },
  C10:{ name: "生前整理 総論ハブ",          phase: "F1", journey: "P1", cv: "lead_pdf",       sup: "general",    ymyl: 1.0 },
  C11:{ name: "死後の手続き・諸手続きロードマップ", phase: "F3", journey: "P3", cv: "lead_pdf", sup: "none",     ymyl: 1.3 },
};

const CV_WEIGHT = { F1: 1.0, F2: 1.3, F3: 1.5, F4: 1.4 };

// 精密ノイズフィルタ: 国語文法(形見分け同音異義汚染)/翻訳/業者名/物の真贋見分け のみ除去
const NOISE = /活用形|古文|古典|連用形|未然形|已然形|終止形|連体形|仮定形|命令形|助動詞|形容動詞|品詞|用言|文語|口語|分子の形|国語|英語|株式会社|有限会社|合同会社|動詞|形容詞|整形|二重|動名詞|現在進行形|完了形|不定詞|過去分詞|分詞/;
// 「見分け」系は文法・整形・真贋鑑定クエリ＝除去。ただし業者/真贋など実需は残す
function isNoise(kw) {
  if (NOISE.test(kw)) return true;
  if (/見分け/.test(kw) && !/業者|悪徳|詐欺|優良|信頼|本物|偽物|真贋|価値/.test(kw)) return true;
  return false;
}

// ---------- 地名検出 ----------
const PREFS = ["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"];
const CITY_EXCLUDE = ["都市","市場","市販","市区町村","区分","区別","区切","町内","町会","村八分","農村","市役所だけ"];
const CITY_RE = /[一-龥ぁ-んァ-ヶ]{1,5}(市|区|町|村)/;
function hasLocation(kw) {
  for (const p of PREFS) if (kw.includes(p)) return true;
  if (CITY_RE.test(kw)) {
    for (const ex of CITY_EXCLUDE) if (kw.includes(ex)) return false;
    return true;
  }
  return false;
}

// ---------- 意図バケット（クラスタ別・順序＝先勝ち） ----------
// 各 bucket: [id, label, test(kw)] ／ test は正規表現 or 関数
const R = (re) => (kw) => re.test(kw);
const BUCKETS = {
  P1: [
    ["cost",    "実家じまいの費用・相場・補助金",       R(/費用|相場|料金|いくら|金額|補助金|助成|安く/)],
    ["timing",  "実家じまいはいつから・タイミング",     R(/いつ|時期|タイミング|何歳|年齢|親が元気|生前|準備/)],
    ["trouble", "実家じまいの後悔・トラブル・進まない", R(/後悔|トラブル|揉め|争|失敗|進ま|できない|疲れ|放置|ストレス|やる気/)],
    ["declutter","実家の片付け・物が多い・断捨離",      R(/片付け|断捨離|物が多い|物を減ら|捨て|ゴミ|不用品|整理収納|汚部屋/)],
    ["roadmap", "実家じまいの進め方・手順・チェックリスト", R(/.*/)],
  ],
  P3: [
    ["subsidy",    "空き家・解体の補助金制度【全国】",   R(/補助金|助成金|支援(制度|金)?|給付|交付/)],
    ["demolition", "空き家・実家の解体費用と流れ",       R(/解体|取り壊し|取壊し|更地/)],
    ["sell",       "空き家・実家の売却と査定",           R(/売却|売る|売れ|査定|高く|いくらで|買い取|買取|手放/)],
    ["use",        "空き家の活用・賃貸・管理",           R(/活用|貸す|賃貸|駐車場|リフォーム|リノベ|管理|民泊|寄付|譲/)],
    ["maintain",   "空き家の維持費・固定資産税・特定空き家", R(/維持費|固定資産税|管理費|特定空き家|特定空家|放置|デメリット|リスク|罰則|税/)],
    ["misc",       "空き家・実家じまいの不動産 総合ハブ", R(/.*/)],
  ],
  P4: [
    ["persuade", "親が片付けない・物を捨てない時の声かけ", R(/捨てない|片付けない|物を捨て|ため込|ゴミ屋敷|説得|声かけ|声掛け|切り出し|嫌が|怒っ/)],
    ["siblings", "きょうだい・兄弟姉妹間のトラブル回避", R(/兄弟|姉妹|きょうだい|相続争|不公平|嫁|長男|実家 帰/)],
    ["care",     "親の介護・介護離職と実家の備え",       R(/介護|離職|認知|施設|在宅|デイ|要介護|地域包括/)],
    ["start",    "親の終活・生前整理を始めてもらうには", R(/終活|生前整理|エンディング|始め|きっかけ|何から/)],
    ["misc",     "親への切り出し方 総合ハブ",             R(/.*/)],
  ],
  C5: [
    ["en_write", "エンディングノートの書き方・項目",     R(/書き方|項目|書く|内容|テンプレ|無料|ダウンロード|アプリ|サンプル|例/)],
    ["en_what",  "終活・エンディングノートとは",         R(/とは|意味|違い|必要|デメリット|目的/)],
    ["howto",    "終活の進め方・やることリスト・年齢",   R(/やること|始め方|進め方|手順|リスト|チェック|いつから|何歳|年齢|準備/)],
    ["service",  "終活サービス・セミナー・資格",         R(/セミナー|講座|資格|アドバイザー|カウンセラー|サービス|相談|費用/)],
    ["misc",     "終活・エンディングノート 総合ハブ",     R(/.*/)],
  ],
  C6: [
    ["digital", "デジタル遺品・スマホ/PCの死後手続き",   R(/デジタル|スマホ|携帯|パソコン|pc|データ|sns|アカウント|サブスク|パスワード|id|ロック/)],
    ["cost",    "遺品整理の費用・相場・料金",            R(/費用|相場|料金|いくら|金額|安く|無料/)],
    ["vendor",  "遺品整理業者の選び方・口コミ・比較",    R(/業者|会社|おすすめ|ランキング|口コミ|評判|比較|選び方|大手|資格|認定/)],
    ["howto",   "遺品整理の進め方・自分で・時期",        R(/自分で|やり方|方法|手順|流れ|進め方|いつ|時期|形見|処分|供養|捨て/)],
    ["misc",    "遺品整理 総合ハブ",                     R(/.*/)],
  ],
  C7: [
    ["butsudan", "仏壇の処分・閉眼供養・仏壇じまい",     R(/仏壇|位牌|神棚|魂抜き|閉眼|お焚き上げ/)],
    ["kimono",   "着物の買取・処分・相場",               R(/着物|和装|帯|反物/)],
    ["kottou",   "骨董品・美術品の買取・相場",           R(/骨董|美術|掛軸|茶道具|陶器|刀剣|古銭|切手|アンティーク/)],
    ["katami",   "形見分けのマナー・進め方",             R(/形見/)],
    ["ningyo",   "人形・ぬいぐるみの供養・処分",         R(/人形|ぬいぐるみ|供養/)],
    ["misc",     "品目別 処分・買取 その他(神棚・遺品等)", R(/.*/)],
  ],
  C8: [
    ["gomi_yashiki","ゴミ屋敷の片付け・費用・業者",      R(/ゴミ屋敷|汚部屋|セルフネグレクト/)],
    ["sodai_howto", "粗大ごみの出し方・捨て方【全国】",  R(/粗大|出し方|捨て方|持ち込み|シール|処理券|収集|回収日/)],
    ["fuyohin_cost","不用品回収の費用・相場",            R(/費用|相場|料金|いくら|トラック|積み放題|軽トラ/)],
    ["fuyohin_vendor","不用品回収業者の選び方・口コミ",  R(/業者|会社|おすすめ|ランキング|口コミ|評判|比較|選び方|違法|無料回収|チラシ/)],
    ["misc",        "不用品回収・ごみ処分 総合ハブ",     R(/.*/)],
  ],
  C9: [
    ["tax",    "相続税の計算・控除・申告",               R(/相続税|税|控除|非課税|基礎控除|申告|評価額|税率/)],
    ["gift",   "生前贈与のやり方・非課税枠・注意点",     R(/贈与|暦年|精算課税|110万|教育資金|住宅資金/)],
    ["trust",  "家族信託の仕組み・費用・手続き",         R(/信託/)],
    ["proc",   "相続の手続き・登記・遺産分割・遺言",     R(/手続き|登記|名義|遺産分割|遺言|相続放棄|必要書類|期限|戸籍/)],
    ["misc",   "相続・税 総合ハブ",                       R(/.*/)],
  ],
  C10: [
    ["what",   "生前整理とは・メリット・デメリット",     R(/とは|意味|メリット|デメリット|必要|違い|断捨離との/)],
    ["howto",  "生前整理のやり方・進め方・チェックリスト", R(/やり方|方法|手順|進め方|始め方|リスト|チェック|コツ|何から/)],
    ["cost",   "生前整理の費用・業者・サービス",         R(/費用|相場|料金|業者|会社|サービス|おすすめ|口コミ|資格|アドバイザー/)],
    ["timing", "生前整理はいつから・年齢・タイミング",   R(/いつ|何歳|年齢|時期|タイミング|定年|50代|60代|70代/)],
    ["misc",   "生前整理 総合ハブ",                       R(/.*/)],
  ],
  C11: [
    ["bank",      "故人の銀行口座 凍結解除・相続手続き", R(/銀行|口座|凍結|引き出し|預金|名義|解約|相続預金/)],
    ["pension",   "年金の死後手続き(遺族年金・未支給)",   R(/年金|遺族|未支給/)],
    ["checklist", "親が亡くなったらやること一覧【手続きロードマップ】", R(/一覧|やること|チェック|順番|期限|流れ|スケジュール|いつまで/)],
    ["misc",      "死後の手続き 総合ハブ",               R(/.*/)],
  ],
};

// 地名KWを集約する pSEO ハブ定義（既存 /area/.../{subsidy,cleanup}）
const PSEO_ROUTE = {
  P3: { id: "pseo-area-subsidy", title: "地域×補助金 pSEO（空き家・解体補助金）", route: "/area/[都道府県]/[市区町村]/subsidy", status: "既存pSEO" },
  C8: { id: "pseo-area-cleanup", title: "地域×粗大ごみ・不用品 pSEO", route: "/area/[都道府県]/[市区町村]/cleanup", status: "既存pSEO" },
};

// ---------- パース & 重複除去 ----------
const files = listRakkoFiles();
const uniq = new Map(); // normKey -> {keyword, cluster, vol, diff, comp, seeds:Set, hits}
let noiseDropped = 0;
for (const fp of files) {
  const p = parseRakkoFile(fp);
  const cluster = SEED_CLUSTER[p.seed];
  if (!cluster) continue; // 未マップシードはスキップ（全47マップ済み想定）
  for (const r of p.rows) {
    const k = normKey(r.keyword);
    if (!k) continue;
    if (isNoise(r.keyword)) { noiseDropped++; continue; }
    let e = uniq.get(k);
    if (!e) {
      e = { keyword: r.keyword, cluster, vol: r.volume ?? 0, diffs: [], comps: [], seeds: new Set(), hits: 0 };
      uniq.set(k, e);
    }
    e.hits++;
    e.seeds.add(p.seed);
    if (r.volume != null && r.volume > e.vol) e.vol = r.volume;
    if (r.difficulty != null) e.diffs.push(r.difficulty);
    if (r.competition != null && r.competition !== "") {
      const c = Number(String(r.competition).replace(/[^\d.]/g, ""));
      if (Number.isFinite(c)) e.comps.push(c);
    }
    // クラスタは最初に出たシードのものを優先（seed偏りを尊重）
  }
}

// ---------- バケット割当 ----------
function assignBucket(cluster, kw) {
  const specs = BUCKETS[cluster];
  for (const [id, label, test] of specs) if (test(kw)) return { id, label };
  return { id: "misc", label: "その他" };
}

const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

// 記事候補グルーピング: key = cluster|bucket（地名KWは pSEO 集約）
const articles = new Map(); // key -> {cluster,bucket,label,members:[],pseo:false}
const pseo = new Map();      // cluster -> {members:[], cities:Set, vol:0}

for (const e of uniq.values()) {
  if (hasLocation(e.keyword)) {
    // 地名KW: pSEO 集約（ルート定義のある P3/C8 を主、その他クラスタ地名は拡充候補として該当クラスタへ）
    const ck = e.cluster;
    let pk = pseo.get(ck);
    if (!pk) { pk = { cluster: ck, members: [], vol: 0 }; pseo.set(ck, pk); }
    pk.members.push(e);
    pk.vol += e.vol;
    continue;
  }
  const b = assignBucket(e.cluster, e.keyword);
  const key = `${e.cluster}|${b.id}`;
  let a = articles.get(key);
  if (!a) { a = { cluster: e.cluster, bucket: b.id, label: b.label, members: [] }; articles.set(key, a); }
  a.members.push(e);
}

// ---------- 記事候補の指標 & 優先度 ----------
function scoreArticle(a) {
  const meta = CLUSTER[a.cluster];
  // 代表KW = ボリューム最大
  a.members.sort((x, y) => y.vol - x.vol);
  const head = a.members[0];
  const volMax = head.vol;
  const volSum = a.members.reduce((s, m) => s + m.vol, 0);
  const diff = avg(a.members.flatMap((m) => m.diffs)) ?? 50;
  const comp = avg(a.members.flatMap((m) => m.comps)) ?? 50;
  const cvW = CV_WEIGHT[meta.phase];
  const winnability = ((100 - diff) / 100) * ((100 - comp) / 100); // dataBoostは地名pSEO側のみ
  const base = (Math.log10(volMax + 1) * cvW * winnability) / meta.ymyl;
  const launchGate = meta.sup === "specialist" ? 0.4 : 1.0;
  const launch = base * launchGate;
  return { head, volMax, volSum, diff: Math.round(diff), comp: Math.round(comp), base, launch, count: a.members.length };
}

const scored = [];
for (const a of articles.values()) {
  if (a.members.length === 0) continue;
  const s = scoreArticle(a);
  scored.push({ ...a, ...s });
}
// スケール（launch を 0-100）
const maxLaunch = Math.max(...scored.map((s) => s.launch));
for (const s of scored) s.priority = Math.round((s.launch / maxLaunch) * 100);
scored.sort((a, b) => b.priority - a.priority);

// S/A/B ランク = パーセンタイル（上位15%=S, 次35%=A, 残り=B）
const N = scored.length;
scored.forEach((s, i) => { s.rank = i < N * 0.15 ? "S" : i < N * 0.5 ? "A" : "B"; });
const rank = (s) => s.rank;

// pSEO 行を scored 形式に
const pseoRows = [];
for (const [ck, pk] of pseo) {
  const route = PSEO_ROUTE[ck];
  const meta = CLUSTER[ck];
  pseoRows.push({
    pseo: true, cluster: ck,
    id: route ? route.id : `pseo-area-${ck.toLowerCase()}`,
    title: route ? route.title : `地域×${meta.name} pSEO拡充候補`,
    route: route ? route.route : "(新規pSEOルート候補)",
    routeStatus: route ? route.status : "拡充候補",
    cities: pk.members.length, volSum: pk.vol,
    head: pk.members.sort((a, b) => b.vol - a.vol)[0],
    cv: meta.cv, sup: meta.sup,
  });
}
pseoRows.sort((a, b) => b.volSum - a.volSum);

// ---------- 出力: keywords.csv ----------
const HEADER = ["kw_id","keyword","cluster","journey_phase","phase","intent","cv_destination","supervisor","priority","status","brief_path","draft_path","qa_report_path","article_id","published_at","gsc_position","notes"];
const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const rows = [];
let idn = 0;
const pad = (n) => String(n).padStart(3, "0");

for (const s of scored) {
  const meta = CLUSTER[s.cluster];
  idn++;
  const subs = s.members.slice(1, 9).map((m) => `${m.keyword}(${m.vol})`).join(" / ");
  const notes = `副次KW(${s.count - 1}件): ${subs}${s.members.length > 9 ? " ほか" : ""} | 月間検索数合計≒${s.volSum.toLocaleString()}(代表${s.volMax.toLocaleString()}/表記ゆれ継承あり) | 難易度${s.diff}/競合${s.comp} | score=${s.priority} rank=${s.rank}`;
  rows.push([
    `${s.cluster}-${pad(idn)}`, s.head.keyword, `${s.cluster}:${meta.name}`, meta.journey, meta.phase,
    s.bucket, meta.cv, meta.sup, s.priority, "backlog", "", "", "", "", "", "", notes,
  ]);
}
// pSEO 行
for (const p of pseoRows) {
  idn++;
  const notes = `pSEOハブ[${p.routeStatus}] route=${p.route} | 集約地名KW ${p.cities}件 / 月間検索数合計≒${p.volSum.toLocaleString()} | 代表:${p.head.keyword}(${p.head.vol}) | 地名KWは手書き記事化せずpSEOで生成。本行はpSEOデータ拡充の根拠`;
  rows.push([
    p.id, p.title, `${p.cluster}:${CLUSTER[p.cluster].name}`, CLUSTER[p.cluster].journey, CLUSTER[p.cluster].phase,
    "programmatic_local", p.cv, p.sup, p.routeStatus === "既存pSEO" ? 90 : 40, "backlog", "", "", "", "", "", "", notes,
  ]);
}

fs.writeFileSync(path.join(OUT_DIR, "keywords.csv"),
  [HEADER.join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n") + "\n", "utf8");

// ---------- 中間 JSON（clusters.md 生成用） ----------
fs.writeFileSync(path.join(OUT_DIR, "_clusters.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  totals: { uniq: uniq.size, articles: scored.length, pseoHubs: pseoRows.length },
  clusterMeta: CLUSTER,
  articles: scored.map((s) => ({
    cluster: s.cluster, bucket: s.bucket, label: s.label, headKw: s.head.keyword,
    volMax: s.volMax, volSum: s.volSum, diff: s.diff, comp: s.comp,
    priority: s.priority, rank: s.rank, count: s.count,
    phase: CLUSTER[s.cluster].phase, journey: CLUSTER[s.cluster].journey,
    cv: CLUSTER[s.cluster].cv, sup: CLUSTER[s.cluster].sup,
    subs: s.members.slice(1, 7).map((m) => `${m.keyword}(${m.vol})`),
  })),
  pseo: pseoRows.map((p) => ({
    cluster: p.cluster, id: p.id, title: p.title, route: p.route, routeStatus: p.routeStatus,
    cities: p.cities, volSum: p.volSum, headKw: p.head.keyword, headVol: p.head.vol, cv: p.cv, sup: p.sup,
  })),
}, null, 2), "utf8");

// ---------- コンソール・サマリ ----------
console.log("=== クラスタリング結果 ===");
console.log("ユニークKW:", uniq.size);
console.log("editorial記事候補:", scored.length, " / pSEOハブ:", pseoRows.length);
const byC = {};
for (const s of scored) byC[s.cluster] = (byC[s.cluster] || 0) + 1;
console.log("\nクラスタ別 記事候補数:");
for (const c of Object.keys(CLUSTER)) console.log(`  ${c} ${CLUSTER[c].name}: ${byC[c] || 0}`);
console.log("\npSEOハブ:");
for (const p of pseoRows) console.log(`  ${p.cluster} ${p.title}: 地名KW${p.cities}件 vol≒${p.volSum.toLocaleString()} [${p.routeStatus}]`);
console.log("\n=== 優先度TOP30(launch調整済) ===");
scored.slice(0, 30).forEach((s, i) =>
  console.log(`  ${String(i + 1).padStart(2)}. [${s.rank}|${String(s.priority).padStart(3)}] ${s.cluster}/${s.bucket}  ${s.head.keyword}  vol${s.volMax}(計${s.volSum}) 難${s.diff}競${s.comp}`));
