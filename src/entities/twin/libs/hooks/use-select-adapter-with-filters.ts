import { useRef, useState } from "react";

import { TwinFilters, Twin_DETAILED } from "@/entities/twin/server";
import {
  SelectAdapterWithFilters,
  isPopulatedArray,
  isPopulatedString,
  shortenUUID,
  wrapWithPercent,
} from "@/shared/libs";

import { useTwinFetchByIdV2, useTwinSearch } from "../../api/hooks";

export function useTwinSelectAdapterWithFilters(): SelectAdapterWithFilters<
  Twin_DETAILED,
  TwinFilters
> {
  const { searchTwins } = useTwinSearch();
  const { fetchTwinById } = useTwinFetchByIdV2();

  const filtersRef = useRef<TwinFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: TwinFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const data = await fetchTwinById(id);
    return data as Twin_DETAILED;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const twinNameLikeList = [
      ...(isPopulatedString(search) ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.twinNameLikeList ?? []),
    ];

    const response = await searchTwins({
      pagination,
      filters: {
        ...filtersRef.current,
        twinNameLikeList: twinNameLikeList.length
          ? twinNameLikeList
          : undefined,
      },
    });

    return response.data as Twin_DETAILED[];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ aliases, name, id }: Twin_DETAILED) {
    const twinName = isPopulatedString(name) ? name : shortenUUID(id);

    if (isPopulatedArray(aliases)) {
      return `${aliases?.slice(-1)} : ${twinName}`;
    }

    return twinName;
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
