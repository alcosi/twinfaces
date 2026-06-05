import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import { useTwinTriggerSearch } from "../../api/hooks";
import { TwinTriggerFilters, TwinTrigger_DETAILED } from "../../api/types";

export function useTwinTriggerSelectAdapterWithFilters(): SelectAdapterWithFilters<
  TwinTrigger_DETAILED,
  TwinTriggerFilters
> {
  const { searchTwinTriggers } = useTwinTriggerSearch();

  const filtersRef = useRef<TwinTriggerFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: TwinTriggerFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const response = await searchTwinTriggers({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const nameLikeList = [
      ...(search ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.nameLikeList ?? []),
    ];

    const response = await searchTwinTriggers({
      pagination,
      filters: {
        ...filtersRef.current,
        nameLikeList: nameLikeList.length ? nameLikeList : undefined,
      },
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, name }: TwinTrigger_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
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
