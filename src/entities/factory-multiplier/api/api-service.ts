import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryMultiplierFilters } from "./types";

export function createFactoryMultiplierApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryMultiplierFilters;
  }) {
    return settings.client.POST("/private/factory_multiplier/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryMultiplier2FactoryMode: "DETAILED",
          showFactoryMultiplier2TwinClassMode: "DETAILED",
          showFactoryMultiplierFiltersCountMode: "SHOW",
          showFactoryMultiplierMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  return { search };
}

export type FactoryMultiplierApi = ReturnType<
  typeof createFactoryMultiplierApi
>;
