import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import {
  hydratePermissionGrantAssigneePropagationFromMap,
  PermissionGrantAssigneePropagation_DETAILED,
  PermissionGrantAssigneePropagationFilter,
} from "@/entities/assigneePropagation";

// TODO: Apply caching-strategy
export const usePermissionGrantAssigneePropagationSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchAssigneePropagationGrant = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: PermissionGrantAssigneePropagationFilter;
    }): Promise<PagedResponse<PermissionGrantAssigneePropagation_DETAILED>> => {
      try {
        const { data, error } = await api.assigneePropagation.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission assignee propagation due to API error"
          );
        }
        const assigneePropagations =
          data.permissionGrantAssigneePropagations?.map((dto) =>
            hydratePermissionGrantAssigneePropagationFromMap(
              dto,
              data.relatedObjects
            )
          ) ?? [];

        return {
          data: assigneePropagations,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error(
          "An error occurred while fetching permission assignee propagation roles"
        );
      }
    },
    [api]
  );

  return { searchAssigneePropagationGrant };
};
