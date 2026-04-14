import { PaginationState } from "@tanstack/react-table";

import { FactoryTriggerFilters } from "@/entities/factory-trigger";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryTriggerApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryTriggerFilters;
  }) {
    return settings.client.POST("/private/twin_factory/trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinFactoryTrigger2FactoryMode: "DETAILED",
          showTwinFactoryTrigger2TwinTriggerMode: "DETAILED",
          showTwinFactoryTrigger2TwinClassMode: "DETAILED",
          showTwinFactoryTriggerMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
      },
    });
  }
  return { search };
}

export type FactoryTriggerApi = ReturnType<typeof createFactoryTriggerApi>;
