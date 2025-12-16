import { ChevronDown, ChevronUp, FilterX } from "lucide-react";
import { useMemo, useState } from "react";

import { cn, isPopulatedString } from "@/shared/libs";

import {
  AutoField,
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "../auto-field";
import { ComboboxFormItem } from "../form-fields";

export function ComplexComboboxFormItem({
  value,
  onChange,
  info,
  inForm,
}: {
  value?: any;
  onChange?: (v: any) => void;
  info: AutoFormComplexComboboxValueInfo;
  inForm?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [filtersVersion, setFiltersVersion] = useState(0);

  const [extraFilters, setExtraFilters] = useState<Record<string, any>>(() =>
    Object.fromEntries(
      Object.entries(info.extraFilters).map(([key, filter]) => [
        key,
        filter.type === AutoFormValueType.tag ? [] : "",
      ])
    )
  );

  const mappedFilters = useMemo(
    () =>
      info.mapExtraFilters ? info.mapExtraFilters(extraFilters) : extraFilters,
    [extraFilters, info]
  );

  const hasFilters = hasActiveFilters(extraFilters);

  function applyFilters() {
    info.adapter.setFilters?.(mappedFilters);
    info.adapter.invalidate?.();
  }

  function resetFilters() {
    const cleared = Object.fromEntries(
      Object.entries(info.extraFilters).map(([key, filter]) => [
        key,
        filter.type === AutoFormValueType.tag ? [] : "",
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
        "space-y-2 transition-colors",
        open && "border-border bg-card rounded-md border p-3"
      )}
    >
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
      />

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

      {open && (
        <>
          <div className="border-border my-2 border-t border-dashed" />

          <div className="text-muted-foreground text-xs">
            Filters for&nbsp;
            <span className="text-foreground font-medium">{info.label}</span>
          </div>

          <div className="space-y-2">
            {Object.entries(info.extraFilters).map(([key, filterInfo]) => (
              <AutoField
                key={`${filtersVersion}-${key}`}
                info={filterInfo}
                value={extraFilters[key]}
                onChange={(v) =>
                  setExtraFilters((prev) => ({
                    ...prev,
                    [key]: v,
                  }))
                }
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

            <button
              type="button"
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-colors",
                hasFilters
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              onClick={applyFilters}
              disabled={!hasFilters}
            >
              Apply
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
    if (typeof v === "string") return isPopulatedString(v);
    if (typeof v === "object" && v !== null) return true;
    return false;
  });
}
