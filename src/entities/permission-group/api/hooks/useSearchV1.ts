import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydratePermissionGroupFromMap } from "../../libs";
import { PermissionGroup_DETAILED, PermissionGroupFilters } from "../types";

// TODO: Apply caching-strategy
export const usePermissionGroupSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchPermissionGroups = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: PermissionGroupFilters;
    }): Promise<PagedResponse<PermissionGroup_DETAILED>> => {
      try {
        const { data, error } = await api.permissionGroup.search({
          search,
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch permissions due to API error");
        }

        const permissionGroups =
          data.permissionGroups?.map((dto) =>
            hydratePermissionGroupFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: permissionGroups, pagination: data.pagination ?? {} };
      } catch (error) {
        console.error("Failed to fetch twin classes:", error);
        throw new Error("An error occurred while fetching twin classes");
      }
    },
    [api]
  );

  return { searchPermissionGroups };
};
