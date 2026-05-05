import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { HistoryFilters } from "./types";

export function createHistoryApi(settings: ApiSettings) {
  function search({
    pagination,
    filters = {},
  }: {
    pagination: PaginationState;
    filters?: HistoryFilters;
  }) {
    return settings.client.POST("/private/twin_history/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showHistoryMode: "DETAILED",
          showHistory2TwinMode: "DETAILED",
          showHistory2UserMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwinClassFieldCollectionMode: "SHOW",
          showTwinFieldCollectionMode: "SHOW",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
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

export type HistoryApi = ReturnType<typeof createHistoryApi>;
