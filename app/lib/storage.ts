"use client";

import {
  CheckItem,
  Asset,
  EndingNote,
  Contact,
  Consultation,
  FamilyShare,
  FamilyMember,
  UserProfile,
  DeadManSwitchSettings,
  ReminderSettings,
  CHECKLIST_DEFAULTS,
} from "./types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Checklist ---

export function getChecklist(): CheckItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("seizenseiri_checklist");
  if (data) return JSON.parse(data);
  const defaults: CheckItem[] = CHECKLIST_DEFAULTS.map((item) => ({
    ...item,
    id: generateId(),
    checked: false,
    status: "todo" as const,
    assignee: "unassigned" as const,
  }));
  localStorage.setItem("seizenseiri_checklist", JSON.stringify(defaults));
  return defaults;
}

export function saveChecklist(items: CheckItem[]) {
  localStorage.setItem("seizenseiri_checklist", JSON.stringify(items));
}

// --- Assets ---

export function getAssets(): Asset[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("seizenseiri_assets");
  if (!data) return [];
  const raw = JSON.parse(data) as Array<Record<string, unknown>>;
  return raw.map((a) => {
    const legacy = a as unknown as Asset & { digitalAccount?: { passwordStorageLocation?: string } };
    const { digitalAccount, ...rest } = legacy;
    const storageLocation =
      (rest as Asset).storageLocation ?? digitalAccount?.passwordStorageLocation ?? "";
    return {
      ...rest,
      storageLocation: storageLocation || undefined,
      estimatedAmount: legacy.estimatedAmount ?? null,
      wantsAppraisal: legacy.wantsAppraisal ?? false,
      dispositionIntent: legacy.dispositionIntent ?? "保有（現状維持）",
      transferTo: legacy.transferTo ?? "",
      shareWithFamily: legacy.shareWithFamily ?? true,
      createdAt: legacy.createdAt ?? new Date().toISOString(),
      updatedAt: legacy.updatedAt ?? new Date().toISOString(),
    } as Asset;
  });
}

export function saveAssets(assets: Asset[]) {
  localStorage.setItem("seizenseiri_assets", JSON.stringify(assets));
}

export function addAsset(asset: Omit<Asset, "id">): Asset {
  const now = new Date().toISOString();
  const newAsset = { ...asset, id: generateId(), createdAt: now, updatedAt: now };
  const assets = getAssets();
  assets.push(newAsset);
  saveAssets(assets);
  return newAsset;
}

export function updateAsset(id: string, updates: Partial<Asset>) {
  const assets = getAssets().map((a) =>
    a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
  );
  saveAssets(assets);
  return assets;
}

export function deleteAsset(id: string) {
  const assets = getAssets().filter((a) => a.id !== id);
  saveAssets(assets);
}

// --- Ending Note ---

const DEFAULT_SHARE_FLAGS = {
  message: true,
  medicalWishes: true,
  funeralWishes: true,
  importantDocs: true,
};

const EMPTY_NOTE: EndingNote = {
  message: "",
  medicalWishes: "",
  funeralWishes: "",
  contacts: [],
  importantDocs: "",
  concernTags: [],
  shareFlags: { ...DEFAULT_SHARE_FLAGS },
};

export function getEndingNote(): EndingNote {
  if (typeof window === "undefined") return EMPTY_NOTE;
  const data = localStorage.getItem("seizenseiri_endingnote");
  if (!data) return EMPTY_NOTE;
  const note = JSON.parse(data);
  return {
    ...EMPTY_NOTE,
    ...note,
    shareFlags: { ...DEFAULT_SHARE_FLAGS, ...(note.shareFlags || {}) },
  };
}

export function saveEndingNote(note: EndingNote) {
  localStorage.setItem("seizenseiri_endingnote", JSON.stringify(note));
}

export function addContact(contact: Omit<Contact, "id">): Contact {
  const newContact = { ...contact, id: generateId() };
  const note = getEndingNote();
  note.contacts.push(newContact);
  saveEndingNote(note);
  return newContact;
}

export function deleteContact(id: string) {
  const note = getEndingNote();
  note.contacts = note.contacts.filter((c) => c.id !== id);
  saveEndingNote(note);
}

// --- Consultations (匿名相談) ---

export function getConsultations(): Consultation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("seizenseiri_consultations");
  return data ? JSON.parse(data) : [];
}

