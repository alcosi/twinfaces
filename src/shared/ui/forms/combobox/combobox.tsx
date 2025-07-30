"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { ForwardedRef } from "react";

import {
  cn,
  fixedForwardRef,
  isPopulatedString,
  isTruthy,
} from "@/shared/libs";
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
import { Separator } from "@/shared/ui/separator";

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
            "disabled:bg-secondary flex h-auto min-h-10 w-auto min-w-full justify-between truncate",
            props.buttonClassName
          )}
        >
          <SelectedOptions
            selected={selectedItems}
            getItemKey={getItemKey}
            onChange={(newSelected) => {
              setSelectedItems(newSelected);
              props.onSelect?.(newSelected);
            }}
            renderItem={props.renderItem}
            selectPlaceholder={props.selectPlaceholder}
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
          <CommandEmpty className="text-center">
            <i>{props.noItemsText || "No items..."}</i>
          </CommandEmpty>
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
        {props.creatable && isTruthy(searchQuery.trim()) && (
          <>
            <Separator />
            <Button
              variant="ghost"
              className="flex w-full justify-start truncate font-bold"
              onClick={() => {
                // TODO: Reevaluate `as T` type assertion.
                // `ComboboxProps<T>` depends on `SelectAdapter<T>`, but `T` lacks `T & string` support.
                // Consider extending `T` with `id` and `name` or updating `SelectAdapter<T>` to handle strings.
                const newItem = searchQuery as T;
                const isDuplicate = selectedItems.some((item) =>
                  isPopulatedString(item)
                    ? item === searchQuery
                    : getItemKey(item) === searchQuery
                );

                if (!isDuplicate) {
                  const updatedSelection = props.multi
                    ? [...selectedItems, newItem]
                    : [newItem];
                  setSelectedItems(updatedSelection);
                  props.onSelect?.(updatedSelection);
                }

                setIsOpen(false);
                setSearchQuery("");
              }}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              {`${searchQuery} (New)`}
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
});
