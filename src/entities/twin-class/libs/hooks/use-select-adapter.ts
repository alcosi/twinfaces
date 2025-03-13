import { DataListOptionV3 } from "@/entities/datalist-option";
import {
  TwinSimpleFilters,
  Twin_DETAILED,
  useValidTwinsForLinkSelectAdapter as useValidTwinsAdapter,
} from "@/entities/twin";
import {
  SelectAdapter,
  isPopulatedString,
  isUndefined,
  wrapWithPercent,
} from "@/shared/libs";

import {
  TagSearchFilters,
  TwinClassFilters,
  TwinClass_DETAILED,
  useFetchTwinClassById,
  useTagSearch,
  useTwinClassSearchV1,
  useValidTwinsForLink,
} from "../../api";

export function useTwinClassSelectAdapter(): SelectAdapter<TwinClass_DETAILED> {
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { fetchTwinClassById } = useFetchTwinClassById();

  async function getById(id: string) {
    return await fetchTwinClassById({
      id,
      query: {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      },
    });
  }

  async function getItems(search: string, filters?: TwinClassFilters) {
    const response = await searchTwinClasses({ search, filters });

    return response.data;
  }

  function renderItem({ key = "", name }: TwinClass_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as TwinClassFilters),
    renderItem,
  };
}

export function useValidTwinsForLinkSelectAdapter({
  twinClassId,
  linkId,
}: {
  twinClassId?: string;
  linkId: string;
}): SelectAdapter<Twin_DETAILED> {
  const adapter = useValidTwinsAdapter({
    twinId: "",
    linkId,
  });
  const { fetchValidTwinsForLink } = useValidTwinsForLink();

  async function getItems(search: string, filters?: TwinSimpleFilters) {
    if (isUndefined(twinClassId)) return [];

    const _filters = {
      ...filters,
      nameLike: isPopulatedString(search)
        ? wrapWithPercent(search)
        : filters?.nameLike,
    };

    const { data } = await fetchValidTwinsForLink({
      twinClassId,
      linkId,
      filters: _filters,
    });
    return data;
  }

  return {
    getById: adapter.getById,
    getItems: (search, options) =>
      getItems(search, options as TwinSimpleFilters),
    renderItem: adapter.renderItem,
  };
}

export function useTagsByTwinClassIdSelectAdapter(
  twinClassId?: string
): SelectAdapter<DataListOptionV3> {
  const { searchTags } = useTagSearch(twinClassId);

  async function getById() {
    return {};
  }

  async function getItems(search: string, filters: TagSearchFilters) {
    if (isUndefined(twinClassId)) {
      return [];
    }

    const response = await searchTags({
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
    getItems: (search, options) =>
      getItems(search, options as TagSearchFilters),
    renderItem,
  };
}
