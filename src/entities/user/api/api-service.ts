import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { DomainUserFilters, PermissionGrantUserFilters } from "./types";

export function createUserApi(settings: ApiSettings) {
  async function searchDomainUsers({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: DomainUserFilters;
  }) {
    return settings.client.POST("/private/domain/user/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDomainUser2UserMode: "DETAILED",
          showDomainUserMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  async function searchPermissionGrants({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionGrantUserFilters;
  }) {
    return settings.client.POST("/private/permission_grant/user/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermissionGrantUser2PermissionSchemaMode: "DETAILED",
          showPermissionGrantUser2PermissionMode: "DETAILED",
          showPermissionGrantUser2UserGroupMode: "DETAILED",
          showPermissionGrantUser2UserMode: "DETAILED",
          showPermissionGrantUserMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  return { searchDomainUsers, searchPermissionGrants };
}

export type UserApi = ReturnType<typeof createUserApi>;
