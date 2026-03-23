import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { TierCreateRq, TierFilters } from "./types";

export function createTierApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TierFilters;
  }) {
    return settings.client.POST("/private/tier/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTierMode: "DETAILED",
          showTier2PermissionSchemaMode: "DETAILED",
          showTier2TwinClassSchemaMode: "DETAILED",
          showTier2TwinflowSchemaMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: { ...filters },
    });
  }

  function create({ body }: { body: TierCreateRq }) {
    return settings.client.POST("/private/tier/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTierMode: "DETAILED",
          showTier2PermissionSchemaMode: "DETAILED",
          showTier2TwinClassSchemaMode: "DETAILED",
          showTier2TwinflowSchemaMode: "DETAILED",
        },
      },
      body,
    });
  }

  return {
    search,
    create,
  };
}

export type TierApi = ReturnType<typeof createTierApi>;
