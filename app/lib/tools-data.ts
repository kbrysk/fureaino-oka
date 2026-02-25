/**
 * 無料ツール一覧の SSOT。slug を id として使用（completedTools 等で参照）。
 */
export interface ToolItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
}

/** ソート・おすすめ表示用の拡張（isRecommended はトリアージ結果で付与） */
export type ToolItemWithRecommended = ToolItem & { isRecommended: boolean };

export const TOOLS: ToolItem[] = [
  { id: "inheritance-share", slug: "inheritance-share", title: "法定相続分シミュレーター", description: "家族構成を入力すると民法の法定相続分を円グラフで表示。家系図をエンディングノートへ保存。", href: "/tools/inheritance-share" },
  { id: "hoji-calendar", slug: "hoji-calendar", title: "法要カレンダー", description: "命日を入力すると初七日から三十三回忌までの日程表を生成。Googleカレンダーに追加可能。", href: "/tools/hoji-calendar" },
  { id: "digital-shame", slug: "digital-shame", title: "デジタル遺品リスク診断", description: "「見られたくないデータ」のリスクを診断。結果をXでシェア、エンディングノートへ導線。", href: "/tools/digital-shame" },
  { id: "jikka-diagnosis", slug: "jikka-diagnosis", title: "実家じまい力診断", description: "約10問で実家のリスク度を診断。結果をLINEで家族に送って会議のきっかけに。", href: "/tools/jikka-diagnosis" },
  { id: "akiya-risk", slug: "akiya-risk", title: "空き家リスク診断", description: "約8問で実家が空き家予備軍かがわかる。結果をLINEで送って会議を開こう。", href: "/tools/akiya-risk" },
  { id: "souzoku-prep", slug: "souzoku-prep", title: "相続準備力診断", description: "約10問で相続の準備度をチェック。結果を家族に送って準備のきっかけに。", href: "/tools/souzoku-prep" },
  { id: "empty-house-tax", slug: "empty-house-tax", title: "空き家税金シミュレーター", description: "都道府県と建物種別で年間維持費の目安を即表示。", href: "/tools/empty-house-tax" },
  { id: "appraisal", slug: "appraisal", title: "資産・査定の目安", description: "持ち物の査定目安を確認。無料一括見積もりへ。", href: "/tools/appraisal" },
  { id: "checklist", slug: "checklist", title: "チェックリスト", description: "生前整理の項目を確認し、進捗を可視化。", href: "/checklist" },
  { id: "area", slug: "area", title: "地域別 粗大ゴミ・遺品整理", description: "東京23区の粗大ゴミ申し込み・遺品整理相談。無料見積もりで比較。", href: "/area" },
];

const STORAGE_KEY_COMPLETED = "seizenseiri_tools_completed";
const STORAGE_KEY_TRIAGE = "seizenseiri_tools_triage";

export type TriageQ1 = "親が健在" | "施設・入院中" | "すでに亡くなった";
export type TriageQ2 = "住んでいる" | "空き家" | "売却・解体予定";
export type TriageQ3 = "まだ何もしていない" | "少し始めた" | "だいたい済んだ";

export interface TriageAnswers {
  q1: TriageQ1 | "";
  q2: TriageQ2 | "";
  q3: TriageQ3 | "";
}

const DEFAULT_TRIAGE: TriageAnswers = { q1: "", q2: "", q3: "" };

function loadCompletedTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveCompletedTools(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function loadTriageAnswers(): TriageAnswers {
  if (typeof window === "undefined") return DEFAULT_TRIAGE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRIAGE);
    if (!raw) return DEFAULT_TRIAGE;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "q1" in parsed && "q2" in parsed && "q3" in parsed) {
      return {
        q1: (parsed as TriageAnswers).q1 || "",
        q2: (parsed as TriageAnswers).q2 || "",
        q3: (parsed as TriageAnswers).q3 || "",
      };
    }
    return DEFAULT_TRIAGE;
  } catch {
    return DEFAULT_TRIAGE;
  }
}

function saveTriageAnswers(a: TriageAnswers) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_TRIAGE, JSON.stringify(a));
  } catch {
    // ignore
  }
}

/**
 * トリアージ回答に基づき、おすすめツールの id（最大4件）を返す。
 * 未回答の場合は空配列（フォールバックで全ツール通常表示）。
 */
export function getRecommendedToolIds(answers: TriageAnswers): string[] {
  const ids: string[] = [];
  if (answers.q1 === "親が健在") {
    ids.push("jikka-diagnosis", "souzoku-prep", "checklist");
  } else if (answers.q1 === "施設・入院中") {
    ids.push("checklist", "digital-shame", "souzoku-prep");
  } else if (answers.q1 === "すでに亡くなった") {
    ids.push("inheritance-share", "hoji-calendar", "area");
  }
  if (answers.q2 === "空き家") {
    ids.push("akiya-risk", "empty-house-tax");
  } else if (answers.q2 === "売却・解体予定") {
    ids.push("appraisal", "area");
  }
  if (answers.q3 === "まだ何もしていない") {
    ids.push("checklist", "jikka-diagnosis");
  } else if (answers.q3 === "だいたい済んだ") {
    ids.push("inheritance-share", "hoji-calendar");
  }
  const unique = Array.from(new Set(ids));
  return unique.slice(0, 4);
}

export { loadCompletedTools, saveCompletedTools, loadTriageAnswers, saveTriageAnswers, DEFAULT_TRIAGE };
