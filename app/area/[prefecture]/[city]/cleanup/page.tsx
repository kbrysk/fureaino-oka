// import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getSampleCityPaths } from "../../../../lib/utils/city-loader";

export const dynamicParams = true;
export const revalidate = 86400;
import { getMunicipalityDataOrDefault, getMunicipalitiesByPrefecture } from "../../../../lib/data/municipalities";
import { getAreaSeizenseiriColumn, getAreaOwlColumn } from "../../../../lib/area-column";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import AreaOwlBlock from "../../../../components/AreaOwlBlock";
import CleanupAffiliateCard from "../../../../components/CleanupAffiliateCard";
import RealEstateAppraisalCard from "../../../../components/RealEstateAppraisalCard";
import MascotAdviceBlock from "../../../../components/MascotAdviceBlock";
import LocalConsultationCard from "../../../../components/LocalConsultationCard";
import NearbySubsidyLinks from "../../../../components/NearbySubsidyLinks";
import AreaDirectoryFallback from "../../../../components/AreaDirectoryFallback";
import { buildCleanupSeoDescription, buildCleanupSeoTitlePart } from "../../../../lib/cleanup-seo-metadata";
import { pageTitle } from "../../../../lib/site-brand";
import { getCanonicalUrl } from "../../../../lib/site-url";
import JsonLd from "../../../../components/JsonLd";

