import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { FactoryMultiplierFilterFilters } from "./types";

export function createFactoryMultiplierFilterApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryMultiplierFilterFilters;
  }) {
    return settings.client.POST(
      `/private/factory_multiplier_filter/search/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showFactoryMultiplierFilter2FactoryConditionSetMode: "DETAILED",
            showFactoryMultiplierFilter2FactoryMultiplierMode: "DETAILED",
            showFactoryMultiplierFilterMode: "DETAILED",
            showFactoryMultiplier2FactoryMode: "DETAILED",
            showFactoryMultiplier2TwinClassMode: "DETAILED",
            showFactoryMultiplierFilter2TwinClassMode: "DETAILED",
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
          },
        },
        body: {
          ...filters,
        },
      }
    );
  }

  return { search };
}

export type FactoryMultiplierFilterApi = ReturnType<
  typeof createFactoryMultiplierFilterApi
>;
