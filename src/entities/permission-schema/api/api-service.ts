import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import {
  PermissionSchemaRqQuery,
  PermissionSchemaSearchFilters,
} from "./types";

export function createPermissionSchemaApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionSchemaSearchFilters;
  }) {
    return settings.client.POST("/private/permission_schema/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermissionSchemaMode: "DETAILED",
          showPermissionSchema2UserMode: "DETAILED",
          showPermissionSchema2BusinessAccountMode: "DETAILED",
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

  function getById({
    schemaId,
    query,
  }: {
    schemaId: string;
    query?: PermissionSchemaRqQuery;
  }) {
    return settings.client.GET("/private/permission_schema/{schemaId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { schemaId },
        query,
      },
    });
  }

  return { search, getById };
}

export type PermissionSchemaApi = ReturnType<typeof createPermissionSchemaApi>;
