import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { TwinStatus_DETAILED, TwinStatusFilters } from "../../api";
import { hydrateTwinStatusFromMap } from "../../libs";

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
    }): Promise<PagedResponse<TwinStatus_DETAILED>> => {
      const { data, error } = await api.twinStatus.search({
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch statuses due to API error");
      }

      const statuses =
        data.statuses?.map((dto) =>
          hydrateTwinStatusFromMap(dto, data.relatedObjects)
        ) ?? [];

      return { data: statuses, pagination: data.pagination ?? {} };
    },
    [api]
  );

  return { searchTwinStatuses };
};
