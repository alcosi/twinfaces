"use client";

import { useEffect, useRef, useState } from "react";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

import { AdvancedFilterLevel } from "./advanced-filter-panel";

const TRANSITION_MS = 300;
// Panels are laid out in a horizontal stack. The drawer grows up to
// MAX_VISIBLE_LEVELS extra panels (and never past the viewport); deeper
// chains scroll horizontally instead of overflowing the screen.
const PANEL_WIDTH = 400;
const MAX_VISIBLE_LEVELS = 3;

/**
 * Manages the horizontal stack of advanced-filter panels shared by the table
 * filters sidebar and the create/edit sheet. Supports arbitrary nesting: a
 * complex combobox inside a panel can open a deeper panel.
 */
export function useAdvancedFilterLevels() {
  const [levels, setLevels] = useState<AdvancedFilterLevel[]>([]);
  const [renderedLevels, setRenderedLevels] = useState<AdvancedFilterLevel[]>(
    []
  );

  useEffect(() => {
    if (levels.length >= renderedLevels.length) {
      setRenderedLevels(levels);
    } else {
      const t = setTimeout(() => setRenderedLevels(levels), TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [levels]);

  function openAdvancedFilters(
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) {
    setLevels((prev) => {
      const existingIndex = prev.findIndex((level) => level.key === filterKey);
      if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);
      return [{ key: filterKey, info }];
    });
  }

  function openAdvancedFiltersFromLevel(parentIndex: number) {
    return (filterKey: string, info: AutoFormComplexComboboxValueInfo) => {
      setLevels((prev) => {
        const existingIndex = prev.findIndex(
          (level) => level.key === filterKey
        );
        if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);
        return [...prev.slice(0, parentIndex + 1), { key: filterKey, info }];
      });
    };
  }

  function closeFrom(index: number) {
    setLevels((prev) => prev.slice(0, index));
  }

  function reset() {
    setLevels([]);
    setRenderedLevels([]);
  }

  const visibleWidth =
    PANEL_WIDTH * (1 + Math.min(levels.length, MAX_VISIBLE_LEVELS));

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Wait for the width transition to settle, then scroll the newest panel
    // into view — but only when the stack actually overflows the drawer.
    const t = setTimeout(() => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      }
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [renderedLevels.length]);

  return {
    levels,
    renderedLevels,
    scrollRef,
    visibleWidth,
    openAdvancedFilters,
    openAdvancedFiltersFromLevel,
    closeFrom,
    reset,
  };
}
