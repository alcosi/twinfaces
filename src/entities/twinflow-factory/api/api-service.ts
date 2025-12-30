import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { TwinFlowFactoryFilters } from "./types";

export function createTwinFlowFactoryApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinFlowFactoryFilters;
  }) {
    return settings.client.POST("/private/twinflow/factory/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinflowFactoryMode: "DETAILED",
          showTwinflowFactory2TwinflowMode: "DETAILED",
          showTwinflowFactory2FactoryMode: "DETAILED",
          showTwinflow2TwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: filters,
      },
    });
  }

  return { search };
}

export type TwinFlowFactoryApi = ReturnType<typeof createTwinFlowFactoryApi>;
