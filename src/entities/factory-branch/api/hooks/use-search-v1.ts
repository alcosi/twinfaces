import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydrateFactoryBranchFromMap } from "../../libs";
import { FactoryBranch_DETAILED, FactoryBranchFilters } from "../types";

export function useFactoryBranchesSearch() {
  const api = useContext(ApiContext);
  const searchFactoryBranches = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryBranchFilters;
    }): Promise<PagedResponse<FactoryBranch_DETAILED>> => {
      try {
        const { data, error } = await api.factoryBranch.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const factoryBranch =
          data.branches?.map((dto) =>
            hydrateFactoryBranchFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: factoryBranch,
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
