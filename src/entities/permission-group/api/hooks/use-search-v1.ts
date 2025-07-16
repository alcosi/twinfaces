import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { wrapWithPercent } from "@/shared/libs";

import { hydratePermissionGroupFromMap } from "../../libs";
import { PermissionGroupFilters, PermissionGroup_DETAILED } from "../types";

export const usePermissionGroupSearchV1 = () => {
  const api = useContext(PrivateApiContext);

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
          filters: {
            ...filters,
            keyLikeList: search ? [wrapWithPercent(search)] : [],
          },
        });

        if (error) {
          throw new Error("Failed to fetch permission groups due to API error");
        }

        const permissionGroups =
          data.permissionGroups?.map((dto) =>
            hydratePermissionGroupFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: permissionGroups, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching permission groups");
      }
    },
    [api]
  );

  return { searchPermissionGroups };
};
