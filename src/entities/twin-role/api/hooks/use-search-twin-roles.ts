import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydratePermissionGrantTwinRolesFromMap } from "../../libs";
import {
  PermissionGrantTwinRolesFilter,
  PermissionGrantTwinRoles_DETAILED,
} from "../types";

export const usePermissionGrantTwinRolesSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchTwinRoleGrant = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: PermissionGrantTwinRolesFilter;
    }): Promise<PagedResponse<PermissionGrantTwinRoles_DETAILED>> => {
      try {
        const { data, error } = await api.twinRole.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission twin roles due to API error"
          );
        }

        const permissionGrantTwinRoles =
          data.permissionGrantTwinRoles?.map((dto) =>
            hydratePermissionGrantTwinRolesFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: permissionGrantTwinRoles,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error(
          "An error occurred while fetching permission grant twin roles"
        );
      }
    },
    [api]
  );

  return { searchTwinRoleGrant };
};
