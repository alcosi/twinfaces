import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydratePermissionGrantUserFromMap } from "../../libs";
import {
  PermissionGrantUserFilters,
  PermissionGrantUser_DETAILED,
} from "../types";

export const usePermissionGrantUserSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchPermissionGrantUsers = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: PermissionGrantUserFilters;
    }): Promise<PagedResponse<PermissionGrantUser_DETAILED>> => {
      try {
        const { data, error } = await api.user.searchPermissionGrants({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch permission grant due to API error");
        }

        const permissionGrantUsers =
          data.permissionGrantUsers?.map((dto) =>
            hydratePermissionGrantUserFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: permissionGrantUsers,
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

  return { searchPermissionGrantUsers };
};
