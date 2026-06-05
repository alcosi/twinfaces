import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import {
  FactoryCondition,
  FactoryConditionFilters,
  useFactoryConditionSearch,
  useFetchFactoryConditionById,
} from "../../api";

export function useFactoryConditionSelectAdapter(): SelectAdapter<FactoryCondition> {
  const { searchFactoryCondition } = useFactoryConditionSearch();
  const { fetchFactoryConditionById } = useFetchFactoryConditionById();

  async function getById(id: string) {
    return await fetchFactoryConditionById(id);
  }

  async function getItems(
    search: string,
    filters?: FactoryConditionFilters,
    pagination: { pageIndex: number; pageSize: number } = {
      pageIndex: 0,
      pageSize: 10,
    }
  ) {
    const response = await searchFactoryCondition({
      pagination,
      filters: {
        ...filters,
      },
    });

    return response.data;
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
    getItems: (search, options) =>
      getItems(search, options as FactoryConditionFilters),
    getItemsPaginated: (search, pagination) =>
      getItems(search, undefined, pagination),
    renderItem,
  };
}
