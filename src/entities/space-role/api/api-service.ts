import { PaginationState } from "@tanstack/table-core";

import {
  PermissionGrantSpaceRoleFilters,
  SpaceRoleFilters,
} from "@/entities/space-role";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createPermissionSpaceRoleApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: SpaceRoleFilters;
  }) {
    return settings.client.POST(`/private/space_role/search/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showSpaceRoleMode: "DETAILED",
          showSpaceRole2TwinClassMode: "DETAILED",
          showTwinClassMode: "DETAILED",
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

  async function searchPermissionGranSpaceRole({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionGrantSpaceRoleFilters;
  }) {
    return settings.client.POST(
      "/private/permission_grant/space_role/search/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showPermissionGrantSpaceRoleMode: "DETAILED",
            showPermissionGrantUserGroup2PermissionSchemaMode: "DETAILED",
            showPermissionGrantSpaceRole2SpaceRoleMode: "DETAILED",
            showPermissionGrantSpaceRole2PermissionSchemaMode: "DETAILED",
            showPermissionGrantSpaceRole2UserMode: "DETAILED",
            showSpaceRole2TwinClassMode: "DETAILED",
            PermissionGrantSpaceRole2SpaceRoleMode: "DETAILED",
            SpaceRole2TwinClassMode: "DETAILED",
            offset: pagination.pageIndex * pagination.pageSize,
            limit: pagination.pageSize,
            sortAsc: false,
          },
        },
        body: {
          ...filters,
        },
      }
    );
  }

  return {
    search,
    searchPermissionGranSpaceRole,
  };
}

export type PermissionSpaceRoleApi = ReturnType<
  typeof createPermissionSpaceRoleApi
>;
