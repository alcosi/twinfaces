import { PaginationState } from "@tanstack/table-core";

import {
  PermissionGrantSpaceRoleFilters,
  SpaceRoleCountGroupField,
  SpaceRoleCreateRq,
  SpaceRoleFilters,
  SpaceRoleSortField,
  SpaceRoleUpdateRq,
} from "@/entities/space-role";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createPermissionSpaceRoleApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: SpaceRoleFilters;
    sortField?: SpaceRoleSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST(`/private/space_role/search/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showSpaceRoleMode: "DETAILED",
          showSpaceRole2TwinClassMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showSpaceRole2BusinessAccountMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        search: { ...filters },
        sortField,
        sortDirection,
      },
    });
  }

  async function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: SpaceRoleFilters;
    groupFields: SpaceRoleCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST(`/private/space_role/count/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showSpaceRoleMode: "DETAILED",
          showSpaceRole2TwinClassMode: "DETAILED",
          showSpaceRole2BusinessAccountMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: { ...filters },
        groupFields,
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

  async function create({ body }: { body: SpaceRoleCreateRq }) {
    return settings.client.POST("/private/space_role/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function update({ body }: { body: SpaceRoleUpdateRq }) {
    return settings.client.PUT("/private/space_role/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return {
    update,
    create,
    search,
    count,
    searchPermissionGranSpaceRole,
  };
}

export type PermissionSpaceRoleApi = ReturnType<
  typeof createPermissionSpaceRoleApi
>;
