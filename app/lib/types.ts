export interface CheckItem {
  id: string;
  category: string;
  label: string;
  checked: boolean;
}

// --- Asset (構造化データ) ---

export type DispositionIntent =
  | "保有（現状維持）"
  | "使い切る"
  | "譲りたい（形見分け）"
  | "売却を検討中"
  | "処分に困っている"
  | "迷っている（保留）"
  | "処分済";

export interface RealEstateDetail {
  type: "戸建て" | "マンション" | "土地" | "その他";
  builtYear: string;
  location: string;
  isVacant: boolean;
}

/** 機密PIIは保存しない。保管場所（メモ）と概算金額のみ。 */
export interface Asset {
  id: string;
  category: string;
  name: string;
  memo: string;
  /** 保管場所（メモ）。口座番号・パスワード・PIN等は絶対に保存しない。 */
  storageLocation?: string;
  status: "保有" | "処分予定" | "譲渡予定" | "処分済"; // legacy compat
  estimatedAmount: number | null;
  wantsAppraisal: boolean;
  dispositionIntent: DispositionIntent;
  transferTo: string;
  realEstate?: RealEstateDetail;
  shareWithFamily: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Ending Note ---

/** 葬儀の形式（パンフレット取り寄せの選択肢） */
export const FUNERAL_TYPE_OPTIONS = [
  "家族葬",
  "樹木葬",
  "一般葬",
  "直葬",
  "無宗教葬",
  "海洋葬",
  "その他",
] as const;

export interface EndingNote {
  message: string;
  medicalWishes: string;
  funeralWishes: string;
  /** 葬儀の形式（パンフレット取り寄せ用） */
  funeralType?: string;
  /** パンフレット取り寄せ希望フラグ（保存時にリード送信） */
  funeralBrochureRequested?: boolean;
  contacts: Contact[];
  importantDocs: string;
  concernTags: string[];
  shareFlags: {
    message: boolean;
    medicalWishes: boolean;
    funeralWishes: boolean;
    importantDocs: boolean;
  };
}

export interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  note: string;
}

// --- Anonymous Consultation ---

export interface Consultation {
  id: string;
  category: string;
  question: string;
  createdAt: string;
}

// --- Family Sharing (Dead Man's Switch) ---

export interface FamilyShare {
  email: string;
  name: string;
  enabled: boolean;
}

export interface DeadManSwitchSettings {
  enabled: boolean;
  inactiveDays: number;
  preNotifyDays: number;
  notifyMethod: "email" | "both";
  phone: string;
}

// --- Family Members (形見分け先マスタ) ---

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
}

// --- User Profile (相続税計算用) ---

export interface UserProfile {
  legalHeirs: number; // 法定相続人数
  familyMembers: FamilyMember[];
}

// --- Reminder Settings ---

export interface ReminderSettings {
  enabled: boolean;
  frequency: "monthly" | "quarterly" | "yearly";
  birthdayMonth: string;
  lastReviewDate: string;
}

// --- Concern Tags ---

export const CONCERN_TAGS = [
  "相続税が心配",
  "荷物が多すぎて片付かない",
  "デジタル遺品が不安",
  "空き家の管理に困っている",
  "不動産の売却を考えている",
  "遺言書の書き方がわからない",
  "家族と話し合えていない",
  "貴重品の価値がわからない",
  "保険の見直しをしたい",
  "葬儀の準備が不安",
] as const;

// --- Contextual CTA definitions ---

export interface ContextualCTA {
  trigger: {
    category?: string;
    intent?: DispositionIntent;
    tag?: string;
    realEstateVacant?: boolean;
    crossTagCategory?: { tag: string; category: string };
  };
  headline: string;
  description: string;
  ctaLabel: string;
  partnerLabel?: string;
}

