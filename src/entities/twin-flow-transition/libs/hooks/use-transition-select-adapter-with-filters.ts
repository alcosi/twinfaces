import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  TwinFlowTransitionFilters,
  TwinFlowTransition_DETAILED,
  useFetchTwinFlowTransitionById,
  useTwinFlowTransitionSearchV1,
} from "../../api";

export function useTransitionSelectAdapterWithFilters(): SelectAdapterWithFilters<
  TwinFlowTransition_DETAILED,
  TwinFlowTransitionFilters
> {
  const { searchTwinFlowTransitions } = useTwinFlowTransitionSearchV1();
  const { fetchTwinFlowTransitionById } = useFetchTwinFlowTransitionById();

  const filtersRef = useRef<TwinFlowTransitionFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: TwinFlowTransitionFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const twinFlowTransition = await fetchTwinFlowTransitionById(id);
    return twinFlowTransition as TwinFlowTransition_DETAILED;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinFlowTransitions({
      search,
      pagination,
      filters: filtersRef.current,
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: TwinFlowTransition_DETAILED) {
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
