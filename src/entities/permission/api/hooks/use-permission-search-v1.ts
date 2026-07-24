import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { hydratePermissionFromMap } from "../../libs";
import {
  PermissionFilters,
  PermissionSortField,
  Permission_DETAILED,
} from "../types";

export const usePermissionSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchPermissions = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
      sort,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: PermissionFilters;
      sort?: SortV1;
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
          sortField: sort?.field as PermissionSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          console.error("Failed to fetch permissions due to API error:", error);
          throw new Error("Failed to fetch permissions due to API error");
        }

        if (!data) {
          throw new Error("Response has no permission data");
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
