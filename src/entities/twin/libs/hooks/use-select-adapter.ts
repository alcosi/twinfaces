import {
  createFixedSelectAdapter,
  isPopulatedArray,
  isPopulatedString,
  SelectAdapter,
  shortenUUID,
  wrapWithPercent,
} from "@/shared/libs";
import { Twin, Twin_DETAILED, TwinFilters } from "../../api";
import {
  useFetchValidHeadTwins,
  useTwinFetchByIdV2,
  useTwinSearchV3,
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
