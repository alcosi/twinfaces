import { ArrowLeft, FilterIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { AdvancedFiltersContext } from "@/components/advanced-filters-context";
import {
  AutoField,
  AutoFormComplexComboboxValueInfo,
  AutoFormValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";

import { cn, isTruthy } from "@/shared/libs";
import {
  Button,
  Form,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";

interface FiltersSidebarProps {
  filtersInfo: Record<string, AutoFormValueInfo>;
  filters: Record<string, unknown>;
  onChange: (values: Record<string, unknown> | null) => Promise<void>;
}

export function FiltersSidebar({
  filtersInfo,
  filters,
  onChange,
}: FiltersSidebarProps) {
  const [open, setOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeFilterInfo, setActiveFilterInfo] =
    useState<AutoFormComplexComboboxValueInfo | null>(null);
  const [advancedFilterValues, setAdvancedFilterValues] = useState<
    Record<string, any>
  >({});
  const [touchedFilters, setTouchedFilters] = useState<Record<string, boolean>>(
    {}
  );

  const prevAppliedRef = useRef<string | null>(null);

  const keys = useMemo(
    () => Object.keys(filtersInfo).filter((key) => isTruthy(filtersInfo[key])),
    [filtersInfo]
  );

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        keys.map((key) => [key, filtersInfo[key]!.defaultValue ?? ""])
      ),
    [keys, filtersInfo]
  );

  const form = useForm({ defaultValues });

  useEffect(() => {
    if (open) form.reset(filters);
  }, [open, filters, form]);

  // Apply advanced filters to adapter in real-time
  useEffect(() => {
    if (!advancedOpen || !activeFilterInfo) return;

    const mapped = activeFilterInfo.mapExtraFilters
      ? activeFilterInfo.mapExtraFilters(advancedFilterValues)
      : advancedFilterValues;
    const sanitized = stripIndeterminateFilters(
      mapped,
      activeFilterInfo.extraFilters,
      touchedFilters
    );

    const serialized = JSON.stringify(sanitized);
    if (prevAppliedRef.current === serialized) return;
    prevAppliedRef.current = serialized;

    activeFilterInfo.adapter.setFilters?.(sanitized);
    activeFilterInfo.adapter.invalidate?.();
  }, [advancedFilterValues, touchedFilters, activeFilterInfo, advancedOpen]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    await onChange(values);
    setOpen(false);
  };

  const handleReset = async () => {
    form.reset(defaultValues);
    await onChange(null);
    setOpen(false);
  };

  function openAdvancedFilters(
    _filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) {
    setActiveFilterInfo(info);
    prevAppliedRef.current = null;

    const initial = Object.fromEntries(
      Object.entries(info.extraFilters)
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
    setAdvancedFilterValues(initial);
    setTouchedFilters({});
    setAdvancedOpen(true);
  }

  function closeAdvancedFilters() {
    setAdvancedOpen(false);
    setActiveFilterInfo(null);
    prevAppliedRef.current = null;
  }

  function handleOpenChange(value: boolean) {
    if (!value && advancedOpen) {
      closeAdvancedFilters();
    }
    setOpen(value);
  }

  function resetAdvancedFilters() {
    if (!activeFilterInfo) return;

    const cleared = Object.fromEntries(
      Object.entries(activeFilterInfo.extraFilters)
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
    setAdvancedFilterValues(cleared);
    setTouchedFilters({});
    prevAppliedRef.current = null;
    activeFilterInfo.adapter.setFilters?.({});
    activeFilterInfo.adapter.invalidate?.();
  }

  return (
    <>
      <Button
        className={cn("block")}
        variant="default"
        onClick={() => setOpen(true)}
      >
        <FilterIcon />
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          className={cn(
            "flex gap-0 overflow-hidden p-0",
            advancedOpen
              ? "w-[800px] sm:max-w-[800px]"
              : "w-[400px] sm:max-w-[400px]"
          )}
          style={{ transitionProperty: "width", transitionDuration: "300ms" }}
        >
          <Form {...form}>
            {/* Main filters panel */}
            <form
              className="flex h-full w-[400px] shrink-0 flex-col"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <SheetHeader className="px-6 py-4">
                <SheetTitle className="text-base">Filters</SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
                <AdvancedFiltersContext.Provider
                  value={{ openAdvancedFilters }}
                >
                  {keys.map((filterKey) => (
                    <AutoField
                      key={filterKey}
                      info={filtersInfo[filterKey]!}
                      name={filterKey}
                      control={form.control}
                    />
                  ))}
                </AdvancedFiltersContext.Provider>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  loading={form.formState.isSubmitting}
                >
                  Clear
                </Button>
                <Button type="submit" loading={form.formState.isSubmitting}>
                  Apply
                </Button>
              </div>
            </form>

            {/* Advanced filters panel */}
            {activeFilterInfo && (
              <div
                className={cn(
                  "flex w-[400px] shrink-0 flex-col",
                  "transition-all duration-500 ease-in-out",
                  advancedOpen
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none translate-x-[400px] opacity-0"
                )}
              >
                <div className="flex items-center gap-2 px-6 py-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={closeAdvancedFilters}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-base font-semibold">
                    {activeFilterInfo.label ?? "Advanced Filters"}
                  </span>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
                  <AdvancedFiltersPanel
                    info={activeFilterInfo}
                    values={advancedFilterValues}
                    onChange={(key, value) => {
                      setTouchedFilters((prev) => ({ ...prev, [key]: true }));
                      setAdvancedFilterValues((prev) => ({
                        ...prev,
                        [key]: normalizeFilterValue(
                          value,
                          activeFilterInfo.extraFilters[key]!
                        ),
                      }));
                    }}
                    onReset={resetAdvancedFilters}
                  />
                </div>
              </div>
            )}
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function AdvancedFiltersPanel({
  info,
  values,
  onChange,
  onReset,
}: {
  info: AutoFormComplexComboboxValueInfo;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}) {
  const hasFilters = hasActiveFilters(values);

  return (
    <div className="space-y-4">
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
            value={values[key]}
            onChange={(v) => onChange(key, v)}
          />
        ))}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          className="text-muted-foreground hover:bg-muted inline-flex items-center gap-1 rounded px-2 py-1 text-xs"
          onClick={onReset}
          disabled={!hasFilters}
        >
          Reset
        </button>
      </div>
    </div>
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
