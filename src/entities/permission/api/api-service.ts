import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  CreatePermissionGrantUserGroupRequestBody,
  CreatePermissionGrantUserRequestBody,
  CreatePermissionRequestBody,
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

  function createPermissionGrantUser({
    body,
  }: {
    body: CreatePermissionGrantUserRequestBody;
  }) {
    return settings.client.POST(`/private/permission_grant/user/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function createPermissionGrantUserGroup({
    body,
  }: {
    body: CreatePermissionGrantUserGroupRequestBody;
  }) {
    return settings.client.POST(`/private/permission_grant/user_group/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return {
    search,
    create,
    update,
    getById,
    createPermissionGrantUser,
    createPermissionGrantUserGroup,
  };
}

export type PermissionApi = ReturnType<typeof createPermissionApi>;
