import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { ApiContext, PagedResponse } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { TransitionAliasFilters, TransitionAliasV1 } from "../types";

// TODO: Apply caching-strategy
export const useTransitionAliasSearch = () => {
  const api = useContext(ApiContext);

  const searchTransitionAlias = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
      search,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TransitionAliasFilters;
    }): Promise<PagedResponse<TransitionAliasV1>> => {
      try {
        const { data, error } = await api.twinFlowTransition.searchAlias({
          pagination,
          filters: {
            ...filters,
            aliasLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.aliasLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch transition alias due to API error");
        }

        return {
          data: data.aliasList ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching transition alias");
      }
    },
    [api]
  );

  return { searchTransitionAlias };
};
