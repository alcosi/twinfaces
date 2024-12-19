import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { PermissionGrantSpaceRoleFilter } from "@/entities/spaceRole";

export function createPermissionSpaceRoleApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionGrantSpaceRoleFilter;
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

export type PermissionSpaceRoleApi = ReturnType<
  typeof createPermissionSpaceRoleApi
>;
