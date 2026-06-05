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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const res = await searchByFilters({
      search,
      pagination,
      filters: filtersRef.current,
    });

    return res.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ key = "", name }: TwinClassFieldV1_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById: fetchTwinClassFieldById,
    getItems,
    getItemsPaginated,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
