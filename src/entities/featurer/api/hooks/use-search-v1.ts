import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { Featurer, FeaturerFilters } from "../types";

// TODO: Apply caching-strategy after discussing with team
export const useFeaturerSearch = () => {
  const api = useContext(PrivateApiContext);

  const searchFeaturers = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: FeaturerFilters;
    }): Promise<PagedResponse<Featurer>> => {
      const { data, error } = await api.featurer.search({
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch statuses due to API error");
      }

      const featurers = data.featurerList ?? [];

      return { data: featurers, pagination: data.pagination ?? {} };
    },
    [api]
  );

  return { searchFeaturers };
};
