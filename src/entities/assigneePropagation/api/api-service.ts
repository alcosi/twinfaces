import { PaginationState } from "@tanstack/table-core";

import { PermissionGrantAssigneePropagationFilter } from "@/entities/assigneePropagation";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createPermissionAssigneePropagationApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionGrantAssigneePropagationFilter;
  }) {
    return settings.client.POST(
      "/private/permission_grant/assignee_propagation/search/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showPermissionGrantAssigneePropagationMode: "DETAILED",
            showPermissionGrantAssigneePropagation2PermissionSchemaMode:
              "DETAILED",
            showPermissionGrantAssigneePropagation2TwinClassMode: "DETAILED",
            showPermissionGrantAssigneePropagation2UserMode: "DETAILED",
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

export type PermissionAssigneePropagationApi = ReturnType<
  typeof createPermissionAssigneePropagationApi
>;
