import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryBranchesFilters } from "./types";

export function createFactoryBranchesApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryBranchesFilters;
  }) {
    return settings.client.POST("/private/factory_branch/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showConditionSetInFactoryBranchUsagesCountMode: "SHOW",
          showConditionSetInFactoryEraserUsagesCountMode: "SHOW",
          showConditionSetInFactoryMultiplierFilterUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineStepUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineUsagesCountMode: "SHOW",
          showFactoryBranch2FactoryConditionSetMode: "DETAILED",
          showFactoryBranch2FactoryMode: "DETAILED",
          showFactoryBranchMode: "DETAILED",
          showFactoryBranchesCountMode: "SHOW",
          showFactoryErasersCountMode: "SHOW",
          showFactoryMultipliersCountMode: "SHOW",
          showFactoryPipelineCountMode: "SHOW",
          showFactoryUsagesCountMode: "SHOW",
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

export type FactoryBranchesApi = ReturnType<typeof createFactoryBranchesApi>;
