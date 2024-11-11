import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import {
  CreatePermissionRequestBody,
  PermissionApiFilters,
  UpdatePermissionRequestBody,
} from "./types";

export function createPermissionApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionApiFilters;
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

  return { search, create, update };
}

export type PermissionApi = ReturnType<typeof createPermissionApi>;
