"use client";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

import {
  AdvancedFilterLevel,
  AdvancedFilterPanel,
} from "./advanced-filter-panel";

/**
 * Renders the horizontal stack of advanced-filter panels produced by
 * {@link useAdvancedFilterLevels}. Place it as a sibling of the main panel
 * inside a horizontally scrollable, full-height flex row.
 */
export function AdvancedFilterPanels({
  renderedLevels,
  openAdvancedFiltersFromLevel,
  closeFrom,
}: {
  renderedLevels: AdvancedFilterLevel[];
  openAdvancedFiltersFromLevel: (
    parentIndex: number
  ) => (key: string, info: AutoFormComplexComboboxValueInfo) => void;
  closeFrom: (index: number) => void;
}) {
  return (
    <>
      {renderedLevels.map((level, index) => (
        <AdvancedFilterPanel
          key={`${level.key}-${index}`}
          level={level}
          onOpenNext={openAdvancedFiltersFromLevel(index)}
          onClose={() => closeFrom(index)}
        />
      ))}
    </>
  );
}
