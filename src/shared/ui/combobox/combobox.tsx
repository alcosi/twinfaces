"use client";

import { cn, fixedForwardRef, isPopulatedArray } from "@/shared/libs";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ForwardedRef } from "react";
import { useComboboxController } from "./hooks";
import { SelectedOptions } from "./selected-options";
import { ComboboxHandle, ComboboxProps } from "./types";

export const Combobox = fixedForwardRef(function Combobox<T>(
  props: ComboboxProps<T>,
  ref: ForwardedRef<ComboboxHandle<T>>
) {
  const {
    isOpen,
    setIsOpen,
    selectedItems,
    setSelectedItems,
    availableItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectItem,
  } = useComboboxController({
    getItems: props.getItems,
    searchDelay: props.searchDelay ?? 300,
    multi: !!props.multi,
    ref,
  });

  function onSelect(newKey: string) {
    const selectedItem = selectItem(newKey, props.getItemKey);
    const updatedSelection: T[] = Array.isArray(selectedItem)
      ? selectedItem
      : selectedItem
        ? [selectedItem]
        : [];
    props.onSelect?.(updatedSelection);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            "flex w-auto min-w-[120px] h-auto min-h-10 justify-between truncate",
            props.buttonClassName
          )}
        >
          {props.multi ? (
            <SelectedOptions
              selected={selectedItems}
              getItemKey={props.getItemKey}
              getItemLabel={props.getItemLabel}
              onChange={(newSelected) => {
                setSelectedItems(newSelected);
                props.onSelect?.(newSelected);
              }}
              placeholder={props.selectPlaceholder}
              multi={props.multi}
            />
          ) : (
            <>
              {isPopulatedArray(selectedItems) ? (
                <span className="truncate max-w-80">
                  {props.getItemLabel(selectedItems[0]!)}
                </span>
              ) : (
                <span className="opacity-50">{props.selectPlaceholder}</span>
              )}
            </>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", props.contentClassName)}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={props.searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            loading={isLoading}
          />
          <CommandEmpty>{props.noItemsText}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {availableItems.map((item) => (
                <CommandItem
                  key={props.getItemKey(item)}
                  value={props.getItemKey(item)}
                  onSelect={() => onSelect(props.getItemKey(item))}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItems.some(
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
});
