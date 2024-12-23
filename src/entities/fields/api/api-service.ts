import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { FieldsFilter } from "@/entities/fields";

export function createFieldsApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FieldsFilter;
  }) {
    return settings.client.POST("/private/twin_class_fields/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassFieldMode: "MANAGED",
          showTwinClassField2TwinClassMode: "DETAILED",
          showTwinClassField2PermissionMode: "DETAILED",
          showTwinClassField2FeaturerMode: "DETAILED",
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

  return {
    search,
  };
}

export type FieldsApi = ReturnType<typeof createFieldsApi>;
