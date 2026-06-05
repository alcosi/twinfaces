import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { TierFilters, Tier_DETAILED, useTierSearch } from "../../api";

export function useTierSelectAdapterWithFilters(): SelectAdapterWithFilters<
  Tier_DETAILED,
  TierFilters
> {
  const { searchTiers } = useTierSearch();

  const filtersRef = useRef<TierFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: TierFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const response = await searchTiers({
      filters: { idList: toArrayOfString(toArray(id)) },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTiers({
      search,
      pagination,
      filters: filtersRef.current,
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: Tier_DETAILED) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
