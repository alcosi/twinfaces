"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { ForwardedRef, useEffect, useRef } from "react";

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
    isLoadingMore,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    selectItem,
  } = useComboboxController({
    getItems: props.getItems,
    getItemsPaginated: props.getItemsPaginated,
    getItemKey: props.getItemKey,
    searchDelay: props.searchDelay ?? 300,
    multi: !!props.multi,
    ref,
  });

  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Keep the latest `loadMore` in a ref so the observer doesn't need to be
  // re-created on every render.
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  // Infinite scroll: load the next page once the sentinel near the bottom of
  // the list becomes visible. This also auto-fills the list when the options
  // don't yet overflow the dropdown (so there's nothing to scroll).
  useEffect(() => {
    if (!isOpen) return;

    const root = listRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMoreRef.current();
        }
      },
      { root, rootMargin: "80px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isOpen, availableItems.length]);

  // When the combobox is rendered inside a Radix Dialog/Sheet, `react-remove-scroll`
  // blocks native wheel/touchpad scrolling for the portaled popover content
  // (the scrollbar still works when dragged). Scroll the list manually to bypass it.
  useEffect(() => {
    const el = listRef.current;
    if (!isOpen || !el) return;

    const onWheel = (event: WheelEvent) => {
      if (el.scrollHeight <= el.clientHeight) return;
      event.preventDefault();
      el.scrollTop += event.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isOpen, availableItems.length]);

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
          <CommandList ref={listRef}>
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
            {hasMore && <div ref={sentinelRef} aria-hidden className="h-px" />}
            {isLoadingMore && (
              <div className="text-muted-foreground py-2 text-center text-xs">
                Loading…
              </div>
            )}
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
