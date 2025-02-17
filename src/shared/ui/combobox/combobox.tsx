"use client";

import { cn, fixedForwardRef } from "@/shared/libs";
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
import { Check, ChevronsUpDown, CircleFadingPlus, Plus } from "lucide-react";
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

  function getItemKey(item: T): string {
    if (props.getItemKey) return props.getItemKey(item);

    return (item as { id: string }).id;
  }

  function onSelect(newKey: string) {
    const selectedItem = selectItem(newKey, getItemKey);
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
          disabled={props.disabled}
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            "flex w-auto min-w-[120px] h-auto min-h-10 justify-between truncate disabled:bg-secondary",
            props.buttonClassName
          )}
        >
          <SelectedOptions
            selected={selectedItems}
            getItemKey={getItemKey}
            renderItem={props.renderItem}
            onChange={(newSelected) => {
              setSelectedItems(newSelected);
              props.onSelect?.(newSelected);
            }}
            placeholder={props.selectPlaceholder}
            multi={props.multi}
          />
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
          {props.ownItems && searchQuery && (
            <Button
              variant="ghost"
              className={cn(
                "flex w-auto min-w-[120px] h-auto min-h-10 justify-between truncate disabled:bg-secondary",
                props.buttonClassName
              )}
              onClick={() => {
                const newItem = searchQuery as T; // if object({ id: z.string().uuid(), name: z.string() }),
                const isDuplicate = selectedItems.some((item) =>
                  typeof item === "string"
                    ? item === searchQuery
                    : getItemKey(item) === searchQuery
                );
                if (isDuplicate) {
                  setIsOpen(false);
                  setSearchQuery("");
                  return;
                }
                const updatedSelection = props.multi
                  ? [...selectedItems, newItem]
                  : [newItem];
                setSelectedItems(updatedSelection);
                props.onSelect?.(updatedSelection);
                setIsOpen(false);
                setSearchQuery("");
              }}
            >
              {`add new tag: "${searchQuery}"`}
              <CircleFadingPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
          <CommandEmpty>{props.noItemsText}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {availableItems.map((item) => (
                <CommandItem
                  key={getItemKey(item)}
                  value={getItemKey(item)}
                  onSelect={() => onSelect(getItemKey(item))}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItems.some(
                        (selectedItem) =>
                          getItemKey(selectedItem) === getItemKey(item)
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {props.renderItem?.(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
