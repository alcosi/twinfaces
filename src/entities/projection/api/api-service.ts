import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { ProjectionFilters } from "./types";

export function createProjectionApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: ProjectionFilters;
  }) {
    return settings.client.POST("/private/projection/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showProjection2ProjectionTypeMode: "DETAILED",
          showProjection2TwinClassFieldMode: "DETAILED",
          showProjection2TwinClassMode: "DETAILED",
          showProjectionMode: "DETAILED",
          showProjectionType2TwinClassMode: "DETAILED",
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

export type ProjectionApi = ReturnType<typeof createProjectionApi>;
