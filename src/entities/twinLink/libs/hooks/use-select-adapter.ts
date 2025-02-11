import {
  Twin_DETAILED,
  TwinSimpleFilters,
  useTwinFetchByIdV2,
} from "@/entities/twin";
import { PagedResponse } from "@/shared/api";
import { isPopulatedString, SelectAdapter } from "@/shared/libs";
import { useFetchTwinsForLink } from "../../api";

export function useTwinsForLinkSelectAdapter({
  twinClassId,
  twinId,
  linkId,
}: {
  twinClassId?: string;
  twinId?: string;
  linkId?: string;
}): SelectAdapter<Twin_DETAILED> {
  const { fetchTwinById } = useTwinFetchByIdV2();
  const { fetchForNewTwin, fetchForExistingTwin } = useFetchTwinsForLink();

  async function getById(id: string) {
    const data = await fetchTwinById(id);
    return data as Twin_DETAILED;
  }

  async function getItems(search: string, filters?: TwinSimpleFilters) {
    if (linkId == null) {
      throw new Error(
        "linkId must be provided to useTwinsForLinkSelectAdapter"
      );
    }

    if (isPopulatedString(search)) {
      if (!filters) filters = {};
      filters.nameLike = "%" + search + "%";
    }

    let response: PagedResponse<Twin_DETAILED>;
    if (twinId) {
      response = await fetchForExistingTwin({
        twinId,
        linkId,
        pagination: { pageIndex: 0, pageSize: 10 },
        filters,
      });
    } else if (twinClassId) {
      response = await fetchForNewTwin({
        twinClassId,
        linkId,
        pagination: { pageIndex: 0, pageSize: 10 },
        filters,
      });
    } else {
      throw new Error(
        "Either twinClassId or twinId must be provided to useLinkSelectAdapter"
      );
    }

    return response.data as Twin_DETAILED[];
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
