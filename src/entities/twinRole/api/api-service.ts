import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { PermissionGrantTwinRolesFilter } from "@/entities/twinRole";

export function createPermissionTwinRoleApi(settings: ApiSettings) {
  async function searchTwinRole({
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
            lazyRelation: true,
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
    searchTwinRole,
  };
}

export type PermissionTwinRoleApi = ReturnType<
  typeof createPermissionTwinRoleApi
>;
