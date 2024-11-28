import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { PermissionGroupFilters } from "./types";

export function createPermissionGroupApi(settings: ApiSettings) {
  async function search({
    search,
    pagination,
    filters,
  }: {
    search?: string;
    pagination: PaginationState;
    filters: PermissionGroupFilters;
  }) {
    return settings.client.POST("/private/permission_group/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermissionGroup2TwinClassMode: "DETAILED",
          showPermissionGroupMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        keyLikeList: search ? ["%" + search + "%"] : undefined,
        ...filters,
        showSystemGroups: true,
      },
    });
  }

  return { search };
}

export type PermissionGroupApi = ReturnType<typeof createPermissionGroupApi>;
