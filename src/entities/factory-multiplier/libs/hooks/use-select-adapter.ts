import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryMultiplier,
  FactoryMultiplierFilters,
  useFactoryMultipliersSearch,
  useFetchFactoryMultiplierById,
} from "../../api";

export function useFactoryMultiplierSelectAdapter(): SelectAdapter<FactoryMultiplier> {
  const { searchFactoryMultipliers } = useFactoryMultipliersSearch();
  const { fetchFactoryMultiplierById } = useFetchFactoryMultiplierById();

  async function getById(id: string) {
    return await fetchFactoryMultiplierById(id);
  }

  async function getItems(search: string, filters?: FactoryMultiplierFilters) {
    const response = await searchFactoryMultipliers({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      filters: {
        descriptionLikeList: [wrapWithPercent(search)],
        ...filters,
      },
    });

    return response.data;
  }

  function renderItem({ inputTwinClass, description }: FactoryMultiplier) {
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
    renderItem,
  };
}
