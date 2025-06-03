import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  CreatePermissionRequestBody,
  GrantAssigneePropagationPermissionPayload,
  GrantTwinRolePermissionPayload,
  GrantUserGroupPermissionPayload,
  GrantUserPermissionPayload,
  PermissionFilters,
  QueryPermissionViewV1,
  UpdatePermissionRequestBody,
} from "./types";

export function createPermissionApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionFilters;
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
          sortAsc: false,
        },
      },
      body: {
        ...filters,
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

  function getPermissionsByUserId({
    userId,
    query = {},
  }: {
    userId: string;
    query?: QueryPermissionViewV1;
  }) {
    return settings.client.GET("/private/user/{userId}/permission/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { userId },
        query: query,
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

  function grantAssigneePropagationPermission({
    body,
  }: {
    body: GrantAssigneePropagationPermissionPayload;
  }) {
    return settings.client.POST(
      `/private/permission_grant/assignee_propagation/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
        },
        body,
      }
    );
  }

  return {
    search,
    create,
    update,
    getById,
    grantUserPermission,
    grantUserGroupPermission,
    grantTwinRolePermission,
    grantAssigneePropagationPermission,
    getPermissionsByUserId,
  };
}

export type PermissionApi = ReturnType<typeof createPermissionApi>;
