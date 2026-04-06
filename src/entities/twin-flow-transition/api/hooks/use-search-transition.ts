import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { hydrateTwinFlowTransitionFromMap } from "../../libs";
import {
  TwinFlowTransitionFilters,
  TwinFlowTransition_DETAILED,
} from "../types";

export const useTwinFlowTransitionSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchTwinFlowTransitions = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinFlowTransitionFilters;
    }): Promise<PagedResponse<TwinFlowTransition_DETAILED>> => {
      try {
        const { data, error } = await api.twinFlowTransition.search({
          search,
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.nameLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch transitions due to API error");
        }

        const transitions =
          data.transition?.map((dto) =>
            hydrateTwinFlowTransitionFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: transitions, pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching transitions");
      }
    },
    [api]
  );

  return { searchTwinFlowTransitions };
};
