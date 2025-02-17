import { ApiContext, PagedResponse } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydrateTwinFlowFromMap } from "../../libs";
import { TwinFlow_DETAILED, TwinFlowFilters } from "../types";

// TODO: Apply caching-strategy
export const useTwinFlowSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinFlows = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinFlowFilters;
    }): Promise<PagedResponse<TwinFlow_DETAILED>> => {
      try {
        const { data, error } = await api.twinFlow.search({
          pagination,
          filters: {
            ...filters,
            nameI18nLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters.nameI18nLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch twin flows due to API error", error);
        }

        const twinFlows =
          data.twinflowList?.map((dto) =>
            hydrateTwinFlowFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinFlows, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching twin flows");
      }
    },
    [api]
  );

  return { searchTwinFlows };
};
