import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydrateFactoryBrancheFromMap } from "../../libs";
import { FactoryBranche_DETAILED, FactoryBranchFilters } from "../types";

export function useFactoryBranchesSearch() {
  const api = useContext(ApiContext);
  const searchFactoryBranches = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryBranchFilters;
    }): Promise<PagedResponse<FactoryBranche_DETAILED>> => {
      try {
        const { data, error } = await api.factoryBranche.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const factoryBranche =
          data.branches?.map((dto) =>
            hydrateFactoryBrancheFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: factoryBranche,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory branches:", error);
        throw new Error(
          "An error occured while fetching factory branches: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryBranches };
}
