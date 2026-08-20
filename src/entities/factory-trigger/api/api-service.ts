import { PaginationState } from "@tanstack/react-table";

import {
  FactoryTriggerCountGroupField,
  FactoryTriggerCreateRq,
  FactoryTriggerDuplicateRq,
  FactoryTriggerExportSqlRq,
  FactoryTriggerFilters,
  FactoryTriggerSortField,
  FactoryTriggerUpdateRq,
} from "@/entities/factory-trigger";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryTriggerApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: FactoryTriggerFilters;
    sortField?: FactoryTriggerSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/twin_factory/trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryTrigger2FactoryMode: "DETAILED",
          showFactoryTrigger2TwinTriggerMode: "DETAILED",
          showFactoryTrigger2TwinClassMode: "DETAILED",
          showFactoryTriggerMode: "DETAILED",
          showFactoryTrigger2FactoryConditionSetMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
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
    filters: FactoryTriggerFilters;
    groupFields: FactoryTriggerCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/twin_factory/trigger/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryTriggerMode: "DETAILED",
          showFactoryTrigger2FactoryMode: "DETAILED",
          showFactoryTrigger2TwinTriggerMode: "DETAILED",
          showFactoryTrigger2TwinClassMode: "DETAILED",
          showTwinClassMode: "DETAILED",
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

  function update({ body }: { body: FactoryTriggerUpdateRq }) {
    return settings.client.PUT("/private/twin_factory/trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function create({ body }: { body: FactoryTriggerCreateRq }) {
    return settings.client.POST("/private/twin_factory/trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function exportSql({ body }: { body: FactoryTriggerExportSqlRq }) {
    return settings.client.POST("/private/factory_trigger/export/sql/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
      parseAs: "text",
    });
  }

  function duplicate({ body }: { body: FactoryTriggerDuplicateRq }) {
    return settings.client.POST("/private/factory_trigger/duplicate/v1", {
      params: { header: getApiDomainHeaders(settings) },
      body,
    });
  }

  return { search, count, update, create, exportSql, duplicate };
}

export type FactoryTriggerApi = ReturnType<typeof createFactoryTriggerApi>;
