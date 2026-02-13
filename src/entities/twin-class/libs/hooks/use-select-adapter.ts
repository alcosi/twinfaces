import { DataListOptionV1 } from "@/entities/datalist-option";
import { useValidTwinsForLinkSelectAdapter as useValidTwinsAdapter } from "@/entities/twin";
import { TwinSimpleFilters, Twin_DETAILED } from "@/entities/twin/server";
import {
  SelectAdapter,
  isPopulatedString,
  isUndefined,
  wrapWithPercent,
} from "@/shared/libs";

import {
  TagSearchFilters,
  TwinClassDynamicMarkerFilters,
  TwinClassDynamicMarker_DETAILED,
  TwinClassFilters,
  TwinClass_DETAILED,
  useFetchTwinClassById,
  useTagSearch,
  useTwinClassDynamicMarkerSearch,
  useTwinClassSearch,
  useValidTwinsForLink,
} from "../../api";

export function useTwinClassSelectAdapter(): SelectAdapter<TwinClass_DETAILED> {
  const { searchByFilters } = useTwinClassSearch();
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
    const response = await searchByFilters({ search, filters });

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

export function useTwinClassBySearchIdSelectAdapter(): SelectAdapter<TwinClass_DETAILED> {
  const { searchBySearchId } = useTwinClassSearch();
  const { fetchTwinClassById } = useFetchTwinClassById();

  type Options = {
    search?: string;
    params?: Record<string, string>;
  };

  async function getById(id: string) {
    return await fetchTwinClassById({
      id,
      query: {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      },
    });
  }

  async function getItems(searchId: string, options?: Options) {
    const { search = "", params } = options ?? {};

    const response = await searchBySearchId({
      searchId,
      narrow: {
        nameI18nLikeList: [wrapWithPercent(search)],
      },
      params,
    });

    return response.data;
  }

  function renderItem({ key = "", name }: TwinClass_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems: (searchId, options) => getItems(searchId, options as Options),
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
): SelectAdapter<DataListOptionV1> {
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
      getItems(search, options as TagSearchFilters),
    renderItem,
  };
}

export function useTwinClassDynamicMarkerSelectAdapter(): SelectAdapter<TwinClassDynamicMarker_DETAILED> {
  const { searchTwinClassDynamicMarker } = useTwinClassDynamicMarkerSearch();

  async function getById(id: string) {
    const response = await searchTwinClassDynamicMarker({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        markerDataListOptionIdList: [id],
      },
    });
    return response.data[0];
  }

  async function getItems(
    search: string,
    filters?: TwinClassDynamicMarkerFilters
  ) {
    const response = await searchTwinClassDynamicMarker({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        markerDataListOptionIdList: isPopulatedString(search)
          ? [search]
          : filters?.markerDataListOptionIdList,
        ...filters,
      },
    });
    return response.data;
  }

  function renderItem(item: TwinClassDynamicMarker_DETAILED | string) {
    return isPopulatedString(item)
      ? item
      : `${item.markerDataListOption?.name} : ${item.markerDataListOption?.id}`;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as TwinClassDynamicMarkerFilters),
    renderItem,
  };
}
