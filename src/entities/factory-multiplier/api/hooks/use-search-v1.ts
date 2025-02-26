import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";
import { PaginationState } from "@tanstack/react-table";
import { FactoryMultiplier_DETAILED, FactoryMultiplierFilters } from "../types";
import { hydrateFactoryMultiplierFromMap } from "../../libs";

export function useFactoryMultipliersSearch() {
  const api = useContext(ApiContext);

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
