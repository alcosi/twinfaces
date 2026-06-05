import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  shortenUUID,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryConditionSet,
  FactoryConditionSetFilters,
  useFactoryConditionSetSearch,
  useFetchFactoryConditionSetById,
} from "../../api";

export function useFactoryConditionSetSelectAdapterWithFilters(): SelectAdapterWithFilters<
  FactoryConditionSet,
  FactoryConditionSetFilters
> {
  const { searchFactoryConditionSet } = useFactoryConditionSetSearch();
  const { fetchFactoryConditionSetById } = useFetchFactoryConditionSetById();

  const filtersRef = useRef<FactoryConditionSetFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: FactoryConditionSetFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchFactoryConditionSetById(id);
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const nameLikeList = [
      ...(search ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.nameLikeList ?? []),
    ];

    const response = await searchFactoryConditionSet({
      pagination,
      filters: {
        ...filtersRef.current,
        nameLikeList,
      },
    });

    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id = "", name }: FactoryConditionSet) {
    return isPopulatedString(name) ? name : shortenUUID(id);
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
