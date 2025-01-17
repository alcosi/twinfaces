import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryBranchFilters } from "./types";

export function createFactoryBrancheApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryBranchFilters;
  }) {
    return settings.client.POST("/private/factory_branch/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryBranch2FactoryConditionSetMode: "DETAILED",
          showFactoryBranch2FactoryMode: "DETAILED",
          showFactoryBranchMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  return { search };
}

export type FactoryBrancheApi = ReturnType<typeof createFactoryBrancheApi>;