/** INSTRUCTION-010 ADDENDUM-A: cleanup 全ページ noindex（generateMetadata の各 return で同一を付与） */
const cleanupRobotsNoindex: NonNullable<Metadata["robots"]> = {
  // INSTRUCTION-010: noindex で検索結果から除外
  // 両分岐(通常+フォールバック)に必ず付与する
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

/**
 * 遺品整理・実家じまいの追記セクション（流れ・FAQ・FAQPage）を出す対象。
 * `prefId/cityId` のみを列挙し、条件は `showExtraSection` 1 箇所で判定する。
 */
const CLEANUP_EXTRA_CITY_KEYS: readonly string[] = [
  "tokyo/chiyoda",
  "tokyo/chuo",
  "tokyo/minato",
  "tokyo/shinjuku",
  "tokyo/bunkyo",
  "tokyo/taito",
  "tokyo/sumida",
  "tokyo/koto",
  "tokyo/shinagawa",
  "tokyo/meguro",
  "tokyo/ota",
  "tokyo/setagaya",
  "tokyo/shibuya",
  "tokyo/nakano",
  "tokyo/suginami",
  "tokyo/toshima",
  "tokyo/kita",
  "tokyo/arakawa",
  "tokyo/itabashi",
  "tokyo/nerima",
  "tokyo/adachi",
  "tokyo/katsushika",
  "tokyo/edogawa",
  "hokkaido/sapporo",
  "hokkaido/hakodate",
  "hokkaido/asahikawa",
  "hokkaido/muroran",
  "hokkaido/otaru",
  "hokkaido/obihiro",
  "hokkaido/kushiro",
  "hokkaido/kitami",
  "hokkaido/yubari",
  "hokkaido/iwamizawa",
  "hokkaido/abashiri",
  "hokkaido/rumoe",
  "hokkaido/tomakomai",
  "hokkaido/wakkanai",
  "hokkaido/bibai",
  "hokkaido/ashibetsu",
  "hokkaido/ebetsu",
  "hokkaido/akabira",
  "hokkaido/monbetsu",
  "hokkaido/shibetsu",
  "hokkaido/nayoro",
  "hokkaido/mikasa",
  "hokkaido/nemuro",
  "hokkaido/chitose",
  "hokkaido/takigawa",
  "hokkaido/sunagawa",
  "hokkaido/utashinai",
  "hokkaido/fukagawa",
  "hokkaido/furano",
  "hokkaido/noboribetsu",
  "hokkaido/eniwa",
  "hokkaido/date",
  "hokkaido/kitahiroshima",
  "hokkaido/ishikari",
  "hokkaido/hokuto",
  "aomori/aomori",
  "aomori/hirosaki",
  "aomori/hachinohe",
  "aomori/kuroishi",
  "aomori/goshogawara",
  "aomori/towada",
  "aomori/misawa",
  "aomori/mutsu",
  "aomori/tsugaru",
  "aomori/hirakawa",
  "iwate/morioka",
  "iwate/miyako",
  "iwate/ofunawataru",
  "iwate/hanamaki",
  "iwate/hokujo",
  "iwate/kuji",
  "iwate/tono",
  "iwate/ichizeki",
  "iwate/rikuzentakata",
  "iwate/kamaishi",
  "iwate/niko",
  "iwate/yawatadaira",
  "iwate/oshu",
  "iwate/takizawa",
  "miyagi/sendai",
  "miyagi/ishinomaki",
  "miyagi/shiogama",
  "miyagi/kesennuma",
  "miyagi/shiraishi",
  "miyagi/natori",
  "miyagi/tsunoda",
  "miyagi/tagajo",
  "miyagi/iwanuma",
  "miyagi/toyone",
  "miyagi/kurihara",
  "miyagi/higashimatsushima",
  "miyagi/osaki",
  "miyagi/tomiya",
  "akita/akita",
  "akita/noshiro",
  "akita/yokode",
  "akita/odate",
  "akita/oga",
  "akita/yuzawa",
  "akita/katsuno",
  "akita/yurihonjo",
  "akita/katagami",
  "akita/daisen",
  "akita/kitaakita",
  "akita/nikaho",
  "akita/semboku",
  "yamagata/yamagata",
  "yamagata/yonezawa",
  "yamagata/tsuruoka",
  "yamagata/sakata",
  "yamagata/shinjo",
  "yamagata/sagae",
  "yamagata/ueyama",
  "yamagata/murayama",
  "yamagata/nagai",
  "yamagata/tendo",
  "yamagata/higashine",
  "yamagata/obanazawa",
  "yamagata/nan-yo",
  "fukushima/fukushima",
  "fukushima/aizuwakamatsu",
  "fukushima/kooriyama",
  "fukushima/iwaki",
  "fukushima/shirakawa",
  "fukushima/sukagawa",
  "fukushima/kitakata",
  "fukushima/soma",
  "fukushima/nihommatsu",
  "fukushima/tamura",
  "fukushima/minamisoma",
  "fukushima/date",
  "fukushima/motomiya",
  "ibaraki/mito",
  "ibaraki/hitachi",
  "ibaraki/tsuchiura",
  "ibaraki/furukawa",
  "ibaraki/ishioka",
  "ibaraki/yuki",
  "ibaraki/ryugasaki",
  "ibaraki/shimozuma",
  "ibaraki/tsuneso",
  "ibaraki/hitachiota",
  "ibaraki/takahagi",
  "ibaraki/kitaibaraki",
  "ibaraki/kasama",
  "ibaraki/totte",
  "ibaraki/ushiku",
  "ibaraki/tsukuba",
  "ibaraki/hitachinaka",
  "ibaraki/kashima",
  "ibaraki/itako",
  "ibaraki/moriya",
  "ibaraki/hitachiomiya",
  "ibaraki/naka",
  "ibaraki/nishi",
  "ibaraki/bando",
  "ibaraki/inashiki",
  "ibaraki/kasumigaura",
  "ibaraki/sakuragawa",
  "ibaraki/kamisu",
  "ibaraki/yukue",
  "ibaraki/hokota",
  "ibaraki/tsukubamirai",
  "ibaraki/oidama",
  "tochigi/utsunomiya",
  "tochigi/ashikaga",
  "tochigi/tochigi",
  "tochigi/sano",
  "tochigi/kanuma",
  "tochigi/nikko",
  "tochigi/koyama",
  "tochigi/mooka",
  "tochigi/otawara",
  "tochigi/yaita",
  "tochigi/nasushiobara",
  "tochigi/sakura",
  "tochigi/nasuuzan",
  "tochigi/geya",
  "gunma/maebashi",
  "gunma/takasaki",
  "gunma/kiryu",
  "gunma/isesaki",
  "gunma/ota",
  "gunma/numata",
  "gunma/tatebayashi",
  "gunma/shibukawa",
  "gunma/fujioka",
  "gunma/tomioka",
  "gunma/annaka",
  "gunma/midori",
  "saitama/saitama",
  "saitama/kawaguchi",
  "saitama/kumagai",
  "saitama/kawagoe",
  "saitama/gyoda",
  "saitama/chichibu",
  "saitama/tokorozawa",
  "saitama/hanno",
  "saitama/kazo",
  "saitama/honjo",
  "saitama/higashimatsuyama",
  "saitama/kasukabe",
  "saitama/sayama",
  "saitama/habu",
  "saitama/konosu",
  "saitama/fukaya",
  "saitama/ageo",
  "saitama/soka",
  "saitama/koshigaya",
  "saitama/warabi",
  "saitama/toda",
  "saitama/iruma",
  "saitama/asagasumi",
  "saitama/shiki",
  "saitama/wako",
  "saitama/niza",
  "saitama/okegawa",
  "saitama/kuki",
  "saitama/kitamoto",
  "saitama/yashio",
  "saitama/fujimi",
  "saitama/misato",
  "saitama/hasuda",
  "saitama/sakado",
  "saitama/satte",
  "saitama/tsurugashima",
  "saitama/hidaka",
  "saitama/yoshikawa",
  "saitama/fujimino",
  "saitama/shiraoka",
  "chiba/chiba",
  "chiba/choshi",
  "chiba/ichikawa",
  "chiba/funabashi",
  "chiba/tateyama",
  "chiba/kisarazu",
  "chiba/matsudo",
  "chiba/noda",
  "chiba/shigehara",
  "chiba/narita",
  "chiba/sakura",
  "chiba/togane",
  "chiba/asahi",
  "chiba/narashino",
  "chiba/kashiwa",
  "chiba/katsuura",
  "chiba/ichihara",
  "chiba/nagareyama",
  "chiba/yachiyo",
  "chiba/abiko",
  "chiba/kamogawa",
  "chiba/kamagaya",
  "chiba/kimitsu",
  "chiba/futtsu",
  "chiba/urayasu",
  "chiba/yotsukaido",
  "chiba/sodegaura",
  "chiba/yamachi",
  "chiba/inzai",
  "chiba/shirai",
  "chiba/tomisato",
  "chiba/minamiboso",
  "chiba/sosa",
  "chiba/katori",
  "chiba/sambu",
  "chiba/isumi",
  "chiba/oamishirasato",
  "tokyo/hachioji",
  "tokyo/tachikawa",
  "tokyo/musashino",
  "tokyo/mitaka",
  "tokyo/oume",
  "tokyo/fuchu",
  "tokyo/akishima",
  "tokyo/chofu",
  "tokyo/machida",
  "tokyo/koganei",
  "tokyo/kodaira",
  "tokyo/hino",
  "tokyo/higashimurayama",
  "tokyo/kokubunji",
  "tokyo/kokuritsu",
  "tokyo/fussa",
  "tokyo/komae",
  "tokyo/higashiyamato",
  "tokyo/kiyose",
  "tokyo/higashikurume",
  "tokyo/musashimurayama",
  "tokyo/tama",
  "tokyo/inagi",
  "tokyo/hamura",
  "tokyo/akiruno",
  "tokyo/nishitokyo",
  "tokyo/mizuho",
  "tokyo/hinode",
  "tokyo/hibaru",
  "tokyo/okutama",
  "kanagawa/yokohama",
  "kanagawa/kawasaki",
  "kanagawa/sagamihara",
  "kanagawa/yokosuka",
  "kanagawa/hiratsuka",
  "kanagawa/kamakura",
  "kanagawa/fujisawa",
  "kanagawa/odawara",
  "kanagawa/chigasaki",
  "kanagawa/zushi",
  "kanagawa/miura",
  "kanagawa/hatano",
  "kanagawa/atsugi",
  "kanagawa/yamato",
  "kanagawa/isehara",
  "kanagawa/ebina",
  "kanagawa/zama",
  "kanagawa/minamiashigara",
  "kanagawa/aikawa",
  "kanagawa/kiyokawa",
  "niigata/nigata",
  "niigata/nagaoka",
  "niigata/sanjo",
  "niigata/kashiwazaki",
  "niigata/shibata",
  "niigata/ojiya",
  "niigata/kamo",
  "niigata/tokamachi",
  "niigata/mitsuke",
  "niigata/murakami",
  "niigata/tsubame",
  "niigata/itoigawa",
  "niigata/myodaka",
  "niigata/gosen",
  "niigata/joetsu",
  "niigata/agano",
  "niigata/sado",
  "niigata/uonuma",
  "niigata/minamiuonuma",
  "toyama/toyama",
  "toyama/takaoka",
  "toyama/uozu",
  "toyama/himi",
  "toyama/namekawa",
  "toyama/kurobe",
  "toyama/tonami",
  "toyama/oyabe",
  "toyama/minamiarato",
  "toyama/imizu",
  "ishikawa/kanazawa",
  "ishikawa/nanabi",
  "ishikawa/komatsu",
  "ishikawa/wajima",
  "ishikawa/suzu",
  "ishikawa/kaga",
  "ishikawa/hakui",
  "ishikawa/kahoku",
  "ishikawa/hakusan",
  "ishikawa/nomi",
  "ishikawa/nonoichi",
  "fukui/fukui",
  "fukui/tsuruga",
  "fukui/obama",
  "fukui/ono",
  "fukui/katsuyama",
  "fukui/sabae",
  "fukui/awara",
  "fukui/echizen",
  "fukui/sakai",
  "yamanashi/kofu",
  "yamanashi/fujiyoshida",
  "yamanashi/tsuru",
  "yamanashi/yamanashi",
  "yamanashi/otsuki",
  "yamanashi/nirasaki",
  "yamanashi/minamiarupusu",
  "yamanashi/kitamori",
  "yamanashi/kai",
  "yamanashi/usui",
  "yamanashi/uenohara",
  "yamanashi/koshu",
  "yamanashi/chuo",
  "nagano/nagano",
  "nagano/matsumoto",
  "nagano/ueda",
  "nagano/okaya",
  "nagano/ida",
  "nagano/suwa",
  "nagano/suzaka",
  "nagano/komoro",
  "nagano/ina",
  "nagano/komagane",
  "nagano/nakano",
  "nagano/omachi",
  "nagano/iyama",
  "nagano/chino",
  "nagano/shiojiri",
  "nagano/saku",
  "nagano/senkyoku",
  "nagano/higashio",
  "nagano/azumino",
  "gifu/gifu",
  "gifu/ogaki",
  "gifu/takayama",
  "gifu/tajimi",
  "gifu/seki",
  "gifu/nakatsugawa",
  "gifu/mino",
  "gifu/mizunami",
  "gifu/hashima",
  "gifu/ena",
  "gifu/minokamo",
  "gifu/toki",
  "gifu/kakamigahara",
  "gifu/kani",
  "gifu/yamagata",
  "gifu/mizuho",
  "gifu/hida",
  "gifu/motosu",
  "gifu/gujo",
  "gifu/gero",
  "gifu/kaizu",
  "shizuoka/shizuoka",
  "shizuoka/hamamatsu",
  "shizuoka/numazu",
  "shizuoka/atami",
  "shizuoka/mishima",
  "shizuoka/fujinomiya",
  "shizuoka/ito",
  "shizuoka/shimada",
  "shizuoka/fuji",
  "shizuoka/iwata",
  "shizuoka/yaizu",
  "shizuoka/kakegawa",
  "shizuoka/fujieda",
  "shizuoka/gotemba",
  "shizuoka/fukuroi",
  "shizuoka/shimoda",
  "shizuoka/susono",
  "shizuoka/kosai",
  "shizuoka/izu",
  "shizuoka/omaezaki",
  "shizuoka/kikukawa",
  "shizuoka/izunokuni",
  "shizuoka/makinohara",
  "aichi/nagoya",
  "aichi/toyohashi",
  "aichi/okazaki",
  "aichi/ichinomiya",
  "aichi/seto",
  "aichi/handa",
  "aichi/kasugai",
  "aichi/toyokawa",
  "aichi/tsushima",
  "aichi/hekinan",
  "aichi/kariya",
  "aichi/toyoda",
  "aichi/aki",
  "aichi/nishio",
  "aichi/kabanogun",
  "aichi/inuyama",
  "aichi/tokoname",
  "aichi/konan",
  "aichi/komaki",
  "aichi/inazawa",
  "aichi/shinjo",
  "aichi/tokai",
  "aichi/ofu",
  "aichi/chita",
  "aichi/chiryu",
  "aichi/owariasahi",
  "aichi/takahama",
  "aichi/iwakura",
  "aichi/toyoaki",
  "aichi/nisshin",
  "aichi/tahara",
  "aichi/ainishi",
  "aichi/kiyosu",
  "aichi/kitanagoya",
  "aichi/yatomi",
  "aichi/miyoshi",
  "aichi/ama",
  "aichi/nagakute",
  "mie/tsu",
  "mie/yokkaichi",
  "mie/ise",
  "mie/matsuzaka",
  "mie/kuwana",
  "mie/suzuka",
  "mie/nabari",
  "mie/owase",
  "mie/kameyama",
  "mie/toba",
  "mie/kumano",
  "mie/inabe",
  "mie/shima",
  "mie/iga",
  "shiga/otsu",
  "shiga/hikone",
  "shiga/nagahama",
  "shiga/omihachiman",
  "shiga/kusatsu",
  "shiga/moriyama",
  "shiga/ritto",
  "shiga/koga",
  "shiga/yasu",
  "shiga/konan",
  "shiga/takashima",
  "shiga/azumaomi",
  "shiga/maibara",
  "kyoto/kyoto",
  "kyoto/fukuchiyama",
  "kyoto/maizuru",
  "kyoto/ayabe",
  "kyoto/uji",
  "kyoto/miyazu",
  "kyoto/kameoka",
  "kyoto/joyo",
  "kyoto/muko",
  "kyoto/nagaokakyo",
  "kyoto/yahata",
  "kyoto/kyotanabe",
  "kyoto/kyomakotogo",
  "kyoto/minamini",
  "kyoto/kizugawa",
  "osaka/osaka",
  "osaka/sakai",
  "osaka/kishiwada",
  "osaka/toyonaka",
  "osaka/ikeda",
  "osaka/suita",
  "osaka/izumiotsu",
  "osaka/takatsuki",
  "osaka/kaizuka",
  "osaka/moriguchi",
  "osaka/hirakata",
  "osaka/ibaragi",
  "osaka/yao",
  "osaka/izumisano",
  "osaka/tomitarin",
  "osaka/neyagawa",
  "osaka/kawachinagano",
  "osaka/matsubara",
  "osaka/daito",
  "osaka/izumi",
  "osaka/minoo",
  "osaka/kashiwabara",
  "osaka/habikino",
  "osaka/kadoma",
  "osaka/settsu",
  "osaka/takaishi",
  "osaka/fujiidera",
  "osaka/higashiosaka",
  "osaka/sennan",
  "osaka/shijonawate",
  "osaka/katano",
  "osaka/osakasayama",
  "osaka/hannan",
  "hyogo/kobe",
  "hyogo/himeji",
  "hyogo/amagasaki",
  "hyogo/akashi",
  "hyogo/nishinomiya",
  "hyogo/sumoto",
  "hyogo/ashiya",
  "hyogo/itami",
  "hyogo/aioi",
  "hyogo/toyooka",
  "hyogo/kakogawa",
  "hyogo/ako",
  "hyogo/nishiwaki",
  "hyogo/takarazuka",
  "hyogo/miki",
  "hyogo/takasago",
  "hyogo/kawanishi",
  "hyogo/ono",
  "hyogo/mita",
  "hyogo/kasai",
  "hyogo/tambashinoyama",
  "hyogo/yofu",
  "hyogo/tamba",
  "hyogo/minamiawaji",
  "hyogo/chorai",
  "hyogo/awaji",
  "hyogo/shiso",
  "hyogo/kato",
  "hyogo/tatsuno",
  "nara/nara",
  "nara/yamatotakada",
  "nara/yamatokoriyama",
  "nara/tenri",
  "nara/kashihara",
  "nara/sakurai",
  "nara/gojo",
  "nara/gosho",
  "nara/ikoma",
  "nara/kashiba",
  "nara/katsuragi",
  "nara/uda",
  "wakayama/wakayama",
  "wakayama/kainan",
  "wakayama/hashimoto",
  "wakayama/arita",
  "wakayama/gobo",
  "wakayama/tanabe",
  "wakayama/shingu",
  "wakayama/kinokawa",
  "wakayama/iwade",
  "tottori/tottori",
  "tottori/yonago",
  "tottori/kurayoshi",
  "tottori/sakaiminato",
  "shimane/matsue",
  "shimane/hamada",
  "shimane/izumo",
  "shimane/masuda",
  "shimane/ota",
  "shimane/yasugi",
  "shimane/gotsu",
  "shimane/unnan",
  "okayama/okayama",
  "okayama/kurashiki",
  "okayama/tsuyama",
  "okayama/tamano",
  "okayama/kasaoka",
  "okayama/ihara",
  "okayama/soja",
  "okayama/takahashi",
  "okayama/nimi",
  "okayama/bizen",
  "okayama/setouchi",
  "okayama/akaiwa",
  "okayama/maniwa",
  "okayama/misaku",
  "okayama/asakuchi",
  "hiroshima/hiroshima",
  "hiroshima/go",
  "hiroshima/takehara",
  "hiroshima/mihara",
  "hiroshima/onomichi",
  "hiroshima/fukuyama",
  "hiroshima/fuchu",
  "hiroshima/sanji",
  "hiroshima/shobara",
  "hiroshima/otake",
  "hiroshima/higashihiroshima",
  "hiroshima/hatsukaichi",
  "hiroshima/akitakada",
  "hiroshima/etajima",
  "yamaguchi/shimonoseki",
  "yamaguchi/ube",
  "yamaguchi/yamaguchi",
  "yamaguchi/hagi",
  "yamaguchi/hofu",
  "yamaguchi/kudamatsu",
  "yamaguchi/iwakuni",
  "yamaguchi/hikari",
  "yamaguchi/nagato",
  "yamaguchi/yanai",
  "yamaguchi/mine",
  "yamaguchi/shuminami",
  "yamaguchi/san-yoonoda",
  "tokushima/tokushima",
  "tokushima/naruto",
  "tokushima/komatsushima",
  "tokushima/anami",
  "tokushima/yoshinogawa",
  "tokushima/awa",
  "tokushima/mima",
  "tokushima/miyoshi",
  "kagawa/takamatsu",
  "kagawa/marugame",
  "kagawa/sakaide",
  "kagawa/zentsuji",
  "kagawa/kannonji",
  "kagawa/sanuki",
  "kagawa/higashikagawa",
  "kagawa/mitoyo",
  "ehime/matsuyama",
  "ehime/imabari",
  "ehime/uwajima",
  "ehime/yawatahama",
  "ehime/niihama",
  "ehime/saijo",
  "ehime/osu",
  "ehime/iyo",
  "ehime/shikokuchuo",
  "ehime/nishi",
  "ehime/ueshima",
  "ehime/kumakogen",
  "ehime/masaki",
  "ehime/tobe",
  "ehime/uchiko",
  "ehime/ikata",
  "ehime/matsuno",
  "ehime/onikita",
  "ehime/aiminami",
  "kochi/kochi",
  "kochi/muroto",
  "kochi/aki",
  "kochi/nangoku",
  "kochi/tosa",
  "kochi/susaki",
  "kochi/sukumo",
  "kochi/tosashimizu",
  "kochi/yonmanju",
  "kochi/konan",
  "kochi/komi",
  "fukuoka/kitakyushu",
  "fukuoka/fukuoka",
  "fukuoka/omuta",
  "fukuoka/kuruyone",
  "fukuoka/chokuho",
  "fukuoka/izuka",
  "fukuoka/tagawa",
  "fukuoka/yanagawa",
  "fukuoka/hachijo",
  "fukuoka/chikugo",
  "fukuoka/okawa",
  "fukuoka/yukuhashi",
  "fukuoka/toyomae",
  "fukuoka/chukan",
  "fukuoka/ogori",
  "fukuoka/chikushino",
  "fukuoka/shunjitsu",
  "fukuoka/onojo",
  "fukuoka/munakata",
  "fukuoka/dazaifu",
  "fukuoka/koga",
  "fukuoka/fukutsu",
  "fukuoka/ukiha",
  "fukuoka/miyawaka",
  "fukuoka/yoshimiasa",
  "fukuoka/asakura",
  "fukuoka/miyama",
  "fukuoka/itoshima",
  "fukuoka/nakagawa",
  "saga/saga",
  "saga/karatsu",
  "saga/tosu",
  "saga/taku",
  "saga/imari",
  "saga/takeo",
  "saga/kashima",
  "saga/ogi",
  "saga/ureshino",
  "saga/kanzaki",
  "nagasaki/nagasaki",
  "nagasaki/sasebo",
  "nagasaki/shimabara",
  "nagasaki/haya",
  "nagasaki/omura",
  "nagasaki/hirado",
  "nagasaki/matsuura",
  "nagasaki/tsushima",
  "nagasaki/iki",
  "nagasaki/goshima",
  "nagasaki/nishiumi",
  "nagasaki/unzen",
  "nagasaki/minamishimabara",
  "kumamoto/kumamoto",
  "kumamoto/hachidai",
  "kumamoto/hitoyoshi",
  "kumamoto/arao",
  "kumamoto/minamata",
  "kumamoto/tamana",
  "kumamoto/yamaga",
  "kumamoto/kikuchi",
  "kumamoto/uto",
  "kumamoto/jotenkusa",
  "kumamoto/jo",
  "kumamoto/aso",
  "kumamoto/tengusa",
  "kumamoto/koshi",
  "oita/oita",
  "oita/beppu",
  "oita/nakatsu",
  "oita/hita",
  "oita/saeki",
  "oita/usuki",
  "oita/tsukumi",
  "oita/takeda",
  "oita/bungotakada",
  "oita/kitsuki",
  "oita/usa",
  "oita/bungoono",
  "oita/yu",
  "oita/kunisaki",
  "miyazaki/miyazaki",
  "miyazaki/nobeoka",
  "miyazaki/nichinan",
  "miyazaki/kobayashi",
  "miyazaki/hinata",
  "miyazaki/kushima",
  "miyazaki/saito",
  "miyazaki/ebino",
  "miyazaki/miyakonojo",
  "miyazaki/mimata",
  "miyazaki/kogen",
  "miyazaki/kokufu",
  "miyazaki/aya",
  "miyazaki/takanabe",
  "miyazaki/shintomi",
  "miyazaki/nishimera",
  "miyazaki/kijo",
  "miyazaki/kawaminami",
  "miyazaki/tsuno",
  "miyazaki/kadogawa",
  "miyazaki/morotsuka",
  "miyazaki/shiiba",
  "miyazaki/misato",
  "miyazaki/takachiho",
  "miyazaki/hinokage",
  "miyazaki/gokase",
  "kagoshima/kagoshima",
  "kagoshima/kanoya",
  "kagoshima/makurazaki",
  "kagoshima/akune",
  "kagoshima/shussui",
  "kagoshima/ibusuki",
  "kagoshima/nishinoomote",
  "kagoshima/tarumi",
  "kagoshima/satsumasendai",
  "kagoshima/hioki",
  "kagoshima/soo",
  "kagoshima/kirishima",
  "kagoshima/ichikikushikino",
  "kagoshima/minamisatsuma",
  "kagoshima/shibushi",
  "kagoshima/amami",
  "kagoshima/minamikyushu",
  "kagoshima/isa",
  "kagoshima/aira",
  "okinawa/naha",
  "okinawa/ginowan",
  "okinawa/ishigaki",
  "okinawa/urazoe",
  "okinawa/nago",
  "okinawa/itoman",
  "okinawa/okinawa",
  "okinawa/tomigusuku",
  "okinawa/uruma",
  "okinawa/miyakojima",
  "okinawa/nanjo",
];

const CLEANUP_EXTRA_CITIES = new Set(CLEANUP_EXTRA_CITY_KEYS);

function buildCleanupExtraFaqJsonLd(cityName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `遠方から${cityName}の実家を片付けるにはどうすればよいですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "遠方にお住まいの方でも、オンラインで見積もり・相談に対応している業者に依頼することができます。現地への立ち会いが難しい場合は、鍵の受け渡し方法や作業報告の方法を事前に確認しておきましょう。",
        },
      },
      {
        "@type": "Question",
        name: `${cityName}での遺品整理の費用はどのくらいですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "部屋数・荷物の量・作業内容によって大きく異なります。1LDKの場合は5万円〜15万円程度、3LDK以上になると30万円を超えることもあります。まずは複数業者に無料見積もりを依頼し、比較することをおすすめします。",
        },
      },
      {
        "@type": "Question",
        name: "遺品整理と実家じまいは同じ業者に頼めますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "遺品整理から不用品処分、清掃まで一括で対応している業者があります。ただし、解体工事や不動産売却には別の専門業者が必要になります。まずはそれぞれに見積もりを依頼することをおすすめします。",
        },
      },
    ],
  };
}

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return getSampleCityPaths().map(({ prefId, cityId }) => ({
    prefecture: prefId,
    city: cityId,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  if (!area) {
    return {
      title: pageTitle("遺品整理・片付け相場"),
      alternates: { canonical: getCanonicalUrl(`/area/${prefecture}/${city}/cleanup`) },
      // INSTRUCTION-010: noindex で検索結果から除外（フォールバック分岐: !area）
      robots: cleanupRobotsNoindex,
    };
  }
  const canonical = getCanonicalUrl(`/area/${prefecture}/${city}/cleanup`);
  const titlePart = buildCleanupSeoTitlePart(data.cityName);
  return {
    title: pageTitle(titlePart),
    description: buildCleanupSeoDescription(data.cityName),
    alternates: { canonical },
    // INSTRUCTION-010: noindex で検索結果から除外（通常分岐）
    robots: cleanupRobotsNoindex,
  };
}

export default async function AreaCleanupPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  // if (!area) notFound();
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const ids = area ? getAreaIds(area.prefecture, area.city)! : { prefectureId: prefecture, cityId: city };

  if (data._isDefault || !area) {
    return (
      <div className="space-y-8">
        <AreaBreadcrumbs prefecture={data.prefName} city={data.cityName} prefectureId={data.prefId} cityId={data.cityId} page="cleanup" />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {data.cityName}の空き家補助金・遺品整理の公式窓口（2026年最新）
          </h1>
        </div>
        <AreaDirectoryFallback
          cityName={data.cityName}
          prefName={data.prefName}
          prefId={data.prefId}
          cityId={data.cityId}
          faqItems={[]}
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
            ← 地域一覧（全国）へ
          </Link>
          <Link href={`/area/${data.prefId}/${data.cityId}`} className="inline-block text-primary font-medium hover:underline">
            ← {data.cityName}の粗大ゴミ・遺品整理ページへ
          </Link>
        </div>
        <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
          <p className="font-medium text-foreground/80 mb-1">監修</p>
          <p>整理収納・遺品整理に関する記載は整理収納アドバイザーの監修を受けております。</p>
        </footer>
      </div>
    );
  }

  const cleanupText = area.cleanupPriceNote || `${area.city}では、遺品整理・実家の片付けは、部屋数・荷物量・立地により相場が異なります。1Kで十数万円〜、2LDKで20〜40万円程度、3LDK以上で40万円〜が目安となることが多いです。複数社の無料見積もりで比較することをおすすめします。`;

  const showExtraSection = CLEANUP_EXTRA_CITIES.has(`${prefecture}/${city}`);

  return (
    <div className="space-y-8">
      {showExtraSection ? <JsonLd data={buildCleanupExtraFaqJsonLd(area.city)} /> : null}
      <AreaBreadcrumbs prefecture={area.prefecture} city={area.city} prefectureId={ids.prefectureId} cityId={ids.cityId} page="cleanup" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {area.city}（{area.prefecture}）の遺品整理・片付け相場
        </h1>
        <p className="text-foreground/60 mt-1">
          1K〜4LDKの目安と、実家の片付け業者選びのポイントです。
        </p>
      </div>

      <AreaOwlBlock cityName={area.city} />

      <section className="bg-amber-50/80 rounded-2xl border border-amber-200/60 p-5">
        <h2 className="text-sm font-bold text-amber-900/90 mb-2">
          {area.city}（{area.prefecture}）の生前整理コラム
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {getAreaSeizenseiriColumn(area.prefecture, area.city)}
        </p>
      </section>

      <MascotAdviceBlock localRiskText={data.mascot?.localRiskText} cityName={area.city} />
      <LocalConsultationCard
        cityName={area.city}
        prefName={data.prefName}
        localRiskText={data.mascot?.localRiskText ?? ""}
      />

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">遺品整理・実家片付けの相場目安</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/70 leading-relaxed">{cleanupText}</p>
          <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
            <li>1K：十数万円〜</li>
            <li>2LDK：20〜40万円程度の目安</li>
            <li>3LDK〜4LDK：40万円〜（荷物量で変動）</li>
          </ul>
          <p className="text-xs text-foreground/50">
            業者・作業内容により異なります。必ず無料見積もりでご確認ください。
          </p>
        </div>
      </div>

      <CleanupAffiliateCard cityName={area.city} cityId={ids.cityId} />

      <RealEstateAppraisalCard
        cityName={area.city}
        cityId={ids.cityId}
        localRiskText={data.mascot?.localRiskText}
      />

      {/* PLG導線: 荷物量で費用シミュレーション */}
      <div className="bg-primary rounded-2xl p-6 text-white text-center">
        <p className="font-bold mb-2">
          {area.city}の平均より高い？安い？実家の荷物量で片付け費用をシミュレーション
        </p>
        <p className="text-sm text-white/80 mb-4">
          チェックリストで「やること」を把握し、見積もり依頼の準備をしましょう。
        </p>
        <Link
          href="/checklist"
          className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition mr-2"
        >
          生前整理チェックリストを見る
        </Link>
        <Link
          href="/articles/master-guide"
          className="inline-block bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition"
        >
          無料で見積もりを依頼する
        </Link>
      </div>

      <NearbySubsidyLinks
        cityName={area.city}
        prefId={ids.prefectureId}
        neighbours={getMunicipalitiesByPrefecture(ids.prefectureId)
          .filter((m) => m.cityId !== ids.cityId)
          .slice(0, 6)
          .map((m) => ({ cityId: m.cityId, cityName: m.cityName }))}
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link href={`/area/${ids.prefectureId}/${ids.cityId}`} className="inline-block text-primary font-medium hover:underline">
          ← {area.city}の粗大ゴミ・遺品整理ページへ
        </Link>
      </div>

      {showExtraSection ? (
        <>
          <section className="jikka-steps">
            <h2>{area.city}で実家じまいをするときの流れ</h2>
            <p>
              {area.city}で実家じまいに取り組む方のために、一般的な流れをご説明します。
              状況によって順序が変わる場合がありますが、まずは全体像を把握することが大切です。
            </p>

            <h3>ステップ1：現状の把握</h3>
            <p>
              実家の荷物の量、建物の状態（築年数・雨漏りなど）、
              相続登記の状況を確認します。
              遠方にお住まいの方は、帰省のタイミングで写真を撮っておくと業者への説明がスムーズです。
            </p>

            <h3>ステップ2：処分方法の検討</h3>
            <p>
              荷物の整理（遺品整理）を先に行うか、建物ごと売却するかを検討します。
              {area.city}では空き家の解体補助金が利用できる場合があります。
              まずは補助金の有無を確認してから業者選びをすると費用を抑えられます。
            </p>

            <h3>ステップ3：業者の選定と見積もり</h3>
            <p>
              遺品整理・解体・不動産売却それぞれの専門業者に相談します。
              複数社から見積もりを取り、内容と金額を比較することをおすすめします。
              オンラインで対応している業者も多いため、遠方にお住まいでも相談できます。
            </p>

            <h3>ステップ4：作業の実施</h3>
            <p>
              業者が決まったら、日程を調整して作業を進めます。
              立ち会いが難しい場合は、写真や動画での報告に対応している業者を選ぶと安心です。
            </p>
          </section>

          <section className="faq-section">
            <h2>{area.city}の遺品整理・実家じまいに関するよくある質問</h2>

            <div className="faq-item">
              <h3>Q. 遠方から{area.city}の実家を片付けるにはどうすればよいですか？</h3>
              <p>
                A. 遠方にお住まいの方でも、オンラインで見積もり・相談に対応している業者に依頼することができます。
                現地への立ち会いが難しい場合は、鍵の受け渡し方法や作業報告の方法を事前に確認しておきましょう。
              </p>
            </div>

            <div className="faq-item">
              <h3>Q. 遺品整理と実家じまいは同じ業者に頼めますか？</h3>
              <p>
                A. 遺品整理から不用品処分、清掃まで一括で対応している業者があります。
                ただし、解体工事や不動産売却には別の専門業者が必要になります。
                まずはそれぞれに見積もりを依頼することをおすすめします。
              </p>
            </div>

            <div className="faq-item">
              <h3>Q. {area.city}での遺品整理の費用はどのくらいですか？</h3>
              <p>
                A. 部屋数・荷物の量・作業内容によって大きく異なります。
                1LDKの場合は5万円〜15万円程度、3LDK以上になると30万円を超えることもあります。
                まずは複数業者に無料見積もりを依頼し、比較することをおすすめします。
              </p>
            </div>

            <div className="faq-item">
              <h3>Q. 親が存命中でも遺品整理・実家じまいの準備はできますか？</h3>
              <p>
                A. できます。「生前整理」として親本人と一緒に進める方法があります。
                本人の意思を確認しながら不要なものを整理することで、後の負担を大きく減らせます。
              </p>
            </div>
          </section>
        </>
      ) : null}

      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>
          整理収納・遺品整理に関する記載は整理収納アドバイザーの監修を受けております。
        </p>
      </footer>
    </div>
  );
}
