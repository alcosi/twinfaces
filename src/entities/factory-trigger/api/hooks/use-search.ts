import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  FactoryTriggerFilters,
  FactoryTriggerSortField,
  FactoryTrigger_DETAILED,
  hydrateFactoryTriggerFromMap,
} from "@/entities/factory-trigger";
import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

export function useFactoryTriggerSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryTrigger = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters: FactoryTriggerFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<FactoryTrigger_DETAILED>> => {
      try {
        const { data, error } = await api.factoryTrigger.search({
          pagination,
          filters,
          sortField: sort?.field as FactoryTriggerSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryTrigger = (data.factoryTriggerList || []).map((dto) =>
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
