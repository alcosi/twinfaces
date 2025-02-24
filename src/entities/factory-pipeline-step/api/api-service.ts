import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryPipelineStepRqQuery, PipelineStepFilters } from "./types";

export function createPipelineStepApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PipelineStepFilters;
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
        ...filters,
      },
    });
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

  return { search, getById };
}

export type PipelineStepApi = ReturnType<typeof createPipelineStepApi>;
