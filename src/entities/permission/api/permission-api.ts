import { ApiSettings, getApiDomainHeaders } from "@/lib/api/api";
import { PaginationState } from "@tanstack/react-table";
import { PermissionApiFilters } from "./types";

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
          showPermission2PermissionGroupMode: "HIDE",
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

  return { search };
}

export type PermissionApi = ReturnType<typeof createPermissionApi>;
