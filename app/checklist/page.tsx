"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckItem, CHECKLIST_ITEM_HINTS, CHECKLIST_ITEM_SOLUTION_LINKS } from "../lib/types";
import { getChecklist, saveChecklist } from "../lib/storage";
import EmailCTA from "../components/EmailCTA";
import ChecklistItemCTAModal from "../components/ChecklistItemCTAModal";

export default function ChecklistPage() {
  const [items, setItems] = useState<CheckItem[]>([]);
  const [filter, setFilter] = useState<string>("すべて");
  const [ctaModal, setCtaModal] = useState<CheckItem | null>(null);

  useEffect(() => {
    setItems(getChecklist());
  }, []);

  const categories = ["すべて", ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = filter === "すべて" ? items : items.filter((i) => i.category === filter);

  const toggleItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    const wasChecked = item?.checked ?? false;
    const updated = items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
    setItems(updated);
    saveChecklist(updated);
    // チェックを入れた直後にアフィCTAモーダル（未チェック→チェックにしたときだけ）
    if (item && !wasChecked && updated.find((x) => x.id === id)?.checked) {
      setCtaModal(item);
    }
  };

  const totalDone = items.filter((i) => i.checked).length;
  const percent = items.length > 0 ? Math.round((totalDone / items.length) * 100) : 0;
  const isComplete = items.length > 0 && percent === 100;

  // Group by category
  const grouped = filtered.reduce<Record<string, CheckItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">チェックリスト</h1>
        <p className="text-foreground/50 mt-1">生前整理に必要な項目を確認しましょう</p>
        <p className="text-xs text-foreground/40 mt-2">
          進捗はこのブラウザに自動保存されます。ページを離れても、次回同じ端末で開くと続きから再開できます。
        </p>
      </div>

      {/* 100%達成時：家族共有アンロック（ゲーミフィケーション） */}
      {isComplete && (
        <div className="bg-accent/15 border border-accent/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-accent">すべて完了！家族への共有がアンロックされました</p>
            <p className="text-sm text-foreground/60 mt-0.5">
              進捗を家族と共有すると、有料級のガイドブックをプレゼントします。
            </p>
          </div>
          <Link
            href="/settings"
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition shrink-0"
          >
            家族を招待する
          </Link>
        </div>
      )}

      {/* Overall Progress */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">全体の進捗</span>
          <span className="text-primary font-bold text-2xl">{percent}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-foreground/50 mt-2">
          {totalDone} / {items.length} 項目完了
          {!isComplete && percent >= 50 && (
            <span className="ml-2 text-primary text-xs font-medium">
              あと{items.length - totalDone}項目で家族共有をアンロック
            </span>
          )}
        </p>
      </div>

      {ctaModal && (
        <ChecklistItemCTAModal
          category={ctaModal.category}
          label={ctaModal.label}
          onClose={() => setCtaModal(null)}
        />
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-white"
                : "bg-card border border-border text-foreground/70 hover:bg-primary-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      {Object.entries(grouped).map(([category, categoryItems]) => {
        const catDone = categoryItems.filter((i) => i.checked).length;
        return (
          <div key={category} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-lg">{category}</h2>
              <span className="text-sm text-foreground/50">
                {catDone} / {categoryItems.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {categoryItems.map((item) => {
                const hint = CHECKLIST_ITEM_HINTS[item.label];
                const solution = CHECKLIST_ITEM_SOLUTION_LINKS[item.label];
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-primary-light/50 transition-colors"
                  >
                    <input
                      id={`check-${item.id}`}
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded accent-primary mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <label htmlFor={`check-${item.id}`} className="cursor-pointer">
                        <span
                          className={`text-base ${
                            item.checked ? "line-through text-foreground/40" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                      {hint && (
                        <p className={`text-xs mt-1 ${item.checked ? "text-foreground/30" : "text-foreground/50"}`}>
                          完了の目安：{hint}
                        </p>
                      )}
                      {solution && (
                        <Link
                          href={solution.href}
                          className="inline-block mt-2 text-xs text-primary font-medium hover:underline"
                        >
                          プロに頼む：{solution.label}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <EmailCTA
        variant="inline"
        heading="チェックリストのPDF版をダウンロード"
        description="印刷して使えるチェックリストと、項目ごとの詳しい解説をメールでお届けします。"
      />
    </div>
  );
}
