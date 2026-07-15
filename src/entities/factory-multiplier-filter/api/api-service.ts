import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryMultiplierFilterCountGroupField,
  FactoryMultiplierFilterDuplicateRq,
  FactoryMultiplierFilterFilters,
  FactoryMultiplierFilterSortField,
  FactoryMultiplierFilterViewQuery,
} from "./types";

export function createFactoryMultiplierFilterApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: FactoryMultiplierFilterFilters;
    sortField?: FactoryMultiplierFilterSortField;
    sortDirection?: "ASC" | "DESC";
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
          search: { ...filters },
          sortField,
          sortDirection,
        },
      }
    );
  }

  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: FactoryMultiplierFilterFilters;
    groupFields: FactoryMultiplierFilterCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/factory_multiplier_filter/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryMultiplierFilter2FactoryConditionSetMode: "DETAILED",
          showFactoryMultiplierFilter2FactoryMultiplierMode: "DETAILED",
          showFactoryMultiplier2FactoryMode: "DETAILED",
          showFactoryMultiplier2TwinClassMode: "DETAILED",
          showFactoryMultiplierFilter2TwinClassMode: "DETAILED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: { ...filters },
        groupFields,
      },
    });
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

  function duplicate({ body }: { body: FactoryMultiplierFilterDuplicateRq }) {
    return settings.client.POST(
      "/private/factory_multiplier_filter/duplicate/v1",
      {
        params: { header: getApiDomainHeaders(settings) },
        body,
      }
    );
  }

  return { getById, search, count, duplicate };
}

export type FactoryMultiplierFilterApi = ReturnType<
  typeof createFactoryMultiplierFilterApi
>;
