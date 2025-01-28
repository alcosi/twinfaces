import { PaginationState } from "@tanstack/react-table";
import { FactoryConditionSetFilters } from "./types";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryConditionSetApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryConditionSetFilters;
  }) {
    return settings.client.POST("/private/factory_condition_set/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: true,
          showConditionSetInFactoryBranchUsagesCountMode: "SHOW",
          showConditionSetInFactoryEraserUsagesCountMode: "SHOW",
          showConditionSetInFactoryMultiplierFilterUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineStepUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineUsagesCountMode: "SHOW",
          showFactoryConditionSetMode: "DETAILED",
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

export type FactoryConditionSetApi = ReturnType<
  typeof createFactoryConditionSetApi
>;
