import {
  Factory,
  FactoryFilters,
  useFactorySearch,
  useFetchFactoryById,
} from "@/entities/factory";
import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

export function useFactorySelectAdapter(): SelectAdapter<Factory> {
  const { searchFactories } = useFactorySearch();
  const { fetchFactoryById } = useFetchFactoryById();

  async function getById(id: string) {
    return await fetchFactoryById(id);
  }

  async function getItems(search: string, filters?: FactoryFilters) {
    const response = await searchFactories({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      filters: {
        keyLikeList: [wrapWithPercent(search)],
        ...filters,
      },
    });
    return response.data;
  }

  function renderItem({ key = "", name }: Factory) {
    return isPopulatedString(name) ? name : key;
  }

  return {
    getById,
    getItems: (search, options) => getItems(search, options as FactoryFilters),
    renderItem,
  };
}
