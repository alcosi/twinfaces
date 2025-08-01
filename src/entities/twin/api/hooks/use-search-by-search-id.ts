import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  TwinFiltersBySearchId,
  Twin_DETAILED,
  hydrateTwinFromMap,
} from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useTwinSearchBySearchId = () => {
  const api = useContext(PrivateApiContext);

  const searchTwinBySearchId = useCallback(
    async ({
      searchId,
      searchParams,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      searchId: string;
      searchParams: Record<string, string>;
      pagination?: PaginationState;
      filters?: TwinFiltersBySearchId;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = await api.twin.searchBySearchId({
          searchId,
          searchParams,
          pagination,
          filters,
        });

        if (error) {
          throw new Error(
            "Failed to fetch twins by search id due to API error"
          );
        }
        const twinList =
          data?.twinList?.map((dto) =>
            hydrateTwinFromMap<Twin_DETAILED>(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinList, pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching twins by search Id");
      }
    },
    [api]
  );

  return { searchTwinBySearchId };
};
