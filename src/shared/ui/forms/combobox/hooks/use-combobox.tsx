import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  SelectAdapter,
  isArray,
  isUndefined,
  useDebouncedValue,
} from "@/shared/libs";

import { ComboboxHandle, ComboboxProps } from "../types";
import { useMultiComboboxStrategy } from "./use-multi-combobox-strategy";
import { useSingleComboboxStrategy } from "./use-single-combobox-strategy";

const PAGE_SIZE = 10;

type Props<T> = Pick<
  SelectAdapter<T>,
  "getItems" | "getItemsPaginated" | "getItemKey"
> &
  Pick<ComboboxProps<T>, "searchDelay" | "multi"> & {
    ref: ForwardedRef<ComboboxHandle<T>>;
  };

export function useComboboxController<T>({
  getItems,
  getItemsPaginated,
  getItemKey,
  searchDelay = 3000,
  multi,
  ref,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [availableItems, setAvailableItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, searchDelay);

  // Tracks the last loaded page so `loadMore` can request the next one.
  const pageIndexRef = useRef(0);
  // Synchronous guard so rapid observer/scroll callbacks can't fetch the same
  // page twice before `isLoadingMore` state updates.
  const loadingMoreRef = useRef(false);

  const keyOf = useCallback(
    (item: T) => getItemKey?.(item) ?? (item as { id?: string })?.id ?? "",
    [getItemKey]
  );

  const singleComboboxStrategy = useSingleComboboxStrategy(
    selectedItems,
    setSelectedItems
  );
  const multiComboboxStrategy = useMultiComboboxStrategy(
    selectedItems,
    setSelectedItems
  );
  const strategy = multi ? multiComboboxStrategy : singleComboboxStrategy;

  // Load the first page whenever the dropdown opens or the query changes.
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setIsLoading(true);
    pageIndexRef.current = 0;
    loadingMoreRef.current = false;

    const request = getItemsPaginated
      ? getItemsPaginated(debouncedSearchQuery, {
          pageIndex: 0,
          pageSize: PAGE_SIZE,
        })
      : getItems(debouncedSearchQuery);

    request
      .then((items) => {
        if (!active) return;
        setAvailableItems(items);
        setHasMore(Boolean(getItemsPaginated) && items.length === PAGE_SIZE);
      })
      .catch(() => {
        if (!active) return;
        setAvailableItems([]);
        setHasMore(false);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
    // `getItems`/`getItemsPaginated` are intentionally excluded: adapters
    // recreate them every render (they read a live filters ref), so depending
    // on them would refetch on every render and reset pagination.
  }, [isOpen, debouncedSearchQuery]);

  const loadMore = useCallback(() => {
    if (!getItemsPaginated || !hasMore || isLoading || loadingMoreRef.current)
      return;

    const nextPage = pageIndexRef.current + 1;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    getItemsPaginated(debouncedSearchQuery, {
      pageIndex: nextPage,
      pageSize: PAGE_SIZE,
    })
      .then((items) => {
        pageIndexRef.current = nextPage;
        setAvailableItems((prev) => {
          const seen = new Set(prev.map(keyOf));
          const fresh = items.filter((item) => !seen.has(keyOf(item)));
          return [...prev, ...fresh];
        });
        setHasMore(items.length === PAGE_SIZE);
      })
      .catch(() => setHasMore(false))
      .finally(() => {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      });
  }, [getItemsPaginated, hasMore, isLoading, debouncedSearchQuery, keyOf]);

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
    isLoadingMore,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    selectedItems,
    setSelectedItems,
    selectItem,
  };
}
