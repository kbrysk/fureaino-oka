/**
 * 実家じまい力診断：設問とスコアリング
 * 「放っておくと負動産確定コース」などの危機感ランク＋LINE共有でバイラルを狙う
 */

export interface DiagnosisQuestion {
  id: string;
  label: string;
  options: { value: number; label: string }[];
}

export const JIKKA_DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: "parent_age",
    label: "実家に住んでいる親（または本人）の年齢は？",
    options: [
      { value: 0, label: "50代以下" },
      { value: 1, label: "60代" },
      { value: 2, label: "70代" },
      { value: 3, label: "80代以上" },
    ],
  },
  {
    id: "rooms",
    label: "実家の部屋数は？（居室の概算）",
    options: [
      { value: 0, label: "1〜2部屋" },
      { value: 1, label: "3〜4部屋" },
      { value: 2, label: "5〜6部屋" },
      { value: 3, label: "7部屋以上" },
    ],
  },
  {
    id: "visit",
    label: "実家にどれくらいの頻度で帰っている？",
    options: [
      { value: 0, label: "月1回以上" },
      { value: 1, label: "数ヶ月に1回" },
      { value: 2, label: "年1回程度" },
      { value: 3, label: "数年帰っていない" },
    ],
  },
  {
    id: "unopened_room",
    label: "「開けない部屋」「物で埋まった部屋」はある？",
    options: [
      { value: 0, label: "ない" },
      { value: 1, label: "1部屋ある" },
      { value: 2, label: "2部屋以上ある" },
      { value: 3, label: "ほぼ全部そう" },
    ],
  },
  {
    id: "building_state",
    label: "実家の建物の状態は？",
    options: [
      { value: 0, label: "問題ない" },
      { value: 1, label: "少し老朽化している" },
      { value: 2, label: "雨漏り・傷みが気になる" },
      { value: 3, label: "空き家になりかけ／すでに空き家" },
    ],
  },
  {
    id: "family_talk",
    label: "相続・遺品整理について家族で話し合ったことは？",
    options: [
      { value: 0, label: "具体的に話している" },
      { value: 1, label: "少し話したことがある" },
      { value: 2, label: "話題にした程度" },
      { value: 3, label: "一度も話していない" },
    ],
  },
  {
    id: "cost_bearer",
    label: "固定資産税や維持費を誰が負担している？",
    options: [
      { value: 0, label: "把握している（自分 or 親が負担）" },
      { value: 1, label: "親が払っている（詳細は不明）" },
      { value: 2, label: "誰が払っているか不明" },
      { value: 3, label: "未払い・滞納の可能性がある" },
    ],
  },
  {
    id: "documents",
    label: "実家の権利証・重要書類の場所を知っている？",
    options: [
      { value: 0, label: "場所を把握している" },
      { value: 1, label: "だいたいわかる" },
      { value: 2, label: "親しか知らない" },
      { value: 3, label: "不明・探せない" },
    ],
  },
  {
    id: "parent_will",
    label: "親（本人）は「片付けたい」と言っている？",
    options: [
      { value: 0, label: "進めてくれと言っている" },
      { value: 1, label: "ときどき言う" },
      { value: 2, label: "あまり乗り気ではない" },
      { value: 3, label: "強く反対・触れてほしくない" },
    ],
  },
  {
    id: "nearby_support",
    label: "実家の近くに頼れる親族はいる？",
    options: [
      { value: 0, label: "いる（頻繁に様子を見られる）" },
      { value: 1, label: "いる（たまに連絡できる）" },
      { value: 2, label: "あまりいない" },
      { value: 3, label: "いない・遠方のみ" },
    ],
  },
];

export type DiagnosisRank = "S" | "A" | "B" | "C" | "D";

export interface DiagnosisResult {
  rank: DiagnosisRank;
  title: string;
  message: string;
  lineShareText: string;
}

const MAX_SCORE = JIKKA_DIAGNOSIS_QUESTIONS.length * 3; // 各問最大3点

export function getDiagnosisResult(totalScore: number): DiagnosisResult {
  const pct = (totalScore / MAX_SCORE) * 100;
  if (pct >= 70) {
    return {
      rank: "S",
      title: "危険度S：放っておくと「負動産確定」コースです",
      message:
        "実家のリスクがかなり高い状態です。放置すると固定資産税の負担増、相続時のトラブル、ゴミ屋敷化のリスクがあります。まずは家族で「実家じまい」の話し合いを始めましょう。",
      lineShareText:
        "実家じまい力診断の結果、危険度Sでした。放っておくと負動産確定のリスクがあります。この結果を見て、家族で会議を開きませんか？",
    };
  }
  if (pct >= 55) {
    return {
      rank: "A",
      title: "危険度A：早めの対策が必要です",
      message:
        "実家にいくつかリスク要因があります。今のうちに「誰が・いつ・何をするか」を家族で共有し、維持費のシミュレーションや片付けの第一歩を検討しましょう。",
      lineShareText:
        "実家じまい力診断で危険度Aでした。早めの対策が必要そうです。家族で話し合うきっかけにしませんか？",
    };
  }
  if (pct >= 40) {
    return {
      rank: "B",
      title: "要注意B：油断禁物です",
      message:
        "現状はまだ取り返しがつく段階です。親の年齢や建物の経年変化で一気にリスクが高まることがあるので、定期的な確認と「いつかやる」を「いつやるか」に変える準備を。",
      lineShareText:
        "実家じまい力診断で要注意Bでした。油断禁物とのこと。家族で一度話し合っておきませんか？",
    };
  }
  if (pct >= 25) {
    return {
      rank: "C",
      title: "安心度C：現状は問題少なめ",
      message:
        "現時点では大きなリスクは少なめです。ただ、親の年齢や健康の変化で状況は変わります。維持費のシミュレーションやチェックリストで、いざというときの準備だけしておくと安心です。",
      lineShareText:
        "実家じまい力診断の結果です。現状は問題少なめですが、家族で情報を共有しておくといいかも。",
    };
  }
  return {
    rank: "D",
    title: "安心度D：よく準備ができています",
    message:
      "家族で話し合いができていたり、実家の状況を把握できている状態です。この調子で定期的な見直しと、維持費・相続のシミュレーションを続けましょう。",
    lineShareText:
        "実家じまい力診断の結果、安心度Dでした。このまま定期的な見直しを続けましょう。",
  };
}

export function buildLineShareUrl(text: string, url?: string): string {
  const full = url ? `${text}\n\n${url}` : text;
  return `https://line.me/R/msg/text/?${encodeURIComponent(full)}`;
}

/**
 * 親にそのまま送れる「実家の未来についてのお手紙」テキストを生成（PLG: 家族招待ループ）
 */
export function buildParentLetter(result: DiagnosisResult, appUrl: string): string {
  const lines = [
    "お父さん・お母さんへ",
    "",
    "実家の未来について、診断ツールでチェックしたら「危険度" + result.rank + "」という結果でした。",
    "",
    result.title,
    result.message,
    "",
    "一緒にこのアプリで、やることリストや資産の整理を確認してみませんか？",
    "無料なので、まずは一度のぞいてみてください。",
    "",
    "▼ 診断・チェックリストはこちら",
    appUrl,
  ];
  return lines.join("\n");
}
