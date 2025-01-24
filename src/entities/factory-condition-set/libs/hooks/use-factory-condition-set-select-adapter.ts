import {
  isPopulatedString,
  SelectAdapter,
  wrapWithPercent,
} from "@/shared/libs";
import { FactoryConditionSet, FactoryConditionSetFilters } from "../../api";
import { useFactoryConditionSetSearch } from "../../api/hooks";
import { useFetchFactoryConditionSetById } from "./use-fetch-factory-condition-set-by-id";

export function useFactoryConditionSetSelectAdapter(): SelectAdapter<FactoryConditionSet> {
  const { searchFactoryConditionSet } = useFactoryConditionSetSearch();
  const { fetchFactoryConditionSetById } = useFetchFactoryConditionSetById();

  async function getById(id: string) {
    return await fetchFactoryConditionSetById(id);
  }

  async function getItems(
    search: string,
    filters?: FactoryConditionSetFilters
  ) {
    const response = await searchFactoryConditionSet({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      filters: {
        nameLikeList: [wrapWithPercent(search)],
        ...filters,
      },
    });

    return response.data;
  }

  function renderItem({ id, name }: FactoryConditionSet) {
    return isPopulatedString(name) ? name : id;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as FactoryConditionSetFilters),
    renderItem,
  };
}
