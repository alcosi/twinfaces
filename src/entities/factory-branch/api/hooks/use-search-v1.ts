import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateFactoryBranchFromMap } from "../../libs";
import {
  FactoryBranchFilters,
  FactoryBranchSortField,
  FactoryBranch_DETAILED,
} from "../types";

export function useFactoryBranchesSearch() {
  const api = useContext(PrivateApiContext);
  const searchFactoryBranches = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: FactoryBranchFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<FactoryBranch_DETAILED>> => {
      try {
        const { data, error } = await api.factoryBranch.search({
          pagination,
          filters,
          sortField: sort?.field as FactoryBranchSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Factory branches response has no data");
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
