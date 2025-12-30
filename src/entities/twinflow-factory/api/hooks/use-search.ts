import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinFlowFactoryFromMap } from "../../libs";
import { TwinFlowFactoryFilters, TwinFlowFactory_DETAILED } from "../types";

export function useTwinFlowFactorySearch() {
  const api = useContext(PrivateApiContext);

  const searchTwinFlowFactories = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: TwinFlowFactoryFilters;
    }): Promise<PagedResponse<TwinFlowFactory_DETAILED>> => {
      try {
        const { data, error } = await api.twinFlowFactory.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const twinflowFactories =
          data.twinflowFactories?.map((dto) =>
            hydrateTwinFlowFactoryFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: twinflowFactories,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch twinflow factories:", error);
        throw new Error(
          "An error occured while fetching twinflow factories: " + error
        );
      }
    },
    [api]
  );

  return { searchTwinFlowFactories };
}
