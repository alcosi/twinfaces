import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  FactoryEraserSearchRq,
  FactoryEraser_DETAILED,
  hydrateFactoryEraserFromMap,
} from "@/entities/factory-eraser";
import { ApiContext, PagedResponse } from "@/shared/api";

export function useFactoryEraserSearch() {
  const api = useContext(ApiContext);
  const searchFactoryErasers = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryEraserSearchRq;
    }): Promise<PagedResponse<FactoryEraser_DETAILED>> => {
      try {
        const { data, error } = await api.factoryEraser.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
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
