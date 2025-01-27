import { useCallback, useContext } from "react";
import { ApiContext } from "@/shared/api";
import { FactoryPipeline } from "../../api";
import { isUndefined } from "@/shared/libs";

export function useFetchFactoryPipelineById() {
  const api = useContext(ApiContext);

  const fetchFactoryPipelineById = useCallback(
    async (pipelineId: string): Promise<FactoryPipeline> => {
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

        return data.pipeline;
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
