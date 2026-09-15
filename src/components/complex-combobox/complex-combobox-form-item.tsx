import {
  ChevronDown,
  ChevronUp,
  FilterX,
  SlidersHorizontal,
} from "lucide-react";
import {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AdvancedFiltersContext } from "@/components/advanced-filters-context";
import {
  buildInitialFilterValues,
  countAppliedFilters,
  normalizeFilterValue,
  stripIndeterminateFilters,
} from "@/components/advanced-filters/filter-values";

import { cn } from "@/shared/libs";

import { AutoField, AutoFormComplexComboboxValueInfo } from "../auto-field";
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

  const hasExtraFilters = Object.values(info.extraFilters).some(
    (filter) => filter !== undefined
  );

  const [open, setOpen] = useState(false);
  const [filtersVersion, setFiltersVersion] = useState(0);

  const [touchedFilters, setTouchedFilters] = useState<Record<string, boolean>>(
    {}
  );

  const [extraFilters, setExtraFilters] = useState<Record<string, any>>(() =>
    buildInitialFilterValues(info.extraFilters)
  );

  const mappedFilters = useMemo(
    () =>
      info.mapExtraFilters ? info.mapExtraFilters(extraFilters) : extraFilters,
    [extraFilters, info]
  );

  // In sidebar mode the values live in the panel stack, so that they survive
  // the panel being closed — the badge has to read the count from there.
  const appliedCount = useSidebar
    ? (sidebarCtx.appliedCounts[filterKey] ?? 0)
    : countAppliedFilters(extraFilters);
  const hasFilters = appliedCount > 0;
  const isPanelOpen = useSidebar && sidebarCtx.openKeys.includes(filterKey);

  const prevFiltersRef = useRef<string | null>(null);

  useEffect(() => {
    if (useSidebar) return;

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
  }, [useSidebar, mappedFilters, touchedFilters, info.adapter]);

  function resetFilters() {
    setExtraFilters(buildInitialFilterValues(info.extraFilters));
    setTouchedFilters({});
    setFiltersVersion((v) => v + 1);
    info.adapter.setFilters?.({});
    info.adapter.invalidate?.();
  }

  const label: ReactNode =
    info.label != null ? (
      <span className="inline-flex flex-wrap items-center gap-2">
        {info.label}
        <AppliedFiltersBadge count={appliedCount} />
      </span>
    ) : (
      info.label
    );

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
            label={label}
            description={info.description}
            {...info.adapter}
            fieldValue={value}
            onSelect={onChange}
            inForm={inForm}
            selectPlaceholder={info.selectPlaceholder}
            searchPlaceholder={info.searchPlaceholder}
            noItemsText={info.noItemsText}
            multi={info.multi}
            disabled={info.disabled}
            required={required}
          />
        </div>

        {!info.disabled && useSidebar && hasExtraFilters && (
          <button
            type="button"
            aria-pressed={isPanelOpen}
            aria-label={`Advanced filters for ${typeof info.label === "string" ? info.label : "field"}`}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-colors",
              isPanelOpen
                ? "border-brand-500 bg-brand-500 text-primary-foreground"
                : hasFilters
                  ? "border-brand-500/50 text-link-enabled hover:bg-muted"
                  : "border-input text-muted-foreground hover:bg-muted hover:text-primary"
            )}
            onClick={() => sidebarCtx.openAdvancedFilters(filterKey, info)}
          >
            <SlidersHorizontal size={16} />
          </button>
        )}
      </div>

      {!info.disabled && !useSidebar && hasExtraFilters && (
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
                  layout="inline"
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

/** Marks a field whose advanced filters are in effect, panel open or not. */
function AppliedFiltersBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="bg-brand-500/15 text-brand-600 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-medium">
      {count} applied
    </span>
  );
}
