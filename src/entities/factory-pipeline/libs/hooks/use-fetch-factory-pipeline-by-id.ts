import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext } from "react";
import { FactoryPipeline_DETAILED } from "../../api";
import { hydrateFactoryPipelineFromMap } from "../helpers";

export function useFetchFactoryPipelineById() {
  const api = useContext(ApiContext);

  const fetchFactoryPipelineById = useCallback(
    async (pipelineId: string): Promise<FactoryPipeline_DETAILED> => {
      try {
        const { data, error } = await api.factoryPipeline.getById({
          pipelineId,
        });

        if (error) {
          throw new Error("Failed to fetch factory pipeline due to API error");
        }

        if (isUndefined(data.pipeline)) {
          throw new Error(`Factory pipeline with ID ${pipelineId} not found.`);
        }

        return hydrateFactoryPipelineFromMap(data.pipeline);
      } catch (error) {
        console.error(
          `Failed to find factory pipeline by ID: ${pipelineId}`,
          error
        );
        throw new Error(
          `Failed to find factory pipeline with ID ${pipelineId}`
        );
      }
    },
    [api]
  );

  return { fetchFactoryPipelineById };
}
