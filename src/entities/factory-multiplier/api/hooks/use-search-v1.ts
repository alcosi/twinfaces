import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateFactoryMultiplierFromMap } from "../../libs";
import {
  FactoryMultiplierFilters,
  FactoryMultiplierSortField,
  FactoryMultiplier_DETAILED,
} from "../types";

export function useFactoryMultipliersSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryMultipliers = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: FactoryMultiplierFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<FactoryMultiplier_DETAILED>> => {
      try {
        const { data, error } = await api.factoryMultiplier.search({
          pagination,
          filters,
          sortField: sort?.field as FactoryMultiplierSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Response has no data");
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
