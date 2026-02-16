export interface ShameQuestion {
  id: string;
  label: string;
  options: { label: string; value: number }[];
}

export const DIGITAL_SHAME_QUESTIONS: ShameQuestion[] = [
  { id: "lock", label: "スマホのロック、家族は解除番号を知っていますか？", options: [{ label: "知っている（解除できる）", value: 0 }, { label: "知らない（自分だけ）", value: 25 }, { label: "そもそもロックしていない", value: 15 }] },
  { id: "secret", label: "ブラウザのシークレットモード、使っていますか？", options: [{ label: "使わない", value: 0 }, { label: "たまに使う", value: 20 }, { label: "よく使う（履歴残したくない）", value: 35 }] },
  { id: "hidden", label: "隠しフォルダや、サブスクの課金履歴はありますか？", options: [{ label: "ない", value: 0 }, { label: "隠しフォルダだけある", value: 25 }, { label: "課金履歴がヤバい / 両方ある", value: 40 }] },
  { id: "sns", label: "SNSのDMや検索履歴、人に見られたくないものは？", options: [{ label: "ほぼない", value: 0 }, { label: "ちょっとある", value: 20 }, { label: "見られたら終わりレベル", value: 35 }] },
  { id: "pass", label: "パスワードや二段階認証、誰かに伝えていますか？", options: [{ label: "信頼できる人にメモで渡している", value: 0 }, { label: "自分だけがわかる状態", value: 25 }, { label: "どこに書いたかも忘れた", value: 30 }] },
  { id: "mail", label: "メールや決済アプリ、家族がアクセスできる状態ですか？", options: [{ label: "できる（共有 or 伝えてある）", value: 0 }, { label: "できない（自分だけ）", value: 20 }, { label: "そもそも何があるか把握していない", value: 25 }] },
];

export type ShameRank = "high" | "mid" | "low";

export interface ShameResult {
  score: number;
  rank: ShameRank;
  title: string;
  message: string;
  shareLabel: string;
}

export function getShameResult(total: number): ShameResult {
  const max = DIGITAL_SHAME_QUESTIONS.length * 40;
  const percent = Math.min(100, Math.round((total / max) * 100));
  if (percent >= 60) {
    return { score: percent, rank: "high", title: "💀 あなたの尊厳は死後3日で崩壊します", message: "スマホを開いた家族が、シークレット履歴と課金明細に絶句するレベル。今のうちに「見られたくないもの」の処分か、パスワード管理を誰かに託す準備を。", shareLabel: "Sランク（尊厳崩壊レベル）" };
  }
  if (percent >= 30) {
    return { score: percent, rank: "mid", title: "😅 ギリギリセーフ？ 油断は禁物", message: "そこそこリスクはある。ロック解除やパスワードの伝え方、見られたくないデータの整理を、元気なうちに少しずつ。", shareLabel: "Aランク（要対策）" };
  }
  return { score: percent, rank: "low", title: "✨ 完璧なデジタル終活です", message: "家族がアクセスできる状態が整っているか、見られて困るデータが少ない。この調子でパスワードや方針だけメモしておけば安心。", shareLabel: "Bランク（安心）" };
}
