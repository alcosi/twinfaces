import { PaginationState } from "@tanstack/react-table";
import { useContext } from "react";

import {
  TwinSimpleFilters,
  Twin_DETAILED,
  hydrateTwinFromMap,
} from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useValidTwinsForLink() {
  const api = useContext(PrivateApiContext);

  async function fetchValidTwinsForLink({
    twinId,
    linkId,
    pagination = { pageIndex: 0, pageSize: 10 },
    filters,
  }: {
    twinId: string;
    linkId: string;
    pagination?: PaginationState;
    filters?: TwinSimpleFilters;
  }): Promise<PagedResponse<Twin_DETAILED>> {
    try {
      const { data, error } = await api.twin.getValidTwinsForLink({
        twinId,
        linkId,
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch twins due to API error");
      }

      const twinList =
        data?.twinList?.map((dto) =>
          hydrateTwinFromMap<Twin_DETAILED>(dto, data.relatedObjects)
        ) ?? [];

      return { data: twinList, pagination: data?.pagination ?? {} };
    } catch (error) {
      throw new Error(
        `An error occurred while fetching twins for link ${linkId} of twin ${twinId}`
      );
    }
  }

  return { fetchValidTwinsForLink };
}
