import { PaginationState } from "@tanstack/react-table";

import {
  FactoryTriggerCreateRq,
  FactoryTriggerDuplicateRq,
  FactoryTriggerExportSqlRq,
  FactoryTriggerFilters,
  FactoryTriggerUpdateRq,
} from "@/entities/factory-trigger";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryTriggerApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryTriggerFilters;
  }) {
    return settings.client.POST("/private/twin_factory/trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinFactoryTrigger2FactoryMode: "DETAILED",
          showTwinFactoryTrigger2TwinTriggerMode: "DETAILED",
          showTwinFactoryTrigger2TwinClassMode: "DETAILED",
          showTwinFactoryTriggerMode: "DETAILED",
          showTwinFactoryTrigger2FactoryConditionSetMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
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

  return { search, update, create, exportSql, duplicate };
}

export type FactoryTriggerApi = ReturnType<typeof createFactoryTriggerApi>;
