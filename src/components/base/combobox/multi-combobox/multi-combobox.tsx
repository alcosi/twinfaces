"use client";

import { Button } from "@/components/base/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/base/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { cn, fixedForwardRef } from "@/shared/libs";
import { Check, ChevronsUpDown } from "lucide-react";
import { ForwardedRef, useState } from "react";
import { ComboboxHandle, MultiComboboxProps } from "../types";
import { useComboboxLogic } from "../useComboboxLogic";
import { SelectedOptions } from "./selected-options";

export const MultiCombobox = fixedForwardRef(ComboboxInternal);

function ComboboxInternal<T>(
  props: MultiComboboxProps<T>,
  ref: ForwardedRef<ComboboxHandle<T>>
) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<T[]>([]);
  const { items, loadingItems, search, setSearch } = useComboboxLogic({
    open,
    getItems: props.getItems,
    searchDelay: props.searchDelay ?? 300,
    multi: true,
    ref,
  });

  function handleOnSelect(newKey: string) {
    const newItem = items.find((item) => props.getItemKey(item) === newKey);
    if (!newItem) return;

    const newSelected = selected.some(
      (item) => props.getItemKey(item) === newKey
    )
      ? selected.filter((item) => props.getItemKey(item) !== newKey)
      : [...selected, newItem];

    setSelected(newSelected);
    props.onSelect?.(newSelected);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex w-auto min-w-[120px] h-auto min-h-10 justify-between truncate max-w-80",
            props.buttonClassName
          )}
        >
          <SelectedOptions
            selected={selected}
            getItemKey={props.getItemKey}
            getItemLabel={props.getItemLabel}
            onChange={(newSelected) => {
              setSelected(newSelected);
              props.onSelect?.(newSelected);
            }}
            placeholder={props.selectPlaceholder}
            multi={props.multi}
          />
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(["w-full p-0", props.contentClassName])}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={props.searchPlaceholder}
            value={search}
            onValueChange={setSearch}
            loading={loadingItems}
          />
          <CommandEmpty>{props.noItemsText}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={props.getItemKey(item)}
                  value={props.getItemKey(item)}
                  onSelect={handleOnSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.some(
                        (selectedItem) =>
                          props.getItemKey(selectedItem) ===
                          props.getItemKey(item)
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {props.renderInList?.(item) ?? props.getItemLabel(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
