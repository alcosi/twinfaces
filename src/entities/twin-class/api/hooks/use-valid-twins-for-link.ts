import {
  hydrateTwinFromMap,
  Twin_DETAILED,
  TwinSimpleFilters,
} from "@/entities/twin";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useContext } from "react";

export function useValidTwinsForLink() {
  const api = useContext(ApiContext);

  async function fetchValidTwinsForLink({
    twinClassId,
    linkId,
    pagination = { pageIndex: 0, pageSize: 10 },
    filters,
  }: {
    twinClassId: string;
    linkId: string;
    pagination?: PaginationState;
    filters?: TwinSimpleFilters;
  }): Promise<PagedResponse<Twin_DETAILED>> {
    try {
      const { data, error } = await api.twinClass.getValidTwinsForLink({
        twinClassId,
        linkId,
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch twins due to API error");
      }

      const twinList =
        data?.twinList?.map((dto) =>
          hydrateTwinFromMap(dto, data.relatedObjects)
        ) ?? [];

      return { data: twinList, pagination: data?.pagination ?? {} };
    } catch (error) {
      throw new Error(
        `An error occurred while fetching twins for link ${linkId} of twin class ${twinClassId}`
      );
    }
  }

  return { fetchValidTwinsForLink };
}
