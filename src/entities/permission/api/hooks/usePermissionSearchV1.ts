import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydratePermissionFromMap } from "../../libs";
import { Permission_DETAILED, PermissionFilters } from "../types";

// TODO: Apply caching-strategy
export const usePermissionSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchPermissions = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: PermissionFilters;
    }): Promise<PagedResponse<Permission_DETAILED>> => {
      try {
        const { data, error } = await api.permission.search({
          pagination,
          filters,
        });

        if (error) {
          console.error("Failed to fetch permissions due to API error:", error);
          throw new Error("Failed to fetch permissions due to API error");
        }

        const permissions =
          data.permissions?.map((dto) =>
            hydratePermissionFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: permissions, pagination: data.pagination ?? {} };
      } catch (error) {
        console.error("Failed to fetch twin classes:", error);
        throw new Error("An error occurred while fetching twin classes");
      }
    },
    [api]
  );

  return { searchPermissions };
};
