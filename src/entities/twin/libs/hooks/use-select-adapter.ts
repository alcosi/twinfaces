import {
  Twin,
  TwinFilters,
  TwinSimpleFilters,
  Twin_DETAILED,
} from "@/entities/twin/server";
import {
  SelectAdapter,
  createFixedSelectAdapter,
  isPopulatedArray,
  isPopulatedString,
  isUndefined,
  shortenUUID,
  wrapWithPercent,
} from "@/shared/libs";

import {
  useFetchValidHeadTwins,
  useTwinFetchByIdV2,
  useTwinSearchV3,
  useValidTwinsForLink,
} from "../../api/hooks";
import { TwinBasicFields, TwinTouchIds } from "../constants";
import { formatTwinDisplay } from "../helpers";

export function useTwinSelectAdapter(): SelectAdapter<Twin_DETAILED> {
  const { searchTwins } = useTwinSearchV3();
  const { fetchTwinById } = useTwinFetchByIdV2();

  async function getById(id: string) {
    const data = await fetchTwinById(id);
    return data as Twin_DETAILED;
  }

  async function getItems(search: string, filters?: TwinFilters) {
    const response = await searchTwins({
      filters: {
        twinNameLikeList: isPopulatedString(search)
          ? [wrapWithPercent(search)]
          : filters?.twinNameLikeList,
        ...filters,
      },
    });
    return response.data as Twin_DETAILED[];
  }

  function renderItem({ aliases, name, id }: Twin_DETAILED) {
    const twinName = isPopulatedString(name) ? name : shortenUUID(id);

    if (isPopulatedArray(aliases)) {
      return `${aliases?.slice(-1)} : ${twinName}`;
    }

    return twinName;
  }

  return {
    getById,
    getItems: (search, options) => getItems(search, options as TwinFilters),
    renderItem,
  };
}

export function useTwinBasicFieldSelectAdapter(): SelectAdapter<
  (typeof TwinBasicFields)[number]
> {
  return createFixedSelectAdapter(TwinBasicFields);
}

export function useTwinTouchIdSelectAdapter(): SelectAdapter<
  (typeof TwinTouchIds)[number]
> {
  return createFixedSelectAdapter(TwinTouchIds);
}

export function useTwinHeadSelectAdapter(): SelectAdapter<Twin> {
  const { fetchValidHeadTwins } = useFetchValidHeadTwins();

  async function getById(id: string) {
    return { id } as Twin;
  }

  async function getItems(search: string, filters?: { twinClassId: string }) {
    const response = await fetchValidHeadTwins({
      search,
      twinClassId: filters?.twinClassId ?? "",
    });

    return response.data;
  }

  function renderItem(twin: Twin) {
    return formatTwinDisplay(twin);
  }

  return {
    getById,
    getItems: (search, options) => getItems(search, options as any),
    renderItem,
  };
}

export function useValidTwinsForLinkSelectAdapter({
  twinId,
  linkId,
}: {
  twinId?: string;
  linkId: string;
}): SelectAdapter<Twin_DETAILED> {
  const { fetchTwinById } = useTwinFetchByIdV2();
  const { fetchValidTwinsForLink } = useValidTwinsForLink();

  async function getById(id: string) {
    const data = await fetchTwinById(id);
    return data as Twin_DETAILED;
  }

  async function getItems(search: string, filters?: TwinSimpleFilters) {
    if (isUndefined(twinId)) return [];

    const _filters = {
      ...filters,
      nameLike: isPopulatedString(search)
        ? wrapWithPercent(search)
        : filters?.nameLike,
    };

    const { data } = await fetchValidTwinsForLink({
      twinId,
      linkId,
      filters: _filters,
    });
    return data;
  }

  function renderItem({ aliases, name, id }: Twin_DETAILED) {
    const twinName = name ?? id;
    return aliases?.length ? `${aliases[0]} : ${twinName}` : twinName;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as TwinSimpleFilters),
    renderItem,
  };
}
