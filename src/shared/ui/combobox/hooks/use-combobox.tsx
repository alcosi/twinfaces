import {
  isArray,
  isUndefined,
  SelectAdapter,
  useDebouncedValue,
} from "@/shared/libs";
import { ForwardedRef, useEffect, useImperativeHandle, useState } from "react";
import { ComboboxHandle, ComboboxProps } from "../types";
import { useMultiComboboxStrategy } from "./use-multi-combobox-strategy";
import { useSingleComboboxStrategy } from "./use-single-combobox-strategy";

type Props<T> = Pick<SelectAdapter<T>, "getItems"> &
  Pick<ComboboxProps<T>, "searchDelay" | "multi"> & {
    ref: ForwardedRef<ComboboxHandle<T>>;
  };

export function useComboboxController<T>({
  getItems,
  searchDelay = 3000,
  multi,
  ref,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [availableItems, setAvailableItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, searchDelay);

  const singleComboboxStrategy = useSingleComboboxStrategy(
    selectedItems,
    setSelectedItems
  );
  const multiComboboxStrategy = useMultiComboboxStrategy(
    selectedItems,
    setSelectedItems
  );
  const strategy = multi ? multiComboboxStrategy : singleComboboxStrategy;

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    getItems(debouncedSearchQuery)
      .then((items) => setAvailableItems(items))
      .catch(() => setAvailableItems([]))
      .finally(() => setIsLoading(false));
  }, [isOpen, debouncedSearchQuery, getItems]);

  useImperativeHandle(ref, () => ({
    getSelected: () => selectedItems,
    setSelected: (newSelection: T | T[] | undefined) => {
      if (isUndefined(newSelection)) {
        return setSelectedItems([]);
      }

      if (isArray(newSelection)) {
        return setSelectedItems(newSelection);
      }

      return setSelectedItems([newSelection]);
    },
  }));

  const selectItem = (itemKey: string, getItemKey: (item: T) => string) => {
    const itemToSelect = availableItems.find(
      (item) => getItemKey(item) === itemKey
    );
    if (!itemToSelect) return;

    return strategy.handleSelect(itemToSelect, getItemKey);
  };

  return {
    isOpen,
    setIsOpen,
    availableItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedItems,
    setSelectedItems,
    selectItem,
  };
}
