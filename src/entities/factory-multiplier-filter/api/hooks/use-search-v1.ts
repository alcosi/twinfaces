import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateFactoryMultiplierFilterFromMap } from "../../libs";
import {
  FactoryMultiplierFilterFilters,
  FactoryMultiplierFilterSortField,
  FactoryMultiplierFilter_DETAILED,
} from "../types";

export function useFactoryMultiplierFilterSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryMultiplierFilters = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: FactoryMultiplierFilterFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<FactoryMultiplierFilter_DETAILED>> => {
      try {
        const { data, error } = await api.factoryMultiplierFilter.search({
          pagination,
          filters,
          sortField: sort?.field as
            | FactoryMultiplierFilterSortField
            | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error(
            "Failed to fetch factory multiplier filters due to API error"
          );
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMultiplierFilters = data.multiplierFilters?.map((dto) =>
          hydrateFactoryMultiplierFilterFromMap(dto, data.relatedObjects)
        );

        return {
          data: factoryMultiplierFilters ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error(
          "An error occured while fetching factory multiplier filters"
        );
      }
    },
    [api]
  );

  return { searchFactoryMultiplierFilters };
}
