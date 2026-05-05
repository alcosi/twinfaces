import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateHistoryFromMap } from "../../libs";
import { History, HistoryFilters } from "../types";

export const useFetchHistoryById = () => {
  const api = useContext(PrivateApiContext);

  const fetchHistoryById = useCallback(
    async ({
      twinId,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      twinId?: string;
      pagination?: PaginationState;
      filters?: HistoryFilters;
    }): Promise<PagedResponse<History>> => {
      try {
        const { data, error } = await api.history.search({
          pagination,
          filters: {
            ...filters,
            ...(twinId ? { twinIdList: [twinId] } : {}),
          },
        });

        if (error) {
          throw new Error("Failed to fetch history due to API error");
        }

        const historyList = data.historyList?.map((dto) =>
          hydrateHistoryFromMap(dto, data.relatedObjects)
        );
        return { data: historyList ?? [], pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching history");
      }
    },
    [api]
  );

  return { fetchHistoryById };
};
