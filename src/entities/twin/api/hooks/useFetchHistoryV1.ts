import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { Twin } from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinHistoryFromMap } from "../../libs";

export const useFetchHistoryV1 = () => {
  const api = useContext(PrivateApiContext);

  const fetchHistoryByTwinId = useCallback(
    async ({
      twinId,
      pagination = { pageIndex: 0, pageSize: 10 },
    }: {
      twinId: string;
      pagination?: PaginationState;
    }): Promise<PagedResponse<Twin>> => {
      try {
        const { data, error } = await api.twin.getHistory({
          twinId,
          pagination,
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
