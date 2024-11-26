import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import {
  PermissionGrantUser_DETAILED,
  PermissionGrantUserFilters,
} from "../types";
import { hydratePermissionGrantUserFromMap } from "../../libs";

// TODO: Apply caching-strategy
export const usePermissionGrantUserSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchPermissionGrantUsers = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: PermissionGrantUserFilters;
    }): Promise<{
      data: PermissionGrantUser_DETAILED[];
      pageCount: number;
    }> => {
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

        const totalItems = data.pagination?.total ?? 0;
        const pageCount = Math.ceil(totalItems / pagination.pageSize);

        return { data: permissionGrantUsers, pageCount };
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
