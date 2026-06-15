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

interface AdvancedFilterLevel {
  key: string;
  info: AutoFormComplexComboboxValueInfo;
}

export function FiltersSidebar({
  filtersInfo,
  filters,
  onChange,
}: FiltersSidebarProps) {
  const TRANSITION_MS = 300;
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState<AdvancedFilterLevel[]>([]);
  const [renderedLevels, setRenderedLevels] = useState<AdvancedFilterLevel[]>(
    []
  );

  useEffect(() => {
    if (levels.length >= renderedLevels.length) {
      setRenderedLevels(levels);
    } else {
      const t = setTimeout(() => setRenderedLevels(levels), TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [levels]);

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
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) {
    setLevels((prev) => {
      const existingIndex = prev.findIndex((level) => level.key === filterKey);
      if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);
      return [{ key: filterKey, info }];
    });
  }

  function openAdvancedFiltersFromLevel(parentIndex: number) {
    return (filterKey: string, info: AutoFormComplexComboboxValueInfo) => {
      setLevels((prev) => {
        const existingIndex = prev.findIndex(
          (level) => level.key === filterKey
        );
        if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);
        return [...prev.slice(0, parentIndex + 1), { key: filterKey, info }];
      });
    };
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setLevels([]);
      setRenderedLevels([]);
    }
    setOpen(value);
  }

  // Panels are laid out in a horizontal stack. The drawer grows up to
  // MAX_VISIBLE_LEVELS extra panels (and never past the viewport); deeper
  // chains scroll horizontally instead of overflowing the screen.
  const PANEL_WIDTH = 400;
  const MAX_VISIBLE_LEVELS = 3;
  const visibleWidth =
    PANEL_WIDTH * (1 + Math.min(levels.length, MAX_VISIBLE_LEVELS));

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Wait for the width transition to settle, then scroll the newest panel
    // into view — but only when the stack actually overflows the drawer.
    const t = setTimeout(() => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      }
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [renderedLevels.length]);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <FilterIcon />
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          className={cn("overflow-hidden p-0")}
          style={{
            width: `min(${visibleWidth}px, 95vw)`,
            maxWidth: `min(${visibleWidth}px, 95vw)`,
            transitionProperty: "width, max-width",
            transitionDuration: "300ms",
          }}
        >
          <Form {...form}>
            <div
              ref={scrollRef}
              className="flex h-full w-full overflow-x-auto"
              style={{ scrollBehavior: "smooth" }}
            >
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

                <div className="border-border flex justify-end gap-2 border-t px-6 py-4">
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

              {/* Advanced filter panels (stack-based, supports N levels) */}
              {renderedLevels.map((level, index) => (
                <AdvancedFilterPanel
                  key={`${level.key}-${index}`}
                  level={level}
                  onOpenNext={openAdvancedFiltersFromLevel(index)}
                  onClose={() => setLevels((prev) => prev.slice(0, index))}
                />
              ))}
            </div>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function AdvancedFilterPanel({
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
