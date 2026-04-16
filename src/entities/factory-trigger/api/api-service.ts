import { PaginationState } from "@tanstack/react-table";

import {
  FactoryTriggerFilters,
  FactoryTriggerUpdateRq,
} from "@/entities/factory-trigger";
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
          showTwinFactoryTrigger2FactoryConditionSetMode: "DETAILED",
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

  function update({ body }: { body: FactoryTriggerUpdateRq }) {
    return settings.client.PUT("/private/twin_factory/trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return { search, update };
}

export type FactoryTriggerApi = ReturnType<typeof createFactoryTriggerApi>;
