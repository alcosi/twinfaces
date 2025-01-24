import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryConditionSet, FactoryConditionSetFilters } from "../types";

// TODO: Turn off lazy-relation, implement hydration
export function useFactoryConditionSetSearch() {
  const api = useContext(ApiContext);

  const searchFactoryConditionSet = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryConditionSetFilters;
    }): Promise<PagedResponse<FactoryConditionSet>> => {
      try {
        const { data, error } = await api.factoryConditionSet.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        return {
          data: data.conditionSets ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory condition set:", error);
        throw new Error("An error occured while fetching factories: " + error);
      }
    },
    [api]
  );

  return { searchFactoryConditionSet };
}
