"use client";

import { useState, useEffect, useCallback } from "react";
import type { EndingNote, Contact } from "../lib/types";
import {
  getEndingNote,
  saveEndingNote,
  addContact as addContactStorage,
  deleteContact as deleteContactStorage,
  getAssets,
  getTotalEstimatedValue,
  getInheritanceTaxThreshold,
} from "../lib/storage";

const EMPTY_NOTE: EndingNote = {
  message: "",
  medicalWishes: "",
  funeralWishes: "",
  contacts: [],
  importantDocs: "",
  concernTags: [],
  shareFlags: { message: true, medicalWishes: true, funeralWishes: true, importantDocs: true },
};

/** Hydration 対策: 初回マウント時のみ localStorage から復元する。 */
export function useEndingNote() {
  const [isMounted, setIsMounted] = useState(false);
  const [note, setNote] = useState<EndingNote>(EMPTY_NOTE);
  const [allAssets, setAllAssets] = useState<ReturnType<typeof getAssets>>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [taxThreshold, setTaxThreshold] = useState(0);

  useEffect(() => {
    setNote(getEndingNote());
    setAllAssets(getAssets());
    setTotalValue(getTotalEstimatedValue());
    setTaxThreshold(getInheritanceTaxThreshold());
    setIsMounted(true);
  }, []);

  const saveNote = useCallback((payload: EndingNote) => {
    saveEndingNote(payload);
    setNote(payload);
  }, []);

  const addContact = useCallback((contact: Omit<Contact, "id">) => {
    const newContact = addContactStorage(contact);
    const updated = getEndingNote();
    setNote(updated);
    return newContact;
  }, []);

  const deleteContact = useCallback((id: string) => {
    deleteContactStorage(id);
    setNote(getEndingNote());
  }, []);

  /** 完成度 0〜100%（連絡先・資産・医療・家族へ の4領域、各25%） */
  const completionRate = !isMounted
    ? 0
    : Math.min(
        100,
        (note.contacts.length > 0 ? 25 : 0) +
          (allAssets.length > 0 ? 25 : 0) +
          (note.medicalWishes.trim() || note.funeralWishes.trim() ? 25 : 0) +
          (note.message.trim() || note.importantDocs.trim() ? 25 : 0)
      );

  return {
    isMounted,
    note,
    setNote,
    saveNote,
    addContact,
    deleteContact,
    allAssets,
    setAllAssets,
    totalValue,
    taxThreshold,
    completionRate,
  };
}
