import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { TwinClassFreeze, TwinClassFreezeFilters } from "../types";

export function useTwinClassFreezeSearch() {
  const api = useContext(PrivateApiContext);

  const searchTwinClassFreezes = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinClassFreezeFilters;
    }): Promise<PagedResponse<TwinClassFreeze>> => {
      try {
        const { data, error } = await api.twinClassFreeze.search({
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.nameLikeList,
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch twin class freezes due to API error"
          );
        }

        return {
          data: data?.twinClassFreezes ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occurred while fetching twin class freezes");
      }
    },
    [api]
  );

  return { searchTwinClassFreezes };
}
