import {
  ChevronDown,
  ChevronUp,
  FilterX,
  SlidersHorizontal,
} from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { AdvancedFiltersContext } from "@/components/advanced-filters-context";

import { cn, isPopulatedString } from "@/shared/libs";

import {
  AutoField,
  AutoFormComplexComboboxValueInfo,
  AutoFormValueInfo,
  AutoFormValueType,
} from "../auto-field";
import { ComboboxFormItem } from "../form-fields";

export function ComplexComboboxFormItem({
  value,
  onChange,
  info,
  inForm,
  required,
  filterKey,
}: {
  value?: any;
  onChange?: (v: any) => void;
  info: AutoFormComplexComboboxValueInfo;
  inForm?: boolean;
  required?: boolean;
  filterKey?: string;
}) {
  const sidebarCtx = useContext(AdvancedFiltersContext);
  const useSidebar = sidebarCtx !== null && filterKey !== undefined;

  const [open, setOpen] = useState(false);
  const [filtersVersion, setFiltersVersion] = useState(0);

  const [touchedFilters, setTouchedFilters] = useState<Record<string, boolean>>(
    {}
  );

  const [extraFilters, setExtraFilters] = useState<Record<string, any>>(() =>
    Object.fromEntries(
      Object.entries(info.extraFilters)
        .filter(([, filter]) => filter !== undefined)
        .map(([key, filter]) => [
          key,
          filter!.type === AutoFormValueType.tag
            ? []
            : filter!.type === AutoFormValueType.boolean &&
                filter!.hasIndeterminate
              ? "indeterminate"
              : "",
        ])
    )
  );

  const mappedFilters = useMemo(
    () =>
      info.mapExtraFilters ? info.mapExtraFilters(extraFilters) : extraFilters,
    [extraFilters, info]
  );

  const hasFilters = hasActiveFilters(extraFilters);

  const prevFiltersRef = useRef<string | null>(null);

  useEffect(() => {
    const sanitizedFilters = stripIndeterminateFilters(
      mappedFilters,
      info.extraFilters,
      touchedFilters
    );

    const serialized = JSON.stringify(sanitizedFilters);
    if (prevFiltersRef.current === serialized) return;

    prevFiltersRef.current = serialized;

    info.adapter.setFilters?.(sanitizedFilters);
    info.adapter.invalidate?.();
  }, [mappedFilters, touchedFilters, info.adapter]);

  function resetFilters() {
    const cleared = Object.fromEntries(
      Object.entries(info.extraFilters)
        .filter(([, filter]) => filter !== undefined)
        .map(([key, filter]) => [
          key,
          filter!.type === AutoFormValueType.tag
            ? []
            : filter!.type === AutoFormValueType.boolean &&
                filter!.hasIndeterminate
              ? "indeterminate"
              : "",
        ])
    );

    setExtraFilters(cleared);
    setFiltersVersion((v) => v + 1);
    info.adapter.setFilters?.({});
    info.adapter.invalidate?.();
  }

  return (
    <div
      className={cn(
        "transition-colors",
        !useSidebar && "space-y-2",
        !useSidebar && open && "border-border bg-card rounded-md border p-3"
      )}
    >
      <div className={cn(useSidebar && "flex items-end gap-1.5")}>
        <div className={cn(useSidebar && "min-w-0 flex-1")}>
          <ComboboxFormItem
            key={info.adapter.version}
            label={info.label}
            {...info.adapter}
            fieldValue={value}
            onSelect={onChange}
            inForm={inForm}
            selectPlaceholder={info.selectPlaceholder}
            searchPlaceholder={info.searchPlaceholder}
            multi={info.multi}
            disabled={info.disabled}
            required={required}
          />
        </div>

        {!info.disabled && useSidebar && (
          <button
            type="button"
            className={cn(
              "mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors",
              hasFilters
                ? "text-link-enabled"
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            )}
            onClick={() => sidebarCtx.openAdvancedFilters(filterKey!, info)}
          >
            <div className="relative">
              <SlidersHorizontal size={16} />
              {hasFilters && (
                <span className="bg-ons-blue-100 text-ons-blue-700 absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-medium">
                  ●
                </span>
              )}
            </div>
          </button>
        )}
      </div>

      {!info.disabled && !useSidebar && (
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs transition-colors",
            hasFilters ? "text-link-enabled" : "text-muted-foreground",
            "hover:text-primary"
          )}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {open ? "Hide advanced filters" : "Advanced filters"}
          {hasFilters && (
            <span className="bg-ons-blue-100 text-ons-blue-700 ml-1 rounded-full px-1.5 text-[10px] font-medium">
              ●
            </span>
          )}
        </button>
      )}

      {!useSidebar && open && (
        <>
          <div className="border-border my-2 border-t border-dashed" />

          <div className="text-muted-foreground text-xs">
            Filters for&nbsp;
            <span className="text-foreground font-medium">{info.label}</span>
          </div>

          <div className="space-y-2">
            {Object.entries(info.extraFilters)
              .filter(([, filterInfo]) => filterInfo !== undefined)
              .map(([key, filterInfo]) => (
                <AutoField
                  key={`${filtersVersion}-${key}`}
                  info={filterInfo!}
                  value={extraFilters[key]}
                  onChange={(v) => {
                    setTouchedFilters((prev) => ({
                      ...prev,
                      [key]: true,
                    }));

                    setExtraFilters((prev) => ({
                      ...prev,
                      [key]: normalizeFilterValue(v, filterInfo!),
                    }));
                  }}
                />
              ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              className="text-muted-foreground hover:bg-muted inline-flex items-center gap-1 rounded px-2 py-1 text-xs"
              onClick={resetFilters}
              disabled={!hasFilters}
            >
              <FilterX size={14} />
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function hasActiveFilters(filters: Record<string, any>) {
  return Object.values(filters).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (v === "indeterminate") return false;
    if (typeof v === "string") return isPopulatedString(v);
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
