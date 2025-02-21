import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { hydratePipelineStepFromMap } from "../helpers";
import { PipelineStep_DETAILED, PipelineStepFilters } from "../../api";

export function usePipelineStepSearch() {
  const api = useContext(ApiContext);

  const searchPipelineStep = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: PipelineStepFilters;
    }): Promise<PagedResponse<PipelineStep_DETAILED>> => {
      try {
        const { data, error } = await api.pipelineStep.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }
        const pipelineSteps = (data.steps || []).map((dto) =>
          hydratePipelineStepFromMap(dto, data.relatedObjects)
        );

        return {
          data: pipelineSteps,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch pipeline steps: ", error);
        throw new Error(
          "An error occured while fetching pipeline steps: " + error
        );
      }
    },
    [api]
  );

  return { searchPipelineStep };
}
