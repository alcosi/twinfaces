"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  AutoField,
  AutoFormComplexComboboxValueInfo,
} from "@/components/auto-field";

import { Button } from "@/shared/ui";

import {
  OpenCascadeCreateArgs,
  SidePanelsContext,
  SidePanelsContextValue,
} from "./context";
import {
  AdvancedFilterTouched,
  AdvancedFilterValues,
  hasAppliedFilters,
  normalizeFilterValue,
  stripIndeterminateFilters,
} from "./filter-values";

export function AdvancedFilterPanel({
  filterKey,
  info,
  values,
  touched,
  openKeys,
  appliedCounts,
  onValueChange,
  onReset,
  onOpenFilters,
  onOpenCreate,
  onClose,
}: {
  filterKey: string;
  info: AutoFormComplexComboboxValueInfo;
  values: AdvancedFilterValues;
  touched: AdvancedFilterTouched;
  openKeys: string[];
  appliedCounts: Record<string, number>;
  onValueChange: (name: string, value: unknown) => void;
  onReset: () => void;
  onOpenFilters: (key: string, info: AutoFormComplexComboboxValueInfo) => void;
  onOpenCreate: (key: string, args: OpenCascadeCreateArgs) => void;
  onClose: () => void;
}) {
  const prevAppliedRef = useRef<string | null>(null);
  // Some inputs (tag boxes) only read their value on mount, so a reset has to
  // remount the fields for the cleared values to show up.
  const [resetVersion, setResetVersion] = useState(0);

  // Apply filters to adapter in real-time
  useEffect(() => {
    const mapped = info.mapExtraFilters ? info.mapExtraFilters(values) : values;
    const sanitized = stripIndeterminateFilters(
      mapped,
      info.extraFilters,
      touched
    );

    const serialized = JSON.stringify(sanitized);
    if (prevAppliedRef.current === serialized) return;
    prevAppliedRef.current = serialized;

    info.adapter.setFilters?.(sanitized);
    info.adapter.invalidate?.();
  }, [values, touched, info]);

  function handleReset() {
    onReset();
    setResetVersion((v) => v + 1);
    prevAppliedRef.current = null;
    info.adapter.setFilters?.({});
    info.adapter.invalidate?.();
  }

  const contextValue: SidePanelsContextValue = useMemo(
    () => ({
      openAdvancedFilters: onOpenFilters,
      openCascadeCreate: onOpenCreate,
      // A filter only ever narrows an existing list, so nothing is created from
      // inside one.
      cascadeCreateEnabled: false,
      path: filterKey,
      openKeys,
      appliedCounts,
    }),
    [onOpenFilters, onOpenCreate, filterKey, openKeys, appliedCounts]
  );

  return (
    <div className="border-border flex w-[400px] shrink-0 flex-col border-l">
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
        <SidePanelsContext.Provider value={contextValue}>
          <div className="text-muted-foreground text-xs">
            Filters for&nbsp;
            <span className="text-foreground font-medium">{info.label}</span>
          </div>

          {Object.entries(info.extraFilters)
            .filter(([, filterInfo]) => filterInfo !== undefined)
            .map(([key, filterInfo]) => (
              <AutoField
                key={`${resetVersion}-${key}`}
                info={filterInfo!}
                name={key}
                layout="inline"
                value={values[key]}
                onChange={(v) =>
                  onValueChange(key, normalizeFilterValue(v, filterInfo!))
                }
              />
            ))}
        </SidePanelsContext.Provider>
      </div>

      <div className="flex items-center justify-end gap-2 px-6 py-4">
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-link-enabled"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-link-enabled"
          onClick={handleReset}
          disabled={!hasAppliedFilters(values)}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
