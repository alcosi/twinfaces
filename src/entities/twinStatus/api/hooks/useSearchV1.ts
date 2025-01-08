import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { TwinStatus, TwinStatusFilters } from "../../api";

// TODO: Apply caching-strategy after discussing with team
export const useTwinStatusSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinStatuses = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      pagination?: PaginationState;
      filters?: TwinStatusFilters;
    }): Promise<PagedResponse<TwinStatus>> => {
      const { data, error } = await api.twinStatus.search({
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch statuses due to API error");
      }

      return { data: data.statuses ?? [], pagination: {} };
    },
    [api]
  );

  return { searchTwinStatuses };
};
