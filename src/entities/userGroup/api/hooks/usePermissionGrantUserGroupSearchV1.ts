import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import {
  PermissionGrantUserGroup_DETAILED,
  PermissionGrantUserGroupFilters,
} from "../types";
import { hydratePermissionGrantUserGroupFromMap } from "../../libs";

// TODO: Apply caching-strategy
export const usePermissionGrantUserGroupSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchPermissionGrantUserGroups = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: PermissionGrantUserGroupFilters;
    }): Promise<{
      data: PermissionGrantUserGroup_DETAILED[];
      pageCount: number;
    }> => {
      try {
        const { data, error } = await api.userGroup.searchPermissionGrants({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch permission grant due to API error");
        }

        const permissionGrantUserGroups =
          data.permissionGrantUserGroups?.map((dto) =>
            hydratePermissionGrantUserGroupFromMap(dto, data.relatedObjects)
          ) ?? [];

        const totalItems = data.pagination?.total ?? 0;
        const pageCount = Math.ceil(totalItems / pagination.pageSize);

        return { data: permissionGrantUserGroups, pageCount };
      } catch (error) {
        throw new Error(
          "An error occurred while fetching permission grant user groups"
        );
      }
    },
    [api]
  );

  return { searchPermissionGrantUserGroups };
};
