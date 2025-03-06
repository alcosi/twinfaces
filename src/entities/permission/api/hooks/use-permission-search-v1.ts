import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { hydratePermissionFromMap } from "../../libs";
import { PermissionFilters, Permission_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const usePermissionSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchPermissions = useCallback(
    async ({
      search,
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
          filters: {
            ...filters,
            keyLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters.keyLikeList,
          },
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
