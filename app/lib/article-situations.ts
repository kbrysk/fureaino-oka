/**
 * 記事一覧ページの「シナリオベース・エントリー」定義
 *
 * 目的：ユーザーのジャーニー段階（時間軸）に対応する5つのシナリオで、
 * 自分の現在地から関連記事に最短アクセスできる入口を作る。
 *
 * ペルソナ：50-70代の実家じまい・終活ユーザー
 * 設計思想：「いま自分はどの状況？」を聞いて、その状況に最適化された
 *           記事キュレーションへ誘導する（SUUMO・たまひよ手法の応用）。
 */

export interface ArticleSituation {
  slug: string;
  /** 短いラベル（カード見出し） */
  shortLabel: string;
  /** 共感を呼ぶ問いかけ文 */
  emotionalHook: string;
  /** SEO/H1用の正式タイトル */
  fullTitle: string;
  /** リード文（200字程度）：状況への共感＋このページで何が分かるか */
  leadText: string;
  /** 関連カテゴリ（slug配列） */
  relatedCategories: string[];
  /** 関連タグ（slug配列） */
  relatedTags: string[];
  /** このシナリオで読むべき記事のmicroCMS contentId配列（厳選） */
  curatedArticleIds: string[];
  /** ステージカラー（薄いアクセント） */
  accentColor: "amber" | "sage" | "rose" | "sky" | "stone";
  /** カードに表示する絵文字 or アイコン名 */
  iconEmoji: string;
}

