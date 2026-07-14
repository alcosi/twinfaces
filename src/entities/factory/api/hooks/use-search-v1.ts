import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  Factory,
  FactoryFilters,
  FactorySortField,
  hydrateFactoryFromMap,
} from "@/entities/factory";
import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

export function useFactorySearch() {
  const api = useContext(PrivateApiContext);

  const searchFactories = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: FactoryFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<Factory>> => {
      try {
        const { data, error } = await api.factory.search({
          pagination,
          filters,
          sortField: sort?.field as FactorySortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Response has no data");
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
