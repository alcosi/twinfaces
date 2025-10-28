import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  DataListOptionFilters,
  DataListOptionV1,
  useDatalistOptionSearch,
} from "../../api";

export function useDatalistOptionSelectAdapter(): SelectAdapter<DataListOptionV1> {
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

  function renderItem(item: DataListOptionV1 | string) {
    // NOTE: The item can be a string when the user creates a new item using Combobox,
    // which relates to the `as T` type assertion issue in `ComboboxProps<T>`.
    // Since `SelectAdapter<T>` doesn't support `T & string`, consider extending `T` with `id` and `name`
    // or updating `SelectAdapter<T>` to handle string values properly.
    // refer to `src/shared/ui/combobox/combobox.tsx`
    return isPopulatedString(item) ? item : item.name;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as DataListOptionFilters),
    renderItem,
  };
}
