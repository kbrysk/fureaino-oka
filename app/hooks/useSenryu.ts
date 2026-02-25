"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { SenryuItem } from "../lib/senryu-data";

const STORAGE_PREFIX = "senryu_";

export type SenryuVoteType = "wakaru" | "zabuton";

function loadUserVotes(): Record<string, SenryuVoteType> {
  if (typeof window === "undefined") return {};
  const out: Record<string, SenryuVoteType> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const id = key.slice(STORAGE_PREFIX.length);
        const val = window.localStorage.getItem(key);
        if (val === "wakaru" || val === "zabuton") out[id] = val;
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

function saveUserVote(id: string, value: SenryuVoteType | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    else window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, value);
  } catch {
    /* ignore */
  }
}

/**
 * 川柳の投票状態を管理。Hydration 対策のためマウント後にのみ localStorage を読む。
 */
export function useSenryu() {
  const [isMounted, setIsMounted] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, SenryuVoteType>>({});

  useEffect(() => {
    setUserVotes(loadUserVotes());
    setIsMounted(true);
  }, []);

  const setUserVote = useCallback((id: string, type: SenryuVoteType | null) => {
    setUserVotes((prev) => {
      const next = { ...prev };
      if (type === null) delete next[id];
      else next[id] = type;
      saveUserVote(id, type);
      return next;
    });
  }, []);

  const getTotalEmpathy = useCallback(
    (item: SenryuItem): number => {
      const base = item?.initialVotes?.empathy ?? 0;
      const add = isMounted && userVotes[item.id] === "wakaru" ? 1 : 0;
      return base + add;
    },
    [isMounted, userVotes]
  );

  const getTotalZabuton = useCallback(
    (item: SenryuItem): number => {
      const base = item?.initialVotes?.zabuton ?? 0;
      const add = isMounted && userVotes[item.id] === "zabuton" ? 1 : 0;
      return base + add;
    },
    [isMounted, userVotes]
  );

  const getRankingTop3 = useCallback(
    (items: SenryuItem[] | undefined | null): SenryuItem[] => {
      if (!Array.isArray(items) || items.length === 0) return [];
      const withTotal = items.map((item) => ({
        item,
        total: Number(getTotalEmpathy(item)) || 0,
      }));
      withTotal.sort((a, b) => (b.total > a.total ? 1 : b.total < a.total ? -1 : 0));
      return withTotal.slice(0, 3).map((x) => x.item);
    },
    [getTotalEmpathy]
  );

  return {
    isMounted,
    userVotes,
    setUserVote,
    getTotalEmpathy,
    getTotalZabuton,
    getRankingTop3,
  };
}
