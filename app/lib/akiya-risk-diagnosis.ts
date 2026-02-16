/**
 * 空き家リスク診断：あなたの実家は空き家予備軍？
 * PLG: 結果をLINEで共有
 */

export interface DiagnosisQuestion {
  id: string;
  label: string;
  options: { value: number; label: string }[];
}

export const AKIYA_RISK_QUESTIONS: DiagnosisQuestion[] = [
  { id: "living", label: "実家に今、誰が住んでいる？", options: [{ value: 0, label: "親（または本人）が元気に住んでいる" }, { value: 1, label: "親が1人で住んでいる" }, { value: 2, label: "たまにしか誰もいない" }, { value: 3, label: "すでに誰も住んでいない（空き家）" }] },
  { id: "visit", label: "実家にどれくらいの頻度で行く？", options: [{ value: 0, label: "月1回以上" }, { value: 1, label: "数ヶ月に1回" }, { value: 2, label: "年1回程度" }, { value: 3, label: "数年行っていない" }] },
  { id: "neighbor", label: "近所に様子を見てくれる人はいる？", options: [{ value: 0, label: "いる（親戚・知人）" }, { value: 1, label: "少しはつながりがある" }, { value: 2, label: "ほとんどいない" }, { value: 3, label: "いない・不明" }] },
  { id: "condition", label: "建物の状態は？", options: [{ value: 0, label: "問題なく住める" }, { value: 1, label: "少し古いが住める" }, { value: 2, label: "雨漏り・傷みが気になる" }, { value: 3, label: "空き家化で荒れている／特定空き家の可能性" }] },
  { id: "plan", label: "将来の住まい（売却・賃貸・住み続ける）を話し合った？", options: [{ value: 0, label: "具体的に話している" }, { value: 1, label: "なんとなく話した" }, { value: 2, label: "話題にした程度" }, { value: 3, label: "一度も話していない" }] },
  { id: "tax", label: "固定資産税・維持費は誰が払っている？", options: [{ value: 0, label: "把握している（自分 or 親）" }, { value: 1, label: "親が払っている（詳細は不明）" }, { value: 2, label: "誰が払っているか不明" }, { value: 3, label: "未払い・滞納の可能性" }] },
  { id: "documents", label: "権利証・書類の場所はわかる？", options: [{ value: 0, label: "把握している" }, { value: 1, label: "だいたいわかる" }, { value: 2, label: "親しか知らない" }, { value: 3, label: "不明" }] },
  { id: "age", label: "実家に住む人（または本人）の年齢は？", options: [{ value: 0, label: "50代以下" }, { value: 1, label: "60代" }, { value: 2, label: "70代" }, { value: 3, label: "80代以上" }] },
];

export type AkiyaRiskRank = "S" | "A" | "B" | "C" | "D";

export interface AkiyaRiskResult {
  rank: AkiyaRiskRank;
  title: string;
  message: string;
  lineShareText: string;
}

const MAX = AKIYA_RISK_QUESTIONS.length * 3;

export function getAkiyaRiskResult(totalScore: number): AkiyaRiskResult {
  const pct = (totalScore / MAX) * 100;
  if (pct >= 70) return { rank: "S", title: "空き家リスクS：すでに「空き家」または一歩手前です", message: "放置すると固定資産税の増額・特定空き家指定のリスクがあります。早めに売却・活用・解体の選択肢を家族で話し合い、自治体や専門家に相談しましょう。", lineShareText: "空き家リスク診断で「リスクS」でした。このままじゃまずいかも。家族で話し合わない？" };
  if (pct >= 55) return { rank: "A", title: "空き家リスクA：早めの対策が必要です", message: "数年以内に空き家になる可能性が高いです。維持費のシミュレーションをして、売却・賃貸・住み続けるための支援のうち、どれを選ぶか家族で話し合いを始めましょう。", lineShareText: "空き家リスク診断で「リスクA」だった。早めに話し合おう。" };
  if (pct >= 40) return { rank: "B", title: "空き家リスクB：油断禁物です", message: "現状はまだ大丈夫でも、親の年齢や健康の変化で一気に空き家リスクが高まることがあります。維持費のシミュレーションと「いつか」ではなく「いつやるか」の準備を。", lineShareText: "空き家リスク診断の結果、リスクBでした。この機会に家族で話し合ってみない？" };
  if (pct >= 25) return { rank: "C", title: "空き家リスクC：現状は問題少なめ", message: "今のところ空き家化のリスクは低めです。ただ、状況は変わります。維持費のシミュレーションやチェックリストで、いざというときの準備だけしておくと安心です。", lineShareText: "空き家リスク診断、リスクCだった。今のうちに情報だけ共有しておこう。" };
  return { rank: "D", title: "空き家リスクD：よく把握できています", message: "住まいの状況や将来の話し合いができている状態です。この調子で定期的な見直しを続け、維持費や相続のシミュレーションも活用しましょう。", lineShareText: "空き家リスク診断、リスクDでした。このまま定期的に見直ししていこう。" };
}

export function buildLineShareUrl(text: string, url?: string): string {
  const full = url ? `${text}\n\n${url}` : text;
  return `https://line.me/R/msg/text/?${encodeURIComponent(full)}`;
}

/**
 * 親にそのまま送れる「空き家の未来についてのお手紙」テキストを生成（PLG: 家族招待ループ）
 */
export function buildParentLetter(result: AkiyaRiskResult, appUrl: string): string {
  const lines = [
    "お父さん・お母さんへ",
    "",
    "空き家リスク診断でチェックしたら「リスク" + result.rank + "」という結果でした。",
    "",
    result.title,
    result.message,
    "",
    "一緒にこのアプリで、維持費のシミュレーションやチェックリストを確認してみませんか？",
    "無料なので、まずは一度のぞいてみてください。",
    "",
    "▼ 空き家リスク診断・ツールはこちら",
    appUrl,
  ];
  return lines.join("\n");
}
