import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryMultiplierCreateRq,
  FactoryMultiplierFilters,
  FactoryMultiplierUpdateRq,
  FactoryMultiplierViewQuery,
} from "./types";

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
          showFactoryMultiplier2FeaturerMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function getById({
    id,
    query = {},
  }: {
    id: string;
    query?: FactoryMultiplierViewQuery;
  }) {
    return settings.client.GET(
      "/private/factory_multiplier/{multiplierId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { multiplierId: id },
          query: query,
        },
      }
    );
  }

  function update({
    id,
    body,
  }: {
    id: string;
    body: FactoryMultiplierUpdateRq;
  }) {
    return settings.client.PUT(
      "/private/factory_multiplier/{factoryMultiplierId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryMultiplierId: id },
        },
        body: body,
      }
    );
  }

  function create({
    id,
    body,
  }: {
    id: string;
    body: FactoryMultiplierCreateRq;
  }) {
    return settings.client.POST(
      `/private/factory/{factoryId}/factory_multiplier/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryId: id },
        },
        body: body,
      }
    );
  }

  return { search, getById, update, create };
}

export type FactoryMultiplierApi = ReturnType<
  typeof createFactoryMultiplierApi
>;
