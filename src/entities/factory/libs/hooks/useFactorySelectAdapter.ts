import {isPopulatedString, SelectAdapter, wrapWithPercent} from "@/shared/libs";
import {
  Factory,
  FactoryFilters,
  useFactorySearch,
  useFetchFactoryById,
} from "@/entities/factory";

export function useFactorySelectAdapter(): SelectAdapter<Factory> {
  const { searchFactories } = useFactorySearch();
  const { fetchFactoryById } = useFetchFactoryById();

  async function getById(id: string) {
    try {
      return await fetchFactoryById(id);
    } catch (error) {
      throw new Error(`Factory with ID ${id} not found.`);
    }
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
