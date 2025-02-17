import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryPipelineFilters } from "@/entities/factory-pipeline";

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

  function getById({ pipelineId }: { pipelineId: string }) {
    return settings.client.GET("/private/factory_pipeline/{pipelineId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { pipelineId: pipelineId },
        query: {
          lazyRelation: false,
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
          showFactoryPipelineMode: "DETAILED",
          showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
        },
      },
    });
  }

  return { search, getById };
}

export type FactoryPipelineApi = ReturnType<typeof createFactoryPipelineApi>;
