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
import React, { ForwardedRef } from "react";
import { ComboboxHandle, ComboboxProps } from "./types";
import { useComboboxLogic } from "./useComboboxLogic";

export const Combobox = fixedForwardRef(ComboboxInternal);

function ComboboxInternal<T>(
  props: ComboboxProps<T>,
  ref: ForwardedRef<ComboboxHandle<T>>
) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<T | undefined>(undefined);
  const { items, loadingItems, search, setSearch } = useComboboxLogic({
    open,
    getItems: props.getItems,
    searchDelay: props.searchDelay ?? 300,
    multi: false,
    ref,
  });

  function onSelect(newKey: string) {
    const newItem = items.find((item) => props.getItemKey(item) === newKey);
    let newSelected = newItem;
    if (selected && props.getItemKey(selected) === newKey) {
      newSelected = undefined;
    }
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
          className={cn([
            "w-auto min-w-[120px] justify-between",
            props.buttonClassName,
          ])}
        >
          {selected ? (
            <span className="truncate max-w-80">
              {props.getItemLabel(selected)}
            </span>
          ) : (
            <span className="opacity-50">{props.selectPlaceholder}</span>
          )}
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
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected &&
                        props.getItemKey(selected) === props.getItemKey(item)
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
