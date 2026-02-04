import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { TwinClassSchemaFilters } from "./types";

export function createTwinClassSchemaApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinClassSchemaFilters;
  }) {
    return settings.client.POST("/private/twin_class_schema/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassSchemaMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
      },
    });
  }

  return {
    search,
  };
}

export type TwinClassSchemaApi = ReturnType<typeof createTwinClassSchemaApi>;
