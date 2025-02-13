import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Featurer_DETAILED, FeaturerFilters } from "../types";

export function useFeaturersSearch() {
  const api = useContext(ApiContext);
  const searchFeaturers = useCallback(
    async ({
      pagination,
      options = {},
    }: {
      pagination: PaginationState;
      options?: FeaturerFilters;
    }): Promise<PagedResponse<Featurer_DETAILED>> => {
      try {
        const { data, error } = await api.featurer.search({
          pagination,
          options,
        });

        if (error) throw error;

        return {
          //TODO: Remove type assertion
          data: data.featurerList as Featurer_DETAILED[],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch featurer:", error);
        throw new Error("An error occured while fecthing featurers:" + error);
      }
    },
    [api]
  );

  return { searchFeaturers };
}
