import {
  Twin_DETAILED,
  TwinSimpleFilters,
  useValidTwinsForLinkSelectAdapter as useValidTwinsAdapter,
} from "@/entities/twin";
import {
  isPopulatedString,
  isUndefined,
  SelectAdapter,
  wrapWithPercent,
} from "@/shared/libs";
import {
  TwinClass_DETAILED,
  TwinClassFilters,
  useFetchTwinClassById,
  useTwinClassSearchV1,
  useValidTwinsForLink,
} from "../../api";

export function useTwinClassSelectAdapter(): SelectAdapter<TwinClass_DETAILED> {
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { fetchTwinClassById } = useFetchTwinClassById();

  async function getById(id: string) {
    const response = await fetchTwinClassById({
      id,
      query: {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      },
    });

    if (!response.data?.twinClass) {
      throw new Error(`TwinClass with ID ${id} not found.`);
    }

    return response.data.twinClass as TwinClass_DETAILED;
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
