import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { hydrateTwinFromMap } from "@/entities/twin";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { TwinFilters, Twin_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const useTwinSearchV3 = () => {
  const api = useContext(PrivateApiContext);

  const searchTwins = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      pagination?: PaginationState;
      filters?: TwinFilters;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = await api.twin.search({
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

        return { data: twinList, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching twins");
      }
    },
    [api]
  );

  return { searchTwins };
};
