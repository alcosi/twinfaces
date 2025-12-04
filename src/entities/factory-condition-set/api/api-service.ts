import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryConditionSetCreateRq,
  FactoryConditionSetFilters,
  FactoryConditionSetUpdateRq,
  FactoryConditionSetViewQuery,
} from "./types";

export function createFactoryConditionSetApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryConditionSetFilters;
  }) {
    return settings.client.POST("/private/factory_condition_set/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showConditionSetInFactoryBranchUsagesCountMode: "SHOW",
          showConditionSetInFactoryEraserUsagesCountMode: "SHOW",
          showConditionSetInFactoryMultiplierFilterUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineStepUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineUsagesCountMode: "SHOW",
          showFactoryConditionSetMode: "DETAILED",
          showFactoryConditionSet2UserMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function create({ body }: { body: FactoryConditionSetCreateRq }) {
    return settings.client.POST("/private/factory_condition_set/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ body }: { body: FactoryConditionSetUpdateRq }) {
    return settings.client.PUT("/private/factory_condition_set/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function getById({
    id,
    query = {},
  }: {
    id: string;
    query?: FactoryConditionSetViewQuery;
  }) {
    return settings.client.GET(
      "/private/factory_condition_set/{factoryConditionSetId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryConditionSetId: id },
          query: query,
        },
      }
    );
  }

  return { search, create, update, getById };
}

export type FactoryConditionSetApi = ReturnType<
  typeof createFactoryConditionSetApi
>;
