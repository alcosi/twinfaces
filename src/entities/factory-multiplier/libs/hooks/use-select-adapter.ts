import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryMultiplierFilters,
  FactoryMultiplier_DETAILED,
  useFactoryMultipliersSearch,
  useFetchFactoryMultiplierById,
} from "../../api";

export function useFactoryMultiplierSelectAdapter(): SelectAdapter<FactoryMultiplier_DETAILED> {
  const { searchFactoryMultipliers } = useFactoryMultipliersSearch();
  const { fetchFactoryMultiplierById } = useFetchFactoryMultiplierById();

  async function getById(id: string) {
    return await fetchFactoryMultiplierById(id);
  }

  async function getItems(
    search: string,
    filters?: FactoryMultiplierFilters,
    pagination: { pageIndex: number; pageSize: number } = {
      pageIndex: 0,
      pageSize: 10,
    }
  ) {
    const response = await searchFactoryMultipliers({
      pagination,
      filters: {
        descriptionLikeList: [wrapWithPercent(search)],
        ...filters,
      },
    });

    return response.data;
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
    getItems: (search, options) =>
      getItems(search, options as FactoryMultiplierFilters),
    getItemsPaginated: (search, pagination) =>
      getItems(search, undefined, pagination),
    renderItem,
  };
}
