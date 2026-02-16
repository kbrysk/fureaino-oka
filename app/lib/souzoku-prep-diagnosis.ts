/**
 * 相続準備力診断：相続で揉めない？準備力チェック
 * PLG: 結果をLINEで共有 → 家族で準備のきっかけに
 */

export interface DiagnosisQuestion {
  id: string;
  label: string;
  options: { value: number; label: string }[];
}

export const SOUZOKU_PREP_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: "will",
    label: "遺言書はある？（本人 or 親）",
    options: [
      { value: 0, label: "ある（公正証書など）" },
      { value: 1, label: "ある（自筆など）" },
      { value: 2, label: "ない・わからない" },
      { value: 3, label: "作るつもりはない" },
    ],
  },
  {
    id: "list",
    label: "資産（預金・不動産・保険など）の一覧はある？",
    options: [
      { value: 0, label: "ある・把握している" },
      { value: 1, label: "だいたいわかる" },
      { value: 2, label: "親しか知らない" },
      { value: 3, label: "不明" },
    ],
  },
  {
    id: "talk",
    label: "相続・遺産について家族で話し合った？",
    options: [
      { value: 0, label: "具体的に話している" },
      { value: 1, label: "少し話した" },
      { value: 2, label: "話題にした程度" },
      { value: 3, label: "一度も話していない" },
    ],
  },
  {
    id: "documents",
    label: "権利証・契約書・パスワードの保管場所は？",
    options: [
      { value: 0, label: "把握している" },
      { value: 1, label: "だいたいわかる" },
      { value: 2, label: "親しか知らない" },
      { value: 3, label: "不明" },
    ],
  },
  {
    id: "note",
    label: "エンディングノートや希望のメモはある？",
    options: [
      { value: 0, label: "ある・書いている" },
      { value: 1, label: "少しある" },
      { value: 2, label: "ない" },
      { value: 3, label: "必要ないと思っている" },
    ],
  },
  {
    id: "heir",
    label: "相続人（誰が相続するか）は把握している？",
    options: [
      { value: 0, label: "把握している" },
      { value: 1, label: "だいたいわかる" },
      { value: 2, label: "曖昧" },
      { value: 3, label: "不明" },
    ],
  },
  {
    id: "tax",
    label: "相続税の基礎控除や申告の必要性は知っている？",
    options: [
      { value: 0, label: "知っている・相談した" },
      { value: 1, label: "なんとなく知っている" },
      { value: 2, label: "あまり知らない" },
      { value: 3, label: "知らない" },
    ],
  },
  {
    id: "real_estate",
    label: "実家の不動産（売却・活用）について話した？",
    options: [
      { value: 0, label: "話している・方針がある" },
      { value: 1, label: "少し話した" },
      { value: 2, label: "話題にした程度" },
      { value: 3, label: "話していない" },
    ],
  },
  {
    id: "digital",
    label: "デジタル資産（メール・SNS・口座）の引き継ぎは？",
    options: [
      { value: 0, label: "一覧・手順を用意している" },
      { value: 1, label: "なんとなく話した" },
      { value: 2, label: "未対応" },
      { value: 3, label: "不要と思っている" },
    ],
  },
  {
    id: "timing",
    label: "「いつかやる」を「いつやるか」決めている？",
    options: [
      { value: 0, label: "決めている・進めている" },
      { value: 1, label: "考えている" },
      { value: 2, label: "まだ先でいいと思っている" },
      { value: 3, label: "考えていない" },
    ],
  },
];

export type SouzokuPrepRank = "S" | "A" | "B" | "C" | "D";

export interface SouzokuPrepResult {
  rank: SouzokuPrepRank;
  title: string;
  message: string;
  lineShareText: string;
}

const MAX = SOUZOKU_PREP_QUESTIONS.length * 3;

export function getSouzokuPrepResult(totalScore: number): SouzokuPrepResult {
  const pct = (totalScore / MAX) * 100;
  if (pct >= 70) {
    return {
      rank: "S",
      title: "準備力S：相続トラブルのリスクが高いです",
      message: "遺言・資産の把握・家族の話し合いが不足している可能性があります。まずは資産のリスト化と「誰に何を伝えるか」から始め、必要なら弁護士・税理士に相談しましょう。",
      lineShareText: "相続準備力診断で「準備力S（要対策）」だった。このままじゃ相続で揉めそう。一緒に準備しない？",
    };
  }
  if (pct >= 55) {
    return {
      rank: "A",
      title: "準備力A：早めの準備をおすすめします",
      message: "いくつか穴がある状態です。遺言の有無確認、資産一覧の作成、家族での方針共有のうち、できることから始めましょう。",
      lineShareText: "相続準備力診断で「準備力A」だった。早めに話し合っておこう。",
    };
  }
  if (pct >= 40) {
    return {
      rank: "B",
      title: "準備力B：あと一歩で安心",
      message: "ある程度は把握できていますが、抜けがあると相続時に慌てます。エンディングノートや資産リストの更新、家族との定期の話し合いを。",
      lineShareText: "相続準備力診断、準備力Bでした。この機会に家族で情報共有しておかない？",
    };
  }
  if (pct >= 25) {
    return {
      rank: "C",
      title: "準備力C：現状は問題少なめ",
      message: "基本的な準備はできています。定期的な見直しと、相続税や不動産の専門家への相談で、さらに安心を。",
      lineShareText: "相続準備力診断、準備力Cだった。このまま定期的に見直そう。",
    };
  }
  return {
    rank: "D",
    title: "準備力D：よく準備ができています",
    message: "遺言・資産の把握・家族の話し合いができている状態です。この調子で定期的な更新と、法律・税制の変更への対応を続けましょう。",
    lineShareText: "相続準備力診断、準備力Dでした。このまま維持していこう。",
  };
}

export function buildLineShareUrl(text: string, url?: string): string {
  const full = url ? `${text}\n\n${url}` : text;
  return `https://line.me/R/msg/text/?${encodeURIComponent(full)}`;
}

/**
 * 親にそのまま送れる「相続準備についてのお手紙」テキストを生成（PLG: 家族招待ループ）
 */
export function buildParentLetter(result: SouzokuPrepResult, appUrl: string): string {
  const lines = [
    "お父さん・お母さんへ",
    "",
    "相続準備力診断でチェックしたら「準備力" + result.rank + "」という結果でした。",
    "",
    result.title,
    result.message,
    "",
    "一緒にこのアプリで、チェックリストや資産の整理を確認してみませんか？",
    "無料なので、まずは一度のぞいてみてください。",
    "",
    "▼ 相続準備力診断・チェックリストはこちら",
    appUrl,
  ];
  return lines.join("\n");
}
