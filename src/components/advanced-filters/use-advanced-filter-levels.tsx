"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AdvancedFiltersContextValue } from "@/components/advanced-filters-context";
import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

import { AdvancedFilterLevel } from "./advanced-filter-panel";
import {
  AdvancedFilterTouched,
  AdvancedFilterValues,
  buildInitialFilterValues,
  countAppliedFilters,
} from "./filter-values";

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
 *
 * Panel values live here rather than in the panels themselves, so that closing
 * a panel keeps its filters applied — the combobox that opened it can then
 * still show how many of them are in effect.
 */
export function useAdvancedFilterLevels() {
  const [levels, setLevels] = useState<AdvancedFilterLevel[]>([]);
  const [renderedLevels, setRenderedLevels] = useState<AdvancedFilterLevel[]>(
    []
  );
  const [valuesByKey, setValuesByKey] = useState<
    Record<string, AdvancedFilterValues>
  >({});
  const [touchedByKey, setTouchedByKey] = useState<
    Record<string, AdvancedFilterTouched>
  >({});
  // Every combobox whose panel has been opened, so a full reset can also clear
  // the filters those panels pushed into the adapters.
  const infoByKey = useRef<Record<string, AutoFormComplexComboboxValueInfo>>(
    {}
  );

  useEffect(() => {
    if (levels.length >= renderedLevels.length) {
      setRenderedLevels(levels);
    } else {
      const t = setTimeout(() => setRenderedLevels(levels), TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [levels]);

  const initValues = useCallback(
    (filterKey: string, info: AutoFormComplexComboboxValueInfo) => {
      infoByKey.current[filterKey] = info;
      setValuesByKey((prev) =>
        prev[filterKey]
          ? prev
          : {
              ...prev,
              [filterKey]: buildInitialFilterValues(info.extraFilters),
            }
      );
    },
    []
  );

  const openAdvancedFilters = useCallback(
    (filterKey: string, info: AutoFormComplexComboboxValueInfo) => {
      initValues(filterKey, info);
      setLevels((prev) => {
        const existingIndex = prev.findIndex(
          (level) => level.key === filterKey
        );
        if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);
        return [{ key: filterKey, info }];
      });
    },
    [initValues]
  );

  const openAdvancedFiltersFromLevel = useCallback(
    (parentIndex: number) =>
      (filterKey: string, info: AutoFormComplexComboboxValueInfo) => {
        initValues(filterKey, info);
        setLevels((prev) => {
          const existingIndex = prev.findIndex(
            (level) => level.key === filterKey
          );
          if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);
          return [...prev.slice(0, parentIndex + 1), { key: filterKey, info }];
        });
      },
    [initValues]
  );

  const closeFrom = useCallback((index: number) => {
    setLevels((prev) => prev.slice(0, index));
  }, []);

  const setFilterValue = useCallback(
    (filterKey: string, name: string, value: unknown) => {
      setValuesByKey((prev) => ({
        ...prev,
        [filterKey]: { ...prev[filterKey], [name]: value },
      }));
      setTouchedByKey((prev) => ({
        ...prev,
        [filterKey]: { ...prev[filterKey], [name]: true },
      }));
    },
    []
  );

  const resetFilterValues = useCallback(
    (filterKey: string, info: AutoFormComplexComboboxValueInfo) => {
      setValuesByKey((prev) => ({
        ...prev,
        [filterKey]: buildInitialFilterValues(info.extraFilters),
      }));
      setTouchedByKey((prev) => ({ ...prev, [filterKey]: {} }));
    },
    []
  );

  function reset() {
    setLevels([]);
    setRenderedLevels([]);
    setValuesByKey({});
    setTouchedByKey({});

    Object.values(infoByKey.current).forEach(({ adapter }) => {
      adapter.setFilters?.({});
      adapter.invalidate?.();
    });
    infoByKey.current = {};
  }

  const openKeys = useMemo(() => levels.map((level) => level.key), [levels]);

  const appliedCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(valuesByKey).map(([key, values]) => [
          key,
          countAppliedFilters(values),
        ])
      ),
    [valuesByKey]
  );

  const contextValue: AdvancedFiltersContextValue = useMemo(
    () => ({ openAdvancedFilters, path: "", openKeys, appliedCounts }),
    [openAdvancedFilters, openKeys, appliedCounts]
  );

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
    contextValue,
    openKeys,
    appliedCounts,
    valuesByKey,
    touchedByKey,
    openAdvancedFilters,
    openAdvancedFiltersFromLevel,
    setFilterValue,
    resetFilterValues,
    closeFrom,
    reset,
  };
}
