import { useRef, useState } from "react";

import {
  TwinFlowFilters,
  TwinFlow_DETAILED,
  useTwinFlowFetchByIdV1,
  useTwinFlowSearchV1,
} from "@/entities/twin-flow";
import { SelectAdapterWithFilters, isEmptyString } from "@/shared/libs";

export function useTwinFlowSelectAdapterWithFilters(): SelectAdapterWithFilters<
  TwinFlow_DETAILED,
  TwinFlowFilters
> {
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const { fetchTwinFlowById } = useTwinFlowFetchByIdV1();

  const filtersRef = useRef<TwinFlowFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: TwinFlowFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const response = await fetchTwinFlowById(id);
    return response as TwinFlow_DETAILED;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinFlows({
      search,
      pagination,
      filters: filtersRef.current,
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, id }: TwinFlow_DETAILED) {
    return !isEmptyString(name) ? name : id;
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
