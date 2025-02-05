import {
  isPopulatedString,
  SelectAdapter,
  wrapWithPercent,
} from "@/shared/libs";
import {
  DataListOptionFilters,
  DataListOptionV3,
  useDatalistOptionSearch,
} from "../../api";

export function useDatalistOptionSelectAdapter(): SelectAdapter<DataListOptionV3> {
  const { searchDatalistOptions } = useDatalistOptionSearch();

  async function getById(id: string) {
    const response = await searchDatalistOptions({
      filters: {
        idList: [id],
      },
    });
    return response.data[0];
  }

  async function getItems(search: string, filters?: DataListOptionFilters) {
    const response = await searchDatalistOptions({
      filters: {
        optionI18nLikeList: isPopulatedString(search)
          ? [wrapWithPercent(search)]
          : filters?.optionI18nLikeList,
        ...filters,
      },
    });
    return response.data;
  }

  function renderItem({ name }: DataListOptionV3) {
    return name;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as DataListOptionFilters),
    renderItem,
  };
}
