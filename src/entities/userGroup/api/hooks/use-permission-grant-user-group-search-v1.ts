import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { ApiContext, PagedResponse } from "@/shared/api";

import { hydratePermissionGrantUserGroupFromMap } from "../../libs";
import {
  PermissionGrantUserGroupFilters,
  PermissionGrantUserGroup_DETAILED,
} from "../types";

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
    }): Promise<PagedResponse<PermissionGrantUserGroup_DETAILED>> => {
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

        return {
          data: permissionGrantUserGroups,
          pagination: data.pagination ?? {},
        };
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
