"use client";

import { useState, useEffect, useCallback } from "react";
import type { TriageAnswers } from "../lib/tools-data";
import {
  loadCompletedTools,
  saveCompletedTools,
  loadTriageAnswers,
  saveTriageAnswers,
  DEFAULT_TRIAGE,
} from "../lib/tools-data";

/**
 * ツール利用状況（完了スタンプ）とトリアージ回答を管理。
 * Hydration 対策: マウント後にのみ localStorage から復元する。
 */
export function useToolsHub() {
  const [isMounted, setIsMounted] = useState(false);
  const [completedTools, setCompletedToolsState] = useState<string[]>([]);
  const [triageAnswers, setTriageAnswersState] = useState<TriageAnswers>(DEFAULT_TRIAGE);

  useEffect(() => {
    setCompletedToolsState(loadCompletedTools());
    setTriageAnswersState(loadTriageAnswers());
    setIsMounted(true);
  }, []);

  const setCompletedTools = useCallback((ids: string[]) => {
    setCompletedToolsState(ids);
    saveCompletedTools(ids);
  }, []);

  const addCompletedTool = useCallback((id: string) => {
    setCompletedToolsState((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      saveCompletedTools(next);
      return next;
    });
  }, []);

  const setTriageAnswers = useCallback((answers: TriageAnswers) => {
    setTriageAnswersState(answers);
    saveTriageAnswers(answers);
  }, []);

  const isTriageComplete =
    Boolean(triageAnswers.q1) && Boolean(triageAnswers.q2) && Boolean(triageAnswers.q3);

  return {
    isMounted,
    completedTools,
    setCompletedTools,
    addCompletedTool,
    triageAnswers,
    setTriageAnswers,
    isTriageComplete,
  };
}
