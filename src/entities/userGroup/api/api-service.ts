import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { PermissionGrantUserGroupFilters, UserGroupFilters } from "./types";

export function createUserGroupApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: UserGroupFilters;
  }) {
    return settings.client.POST("/private/user_group/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showUserGroupMode: "SHORT",
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
    filters: PermissionGrantUserGroupFilters;
  }) {
    return settings.client.POST(
      "/private/permission_grant/user_group/search/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showPermissionGrantUserGroup2PermissionSchemaMode: "DETAILED",
            showPermissionGrantUserGroup2PermissionMode: "DETAILED",
            showPermissionGrantUserGroup2UserGroupMode: "DETAILED",
            showPermissionGrantUserGroup2UserMode: "DETAILED",
            showPermissionGrantUserGroupMode: "DETAILED",
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

  return { search, searchPermissionGrants };
}

export type UserGroupApi = ReturnType<typeof createUserGroupApi>;
