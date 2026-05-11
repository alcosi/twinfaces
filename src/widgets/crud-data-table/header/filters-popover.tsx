import { FilterIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";

import { cn, isTruthy } from "@/shared/libs";
import {
  Button,
  Form,
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from "@/shared/ui";

interface FiltersPopoverProps {
  filtersInfo: Record<string, AutoFormValueInfo>;
  filters: Record<string, unknown>;
  onChange: (values: Record<string, unknown> | null) => Promise<void>;
}

export function FiltersPopover({
  filtersInfo,
  filters,
  onChange,
}: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn("block")} variant="default">
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
              {keys.map((filterKey) => (
                <AutoField
                  key={filterKey}
                  info={filtersInfo[filterKey]!}
                  name={filterKey}
                  control={form.control}
                />
              ))}
            </div>

            <PopoverFooter>
              <Button
                onClick={handleReset}
                type="button"
                variant="outline"
                loading={form.formState.isSubmitting}
              >
                Clear
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Apply
              </Button>
            </PopoverFooter>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
