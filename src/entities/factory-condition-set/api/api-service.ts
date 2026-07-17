import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryConditionSetCountGroupField,
  FactoryConditionSetCreateRq,
  FactoryConditionSetDuplicateRq,
  FactoryConditionSetFilters,
  FactoryConditionSetSortField,
  FactoryConditionSetUpdateRq,
  FactoryConditionSetViewQuery,
} from "./types";

export function createFactoryConditionSetApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: FactoryConditionSetFilters;
    sortField?: FactoryConditionSetSortField;
    sortDirection?: "ASC" | "DESC";
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
          showFactoryConditionSet2FactoryMode: "DETAILED",
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
    filters: FactoryConditionSetFilters;
    groupFields: FactoryConditionSetCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/factory_condition_set/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryConditionSet2FactoryMode: "DETAILED",
          showFactoryConditionSet2UserMode: "DETAILED",
          showFactoryMode: "DETAILED",
          showUserMode: "DETAILED",
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

  function duplicate({ body }: { body: FactoryConditionSetDuplicateRq }) {
    return settings.client.POST("/private/factory_condition_set/duplicate/v1", {
      params: { header: getApiDomainHeaders(settings) },
      body,
    });
  }

  return { search, count, create, update, getById, duplicate };
}

export type FactoryConditionSetApi = ReturnType<
  typeof createFactoryConditionSetApi
>;
