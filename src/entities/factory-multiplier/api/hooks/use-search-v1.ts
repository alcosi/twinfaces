import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateFactoryMultiplierFromMap } from "../../libs";
import { FactoryMultiplierFilters, FactoryMultiplier_DETAILED } from "../types";

export function useFactoryMultipliersSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryMultipliers = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryMultiplierFilters;
    }): Promise<PagedResponse<FactoryMultiplier_DETAILED>> => {
      try {
        const { data, error } = await api.factoryMultiplier.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const factoryMultiplier =
          data.multipliers?.map((dto) =>
            hydrateFactoryMultiplierFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: factoryMultiplier,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory multipliers:", error);
        throw new Error(
          "An error occured while fetching factory multipliers: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryMultipliers };
}
