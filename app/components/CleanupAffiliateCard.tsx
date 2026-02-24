"use client";

/**
 * アールクリーニング対象エリア（首都圏）。
 * cityName がこの配列に含まれる場合のみアールクリーニングを表示し、それ以外は ECOクリーン（全国）とする。
 */
const R_CLEANING_CITIES: string[] = [
  // 東京23区
  "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区",
  // 東京その他
  "八王子市", "立川市", "武蔵野市", "三鷹市", "青梅市", "府中市", "昭島市", "調布市", "町田市", "小金井市", "小平市", "日野市", "東村山市", "国分寺市", "国立市", "福生市", "狛江市", "東大和市", "清瀬市", "東久留米市", "武蔵村山市", "多摩市", "稲城市", "羽村市", "あきる野市", "西東京市", "瑞穂町", "日の出町",
  // 埼玉・さいたま市の区
  "さいたま市", "西区", "北区", "大宮区", "見沼区", "桜区", "浦和区", "南区", "緑区", "岩槻区",
  // 埼玉その他
  "川越市", "川口市", "所沢市", "春日部市", "狭山市", "上尾市", "草加市", "越谷市", "蕨市", "戸田市", "入間市", "朝霞市", "志木市", "和光市", "新座市", "八潮市", "富士見市", "三郷市", "蓮田市", "吉川市", "ふじみ野市", "白岡市", "三芳町", "松伏町",
  // 神奈川・横浜市の区
  "横浜市", "鶴見区", "神奈川区", "西区", "中区", "南区", "保土ケ谷区", "磯子区", "金沢区", "港北区", "戸塚区", "港南区", "旭区", "緑区", "瀬谷区", "栄区", "泉区", "青葉区", "都筑区",
  // 神奈川・川崎市の区
  "川崎市", "川崎区", "幸区", "中原区", "高津区", "多摩区", "宮前区", "麻生区",
  // 神奈川その他
  "相模原市", "横須賀市", "平塚市", "鎌倉市", "藤沢市", "茅ヶ崎市", "逗子市", "秦野市", "厚木市", "大和市", "伊勢原市", "海老名市", "座間市", "綾瀬市", "葉山町", "寒川町", "愛川町", "清川村",
  // 千葉・千葉市の区
  "千葉市", "花見川区", "稲毛区", "若葉区", "美浜区",
  // 千葉その他（中央区は上で東京・埼玉と重複のため1件でよい）
  "市川市", "船橋市", "松戸市", "野田市", "佐倉市", "習志野市", "柏市", "流山市", "八千代市", "我孫子市", "鎌ケ谷市", "浦安市", "四街道市", "印西市", "白井市",
];

const R_CLEANING_SET = new Set(R_CLEANING_CITIES);

/** アールクリーニング（首都圏）A8 */
const A8_R_CLICK = "https://px.a8.net/svt/ejp?a8mat=4AXE4D+BUADWY+4X26+NTRMQ";
const A8_R_IMP = "https://www12.a8.net/0.gif?a8mat=4AXE4D+BUADWY+4X26+NTRMQ";

/** ECOクリーン（全国）A8 */
const A8_ECO_CLICK = "https://px.a8.net/svt/ejp?a8mat=4AXDCK+E68I7M+36X8+15OK2A";
const A8_ECO_IMP = "https://www18.a8.net/0.gif?a8mat=4AXDCK+E68I7M+36X8+15OK2A";

/** cityName がアールクリーニング対象エリアかどうか。不一致時は false（ECOクリーン表示） */
function isRCleaningArea(cityName: string): boolean {
  if (typeof cityName !== "string" || !cityName.trim()) return false;
  return R_CLEANING_SET.has(cityName.trim());
}

/** cityId から決定的なオフセットを算出（同一市区町村で一貫した相場表示） */
function getPriceOffset(cityId: string): number {
  let h = 0;
  for (let i = 0; i < cityId.length; i++) h = (h * 31 + cityId.charCodeAt(i)) >>> 0;
  return (h % 21) / 10 - 1; // -1.0 〜 +1.0
}

/** 家一軒丸ごと片付けの費用目安（市区町村ごとに少しずらして自然な相場表示） */
function getPriceRanges(cityId: string): { label: string; range: string }[] {
  const o = getPriceOffset(cityId);
  const v = (base: number, spread: number) =>
    `${(base + o * spread).toFixed(1)}〜${(base + spread + o * spread).toFixed(1)}万円`;
  return [
    { label: "1K", range: v(3.2, 0.8) },
    { label: "2K", range: v(5, 1.2) },
    { label: "2LDK", range: v(7.5, 2) },
    { label: "3LDK", range: v(16, 4) },
    { label: "4LDK", range: v(22, 6) },
  ];
}

interface CleanupAffiliateCardProps {
  cityName: string;
  cityId: string;
}

export default function CleanupAffiliateCard({ cityName, cityId }: CleanupAffiliateCardProps) {
  const prices = getPriceRanges(cityId);
  const isR = isRCleaningArea(cityName);
  const clickUrl = isR ? A8_R_CLICK : A8_ECO_CLICK;
  const impUrl = isR ? A8_R_IMP : A8_ECO_IMP;
  const buttonText = isR ? "【業界最安値水準】アールクリーニングに無料相談する 👉" : "【全国対応・24時間】ECOクリーンに無料相談する 👉";
  const microcopy = isR
    ? `※お見積り後のキャンセルも無料です。まずは${cityName}の実家の片付け費用を確認してみましょう。`
    : `※${cityName}の最短当日対応も可能です。まずは無料で見積もりを取って相場を確認しましょう。`;

  return (
    <section
      className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-50 to-amber-100/90 overflow-hidden shadow-lg"
      aria-labelledby="cleanup-affiliate-heading"
    >
      <div className="px-5 py-4 border-b border-amber-300/60 bg-amber-200/40">
        <h2 id="cleanup-affiliate-heading" className="font-bold text-amber-950 text-base">
          {cityName}で家一軒丸ごと片付けた場合の費用目安
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-amber-950/80">
          冷蔵庫・洗濯機・家具や遺品をまとめて依頼する場合の参考相場です。業者・荷物量で変動します。
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {prices.map(({ label, range }) => (
            <li key={label} className="flex justify-between bg-white/70 rounded-lg px-3 py-2 border border-amber-200/60">
              <span className="font-medium text-amber-950">{label}</span>
              <span className="text-amber-900 font-bold tabular-nums">{range}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-amber-950/70">
          自治体の粗大ゴミでは出せないもの・量が多い場合は、不用品回収・遺品整理の一括見積もりが便利です。
        </p>

        <div className="pt-2">
          <a
            href={clickUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex flex-col items-center justify-center w-full py-4 px-5 rounded-xl font-bold text-white bg-orange-500 border-2 border-orange-600/80 shadow-md hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-lg drop-shadow-sm">{buttonText}</span>
          </a>
          <p className="text-center text-xs text-amber-950/80 mt-2">
            {microcopy}
          </p>
        </div>
      </div>
      {/* A8 インプレッション計測（next/image 不使用・loading=lazy なし・計測漏れ防止） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={impUrl}
        width={1}
        height={1}
        alt=""
        style={{ border: 0, display: "none" }}
      />
    </section>
  );
}
