import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  FactoryPipelineStepDuplicateRq,
  FactoryPipelineStepExportSqlRq,
  FactoryPipelineStepRqQuery,
  FactoryPipelineStepUpdateRq,
  PipelineStepCountGroupField,
  PipelineStepCreateRq,
  PipelineStepFilters,
  PipelineStepSortField,
} from "./types";

export function createPipelineStepApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: PipelineStepFilters;
    sortField?: PipelineStepSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/factory_pipeline_step/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
          showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
          showFactoryPipelineStep2FactoryConditionSetMode: "DETAILED",
          showFactoryPipelineStep2FactoryPipelineMode: "DETAILED",
          showFactoryPipelineStepMode: "DETAILED",
          showFactoryPipelineStep2FeaturerMode: "DETAILED",
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
    filters: PipelineStepFilters;
    groupFields: PipelineStepCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/factory_pipeline_step/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
          showFactoryPipelineStep2FactoryConditionSetMode: "DETAILED",
          showFactoryPipelineStep2FactoryPipelineMode: "DETAILED",
          showFactoryPipelineStep2FeaturerMode: "DETAILED",
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

  function create({ id, body }: { id: string; body: PipelineStepCreateRq }) {
    return settings.client.POST(
      `/private/factory/factory_pipeline/{factoryPipelineId}/factory_pipeline_step/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryPipelineId: id },
        },
        body: body,
      }
    );
  }

  function getById({
    stepId,
    query,
  }: {
    stepId: string;
    query: FactoryPipelineStepRqQuery;
  }) {
    return settings.client.GET("/private/factory_pipeline_step/{stepId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { stepId },
        query,
      },
    });
  }

  function update({
    factoryPipelineStepId,
    body,
  }: {
    factoryPipelineStepId: string;
    body: FactoryPipelineStepUpdateRq;
  }) {
    return settings.client.PUT(
      "/private/factory/factory_pipeline_step/{factoryPipelineStepId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryPipelineStepId },
        },
        body,
      }
    );
  }

  function duplicate({ body }: { body: FactoryPipelineStepDuplicateRq }) {
    return settings.client.POST("/private/factory_pipeline_step/duplicate/v1", {
      params: { header: getApiDomainHeaders(settings) },
      body,
    });
  }

  function exportSql({ body }: { body: FactoryPipelineStepExportSqlRq }) {
    return settings.client.POST(
      "/private/factory_pipeline_step/export/sql/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
        },
        body: body,
        parseAs: "text",
      }
    );
  }

  return { search, count, create, getById, update, duplicate, exportSql };
}

export type PipelineStepApi = ReturnType<typeof createPipelineStepApi>;
