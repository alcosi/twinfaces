import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  CreatePermissionRequestBody,
  GrantSpaceRolePermissionPayload,
  GrantTwinRolePermissionPayload,
  GrantUserGroupPermissionPayload,
  GrantUserPermissionPayload,
  PermissionCountGroupField,
  PermissionFilters,
  PermissionSortField,
  QueryPermissionViewV1,
  UpdatePermissionRequestBody,
} from "./types";

export function createPermissionApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: PermissionFilters;
    sortField?: PermissionSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/permission/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermission2PermissionGroupMode: "DETAILED",
          showPermissionMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
        sortField,
        sortDirection,
      },
    });
  }

  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: PermissionFilters;
    groupFields: PermissionCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/permission/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermission2PermissionGroupMode: "DETAILED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: {
          ...filters,
        },
        groupFields,
      },
    });
  }

  async function create({ body }: { body: CreatePermissionRequestBody }) {
    return settings.client.POST("/private/permission/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  async function update({
    permissionId,
    body,
  }: {
    permissionId: string;
    body: UpdatePermissionRequestBody;
  }) {
    return settings.client.POST("/private/permission/{permissionId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { permissionId },
      },
      body: body,
    });
  }

  function getById({
    permissionId,
    query = {},
  }: {
    permissionId: string;
    query?: QueryPermissionViewV1;
  }) {
    return settings.client.GET("/private/permission/{permissionId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { permissionId },
        query,
      },
    });
  }

  function grantUserPermission({ body }: { body: GrantUserPermissionPayload }) {
    return settings.client.POST(`/private/permission_grant/user/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function grantUserGroupPermission({
    body,
  }: {
    body: GrantUserGroupPermissionPayload;
  }) {
    return settings.client.POST(`/private/permission_grant/user_group/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function grantTwinRolePermission({
    body,
  }: {
    body: GrantTwinRolePermissionPayload;
  }) {
    return settings.client.POST(`/private/permission_grant/twin_role/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function grantSpaceRolePermission({
    body,
  }: {
    body: GrantSpaceRolePermissionPayload;
  }) {
    return settings.client.POST(`/private/permission_grant/space_role/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return {
    search,
    count,
    create,
    update,
    getById,
    grantUserPermission,
    grantUserGroupPermission,
    grantTwinRolePermission,
    grantSpaceRolePermission,
  };
}

export type PermissionApi = ReturnType<typeof createPermissionApi>;
