import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  FactoryEraserFilters,
  FactoryEraser_DETAILED,
  hydrateFactoryEraserFromMap,
} from "@/entities/factory-eraser";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useFactoryEraserSearch() {
  const api = useContext(PrivateApiContext);
  const searchFactoryErasers = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryEraserFilters;
    }): Promise<PagedResponse<FactoryEraser_DETAILED>> => {
      try {
        const { data, error } = await api.factoryEraser.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Factory erasers response has no data");
        }

        const erasers =
          data.erasers?.map((dto) =>
            hydrateFactoryEraserFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: erasers,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error(
          "An error occurred while fetching factory eraser: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryErasers };
}
