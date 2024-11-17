import { useDebouncedValue } from "@/shared/libs";
import { ForwardedRef, useEffect, useImperativeHandle, useState } from "react";
import { ComboboxHandle } from "./types";

export function useComboboxLogic<T>({
  open,
  getItems,
  searchDelay,
  multi,
  ref,
}: {
  open: boolean;
  getItems: (search: string) => Promise<T[]>;
  searchDelay: number;
  multi: boolean;
  ref: ForwardedRef<ComboboxHandle<T>>;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, searchDelay);
  // Unify the selection state as an array
  const [selected, setSelected] = useState<T[]>([]);

  useEffect(() => {
    if (!open) return;
    setLoadingItems(true);
    getItems(debouncedSearch)
      .then((items) => setItems(items))
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  }, [open, debouncedSearch, getItems]);

  useImperativeHandle(ref, () => ({
    getSelected: () => selected,
    setSelected: (newSelected: T | T[] | undefined) => {
      if (multi) {
        setSelected((newSelected ?? []) as T[]);
      } else {
        setSelected((newSelected ? [newSelected] : []) as T[]);
      }
    },
  }));

  return {
    items,
    loadingItems,
    search,
    setSearch,
    selected,
    setSelected,
  };
}
