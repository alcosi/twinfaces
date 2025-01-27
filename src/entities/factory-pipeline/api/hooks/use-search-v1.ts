import { useCallback, useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { FactoryFilters } from "@/entities/factory";
import {
  FactoryPipeline_DETAILED,
  hydrateFactoryPipelineFromMap,
} from "@/entities/factory-pipeline";

// TODO: Turn off lazy-relation for twinClasses and factories, implement hydration
// https://alcosi.atlassian.net/browse/TWINFACES-419
export function useFactoryPipelineSearch() {
  const api = useContext(ApiContext);
  const searchFactoryPipelines = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryFilters;
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
