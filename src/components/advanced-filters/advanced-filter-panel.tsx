"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AdvancedFiltersContext } from "@/components/advanced-filters-context";
import {
  AutoField,
  AutoFormComplexComboboxValueInfo,
  AutoFormValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";

import { Button } from "@/shared/ui";

export interface AdvancedFilterLevel {
  key: string;
  info: AutoFormComplexComboboxValueInfo;
}

export function AdvancedFilterPanel({
  level,
  onOpenNext,
  onClose,
}: {
  level: AdvancedFilterLevel;
  onOpenNext: (key: string, info: AutoFormComplexComboboxValueInfo) => void;
  onClose: () => void;
}) {
  const { info } = level;
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() =>
    buildInitialFilterValues(info.extraFilters)
  );
  const [touchedFilters, setTouchedFilters] = useState<Record<string, boolean>>(
    {}
  );
  const prevAppliedRef = useRef<string | null>(null);

  // Apply filters to adapter in real-time
  useEffect(() => {
    const mapped = info.mapExtraFilters
      ? info.mapExtraFilters(filterValues)
      : filterValues;
    const sanitized = stripIndeterminateFilters(
      mapped,
      info.extraFilters,
      touchedFilters
    );

    const serialized = JSON.stringify(sanitized);
    if (prevAppliedRef.current === serialized) return;
    prevAppliedRef.current = serialized;

    info.adapter.setFilters?.(sanitized);
    info.adapter.invalidate?.();
  }, [filterValues, touchedFilters, info]);

  function handleReset() {
    setFilterValues(buildInitialFilterValues(info.extraFilters));
    setTouchedFilters({});
    prevAppliedRef.current = null;
    info.adapter.setFilters?.({});
    info.adapter.invalidate?.();
  }

  return (
    <div className="flex w-[400px] shrink-0 flex-col">
      <div className="flex items-center gap-2 px-6 py-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-base font-semibold">
          {info.label ?? "Advanced Filters"}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
        <AdvancedFiltersContext.Provider
          value={{ openAdvancedFilters: onOpenNext }}
        >
          <div className="text-muted-foreground text-xs">
            Filters for&nbsp;
            <span className="text-foreground font-medium">{info.label}</span>
          </div>

          {Object.entries(info.extraFilters)
            .filter(([, filterInfo]) => filterInfo !== undefined)
            .map(([key, filterInfo]) => (
              <AutoField
                key={key}
                info={filterInfo!}
                name={key}
                value={filterValues[key]}
                onChange={(v) => {
                  setTouchedFilters((prev) => ({ ...prev, [key]: true }));
                  setFilterValues((prev) => ({
                    ...prev,
                    [key]: normalizeFilterValue(v, filterInfo!),
                  }));
                }}
              />
            ))}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className="text-muted-foreground hover:bg-muted inline-flex items-center gap-1 rounded px-2 py-1 text-xs"
              onClick={handleReset}
              disabled={!hasActiveFilters(filterValues)}
            >
              Reset
            </button>
          </div>
        </AdvancedFiltersContext.Provider>
      </div>
    </div>
  );
}

function buildInitialFilterValues(
  extraFilters: Record<string, AutoFormValueInfo>
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(extraFilters)
      .filter(([, f]) => f !== undefined)
      .map(([k, f]) => [
        k,
        f!.type === AutoFormValueType.tag
          ? []
          : f!.type === AutoFormValueType.boolean && f!.hasIndeterminate
            ? "indeterminate"
            : "",
      ])
  );
}

function hasActiveFilters(filters: Record<string, any>) {
  return Object.values(filters).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (v === "indeterminate") return false;
    if (typeof v === "string") return v.length > 0;
    if (typeof v === "object" && v !== null) return true;
    return false;
  });
}

function normalizeFilterValue(value: unknown, filter: AutoFormValueInfo) {
  if (filter.type === AutoFormValueType.boolean && filter.hasIndeterminate) {
    return value === undefined ? "indeterminate" : value;
  }
  return value;
}

function stripIndeterminateFilters(
  filters: Record<string, any>,
  filterInfos: Record<string, AutoFormValueInfo | undefined>,
  touched: Record<string, boolean>
) {
  return Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => {
      const info = filterInfos[key];
      if (info?.type === AutoFormValueType.boolean && info.hasIndeterminate) {
        if (!touched[key]) return false;
        return value !== "indeterminate";
      }
      return true;
    })
  );
}
