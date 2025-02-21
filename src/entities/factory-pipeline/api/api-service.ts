import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import {
  FactoryPipelineFilters,
  FactoryPipelineUpdateRq,
  FactoryPipelineViewQuery,
} from "@/entities/factory-pipeline";

export function createFactoryPipelineApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryPipelineFilters;
  }) {
    return settings.client.POST("/private/factory_pipeline/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryPipelineMode: "DETAILED",
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
          showFactoryPipelineTwinFactory2FactoryMode: "DETAILED",
          showFactoryPipeline2TwinClassMode: "DETAILED",
          showFactoryPipelineOutputTwinStatus2StatusMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
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

  return { search, getById, update };
}

export type FactoryPipelineApi = ReturnType<typeof createFactoryPipelineApi>;
