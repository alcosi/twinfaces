import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryBranche, FactoryBranche_DETAILED, FactoryBranchesFilters } from "../../api";

export function useFactoryBranchesSearch() {
  const api = useContext(ApiContext);
  const searchFactoryBranches = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryBranchesFilters;
    }): Promise<PagedResponse<FactoryBranche>> => {  //TODO replase to the FactoryBranche_DETAILED type after hydration
      try {
        const { data, error } = await api.factoryBranches.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        return {
          data: data.branches ?? [],
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
