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
        optionLikeList: isPopulatedString(search)
          ? [wrapWithPercent(search)]
          : filters?.optionLikeList,
        ...filters,
      },
    });
    return response.data;
  }

  function renderItem(item: DataListOptionV3 | string) {
    return typeof item === "string" ? item : item.name;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as DataListOptionFilters),
    renderItem,
  };
}
