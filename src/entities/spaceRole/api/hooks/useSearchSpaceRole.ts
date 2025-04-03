import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  PermissionGrantSpaceRoleFilter,
  PermissionGrantSpaceRole_DETAILED,
  hydratePermissionGrantSpaceRoleFromMap,
} from "@/entities/spaceRole";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const usePermissionSpaceRoleSearchV1 = () => {
  const api = useContext(PrivateApiContext);

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
