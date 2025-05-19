import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  TwinFilters,
  Twin_DETAILED,
  hydrateTwinFromMap,
} from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useTwinSearchBySearchId = () => {
  const api = useContext(PrivateApiContext);

  const searchTwinsBySearchId = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
      searchId,
      storageId,
    }: {
      pagination?: PaginationState;
      filters?: TwinFilters;
      searchId: string;
      storageId: string;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = await api.twin.searchBySearchId({
          pagination,
          filters,
          searchId,
          storageId,
        });

        if (error) {
          throw new Error("Failed to fetch twins due to API error");
        }

        const twinList =
          data.twinList?.map((dto) =>
            hydrateTwinFromMap<Twin_DETAILED>(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinList, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching twins");
      }
    },
    [api]
  );

  return { searchTwinsBySearchId };
};
