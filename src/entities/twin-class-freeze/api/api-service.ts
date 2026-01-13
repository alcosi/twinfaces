import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { TwinClassFreezeFilters } from "./types";

export function createTwinClassFreezeApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinClassFreezeFilters;
  }) {
    return settings.client.POST("/private/twin_class_freeze/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassFreezeMode: "DETAILED",
          showTwinClassFreeze2StatusMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        search: filters,
      },
    });
  }

  return { search };
}

export type TwinClassFreezeApi = ReturnType<typeof createTwinClassFreezeApi>;