export const CONTEXTUAL_CTAS: ContextualCTA[] = [
  // Cross-analysis CTAs (悩み×資産)
  {
    trigger: { crossTagCategory: { tag: "空き家の管理に困っている", category: "不動産" } },
    headline: "お持ちの不動産、売却・活用で収益化できる可能性があります",
    description: "空き家の想定収益シミュレーション（賃貸・売却・管理委託）を無料でお出しします。固定資産税の負担軽減にも。",
    ctaLabel: "収益シミュレーションを見る",
    partnerLabel: "提携：不動産コンサルティング",
  },
  {
    trigger: { crossTagCategory: { tag: "不動産の売却を考えている", category: "不動産" } },
    headline: "不動産売却、最適なタイミングと方法をご提案",
    description: "複数の不動産会社による一括査定で、最高値での売却をサポートします。",
    ctaLabel: "無料一括査定を依頼",
    partnerLabel: "提携：不動産一括査定サービス",
  },
  {
    trigger: { crossTagCategory: { tag: "相続税が心配", category: "不動産" } },
    headline: "不動産の相続税対策、早めの準備が鍵です",
    description: "お持ちの不動産の評価額から、相続税の概算をシミュレーションできます。",
    ctaLabel: "相続税シミュレーション",
    partnerLabel: "提携：相続専門税理士法人",
  },
  {
    trigger: { crossTagCategory: { tag: "貴重品の価値がわからない", category: "貴金属・美術品" } },
    headline: "お手持ちの貴重品、専門鑑定士が無料で査定します",
    description: "正確な市場価値を知ることで、相続の分配計画や保険の見直しに役立ちます。",
    ctaLabel: "無料鑑定を依頼する",
    partnerLabel: "提携：美術品鑑定協会",
  },
  // Category CTAs
  {
    trigger: { category: "貴金属・美術品" },
    headline: "このお品の現在の価値を知りたくありませんか？",
    description: "貴金属・美術品の無料査定で、正確な資産価値を把握できます。",
    ctaLabel: "無料査定を依頼する",
    partnerLabel: "提携：買取専門業者",
  },
  {
    trigger: { category: "衣類" },
    headline: "着物や高級衣類は思わぬ価値があることも",
    description: "専門の買取業者による無料査定で、適正な価値を確認できます。",
    ctaLabel: "無料で査定を相談する",
    partnerLabel: "提携：着物買取専門",
  },
  {
    trigger: { category: "不動産", realEstateVacant: true },
    headline: "空き家の維持、負担になっていませんか？",
    description: "固定資産税の節税シミュレーションや空き家管理サービスをご案内します。",
    ctaLabel: "空き家の無料相談をする",
    partnerLabel: "提携：空き家管理サービス",
  },
  {
    trigger: { category: "不動産" },
    headline: "不動産の今の価値をご存知ですか？",
    description: "無料の不動産査定で、相続・売却の判断材料を得られます。",
    ctaLabel: "無料査定を依頼する",
    partnerLabel: "提携：不動産一括査定",
  },
  // Intent CTAs
  {
    trigger: { intent: "売却を検討中" },
    headline: "売却をお考えなら、まずは無料査定から",
    description: "複数の専門業者から見積もりを取ることで、適正価格がわかります。",
    ctaLabel: "無料一括査定を依頼",
  },
  {
    trigger: { intent: "処分に困っている" },
    headline: "処分にお困りですか？専門家に相談できます",
    description: "遺品整理・不用品回収の専門業者に匿名で相談できます。",
    ctaLabel: "匿名で相談する",
    partnerLabel: "提携：整理業者",
  },
  // Tag CTAs
  {
    trigger: { tag: "相続税が心配" },
    headline: "相続税、いくらかかるか把握していますか？",
    description: "税理士による無料の相続税シミュレーションで、対策の第一歩を。",
    ctaLabel: "無料シミュレーションを受ける",
    partnerLabel: "提携：相続専門税理士",
  },
  {
    trigger: { tag: "デジタル遺品が不安" },
    headline: "デジタル遺品の整理、プロに任せませんか？",
    description: "パスワード管理やアカウント整理を専門家がサポートします。",
    ctaLabel: "デジタル整理を相談する",
  },
  {
    trigger: { tag: "遺言書の書き方がわからない" },
    headline: "遺言書、正しく書かないと無効になることも",
    description: "司法書士による無料相談で、法的に有効な遺言書を作成しましょう。",
    ctaLabel: "無料相談を予約する",
    partnerLabel: "提携：司法書士事務所",
  },
];

// --- Checklist Defaults ---

export const CHECKLIST_DEFAULTS: Omit<CheckItem, "id" | "checked">[] = [
  { category: "財産・お金", label: "預貯金の一覧を作成する" },
  { category: "財産・お金", label: "不動産の権利証・登記簿を確認する" },
  { category: "財産・お金", label: "株式・投資信託などの金融資産を整理する" },
  { category: "財産・お金", label: "生命保険・損害保険の内容を確認する" },
  { category: "財産・お金", label: "ローン・借入金を確認する" },
  { category: "財産・お金", label: "クレジットカードを整理する" },
  { category: "財産・お金", label: "年金の受給状況を確認する" },
  { category: "持ち物", label: "衣類を整理する" },
  { category: "持ち物", label: "書籍・趣味の品を整理する" },
  { category: "持ち物", label: "家具・家電の処分を検討する" },
  { category: "持ち物", label: "写真・アルバムを整理する" },
  { category: "持ち物", label: "貴重品（宝石・美術品等）をリストアップする" },
  { category: "デジタル", label: "メール・SNSアカウントの一覧を作成する" },
  { category: "デジタル", label: "パスワードを安全に記録する" },
  { category: "デジタル", label: "サブスクリプションサービスを確認する" },
  { category: "デジタル", label: "スマホ・PCのデータを整理する" },
  { category: "書類・手続き", label: "遺言書を作成・更新する" },
  { category: "書類・手続き", label: "エンディングノートを記入する" },
  { category: "書類・手続き", label: "葬儀の希望を書き残す" },
  { category: "書類・手続き", label: "お墓について確認・決定する" },
  { category: "書類・手続き", label: "医療・介護の希望を伝える" },
  { category: "人間関係", label: "家族に伝えたいことを整理する" },
  { category: "人間関係", label: "友人・知人の連絡先リストを作成する" },
  { category: "人間関係", label: "お世話になった人にお礼を伝える" },
];

