import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateFactoryConditionSetFromMap } from "../../libs";
import { FactoryConditionSet, FactoryConditionSetFilters } from "../types";

// TODO: Turn off lazy-relation, implement hydration
export function useFactoryConditionSetSearch() {
  const api = useContext(PrivateApiContext);

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

        const factoryConditionSets = data.conditionSets?.map((dto) =>
          hydrateFactoryConditionSetFromMap(dto, data.relatedObjects)
        );

        return {
          data: factoryConditionSets ?? [],
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
