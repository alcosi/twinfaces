"use client";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

import {
  AdvancedFilterLevel,
  AdvancedFilterPanel,
} from "./advanced-filter-panel";
import { AdvancedFilterTouched, AdvancedFilterValues } from "./filter-values";

export interface AdvancedFilterPanelsProps {
  renderedLevels: AdvancedFilterLevel[];
  openKeys: string[];
  appliedCounts: Record<string, number>;
  valuesByKey: Record<string, AdvancedFilterValues>;
  touchedByKey: Record<string, AdvancedFilterTouched>;
  openAdvancedFiltersFromLevel: (
    parentIndex: number
  ) => (key: string, info: AutoFormComplexComboboxValueInfo) => void;
  setFilterValue: (filterKey: string, name: string, value: unknown) => void;
  resetFilterValues: (
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) => void;
  closeFrom: (index: number) => void;
}

/**
 * Renders the horizontal stack of advanced-filter panels produced by
 * {@link useAdvancedFilterLevels}. Place it as a sibling of the main panel
 * inside a horizontally scrollable, full-height flex row.
 */
export function AdvancedFilterPanels({
  renderedLevels,
  openKeys,
  appliedCounts,
  valuesByKey,
  touchedByKey,
  openAdvancedFiltersFromLevel,
  setFilterValue,
  resetFilterValues,
  closeFrom,
}: AdvancedFilterPanelsProps) {
  return (
    <>
      {renderedLevels.map((level, index) => (
        <AdvancedFilterPanel
          key={`${level.key}-${index}`}
          level={level}
          values={valuesByKey[level.key] ?? {}}
          touched={touchedByKey[level.key] ?? {}}
          openKeys={openKeys}
          appliedCounts={appliedCounts}
          onValueChange={(name, value) =>
            setFilterValue(level.key, name, value)
          }
          onReset={() => resetFilterValues(level.key, level.info)}
          onOpenNext={openAdvancedFiltersFromLevel(index)}
          onClose={() => closeFrom(index)}
        />
      ))}
    </>
  );
}
