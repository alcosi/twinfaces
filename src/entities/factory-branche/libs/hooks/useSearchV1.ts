import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryBranche_DETAILED, FactoryBranchFilters } from "../../api";
import { hydrateFactoryBrancheFromMap } from "../helpers";

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
        const { data, error } = await api.factoryBranches.search({
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
