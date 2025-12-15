import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  TwinClassFieldV1_DETAILED,
  useFetchTwinClassFieldById,
  useTwinClassFieldSearch,
} from "../../api";

export function useTwinClassFieldSelectAdapterWithFilters(): SelectAdapterWithFilters<
  TwinClassFieldV1_DETAILED,
  any
> {
  const { searchByFilters } = useTwinClassFieldSearch();
  const { fetchTwinClassFieldById } = useFetchTwinClassFieldById();

  const filtersRef = useRef<any>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: any) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  const hasAdvancedFilters = Object.keys(filtersRef.current ?? {}).length > 0;

  async function getItems(search: string) {
    const res = await searchByFilters({
      search: hasAdvancedFilters ? undefined : search,
      filters: filtersRef.current,
    });

    return res.data;
  }

  function renderItem({ key = "", name }: TwinClassFieldV1_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById: fetchTwinClassFieldById,
    getItems,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
