import { FilterIcon } from "lucide-react";
import { useState } from "react";
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
  filtersInfo: { [key: string]: AutoFormValueInfo };
  onChange: (values: { [key: string]: any }) => Promise<any>;
}

export function FiltersPopover({ filtersInfo, onChange }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);

  const keys: string[] = [];
  for (const key in filtersInfo) {
    if (isTruthy(filtersInfo[key])) {
      keys.push(key);
    }
  }

  const form = useForm({
    defaultValues: Object.fromEntries(
      keys.map((key) => [key, filtersInfo[key]!.defaultValue ?? ""])
    ),
  });

  async function internalSubmit(newValue: object) {
    try {
      await onChange(newValue);
      setOpen(false);
    } catch (e) {
      console.error("Failed to update FiltersPopover", e);
    }
  }

  async function onReset() {
    form.reset(undefined, { keepDefaultValues: true });

    try {
      await onChange({});
      setOpen(false);
    } catch (e) {
      console.error("Failed to reset FiltersPopover", e);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className={cn("block")}
          onClick={() => {
            setOpen(true);
          }}
          variant="default"
        >
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(internalSubmit)}>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
              {keys.map((filterKey) => {
                return (
                  <AutoField
                    key={filterKey}
                    info={filtersInfo[filterKey]!}
                    name={filterKey}
                    control={form.control}
                  />
                );
              })}
            </div>

            <PopoverFooter>
              <Button
                onClick={onReset}
                type="reset"
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
