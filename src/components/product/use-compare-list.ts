"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "forgepc:compare";
const CHANGE_EVENT = "forgepc:compare-changed";
export const MAX_COMPARE = 4;

export interface CompareItem {
  slug: string;
  name: string;
  type: string;
}

function readStorage(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompareItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CompareItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCompareList() {
  const [items, setItems] = useState<CompareItem[]>(() => readStorage());

  useEffect(() => {
    const handler = () => setItems(readStorage());
    window.addEventListener(CHANGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isSelected = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback((item: CompareItem) => {
    const current = readStorage();
    const exists = current.some((i) => i.slug === item.slug);
    let next: CompareItem[];

    if (exists) {
      next = current.filter((i) => i.slug !== item.slug);
    } else {
      // Comparison only makes sense within one product type; switching types starts a new tray.
      const sameType = current.every((i) => i.type === item.type);
      const base = sameType ? current : [];
      next = [...base, item].slice(-MAX_COMPARE);
    }

    writeStorage(next);
    setItems(next);
    return next;
  }, []);

  const clear = useCallback(() => {
    writeStorage([]);
    setItems([]);
  }, []);

  return { items, isSelected, toggle, clear };
}
