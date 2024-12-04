import { ApiContext, PagedResponse } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydrateTwinFlowSchemaFromMap } from "../../libs";
import { TwinFlowSchema_DETAILED, TwinFlowSchemaFilters } from "../types";

// TODO: Apply caching-strategy
export const useTwinFlowSchemaSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinFlowSchemas = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinFlowSchemaFilters;
    }): Promise<PagedResponse<TwinFlowSchema_DETAILED>> => {
      try {
        const { data, error } = await api.twinFlowSchema.search({
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters.nameLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch twin flows due to API error", error);
        }

        const twinFlowSchemas =
          data.twinflowSchemas?.map((dto) =>
            hydrateTwinFlowSchemaFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinFlowSchemas, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching twin flows");
      }
    },
    [api]
  );

  return { searchTwinFlowSchemas };
};
