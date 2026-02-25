"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  CheckItem,
  CheckItemStatus,
  CheckItemAssignee,
  CHECKLIST_ITEM_HINTS,
  CHECKLIST_ITEM_SOLUTION_LINKS,
} from "../lib/types";
import { useChecklist } from "../hooks/useChecklist";
import { baseUrl } from "../lib/constants/site-metadata";
import EmailCTA from "../components/EmailCTA";
import ChecklistItemCTAModal from "../components/ChecklistItemCTAModal";

function getStatus(item: CheckItem): CheckItemStatus {
  return item.status ?? (item.checked ? "completed" : "todo");
}

function getDescription(item: CheckItem): string | undefined {
  return item.description ?? CHECKLIST_ITEM_HINTS[item.label];
}

function getActionLink(item: CheckItem): { url: string; text: string } | undefined {
  if (item.actionLink) return item.actionLink;
  const sol = CHECKLIST_ITEM_SOLUTION_LINKS[item.label];
  return sol ? { url: sol.href, text: sol.label } : undefined;
}

const ASSIGNEE_LABELS: Record<CheckItemAssignee, string> = {
  unassigned: "未割当",
  me: "自分",
  family: "家族",
  expert: "専門家",
};

export default function ChecklistPage() {
  const { items, setItems, isMounted } = useChecklist();
  const [filter, setFilter] = useState<string>("すべて");
  const [ctaModal, setCtaModal] = useState<CheckItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["すべて", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = filter === "すべて" ? items : items.filter((i) => i.category === filter);

  const toggleCheck = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      const wasChecked = item?.checked ?? false;
      const updated = items.map((i) =>
        i.id === id
          ? {
              ...i,
              checked: !i.checked,
              status: (i.checked ? "todo" : "completed") as CheckItemStatus,
            }
          : i
      );
      setItems(updated);
      if (item && !wasChecked && updated.find((x) => x.id === id)?.checked) {
        setCtaModal(item);
      }
    },
    [items, setItems]
  );

  const setStatus = useCallback(
    (id: string, status: CheckItemStatus) => {
      const updated = items.map((i) =>
        i.id === id ? { ...i, status, checked: status === "completed" } : i
      );
      setItems(updated);
    },
    [items, setItems]
  );

  const setAssignee = useCallback(
    (id: string, assignee: CheckItemAssignee) => {
      const updated = items.map((i) => (i.id === id ? { ...i, assignee } : i));
      setItems(updated);
    },
    [items, setItems]
  );

  const completedCount = items.filter((i) => getStatus(i) === "completed").length;
  const skippedCount = items.filter((i) => getStatus(i) === "skipped").length;
  const denominator = Math.max(1, items.length - skippedCount);
  const percent = items.length > 0 ? Math.round((completedCount / denominator) * 100) : 0;
  const isComplete = items.length > 0 && denominator > 0 && percent === 100;

  const focusTasks = items.filter((i) => getStatus(i) === "todo").slice(0, 3);

  const grouped = filtered.reduce<Record<string, CheckItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const scrollToItem = useCallback((id: string) => {
    document.getElementById(`item-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">チェックリスト</h1>
          <p className="text-foreground/50 mt-1">生前整理に必要な項目を確認しましょう</p>
          <p className="text-xs text-foreground/40 mt-2">
            進捗はこのブラウザに自動保存されます。ページを離れても、次回同じ端末で開くと続きから再開できます。
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">全体の進捗</span>
            <span className="text-primary font-bold text-2xl">0%</span>
          </div>
          <div className="w-full bg-border rounded-full h-4">
            <div className="bg-primary h-4 rounded-full transition-all duration-500" style={{ width: "0%" }} />
          </div>
          <p className="text-sm text-foreground/50 mt-2">読み込み中…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">チェックリスト</h1>
        <p className="text-foreground/50 mt-1">生前整理に必要な項目を確認しましょう</p>
        <p className="text-xs text-foreground/40 mt-2">
          進捗はこのブラウザに自動保存されます。ページを離れても、次回同じ端末で開くと続きから再開できます。
        </p>
      </div>

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
          {completedCount} / {items.length - skippedCount} 項目完了
          {skippedCount > 0 && (
            <span className="ml-2 text-foreground/50 text-xs">（対象外 {skippedCount} 件除く）</span>
          )}
          {!isComplete && percent >= 50 && (
            <span className="ml-2 text-primary text-xs font-medium">
              あと{items.length - skippedCount - completedCount}項目で家族共有をアンロック
            </span>
          )}
        </p>
      </div>

      {/* Focus Mode: 今すぐ進めるべきタスク（最大3件） */}
      {focusTasks.length > 0 && (
        <div className="bg-primary-light/40 border border-primary/20 rounded-lg p-4">
          <p className="font-bold text-primary text-sm mb-3">📌 今すぐ進めるべきタスク</p>
          <ul className="space-y-2">
            {focusTasks.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToItem(item.id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white border border-primary/20 text-foreground hover:bg-primary-light/50 transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

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
        const catDone = categoryItems.filter((i) => getStatus(i) === "completed").length;
        const catTotal = categoryItems.filter((i) => getStatus(i) !== "skipped").length;
        return (
          <div key={category} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-lg">{category}</h2>
              <span className="text-sm text-foreground/50">
                {catDone} / {catTotal}
              </span>
            </div>
            <div className="divide-y divide-border">
              {categoryItems.map((item) => {
                const status = getStatus(item);
                const isSkipped = status === "skipped";
                const description = getDescription(item);
                const actionLink = getActionLink(item);
                const isExpanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    id={`item-${item.id}`}
                    className={`transition-colors ${isSkipped ? "bg-gray-100 opacity-75" : ""}`}
                  >
                    <div className="flex items-start gap-4 px-6 py-4 hover:bg-primary-light/50 transition-colors">
                      <input
                        id={`check-${item.id}`}
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheck(item.id)}
                        disabled={isSkipped}
                        className="w-5 h-5 rounded accent-primary mt-0.5 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="text-left flex-1 min-w-0 flex items-center gap-2"
                          >
                            <span
                              className={`text-base ${item.checked ? "line-through text-foreground/40" : ""} ${isSkipped ? "text-foreground/50" : ""}`}
                            >
                              {item.label}
                            </span>
                            <span
                              className={`shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              aria-hidden
                            >
                              ▼
                            </span>
                          </button>
                          <div className="flex items-center gap-1 flex-wrap shrink-0">
                            {(["me", "family", "expert"] as const).map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => setAssignee(item.id, a)}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                  (item.assignee ?? "unassigned") === a
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-foreground/70 hover:bg-gray-300"
                                }`}
                              >
                                {ASSIGNEE_LABELS[a]}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setStatus(item.id, isSkipped ? "todo" : "skipped")}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                isSkipped ? "bg-gray-500 text-white" : "bg-gray-200 text-foreground/70 hover:bg-gray-300"
                              }`}
                            >
                              対象外
                            </button>
                          </div>
                        </div>
                        {isExpanded && (description || actionLink) && (
                          <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                            {description && (
                              <p className="text-sm text-foreground/80 mb-3">{description}</p>
                            )}
                            {actionLink && (
                              <Link
                                href={actionLink.url}
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                              >
                                {actionLink.text}
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <a
          href={`https://line.me/R/msg/text/?${encodeURIComponent(
            `実家じまい・終活のチェックリストを作成し、担当分けをしました。「ふれあいの丘」のサイト（私のスマホ/PCのブラウザ）に保存してあるので、一緒に進めていきましょう。 ${baseUrl}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition shrink-0"
          style={{ backgroundColor: "#06C755" }}
        >
          💬 家族に分担状況をLINEで共有する
        </a>
        <EmailCTA
          variant="inline"
          heading="チェックリストのPDF版をダウンロード"
          description="印刷して使えるチェックリストと、項目ごとの詳しい解説をメールでお届けします。"
        />
      </div>
    </div>
  );
}