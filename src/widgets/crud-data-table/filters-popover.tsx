import { AutoField, AutoFormValueInfo } from "@/components/auto-field";
import { Button } from "@/components/base/button";
import { Form } from "@/components/base/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { cn } from "@/shared/libs";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FiltersPopoverProps {
  filtersInfo: { [key: string]: AutoFormValueInfo };
  onChange: (values: { [key: string]: any }) => Promise<any>;
}

export function FiltersPopover({ filtersInfo, onChange }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);

  const keys = Object.keys(filtersInfo);

  const form = useForm({
    defaultValues: Object.fromEntries(
      keys.map((key) => [key, filtersInfo[key]!.defaultValue ?? ""])
    ),
  });

  async function internalSubmit(newValue: object) {
    console.log("submit", newValue);
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
      <PopoverContent className="max-h-[80vh] overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(internalSubmit)}
            className="space-y-4"
          >
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

            <div className={"flex flex-row justify-end gap-2"}>
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
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