export const ARTICLE_SITUATIONS: ArticleSituation[] = [
  {
    slug: "before-care",
    shortLabel: "親が元気なうちに準備したい",
    emotionalHook: "今のうちに話し合っておきたい",
    fullTitle: "親が元気なうちに準備する｜生前整理・対話・財産把握ガイド",
    leadText:
      "「まだ元気だから先のこと」と思いつつも、いつかは向き合う実家のこと。親が元気な今こそ、対話を始める最良のタイミングです。生前整理アドバイザー協会の5メソッドを使った無理のない切り出し方、家族会議の進め方、財産の把握、エンディングノートの書き方まで——「より良く生きる」ための準備をやさしくお伝えします。",
    relatedCategories: ["guide", "mental", "cleanup"],
    relatedTags: ["parent-stubborn", "family-conflict", "hajimete"],
    curatedArticleIds: [
      "oya-no-shukatsu",                  // 親に切り出すには
      "seizenseiri-hub",                  // 生前整理とは
      "ending-note-towa",                 // エンディングノートとは
      "oya-zaisan-haaku-houhou",          // 親の財産把握
      "oyakoko-imadekiru-koto",           // 親孝行で今できること
      "kakeizu-tsukurikata",              // 家系図の作り方
      "shukatsu-itsukara",                // 終活はいつから
    ],
    accentColor: "sage",
    iconEmoji: "🌱",
  },
  {
    slug: "during-care",
    shortLabel: "親の介護が始まった／始まりそう",
    emotionalHook: "介護と仕事、両立できるか不安",
    fullTitle: "親の介護フェーズ｜制度活用・施設選び・離職予防ガイド",
    leadText:
      "親の介護が現実になってきた40〜60代の方へ。介護休業93日・3分割制度の使い方、地域包括支援センターの活用、介護施設8タイプの選び方、認知症の親の預金問題まで。「介護で人生が終わった」と感じないために、仕事と介護を両立する制度と備えを整理しました。介護離職を防ぎたい方に最適な入口です。",
    relatedCategories: ["mental", "inheritance"],
    relatedTags: ["no-time", "parent-stubborn", "family-conflict"],
    curatedArticleIds: [
      "oya-no-kaigo",                     // 親の介護に直面したあなたへ
      "kaigo-rishoku-fusegu",             // 介護離職を防ぐ
      "kaigo-hoken-shinsei-nagare",       // 介護保険申請
      "kaigo-hiyou-soba",                 // 介護費用月額相場
      "kaigo-shisetsu-shurui-erabikata",  // 介護施設の種類と選び方
      "ninchisho-yokin-hikidashi",        // 認知症の親の預金
      "oya-ninchisho-kaigo-junbi",        // 親が認知症かも
    ],
    accentColor: "amber",
    iconEmoji: "🤝",
  },
  {
    slug: "after-death",
    shortLabel: "親が亡くなった直後の手続き",
    emotionalHook: "何から手をつけたらいいかわからない",
    fullTitle: "親が亡くなった後｜手続き・相続・期限の優先順位ガイド",
    leadText:
      "突然の出来事に直面した遺族の方へ。今日・明日・今週・今月の優先順位、死亡届から相続手続きまでの全ステップ、銀行口座の凍結解除、相続放棄3か月期限、準確定申告4か月期限など、漏れやすい期限を時系列でまとめました。悲しみの中で迷子にならないために、まず読んでいただきたい入口です。",
    relatedCategories: ["inheritance", "guide"],
    relatedTags: ["inheritance-deadline", "hajimete", "no-time"],
    curatedArticleIds: [
      "oya-nakunattara-tetsuzuki-junban", // 親が亡くなったら
      "ginko-koza-tousai-kaijo",          // 銀行口座凍結
      "shigo-tetsuzuki-checklist",        // 死後手続きチェックリスト
      "oya-tsucho-sagashikata",           // 通帳・印鑑探し方
      "souzoku-houki-3kagetsu",           // 相続放棄3か月
      "junkakutei-shinkoku-yarikata",     // 準確定申告
      "shibo-hokenkin-seikyu",            // 死亡保険金請求
      "souzokuzei-kiso-koujo",            // 相続税基礎控除
    ],
    accentColor: "rose",
    iconEmoji: "🕊️",
  },
  {
    slug: "jikka-cleanup",
    shortLabel: "実家を片付ける段階",
    emotionalHook: "膨大なモノをどうしたらいいか",
    fullTitle: "実家の片付け・処分｜業者選び・費用・遺品整理の完全ガイド",
    leadText:
      "親の家を片付け始めた、または始めたい方へ。生前整理アドバイザー協会の4分類シート・思い入れ箱・ベストショットアルバムを使った、捨てない整理のメソッド。業者依頼の費用相場、悪質業者の見抜き方、不用品回収・買取・お焚き上げの選び方まで。「捨てる」ではなく「手放す」整理を実現する入口です。",
    relatedCategories: ["cleanup", "real-estate"],
    relatedTags: ["save-money", "guilt-cannot-throw", "no-time"],
    curatedArticleIds: [
      "ihin-seiri",                       // 遺品整理とは
      "ihin-seiri-jibun-de",              // 遺品整理を自分でやる
      "ihin-hiyou-soba",                  // 遺品整理費用相場
      "ihin-seiri-gyosha",                // 遺品整理業者の選び方
      "jikka-katazuke-gyosha-erabikata",  // 実家片付け業者選び方
      "fuyohin-kaishu",                   // 不用品回収業者選び方
      "sodai-gomi",                       // 粗大ごみ
      "otakiage-service",                 // お焚き上げ
      "ihin-kaitori-gyosha",              // 遺品買取
      "kimono-kaitori",                   // 着物の買取
      "furugi-shobun",                    // 古着の手放し方
    ],
    accentColor: "stone",
    iconEmoji: "🏡",
  },
  {
    slug: "my-shukatsu",
    shortLabel: "自分の終活を進めたい",
    emotionalHook: "家族に迷惑をかけたくない",
    fullTitle: "自分の終活｜エンディングノート・遺言書・お墓まで完全ガイド",
    leadText:
      "「子どもに迷惑をかけたくない」「自分の人生を整えたい」と思い始めた方へ。エンディングノートの書き方、遺言書の作成、家族信託・任意後見・死後事務委任契約の4制度ロードマップ、お墓・葬儀の選び方まで。終活アドバイザー資格の解説も含め、今日から始められる第一歩をお届けします。おひとりさまにも最適です。",
    relatedCategories: ["shukatsu", "inheritance", "mental"],
    relatedTags: ["hajimete", "long-distance", "save-money"],
    curatedArticleIds: [
      "ending-note-towa",                 // エンディングノートとは
      "yuigonsho-kakikata-kihon",         // 遺言書の書き方
      "ohitorisama-shukatsu",             // おひとりさま終活
      "shigo-jimu-inin-keiyaku",          // 死後事務委任契約
      "nini-koken-keiyaku-toha",          // 任意後見契約
      "kazoku-shintaku-kihon",            // 家族信託
      "shukatsu-seminar-erabikata",       // 終活セミナー
      "shumatsuki-iryo-ishihyoji",        // 終末期医療
      "sogi-hiyou-heikin",                // 葬儀費用平均
      "kazoku-sou-nagare",                // 家族葬の流れ
      "hakajimai-nagare",                 // 墓じまい
      "eitai-kuyou-shurui-hiyou",         // 永代供養
    ],
    accentColor: "sky",
    iconEmoji: "✏️",
  },
];

/** slug から状況を取得 */
export function getSituation(slug: string): ArticleSituation | undefined {
  return ARTICLE_SITUATIONS.find((s) => s.slug === slug);
}

/** アクセントカラーから Tailwind クラスへの変換 */
export const SITUATION_ACCENT_CLASSES: Record<
  ArticleSituation["accentColor"],
  { bg: string; ring: string; text: string; cardBg: string }
> = {
  amber: {
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    text: "text-amber-800",
    cardBg: "bg-gradient-to-br from-amber-50 to-orange-50",
  },
  sage: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    text: "text-emerald-800",
    cardBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
  },
  rose: {
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    text: "text-rose-800",
    cardBg: "bg-gradient-to-br from-rose-50 to-pink-50",
  },
  sky: {
    bg: "bg-sky-50",
    ring: "ring-sky-200",
    text: "text-sky-800",
    cardBg: "bg-gradient-to-br from-sky-50 to-blue-50",
  },
  stone: {
    bg: "bg-stone-50",
    ring: "ring-stone-200",
    text: "text-stone-800",
    cardBg: "bg-gradient-to-br from-stone-50 to-amber-50/30",
  },
};
