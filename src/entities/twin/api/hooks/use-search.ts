import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  TwinFilters,
  TwinFiltersBySearchId,
  Twin_DETAILED,
  hydrateTwinFromMap,
} from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useTwinSearch = () => {
  const api = useContext(PrivateApiContext);

  const searchTwins = useCallback(
    async ({
      searchId,
      searchParams,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      searchId?: string;
      searchParams?: Record<string, string>;
      pagination?: PaginationState;
      filters?: TwinFiltersBySearchId | TwinFilters;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = searchId
          ? await api.twin.searchBySearchId({
              path: {
                searchId,
              },
              query: {
                offset: pagination.pageIndex * pagination.pageSize,
                limit: pagination.pageSize,
              },
              body: {
                params: searchParams,
                narrow: filters,
              },
            })
          : await api.twin.search({
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

        return { data: twinList, pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching twins");
      }
    },
    [api]
  );

  return { searchTwins };
};
