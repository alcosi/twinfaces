import {
  ChevronDown,
  ChevronUp,
  FilterX,
  Plus,
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

import {
  SidePanelsContext,
  scopeCreateKey,
  scopeFilterKey,
} from "@/components/side-panels/context";
import {
  buildInitialFilterValues,
  countAppliedFilters,
  normalizeFilterValue,
  stripIndeterminateFilters,
} from "@/components/side-panels/filter-values";

import { cn, isTruthy } from "@/shared/libs";

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
  const sidebarCtx = useContext(SidePanelsContext);
  const useSidebar = sidebarCtx !== null && filterKey !== undefined;
  // The same field name appears in several nested filter sets, so the panel it
  // belongs to is part of its key.
  const scopedKey = useSidebar
    ? scopeFilterKey(sidebarCtx.path, filterKey)
    : undefined;
  const scopedCreateKey = useSidebar
    ? scopeCreateKey(sidebarCtx.path, filterKey)
    : undefined;

  const hasExtraFilters = Object.values(info.extraFilters).some(
    (filter) => filter !== undefined
  );

  // Creating from here only works inside a panel stack that can host the create
  // panel, and only for entities whose create form the registry knows.
  const canCascadeCreate =
    useSidebar &&
    sidebarCtx.cascadeCreateEnabled &&
    info.create !== undefined &&
    !info.disabled;
  const isCreatePanelOpen =
    scopedCreateKey !== undefined &&
    (sidebarCtx?.openKeys.includes(scopedCreateKey) ?? false);

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
  const appliedCount =
    useSidebar && scopedKey
      ? (sidebarCtx.appliedCounts[scopedKey] ?? 0)
      : countAppliedFilters(extraFilters);
  const hasFilters = appliedCount > 0;
  const isPanelOpen =
    useSidebar && scopedKey ? sidebarCtx.openKeys.includes(scopedKey) : false;

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

  /**
   * Picks up what the create panel just added: the list is refreshed either way,
   * and the new entity is selected when the API handed its id back.
   */
  async function handleCreated(id?: string) {
    info.adapter.invalidate?.();

    if (!isTruthy(id)) return;

    const created = await info.adapter.getById(id);
    if (!isTruthy(created)) return;

    const selected = Array.isArray(value) ? value : [];
    onChange?.(info.multi ? [...selected, created] : [created]);
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

        {canCascadeCreate && (
          <button
            type="button"
            aria-pressed={isCreatePanelOpen}
            aria-label={`Create a new ${typeof info.label === "string" ? info.label : "item"}`}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-colors",
              isCreatePanelOpen
                ? "border-brand-500 bg-brand-500 text-primary-foreground"
                : "border-input text-muted-foreground hover:bg-muted hover:text-primary"
            )}
            onClick={() =>
              sidebarCtx.openCascadeCreate(scopedCreateKey!, {
                config: info.create!,
                label: info.label,
                onCreated: handleCreated,
              })
            }
          >
            <Plus size={16} />
          </button>
        )}

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
            onClick={() => sidebarCtx.openAdvancedFilters(scopedKey!, info)}
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
