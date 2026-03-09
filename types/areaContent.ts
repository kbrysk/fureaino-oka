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
}
