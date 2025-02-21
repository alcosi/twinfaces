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
import { useTagSearch } from "@/entities/twin-class/api/hooks/use-tag-search";
import { TagListOptionFilter } from "@/entities/twin-class";

export function useDatalistOptionSelectAdapter(): SelectAdapter<DataListOptionV3> {
  // const { searchDatalistOptions } = useDatalistOptionSearch();
  const { searchTagListOptions } = useTagSearch();

  async function getById(id: string) {
    const response = await searchTagListOptions({
      twinClassId: id,
    });
    return response.data[0];
  }

  async function getItems(
    id: string,
    search: string,
    filters?: TagListOptionFilter
  ) {
    const response = await searchTagListOptions({
      twinClassId: id,
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
    // NOTE: The item can be a string when the user creates a new item using Combobox,
    // which relates to the `as T` type assertion issue in `ComboboxProps<T>`.
    // Since `SelectAdapter<T>` doesn't support `T & string`, consider extending `T` with `id` and `name`
    // or updating `SelectAdapter<T>` to handle string values properly.
    // refer to `src/shared/ui/combobox/combobox.tsx`
    return isPopulatedString(item) ? item : item.name;
  }

  return {
    getById,
    getItems: (id, search, options) =>
      getItems(id, search, options as TagListOptionFilter),
    renderItem,
  };
}