export function addConsultation(consultation: Omit<Consultation, "id" | "createdAt">): Consultation {
  const newItem: Consultation = {
    ...consultation,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const items = getConsultations();
  items.push(newItem);
  localStorage.setItem("seizenseiri_consultations", JSON.stringify(items));
  return newItem;
}

// --- Family Sharing ---

export function getFamilyShares(): FamilyShare[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("seizenseiri_familyshares");
  return data ? JSON.parse(data) : [];
}

export function saveFamilyShares(shares: FamilyShare[]) {
  localStorage.setItem("seizenseiri_familyshares", JSON.stringify(shares));
}

// --- Dead Man's Switch Settings ---

const DEFAULT_DMS: DeadManSwitchSettings = {
  enabled: false,
  inactiveDays: 90,
  preNotifyDays: 7,
  notifyMethod: "email",
  phone: "",
};

export function getDeadManSwitchSettings(): DeadManSwitchSettings {
  if (typeof window === "undefined") return DEFAULT_DMS;
  const data = localStorage.getItem("seizenseiri_dms");
  return data ? { ...DEFAULT_DMS, ...JSON.parse(data) } : DEFAULT_DMS;
}

export function saveDeadManSwitchSettings(settings: DeadManSwitchSettings) {
  localStorage.setItem("seizenseiri_dms", JSON.stringify(settings));
}

// --- Reminder Settings ---

const DEFAULT_REMINDER: ReminderSettings = {
  enabled: false,
  frequency: "quarterly",
  birthdayMonth: "",
  lastReviewDate: "",
};

export function getReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return DEFAULT_REMINDER;
  const data = localStorage.getItem("seizenseiri_reminders");
  return data ? { ...DEFAULT_REMINDER, ...JSON.parse(data) } : DEFAULT_REMINDER;
}

export function saveReminderSettings(settings: ReminderSettings) {
  localStorage.setItem("seizenseiri_reminders", JSON.stringify(settings));
}

// --- User Profile (家族マスタ・相続税計算) ---

const DEFAULT_PROFILE: UserProfile = {
  legalHeirs: 1,
  familyMembers: [],
};

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const data = localStorage.getItem("seizenseiri_profile");
  return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem("seizenseiri_profile", JSON.stringify(profile));
}

// --- Inheritance Tax Logic ---

export function getInheritanceTaxThreshold(): number {
  const profile = getUserProfile();
  // 基礎控除額 = 3000万 + 600万 × 法定相続人数
  return 30_000_000 + 6_000_000 * profile.legalHeirs;
}

export function isOverTaxThreshold(): boolean {
  const totalValue = getTotalEstimatedValue();
  if (totalValue === 0) return false;
  return totalValue > getInheritanceTaxThreshold();
}

// --- Utility ---

/** 想定処分費用の算出：1アイテムあたりの金額（後で調整可能なため定数化） */
export const DISPOSAL_COST_PER_ITEM_YEN = 5000;

/** 処分費用を算出する対象カテゴリ（家具・家電・その他不用品）。車・バイク・不動産は0円。 */
export const CATEGORIES_WITH_DISPOSAL_COST: string[] = [
  "家具・家電",
  "衣類",
  "書籍・趣味品",
  "その他",
];

/** 処分費用をカウントする意向（迷っている・処分に困っている・処分済） */
const DISPOSITION_INTENTS_WITH_DISPOSAL_COST: string[] = [
  "迷っている（保留）",
  "処分に困っている",
  "処分済",
];

/**
 * 想定処分費用（マイナス額）を算出。
 * 対象：カテゴリが家具・家電・衣類・書籍・趣味品・その他 かつ 意向が迷っている/処分に困っている/処分済。
 * 車・バイク・不動産は0円（要査定のため計算外）。
 */
export function getEstimatedDisposalCost(): number {
  if (typeof window === "undefined") return 0;
  const assets = getAssets();
  const count = assets.filter(
    (a) =>
      CATEGORIES_WITH_DISPOSAL_COST.includes(a.category) &&
      DISPOSITION_INTENTS_WITH_DISPOSAL_COST.includes(a.dispositionIntent)
  ).length;
  if (count === 0) return 0;
  return -(count * DISPOSAL_COST_PER_ITEM_YEN);
}

export function getTotalEstimatedValue(): number {
  return getAssets()
    .filter((a) => a.estimatedAmount !== null && a.dispositionIntent !== "処分済")
    .reduce((sum, a) => sum + (a.estimatedAmount ?? 0), 0);
}

export function getCompletionRate(): number {
  const assets = getAssets();
  if (assets.length === 0) return 0;
  const resolved = assets.filter(
    (a) =>
      a.dispositionIntent === "処分済" ||
      a.dispositionIntent === "譲りたい（形見分け）" ||
      a.dispositionIntent === "使い切る"
  ).length;
  return Math.round((resolved / assets.length) * 100);
}
