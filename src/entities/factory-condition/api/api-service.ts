import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryConditionCreateRq,
  FactoryConditionFilters,
  FactoryConditionUpdateRq,
} from "./types";

export function createFactoryConditionApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryConditionFilters;
  }) {
    return settings.client.POST("/private/factory_condition/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryCondition2FactoryConditionSetMode: "DETAILED",
          showFactoryCondition2FeaturerMode: "DETAILED",
          showFactoryConditionMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function create({ body }: { body: FactoryConditionCreateRq }) {
    return settings.client.POST("/private/factory_condition/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ body }: { body: FactoryConditionUpdateRq }) {
    return settings.client.PUT("/private/factory_condition/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return { search, update, create };
}

export type FactoryConditionApi = ReturnType<typeof createFactoryConditionApi>;
