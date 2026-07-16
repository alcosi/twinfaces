import { PaginationState } from "@tanstack/react-table";

import {
  FactoryPipelineCountGroupField,
  FactoryPipelineCreateRq,
  FactoryPipelineDuplicateRq,
  FactoryPipelineExportSqlRq,
  FactoryPipelineFilters,
  FactoryPipelineSortField,
  FactoryPipelineUpdateRq,
  FactoryPipelineViewQuery,
} from "@/entities/factory-pipeline";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryPipelineApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: FactoryPipelineFilters;
    sortField?: FactoryPipelineSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/factory_pipeline/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryPipelineMode: "DETAILED",
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
          showFactoryPipeline2TwinClassMode: "DETAILED",
          showFactoryPipelineOutputTwinStatus2StatusMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
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
    filters: FactoryPipelineFilters;
    groupFields: FactoryPipelineCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/factory_pipeline/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipeline2TwinClassMode: "DETAILED",
          showFactoryPipelineOutputTwinStatus2StatusMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
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
    id,
    query = {},
  }: {
    id: string;
    query?: FactoryPipelineViewQuery;
  }) {
    return settings.client.GET("/private/factory_pipeline/{pipelineId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { pipelineId: id },
        query: query,
      },
    });
  }

  function update({ id, body }: { id: string; body: FactoryPipelineUpdateRq }) {
    return settings.client.PUT(
      "/private/factory_pipeline/{factoryPipelineId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryPipelineId: id },
        },
        body: body,
      }
    );
  }

  function create({ id, body }: { id: string; body: FactoryPipelineCreateRq }) {
    return settings.client.POST(
      `/private/factory/{factoryId}/factory_pipeline/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryId: id },
        },
        body: body,
      }
    );
  }

  function exportSql({ body }: { body: FactoryPipelineExportSqlRq }) {
    return settings.client.POST("/private/factory_pipeline/export/sql/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
      parseAs: "text",
    });
  }

  function duplicate({ body }: { body: FactoryPipelineDuplicateRq }) {
    return settings.client.POST("/private/factory_pipeline/duplicate/v1", {
      params: { header: getApiDomainHeaders(settings) },
      body,
    });
  }

  return { search, count, getById, update, create, exportSql, duplicate };
}

export type FactoryPipelineApi = ReturnType<typeof createFactoryPipelineApi>;
