import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { PipelineStepsFilters } from "./types";

export function createPipelineStepsApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PipelineStepsFilters;
  }) {
    return settings.client.POST("/private/factory_pipeline_step/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showConditionSetInFactoryBranchUsagesCountMode: "SHOW",
          showConditionSetInFactoryEraserUsagesCountMode: "SHOW",
          showConditionSetInFactoryMultiplierFilterUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineStepUsagesCountMode: "SHOW",
          showConditionSetInFactoryPipelineUsagesCountMode: "SHOW",
          showFactoryBranchesCountMode: "SHOW",
          showFactoryErasersCountMode: "SHOW",
          showFactoryMultipliersCountMode: "SHOW",
          showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
          showFactoryPipeline2TwinClassMode: "DETAILED",
          showFactoryPipelineCountMode: "SHOW",
          showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
          showFactoryPipelineOutputTwinStatus2StatusMode: "DETAILED",
          showFactoryPipelineStep2FactoryConditionSetMode: "DETAILED",
          showFactoryPipelineStep2FactoryPipeline: "DETAILED",
          showFactoryPipelineStepMode: "DETAILED",
          showFactoryUsagesCountMode: "SHOW",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  return { search };
}

export type PipelineStepsApi = ReturnType<typeof createPipelineStepsApi>;
