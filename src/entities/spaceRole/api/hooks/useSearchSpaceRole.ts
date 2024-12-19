import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import {
  hydratePermissionGrantSpaceRoleFromMap,
  PermissionGrantSpaceRole_DETAILED,
  PermissionGrantSpaceRoleFilter,
} from "@/entities/spaceRole";

// TODO: Apply caching-strategy
export const usePermissionSpaceRoleSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchSpaceRoleGrant = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: PermissionGrantSpaceRoleFilter;
    }): Promise<PagedResponse<PermissionGrantSpaceRole_DETAILED>> => {
      try {
        const { data, error } = await api.spaceRole.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission space role due to API error"
          );
        }
        const SpaceRoles =
          data.permissionGrantSpaceRoles?.map((dto) =>
            hydratePermissionGrantSpaceRoleFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: SpaceRoles,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error(
          "An error occurred while fetching permission space role"
        );
      }
    },
    [api]
  );

  return { searchSpaceRoleGrant };
};
