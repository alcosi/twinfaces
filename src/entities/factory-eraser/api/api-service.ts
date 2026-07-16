import { PaginationState } from "@tanstack/react-table";

import {
  FactoryEraserCountGroupField,
  FactoryEraserDuplicateRq,
  FactoryEraserExportSqlRq,
  FactoryEraserFilters,
  FactoryEraserRqQuery,
  FactoryEraserSortField,
  FactoryEraserUpdate,
} from "@/entities/factory-eraser";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryEraserApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: FactoryEraserFilters;
    sortField?: FactoryEraserSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/factory_eraser/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryEraserMode: "DETAILED",
          showFactoryEraser2FactoryMode: "DETAILED",
          showFactoryEraser2TwinClassMode: "DETAILED",
          showFactoryEraser2FactoryConditionSetMode: "DETAILED",
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
    filters: FactoryEraserFilters;
    groupFields: FactoryEraserCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/factory_eraser/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryEraser2FactoryMode: "DETAILED",
          showFactoryEraser2TwinClassMode: "DETAILED",
          showFactoryEraser2FactoryConditionSetMode: "DETAILED",
          showFactoryMode: "DETAILED",
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
    eraserId,
    query,
  }: {
    eraserId: string;
    query: FactoryEraserRqQuery;
  }) {
    return settings.client.GET("/private/factory_eraser/{eraserId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { eraserId },
        query,
      },
    });
  }

  function update({
    factoryEraserId,
    body,
  }: {
    factoryEraserId: string;
    body: FactoryEraserUpdate;
  }) {
    return settings.client.PUT(
      "/private/factory/factory_eraser/{factoryEraserId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryEraserId },
        },
        body: body,
      }
    );
  }

  function exportSql({ body }: { body: FactoryEraserExportSqlRq }) {
    return settings.client.POST("/private/factory_eraser/export/sql/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
      parseAs: "text",
    });
  }

  function duplicate({ body }: { body: FactoryEraserDuplicateRq }) {
    return settings.client.POST("/private/factory_eraser/duplicate/v1", {
      params: { header: getApiDomainHeaders(settings) },
      body,
    });
  }

  return { search, count, getById, update, exportSql, duplicate };
}

export type FactoryEraserApi = ReturnType<typeof createFactoryEraserApi>;
