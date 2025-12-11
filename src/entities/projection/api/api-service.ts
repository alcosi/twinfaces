import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { ProjectionFilters, ProjectionTypeFilters } from "./types";

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
          showProjectionMode: "MANAGED",
          showProjectionType2TwinClassMode: "DETAILED",
          showProjection2FeaturerMode: "DETAILED",
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

  function searchProjectionType({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: ProjectionTypeFilters;
  }) {
    return settings.client.POST("/private/projection_type/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showProjectionType2TwinClassMode: "DETAILED",
          showProjectionTypeMode: "DETAILED",
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

  return { search, searchProjectionType };
}

export type ProjectionApi = ReturnType<typeof createProjectionApi>;
