import { FilterIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  AdvancedFilterPanels,
  useAdvancedFilterLevels,
} from "@/components/advanced-filters";
import { AdvancedFiltersContext } from "@/components/advanced-filters-context";
import { AutoField, AutoFormValueInfo } from "@/components/auto-field";

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

  const {
    renderedLevels,
    scrollRef,
    visibleWidth,
    openAdvancedFilters,
    openAdvancedFiltersFromLevel,
    closeFrom,
    reset,
  } = useAdvancedFilterLevels();

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

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    setOpen(value);
  }

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
              <AdvancedFilterPanels
                renderedLevels={renderedLevels}
                openAdvancedFiltersFromLevel={openAdvancedFiltersFromLevel}
                closeFrom={closeFrom}
              />
            </div>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
