export interface LocalFacility {
  name: string;
  address: string;
  phone?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SubsidyInfo {
  name: string;
  maxAmount: string;
  condition: string;
  contact: string;
}

/**
 * 補助金ページ用の地域固有「読み物」セクション（任意）。
 * Striking Distance 22 ページ強化計画（docs/AREA_SUBSIDY_STRIKING_DISTANCE_22.md）で導入。
 * 全フィールド任意。データが入った市区町村のみ表示される。
 */
export interface SubsidyContext {
  /** 当該市の解体補助金が他市と比べて高い/低い理由（300字目安） */
  comparison?: string;
  /** 当該市特有の空き家事情：人口減・移住・歴史・気候など（300字目安） */
  localContext?: string;
  /** 申請の落とし穴：年度切替・先着順・自己負担割合の誤解など（250字目安） */
  pitfalls?: string;
  /** 当該市の解体業者数・坪単価相場の目安（150字目安・「目安」と明記） */
  localBusinessCount?: string;
  /** 出典URL（公的機関を推奨。任意） */
  sourceUrl?: string;
  /** 情報更新日（YYYY-MM-DD。任意） */
  updatedAt?: string;
}

export interface AreaContentData {
  cityName: string;
  empatheticLead: string;
  localDisposalRules: string[];
  facilities: LocalFacility[];
  marketPriceText: string;
  faqs: FAQ[];
  advisoryNote: string;
  /** 解体補助金・空き家助成金（任意） */
  subsidyInfo?: SubsidyInfo;
  /** 解体補助金ページ用の地域固有テキスト（任意・条件付き表示） */
  subsidyContext?: SubsidyContext;
}
