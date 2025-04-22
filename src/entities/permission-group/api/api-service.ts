import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { PermissionGroupFilters, PermissionGroupRqQuery } from "./types";

export function createPermissionGroupApi(settings: ApiSettings) {
  async function search({
    search,
    pagination,
    filters,
  }: {
    search?: string;
    pagination: PaginationState;
    filters: PermissionGroupFilters;
  }) {
    return settings.client.POST("/private/permission_group/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermissionGroup2TwinClassMode: "DETAILED",
          showPermissionGroupMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        ...filters,
        showSystemGroups: true,
      },
    });
  }

  function getById({
    groupId,
    query = {},
  }: {
    groupId: string;
    query: PermissionGroupRqQuery;
  }) {
    return settings.client.GET("/private/permission_group/{groupId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { groupId },
        query: { lazyRelation: false, ...query },
      },
    });
  }

  return { search, getById };
}

export type PermissionGroupApi = ReturnType<typeof createPermissionGroupApi>;
