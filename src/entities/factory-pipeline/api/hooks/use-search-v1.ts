import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  FactoryPipelineFilters,
  FactoryPipeline_DETAILED,
  hydrateFactoryPipelineFromMap,
} from "@/entities/factory-pipeline";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useFactoryPipelineSearch() {
  const api = useContext(PrivateApiContext);
  const searchFactoryPipelines = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryPipelineFilters;
    }): Promise<PagedResponse<FactoryPipeline_DETAILED>> => {
      try {
        const { data, error } = await api.factoryPipeline.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const pipelines =
          data.pipelines?.map((dto) =>
            hydrateFactoryPipelineFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: pipelines,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory pipelines:", error);
        throw new Error(
          "An error occurred while fetching factory pipelines: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryPipelines };
}
