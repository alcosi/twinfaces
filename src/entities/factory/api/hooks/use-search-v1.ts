import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  Factory,
  FactoryFilters,
  hydrateFactoryFromMap,
} from "@/entities/factory";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useFactorySearch() {
  const api = useContext(PrivateApiContext);

  const searchFactories = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryFilters;
    }): Promise<PagedResponse<Factory>> => {
      try {
        const { data, error } = await api.factory.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const factory =
          data.factories?.map((dto) =>
            hydrateFactoryFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: factory,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factories:", error);
        throw new Error("An error occurred while fetching factories: " + error);
      }
    },
    [api]
  );

  return { searchFactories };
}
