import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { PermissionGrantTwinRolesFilter } from "./types";

export function createPermissionTwinRoleApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionGrantTwinRolesFilter;
  }) {
    return settings.client.POST(
      "/private/permission_grant/twin_role/search/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showPermissionGrantTwinRoleMode: "DETAILED",
            showPermissionGrantTwinRole2TwinClassMode: "DETAILED",
            showPermissionGrantTwinRole2UserMode: "DETAILED",
            showPermissionGrantTwinRole2PermissionSchemaMode: "DETAILED",
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
  };
}

export type PermissionTwinRoleApi = ReturnType<
  typeof createPermissionTwinRoleApi
>;
