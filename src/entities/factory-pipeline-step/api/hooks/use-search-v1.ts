import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import {
  PipelineStepFilters,
  PipelineStepSortField,
  PipelineStep_DETAILED,
} from "../../api";
import { hydratePipelineStepFromMap } from "../../libs";

export function usePipelineStepSearch() {
  const api = useContext(PrivateApiContext);

  const searchPipelineStep = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: PipelineStepFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<PipelineStep_DETAILED>> => {
      try {
        const { data, error } = await api.pipelineStep.search({
          pagination,
          filters,
          sortField: sort?.field as PipelineStepSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Response has no data");
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
