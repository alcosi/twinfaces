import { PaginationState } from "@tanstack/react-table";
import {
  hydrateTwinFromMap,
  Twin_DETAILED,
  TwinSimpleFilters,
} from "@/entities/twin";
import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";

export function useFetchTwinsForLink() {
  const api = useContext(ApiContext);

  const fetchForNewTwin = useCallback(
    async ({
      twinClassId,
      linkId,
      pagination,
      filters,
    }: {
      twinClassId: string;
      linkId: string;
      pagination: PaginationState;
      filters?: TwinSimpleFilters;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = await api.twin.getNewTwinLinkOptions({
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
    },
    [api]
  );

  const fetchForExistingTwin = useCallback(
    async ({
      twinId,
      linkId,
      pagination,
      filters,
    }: {
      twinId: string;
      linkId: string;
      pagination: PaginationState;
      filters?: TwinSimpleFilters;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = await api.twin.getExistingTwinLinkOptions({
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
            hydrateTwinFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinList, pagination: data?.pagination ?? {} };
      } catch (error) {
        throw new Error(
          `An error occurred while fetching twins for link ${linkId} of twin ${twinId}`
        );
      }
    },
    [api]
  );

  return { fetchForNewTwin, fetchForExistingTwin };
}
