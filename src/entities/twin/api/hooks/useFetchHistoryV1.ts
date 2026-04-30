import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinHistoryFromMap } from "../../libs";
import { HistoryFilters, HistoryV1 } from "../../server";

export const useFetchHistoryV1 = () => {
  const api = useContext(PrivateApiContext);

  const fetchHistoryByTwinId = useCallback(
    async ({
      twinId,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      twinId?: string;
      pagination?: PaginationState;
      filters?: HistoryFilters;
    }): Promise<PagedResponse<HistoryV1>> => {
      try {
        const { data, error } = await api.twin.getHistory({
          pagination,
          filters: {
            ...filters,
            ...(twinId ? { twinIdList: [twinId] } : {}),
          },
        });

        if (error) {
          throw new Error("Failed to fetch twin history due to API error");
        }

        const historyList = data.historyList?.map((dto) =>
          hydrateTwinHistoryFromMap(dto, data.relatedObjects)
        );

        return { data: historyList ?? [], pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching twin history");
      }
    },
    [api]
  );

  return { fetchHistoryByTwinId };
};
