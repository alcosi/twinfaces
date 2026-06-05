import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  FactoryCondition,
  FactoryConditionFilters,
  useFactoryConditionSearch,
  useFetchFactoryConditionById,
} from "../../api";

export function useFactoryConditionSelectAdapterWithFilters(): SelectAdapterWithFilters<
  FactoryCondition,
  FactoryConditionFilters
> {
  const { searchFactoryCondition } = useFactoryConditionSearch();
  const { fetchFactoryConditionById } = useFetchFactoryConditionById();

  const filtersRef = useRef<FactoryConditionFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: FactoryConditionFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchFactoryConditionById(id);
  }

  async function getItemsPaginated(
    _search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchFactoryCondition({
      pagination,
      filters: {
        ...filtersRef.current,
      },
    });

    return response.data;
  }

  async function getItems() {
    return getItemsPaginated("", { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, description }: FactoryCondition) {
    return isPopulatedString(id) && isPopulatedString(description)
      ? `${id} | ${description}`
      : isPopulatedString(id)
        ? id
        : isPopulatedString(description)
          ? description
          : "N/A";
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
