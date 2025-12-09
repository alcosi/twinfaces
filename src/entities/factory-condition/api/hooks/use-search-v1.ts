import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateFactoryConditionFromMap } from "../../libs";
import { FactoryConditionFilters, FactoryCondition_DETAILED } from "../types";

export function useFactoryConditionSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryCondition = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryConditionFilters;
    }): Promise<PagedResponse<FactoryCondition_DETAILED>> => {
      try {
        const { data, error } = await api.factoryCondition.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const factoryConditions =
          data.conditions?.map((dto) =>
            hydrateFactoryConditionFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: factoryConditions,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory conditions:", error);
        throw new Error(
          "An error occured while fetching factory conditions: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryCondition };
}
