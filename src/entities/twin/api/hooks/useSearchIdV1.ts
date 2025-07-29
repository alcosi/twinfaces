import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  TwinSearchExtendedV1,
  Twin_DETAILED,
  hydrateTwinFromMap,
} from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useTwinSearchIdV1 = (
  searchId: string,
  searchParams: {
    [key: string]: string;
  }
) => {
  const api = useContext(PrivateApiContext);

  const searchIdTwins = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      pagination?: PaginationState;
      filters?: TwinSearchExtendedV1;
    }): Promise<PagedResponse<Twin_DETAILED>> => {
      try {
        const { data, error } = await api.twin.searchId({
          searchId,
          searchParams,
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

  return { searchIdTwins };
};