/**
 * 項目ごとの「解決ボタン（プロに頼む）」＝送客ツール化でCPA収益を最大化
 * 面倒だと思った瞬間にプロに任せる選択肢を提示する
 */
export const CHECKLIST_ITEM_SOLUTION_LINKS: Record<string, { label: string; href: string }> = {
  "衣類を整理する": { label: "着物・古着の出張買取を呼ぶ", href: "/guide" },
  "書籍・趣味の品を整理する": { label: "本・コレクションの買取に出す", href: "/guide" },
  "家具・家電の処分を検討する": { label: "家具・家電の引き取り・処分を依頼する", href: "/guide" },
  "写真・アルバムを整理する": { label: "写真のスキャン・デジタル化を依頼する", href: "/guide" },
  "貴重品（宝石・美術品等）をリストアップする": { label: "鑑定・査定を依頼する", href: "/tools/appraisal" },
  "不動産の権利証・登記簿を確認する": { label: "不動産売却の無料相談をする", href: "/guide" },
  "預貯金の一覧を作成する": { label: "相続・資産整理の相談をする", href: "/guide" },
  "遺言書を作成・更新する": { label: "弁護士に遺言書の相談をする", href: "/guide" },
  "葬儀の希望を書き残す": { label: "葬儀の事前相談をする", href: "/guide" },
  "お墓について確認・決定する": { label: "お墓・永代供養の相談をする", href: "/guide" },
};

/** 各チェック項目の「完了の目安」・ポイント（進捗の精度向上用） */
export const CHECKLIST_ITEM_HINTS: Record<string, string> = {
  "預貯金の一覧を作成する": "金融機関名・口座種別・おおよその残高を一覧にしておく",
  "不動産の権利証・登記簿を確認する": "権利証の保管場所と、登記簿謄本の取得方法を家族が知っている状態にする",
  "株式・投資信託などの金融資産を整理する": "証券口座・銘柄・おおよその評価額をメモする",
  "生命保険・損害保険の内容を確認する": "契約者・被保険者・受取人と、解約返戻金の有無を把握する",
  "ローン・借入金を確認する": "住宅ローン・カーローン等の残高と返済先を一覧化する",
  "クレジットカードを整理する": "保有枚数・利用状況・解約の要否を確認する",
  "年金の受給状況を確認する": "公的年金・企業年金の種類と受給開始年齢を把握する",
  "衣類を整理する": "残す・譲る・処分に分類し、着物・高級品は買取査定を検討する",
  "書籍・趣味の品を整理する": "売却・寄贈・処分の優先順位を決め、必要なら買取業者に相談する",
  "家具・家電の処分を検討する": "リサイクル・買取・廃棄の方法とおおよその費用を調べる",
  "写真・アルバムを整理する": "残すものを選び、デジタル化やスキャン代行を検討する",
  "貴重品（宝石・美術品等）をリストアップする": "品目・保管場所を記録し、鑑定・査定の必要性を判断する",
  "メール・SNSアカウントの一覧を作成する": "サービス名・ID・連絡先の引き継ぎ希望を一覧にする",
  "パスワードを安全に記録する": "パスワードそのものは入力せず「保管場所」だけを記録する",
  "サブスクリプションサービスを確認する": "契約中のサービスと解約方法を一覧化する",
  "スマホ・PCのデータを整理する": "残すデータを選び、バックアップや承継方法を決める",
  "遺言書を作成・更新する": "公正証書・自筆証書の別と、保管場所を家族に伝える",
  "エンディングノートを記入する": "想い・連絡先・医療の希望を書き、共有する人を決める",
  "葬儀の希望を書き残す": "葬儀の形式・会場の希望・連絡してほしい人をメモする",
  "お墓について確認・決定する": "継承・改葬・永代供養の希望を家族と話し合う",
  "医療・介護の希望を伝える": "延命治療・介護の希望を書面や家族会議で伝える",
  "家族に伝えたいことを整理する": "感謝や伝えたいことをメモし、共有のタイミングを考える",
  "友人・知人の連絡先リストを作成する": "名前・関係・連絡先を一覧にし、葬儀案内の参考にする",
  "お世話になった人にお礼を伝える": "伝えたい相手と方法（手紙・会う等）をリストにする",
};

export const ASSET_CATEGORIES = [
  "預貯金",
  "不動産",
  "株式・投資",
  "保険",
  "貴金属・美術品",
  "車・バイク",
  "家具・家電",
  "衣類",
  "書籍・趣味品",
  "デジタル資産",
  "デジタル（ID/PASS）",
  "その他",
] as const;

export const DISPOSITION_INTENTS: DispositionIntent[] = [
  "保有（現状維持）",
  "使い切る",
  "譲りたい（形見分け）",
  "売却を検討中",
  "処分に困っている",
  "迷っている（保留）",
  "処分済",
];

export const REAL_ESTATE_TYPES = ["戸建て", "マンション", "土地", "その他"] as const;
