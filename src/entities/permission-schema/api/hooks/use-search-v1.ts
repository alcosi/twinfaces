import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { hydratePermissionSchemaFromMap } from "@/entities/permission-schema";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { PermissionSchema, PermissionSchemaSearchFilters } from "../types";

export const usePermissionSchemaSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchPermissionSchemas = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: PermissionSchemaSearchFilters;
    }): Promise<PagedResponse<PermissionSchema>> => {
      try {
        const { data, error } = await api.permissionSchema.search({
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.nameLikeList,
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission schemas due to API error"
          );
        }

        const permissionSchemas =
          data.permissionSchemas?.map((dto) =>
            hydratePermissionSchemaFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: permissionSchemas,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching permission schemas");
      }
    },
    [api]
  );

  return { searchPermissionSchemas };
};
