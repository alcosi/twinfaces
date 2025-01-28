import {
  isPopulatedString,
  SelectAdapter,
  shortenUUID,
  wrapWithPercent,
} from "@/shared/libs";
import {
  FactoryConditionSet,
  FactoryConditionSetFilters,
  useFactoryConditionSetSearch,
  useFetchFactoryConditionSetById,
} from "../../api";

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

  function renderItem({ id = "", name }: FactoryConditionSet) {
    return isPopulatedString(name) ? name : shortenUUID(id);
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as FactoryConditionSetFilters),
    renderItem,
  };
}
