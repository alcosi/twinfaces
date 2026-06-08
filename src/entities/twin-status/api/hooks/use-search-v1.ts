import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { TwinStatusFilters, TwinStatus_DETAILED } from "../../api";
import { hydrateTwinStatusFromMap } from "../../libs";

export const useTwinStatusSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchTwinStatuses = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
      sort,
    }: {
      pagination?: PaginationState;
      filters?: TwinStatusFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<TwinStatus_DETAILED>> => {
      const { data, error } = await api.twinStatus.search({
        pagination,
        filters,
        sort,
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
