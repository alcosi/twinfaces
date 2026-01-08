import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinFlowFactoryCreateRq,
  TwinFlowFactoryFilters,
  TwinFlowFactoryUpdateRq,
} from "./types";

export function createTwinFlowFactoryApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinFlowFactoryFilters;
  }) {
    return settings.client.POST("/private/twinflow/factory/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinflowFactoryMode: "DETAILED",
          showTwinflowFactory2TwinflowMode: "DETAILED",
          showTwinflowFactory2FactoryMode: "DETAILED",
          showTwinflow2TwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: filters,
      },
    });
  }

  function create({ body }: { body: TwinFlowFactoryCreateRq }) {
    return settings.client.POST("/private/twinflow/factory/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function getById({ twinflowFactoryId }: { twinflowFactoryId: string }) {
    return settings.client.GET(
      "/private/twinflow/factory/{twinflowFactoryId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinflowFactoryId },
          query: {
            lazyRelation: false,
            showTwinflowFactoryMode: "DETAILED",
            showTwinflowFactory2TwinflowMode: "DETAILED",
            showTwinflowFactory2FactoryMode: "DETAILED",
            showTwinflow2TwinClassMode: "DETAILED",
          },
        },
      }
    );
  }

  function update({ body }: { body: TwinFlowFactoryUpdateRq }) {
    return settings.client.PUT("/private/twinflow/factory/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return { search, create, getById, update };
}

export type TwinFlowFactoryApi = ReturnType<typeof createTwinFlowFactoryApi>;
