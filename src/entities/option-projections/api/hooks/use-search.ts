import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  OptionProjection_DETAILED,
  hydrateOptionProjectionFromMap,
  optionProjectionFilters,
} from "@/entities/option-projections";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useOptionProjectionSearch() {
  const api = useContext(PrivateApiContext);

  const searchOptionProjection = useCallback(
    async ({
      pagination,
      filters,
    }: {
      pagination: PaginationState;
      filters?: optionProjectionFilters;
    }): Promise<PagedResponse<OptionProjection_DETAILED>> => {
      try {
        const { data, error } = await api.optionProjection.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error(
            "Failed to fetch option projections due to API error"
          );
        }
        const optionProjections = data.dataListOptionProjections?.map((dto) =>
          hydrateOptionProjectionFromMap(dto, data.relatedObjects)
        );

        return {
          data: optionProjections ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occured while fetching option projections");
      }
    },
    [api]
  );
  return { searchOptionProjection };
}
