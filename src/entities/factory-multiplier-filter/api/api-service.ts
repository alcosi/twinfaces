import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryMultiplierFilterFilters,
  FactoryMultiplierFilterViewQuery,
} from "./types";

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

  function getById({
    id,
    query = {},
  }: {
    id: string;
    query?: FactoryMultiplierFilterViewQuery;
  }) {
    return settings.client.GET(
      "/private/factory_multiplier_filter/{multiplierId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { multiplierId: id },
          query: query,
        },
      }
    );
  }

  return { getById, search };
}

export type FactoryMultiplierFilterApi = ReturnType<
  typeof createFactoryMultiplierFilterApi
>;
