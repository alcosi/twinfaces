import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { hydrateTwinClassSchemaFromMap } from "../../libs";
import { TwinClassSchemaFilters, TwinClassSchema_DETAILED } from "../types";

export const useTwinClassSchemaSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchTwinClassSchemas = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinClassSchemaFilters;
    }): Promise<PagedResponse<TwinClassSchema_DETAILED>> => {
      try {
        const { data, error } = await api.twinClassSchema.search({
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters.nameLikeList,
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch twin class schemas due to API error",
            error
          );
        }

        const twinClassSchemas =
          data.twinClassSchemas?.map((dto) =>
            hydrateTwinClassSchemaFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinClassSchemas, pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching twin class schemas");
      }
    },
    [api]
  );

  return { searchTwinClassSchemas };
};
