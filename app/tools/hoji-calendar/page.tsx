"use client";

import { useState } from "react";
import Link from "next/link";
import { addDays, addYears, format, parseISO } from "date-fns";

/** 各法要に対応するギフト・香典返しアフィリエイト導線のラベル（未設定は非表示） */
const HOJI_GIFT_LABELS: Record<string, string> = {
  shonanoka: "引き出物のマナーと人気ギフトを見る",
  shijukunichi: "香典返しのマナーと人気ギフトを見る",
  hyakunichi: "百ヶ日法要の引き出物を探す",
  ikkaiki: "一周忌の香典返し・引き出物を見る",
  sankaiki: "三回忌の香典返し・引き出物を見る",
  nanakaiki: "七回忌の引き出物を探す",
  sanjusankaiki: "弔い上げの引き出物を探す",
};

const HOJI_ITEMS: { key: string; label: string; type: "kiji" | "nenki"; getDate: (death: Date) => Date; meaning: string; preparation: string }[] = [
  { key: "shonanoka", label: "初七日", type: "kiji", getDate: (d) => addDays(d, 6), meaning: "亡くなってから7日目。最初の忌日法要。", preparation: "僧侶手配、会食・引き出物の手配" },
  { key: "shijukunichi", label: "四十九日", type: "kiji", getDate: (d) => addDays(d, 48), meaning: "七七日。忌明けの法要。この日までが「忌中」。", preparation: "僧侶・会場・会食、香典返し、本位牌" },
  { key: "hyakunichi", label: "百ヶ日", type: "kiji", getDate: (d) => addDays(d, 99), meaning: "忌日法要の区切り。百ヶ日法要を行う地域もあります。", preparation: "僧侶手配、少人数で行う場合あり" },
  { key: "ikkaiki", label: "一周忌", type: "nenki", getDate: (d) => addYears(d, 1), meaning: "満1年目の命日。最初の年忌法要。", preparation: "僧侶・会場・会食、香典返し、案内状" },
  { key: "sankaiki", label: "三回忌", type: "nenki", getDate: (d) => addYears(d, 2), meaning: "満2年目（2年後）。「三回忌」は数えで3年目。", preparation: "僧侶手配、会食、案内状" },
  { key: "nanakaiki", label: "七回忌", type: "nenki", getDate: (d) => addYears(d, 6), meaning: "満6年目。以降は規模を縮小することが多い。", preparation: "僧侶手配、家族のみで行う場合も" },
  { key: "jusankaiki", label: "十三回忌", type: "nenki", getDate: (d) => addYears(d, 12), meaning: "満12年目。", preparation: "僧侶手配" },
  { key: "junanakaiki", label: "十七回忌", type: "nenki", getDate: (d) => addYears(d, 16), meaning: "満16年目。", preparation: "僧侶手配" },
  { key: "nijusankaiki", label: "二十三回忌", type: "nenki", getDate: (d) => addYears(d, 22), meaning: "満22年目。", preparation: "僧侶手配" },
  { key: "nijunanakaiki", label: "二十七回忌", type: "nenki", getDate: (d) => addYears(d, 26), meaning: "満26年目。", preparation: "僧侶手配" },
  { key: "sanjusankaiki", label: "三十三回忌", type: "nenki", getDate: (d) => addYears(d, 32), meaning: "満32年目。多くの地域で「弔い上げ」とし、以降は省略。", preparation: "僧侶手配、弔い上げの会食" },
];

function buildGoogleCalendarUrl(title: string, date: Date, description?: string): string {
  const start = format(date, "yyyyMMdd");
  const end = format(addDays(date, 1), "yyyyMMdd");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    ...(description && { details: description }),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function HojiCalendarPage() {
  const [deathDateStr, setDeathDateStr] = useState("");
  const [deathDate, setDeathDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deathDateStr) return;
    const parsed = parseISO(deathDateStr);
    if (!isNaN(parsed.getTime())) setDeathDate(parsed);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">法要カレンダー（命日→三十三回忌）</h1>
        <p className="text-foreground/60 mt-1">故人の命日を入力すると、忌日・年忌の日程表を自動生成します。</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6">
        <label className="block font-medium mb-2">故人の命日（祥月命日）</label>
        <input
          type="date"
          value={deathDateStr}
          onChange={(e) => setDeathDateStr(e.target.value)}
          className="border border-border rounded-lg px-4 py-2 bg-background"
        />
        <button type="submit" className="ml-3 bg-primary text-white px-5 py-2 rounded-xl font-medium hover:opacity-90">
          日程表を生成
        </button>
      </form>

      {deathDate && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-primary-light">
                <th className="border border-border px-4 py-3 text-left font-bold">法要名</th>
                <th className="border border-border px-4 py-3 text-left font-bold">日付</th>
                <th className="border border-border px-4 py-3 text-left font-bold">この法要の意味</th>
                <th className="border border-border px-4 py-3 text-left font-bold">準備するもの</th>
                <th className="border border-border px-4 py-3 text-left font-bold">ギフト・香典返し</th>
                <th className="border border-border px-4 py-3 text-left font-bold">リマインド</th>
              </tr>
            </thead>
            <tbody>
              {HOJI_ITEMS.map((row) => {
                const d = row.getDate(deathDate);
                const giftLabel = HOJI_GIFT_LABELS[row.key];
                const calendarUrl = buildGoogleCalendarUrl(`${row.label}法要`, d, row.meaning);
                return (
                  <tr key={row.key} className="bg-card border-b border-border">
                    <td className="border border-border px-4 py-3 font-medium">{row.label}</td>
                    <td className="border border-border px-4 py-3">{format(d, "yyyy年M月d日")}</td>
                    <td className="border border-border px-4 py-3 text-foreground/80">{row.meaning}</td>
                    <td className="border border-border px-4 py-3 text-foreground/70">{row.preparation}</td>
                    <td className="border border-border px-4 py-3">
                      {giftLabel ? (
                        <Link
                          href={`/guide?source=hoji_gift&hoji=${row.key}`}
                          className="inline-block bg-accent/20 text-accent px-3 py-2 rounded-lg text-xs font-medium hover:bg-accent/30"
                        >
                          {giftLabel}
                        </Link>
                      ) : (
                        <Link
                          href="/guide?source=hoji_gift"
                          className="inline-block border border-border px-3 py-2 rounded-lg text-xs hover:bg-primary-light/20"
                        >
                          法要の引き出物を探す
                        </Link>
                      )}
                    </td>
                    <td className="border border-border px-4 py-3 space-y-2">
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                      >
                        Googleカレンダーに追加
                      </a>
                      <div>
                        <Link
                          href="/guide?source=obosan_bin"
                          className="inline-block border border-border px-3 py-1.5 rounded-lg text-xs hover:bg-primary-light/20 mt-1"
                        >
                          お坊さん便（僧侶手配）
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/tools" className="inline-block text-primary font-medium hover:underline">← ツール一覧へ</Link>
    </div>
  );
}
