/**
 * コラム（記事）のタグ定義（横軸＝状況・悩み）
 * PDF改善提案: 状況別タグでタグまとめページをLP化。記事に複数タグ付与可。
 */

export interface ArticleTag {
  slug: string;
  /** 表示用（タグボタン・H1用） */
  name: string;
  /** タグまとめページのH1用タイトル（例: 遠方に住む方のための実家じまいガイド） */
  title: string;
  /** リード文（300字程度。SEO・キュレーション評価用） */
  leadText: string;
  /** このタグのまとめページに表示するCTA用ツール（診断・シミュレーター） */
  toolHref: string | null;
  toolLabel: string | null;
  /** ボタン用短いラベル（任意） */
  shortLabel?: string;
}

export const ARTICLE_TAGS: ArticleTag[] = [
  {
    slug: "long-distance",
    name: "遠距離・帰省できない",
    title: "遠方に住む方のための実家じまいガイド",
    leadText:
      "実家が飛行機や新幹線の距離にあり、帰省する時間が取れない…とお悩みの方へ。立ち会い不要の業者選びやWeb見積もりのコツ、遠隔で進める手順をまとめました。プロに任せる判断基準と、ご自身でできる範囲を整理して、無理のない実家じまいを。",
    toolHref: "/tools/jikka-diagnosis",
    toolLabel: "実家じまい力診断（無料）",
    shortLabel: "実家が遠い・帰れない",
  },
  {
    slug: "save-money",
    name: "お金がない・費用を抑えたい",
    title: "費用を抑えて実家じまいしたい方のガイド",
    leadText:
      "親の貯蓄が少ない、自分の持ち出しを抑えたい…と感じている方へ。補助金制度の調べ方、相見積もりのコツ、自分でできる範囲と業者に頼む範囲の線引きをまとめました。無理のない予算で、次の一歩を決める参考にしてください。",
    toolHref: "/cost",
    toolLabel: "間取り別 費用相場を確認する",
    shortLabel: "とにかく安く済ませたい",
  },
  {
    slug: "no-time",
    name: "時間がない・週末しかできない",
    title: "忙しい方のための実家じまい・効率的進め方",
    leadText:
      "現役で働いており、まとまった休みが取りづらい方へ。週末だけの弾丸帰省で進めるスケジュールの立て方や、効率的な仕分け手順、業者に任せるタイミングをまとめました。限られた時間でできることから始められます。",
    toolHref: "/tools/jikka-diagnosis",
    toolLabel: "実家じまい力診断（無料）",
    shortLabel: "時間がない",
  },
  {
    slug: "parent-stubborn",
    name: "親が頑固・説得できない",
    title: "親を説得したい方のための実家じまいガイド",
    leadText:
      "「まだ早い」「もったいない」と親に片付けを拒まれて困っている方へ。怒らせない切り出し方や、親の心理に寄り添う会話のコツ、進捗を共有する方法をまとめました。こじらせずに、一歩ずつ進めるヒントがあります。",
    toolHref: "/guide",
    toolLabel: "実家じまいの進め方 全手順",
    shortLabel: "親と喧嘩している",
  },
  {
    slug: "family-conflict",
    name: "兄弟・親族トラブル",
    title: "兄弟・親族で揉めないための実家じまい・相続ガイド",
    leadText:
      "遺産分割や片付けの役割分担で、兄弟・親族ともめている、もめそうで不安な方へ。法定相続分の考え方、家族会議の進め方、負担の公平な分け方をまとめました。数字で見える化すると話し合いがスムーズになることがあります。",
    toolHref: "/tools/inheritance-share",
    toolLabel: "法定相続分シミュレーター",
    shortLabel: "兄弟・親族トラブル",
  },
  {
    slug: "gomi-yashiki",
    name: "ゴミ屋敷・足の踏み場がない",
    title: "ゴミ屋敷・足の踏み場がない場合の片付けガイド",
    leadText:
      "実家がゴミや不用品で足の踏み場がない状態で、どこから手を付ければいいかわからない方へ。特殊清掃の依頼の流れ、近所に知られずに進めるポイント、業者選びの注意点をまとめました。まずは現状の把握と、信頼できる業者への相談から。",
    toolHref: "/tools/jikka-diagnosis",
    toolLabel: "実家じまい力診断（無料）",
    shortLabel: "ゴミ屋敷",
  },
  {
    slug: "akiya-long",
    name: "空き家・放置期間が長い",
    title: "空き家・放置が長い方のためのリスクと対策ガイド",
    leadText:
      "すでに誰も住んでいない実家があり、固定資産税や劣化が気になっている方へ。空き家の維持費の目安、特定空き家のリスク、解体費用の考え方と、売却・活用の選択肢をまとめました。まずは数字で現状を把握することから始められます。",
    toolHref: "/tools/empty-house-tax",
    toolLabel: "空き家税金シミュレーター",
    shortLabel: "空き家が長い",
  },
  {
    slug: "digital-worry",
    name: "デジタル遺品・パスワード不明",
    title: "デジタル遺品・パスワードが心配な方のガイド",
    leadText:
      "親のスマホが開けない、ネット証券やネット銀行の口座がわからない…と不安な方へ。デジタル遺品のリスクの見える化、ロック解除の法的手続き、家族が困らないためのリストの作り方をまとめました。今からできる備えもあります。",
    toolHref: "/tools/digital-shame",
    toolLabel: "デジタル遺品リスク診断",
    shortLabel: "デジタル遺品が心配",
  },
  {
    slug: "inheritance-deadline",
    name: "相続手続き・期限が近い",
    title: "相続手続き・期限が気になる方のガイド",
    leadText:
      "相続発生後、やるべき手続きと期限が多くて戸惑っている方へ。期限一覧と優先順位、銀行口座の凍結解除、届出の流れをまとめました。期限に間に合わせるためのチェックリストで、漏れを防ぎましょう。",
    toolHref: "/tools/inheritance-share",
    toolLabel: "法定相続分シミュレーター",
    shortLabel: "相続・期限が近い",
  },
  {
    slug: "guilt-cannot-throw",
    name: "罪悪感・捨てられない",
    title: "罪悪感があって捨てられない方のためのガイド",
    leadText:
      "親の思い出の品をゴミ袋に入れることに抵抗がある方へ。供養サービスや寄付・リサイクルの選択肢、写真に残してから手放す方法、心を整える考え方をまとめました。「捨てる」以外の道もたくさんあります。",
    toolHref: "/dispose",
    toolLabel: "捨て方辞典（品目別）",
    shortLabel: "罪悪感・捨てられない",
  },
];

const TAG_BY_SLUG = new Map(ARTICLE_TAGS.map((t) => [t.slug, t]));

export function getArticleTagBySlug(slug: string): ArticleTag | undefined {
  return TAG_BY_SLUG.get(slug);
}

export function getArticleTagSlugs(): string[] {
  return ARTICLE_TAGS.map((t) => t.slug);
}
