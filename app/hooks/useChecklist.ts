"use client";

import { useState, useEffect, useCallback } from "react";
import type { CheckItem, CheckItemStatus, CheckItemAssignee } from "../lib/types";
import { getChecklist, saveChecklist } from "../lib/storage";

function normalizeItem(item: CheckItem): CheckItem {
  return {
    ...item,
    status: item.status ?? (item.checked ? "completed" : "todo"),
    assignee: item.assignee ?? "unassigned",
  };
}

/** Hydration 対策: マウント後にのみ localStorage から復元する。 */
export function useChecklist() {
  const [isMounted, setIsMounted] = useState(false);
  const [items, setItems] = useState<CheckItem[]>([]);

  useEffect(() => {
    const raw = getChecklist();
    setItems(raw.map(normalizeItem));
    setIsMounted(true);
  }, []);

  const persist = useCallback((next: CheckItem[]) => {
    const normalized = next.map(normalizeItem);
    setItems(normalized);
    saveChecklist(normalized);
  }, []);

  return { items, setItems: persist, isMounted };
}
