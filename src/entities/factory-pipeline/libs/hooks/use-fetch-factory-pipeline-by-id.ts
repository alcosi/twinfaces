import { useCallback, useContext } from "react";
import { ApiContext } from "@/shared/api";
import { FactoryPipeline } from "../../api";

export function useFetchFactoryPipelineById() {
  const api = useContext(ApiContext);

  const fetchFactoryPipelineById = useCallback(
    async (id: string): Promise<FactoryPipeline> => {
      try {
        const { data, error } = await api.factoryPipeline.search({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (data.pipelines == null || data.pipelines.length == 0) {
          throw new Error(`Factory pipeline with ID ${id} not found.`);
        }

        return data.pipelines[0]!;
      } catch (error) {
        console.error(`Failed to find factory by ID: ${id}`, error);
        throw new Error(`Failed to find factory pipeline with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchFactoryPipelineById };
}
