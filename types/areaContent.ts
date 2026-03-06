export interface LocalFacility {
  name: string;
  address: string;
  phone?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AreaContentData {
  cityName: string;
  empatheticLead: string;
  localDisposalRules: string[];
  facilities: LocalFacility[];
  marketPriceText: string;
  faqs: FAQ[];
  advisoryNote: string;
}
