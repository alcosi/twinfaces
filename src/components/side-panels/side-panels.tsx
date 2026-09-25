"use client";

import { CascadeCreatePanel } from "./create-panel";
import { AdvancedFilterPanel } from "./filter-panel";
import { AdvancedFilterTouched, AdvancedFilterValues } from "./filter-values";
import { useSidePanels } from "./use-side-panels";

type SidePanelsProps = Pick<
  ReturnType<typeof useSidePanels>,
  | "renderedLevels"
  | "openKeys"
  | "appliedCounts"
  | "valuesByKey"
  | "touchedByKey"
  | "openAdvancedFiltersFromLevel"
  | "openCascadeCreateFromLevel"
  | "setFilterValue"
  | "resetFilterValues"
  | "closeFrom"
> & {
  valuesByKey: Record<string, AdvancedFilterValues>;
  touchedByKey: Record<string, AdvancedFilterTouched>;
};

/**
 * Renders the horizontal stack of panels produced by {@link useSidePanels}.
 * Place it as a sibling of the main panel inside a horizontally scrollable,
 * full-height flex row.
 */
export function SidePanels({
  renderedLevels,
  openKeys,
  appliedCounts,
  valuesByKey,
  touchedByKey,
  openAdvancedFiltersFromLevel,
  openCascadeCreateFromLevel,
  setFilterValue,
  resetFilterValues,
  closeFrom,
}: SidePanelsProps) {
  return (
    <>
      {renderedLevels.map((level, index) =>
        level.kind === "create" ? (
          <CascadeCreatePanel
            key={`${level.key}-${index}`}
            panelKey={level.key}
            config={level.config}
            label={level.label}
            openKeys={openKeys}
            appliedCounts={appliedCounts}
            onCreated={level.onCreated}
            onOpenFilters={openAdvancedFiltersFromLevel(index)}
            onOpenCreate={openCascadeCreateFromLevel(index)}
            onClose={() => closeFrom(index)}
          />
        ) : (
          <AdvancedFilterPanel
            key={`${level.key}-${index}`}
            filterKey={level.key}
            info={level.info}
            values={valuesByKey[level.key] ?? {}}
            touched={touchedByKey[level.key] ?? {}}
            openKeys={openKeys}
            appliedCounts={appliedCounts}
            onValueChange={(name, value) =>
              setFilterValue(level.key, name, value)
            }
            onReset={() => resetFilterValues(level.key, level.info)}
            onOpenFilters={openAdvancedFiltersFromLevel(index)}
            onOpenCreate={openCascadeCreateFromLevel(index)}
            onClose={() => closeFrom(index)}
          />
        )
      )}
    </>
  );
}
