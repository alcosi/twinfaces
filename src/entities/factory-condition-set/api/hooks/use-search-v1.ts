import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryConditionSet, FactoryConditionSetFilters } from "../types";
import { hydrateFactoryConditionSetFromMap } from "../../libs";

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

        const factoryConditionSet = data.conditionSets?.map((dto) =>
          hydrateFactoryConditionSetFromMap(dto, data.relatedObjects)
        );

        return {
          data: factoryConditionSet ?? [],
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
