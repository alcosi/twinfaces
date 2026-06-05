import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryMultiplierFilters,
  FactoryMultiplier_DETAILED,
  useFactoryMultipliersSearch,
  useFetchFactoryMultiplierById,
} from "../../api";

export function useFactoryMultiplierSelectAdapterWithFilters(): SelectAdapterWithFilters<
  FactoryMultiplier_DETAILED,
  FactoryMultiplierFilters
> {
  const { searchFactoryMultipliers } = useFactoryMultipliersSearch();
  const { fetchFactoryMultiplierById } = useFetchFactoryMultiplierById();

  const filtersRef = useRef<FactoryMultiplierFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: FactoryMultiplierFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchFactoryMultiplierById(id);
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const descriptionLikeList = [
      ...(search ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.descriptionLikeList ?? []),
    ];

    const response = await searchFactoryMultipliers({
      pagination,
      filters: {
        ...filtersRef.current,
        descriptionLikeList,
      },
    });

    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({
    inputTwinClass,
    description,
  }: FactoryMultiplier_DETAILED) {
    return isPopulatedString(description) &&
      isPopulatedString(inputTwinClass?.name)
      ? `${inputTwinClass.name} | ${description}`
      : isPopulatedString(description)
        ? `N/A | ${description}`
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
