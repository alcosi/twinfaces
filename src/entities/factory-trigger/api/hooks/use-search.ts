import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  FactoryTriggerFilters,
  FactoryTrigger_DETAILED,
  hydrateFactoryTriggerFromMap,
} from "@/entities/factory-trigger";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useFactoryTriggerSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryTrigger = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryTriggerFilters;
    }): Promise<PagedResponse<FactoryTrigger_DETAILED>> => {
      try {
        const { data, error } = await api.factoryTrigger.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }
        const factoryTrigger = (data.twinFactoryTriggers || []).map((dto) =>
          hydrateFactoryTriggerFromMap(dto, data.relatedObjects)
        );

        return {
          data: factoryTrigger,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory triggers: ", error);
        throw new Error(
          "An error occured while fetching factory triggers: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryTrigger };
}
