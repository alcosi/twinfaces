import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { StatusTriggerFilters } from "./types";

export function createStatusTriggerApi(settings: ApiSettings) {
  function search({
    pagination,
    filters = {},
  }: {
    pagination: PaginationState;
    filters?: StatusTriggerFilters;
  }) {
    return settings.client.POST("/private/twin_status/trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinStatusTriggerMode: "DETAILED",
          showTwinStatusTrigger2TwinStatusMode: "DETAILED",
          showTwinStatusTrigger2TwinTriggerMode: "DETAILED",
          showTwinTrigger2FeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
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

export type StatusTriggerApi = ReturnType<typeof createStatusTriggerApi>;
