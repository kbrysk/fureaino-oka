/**
 * リード・スコアリング用イベント送信（クライアント専用）
 * S/A/B ランクは lead_events を集計して管理画面で付与
 */

const ANONYMOUS_ID_KEY = "seizenseiri_anonymous_id";

function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = "anon_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

export function getAnonymousId(): string {
  return getOrCreateAnonymousId();
}

export type LeadEventType =
  | "empty_house_sim_10y_loss_100_plus"
  | "appraisal_button_click"
  | "area_bulky_waste_click"
  | "asset_high_value_category_3_plus"
  | "funeral_brochure_request";

interface TrackEventPayload {
  source?: string;
  ten_year_loss_yen?: number;
  prefecture?: string;
  city?: string;
  category?: string;
  /** 葬儀パンフレット：選択した形式（家族葬・樹木葬など） */
  option?: string;
  [key: string]: unknown;
}

export function trackLeadEvent(
  eventType: LeadEventType,
  payload?: TrackEventPayload
): void {
  if (typeof window === "undefined") return;
  const anonymousId = getOrCreateAnonymousId();
  fetch("/api/lead/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      anonymous_id: anonymousId,
      payload: payload ?? undefined,
    }),
  }).catch(() => {});
}
