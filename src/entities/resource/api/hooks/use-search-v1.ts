import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { Resource, ResourceFilters, ResourceSortField } from "../../libs";

export const useResourceSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchResources = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
      sort,
    }: {
      pagination?: PaginationState;
      filters?: ResourceFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<Resource>> => {
      try {
        const { data, error } = await api.resource.search({
          pagination,
          filters,
          sortField: sort?.field as ResourceSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error("Failed to fetch resources due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        return {
          data: data.resources ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching resources: " + error);
      }
    },
    [api]
  );

  return { searchResources };
};
