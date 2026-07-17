import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryConditionCountGroupField,
  FactoryConditionCreateRq,
  FactoryConditionDuplicateRq,
  FactoryConditionFilters,
  FactoryConditionSortField,
  FactoryConditionUpdateRq,
} from "./types";

export function createFactoryConditionApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: FactoryConditionFilters;
    sortField?: FactoryConditionSortField;
    sortDirection?: "ASC" | "DESC";
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
        search: { ...filters },
        sortField,
        sortDirection,
      },
    });
  }

  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: FactoryConditionFilters;
    groupFields: FactoryConditionCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/factory_condition/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryCondition2FactoryConditionSetMode: "DETAILED",
          showFactoryCondition2FeaturerMode: "DETAILED",
          showFactoryConditionSetMode: "DETAILED",
          showFeaturerMode: "DETAILED",
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

  function duplicate({ body }: { body: FactoryConditionDuplicateRq }) {
    return settings.client.POST("/private/factory_condition/duplicate/v1", {
      params: { header: getApiDomainHeaders(settings) },
      body,
    });
  }

  return { search, count, update, create, duplicate };
}

export type FactoryConditionApi = ReturnType<typeof createFactoryConditionApi>;
