import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext, useState } from "react";
import { FactoryPipeline_DETAILED } from "..";
import { hydrateFactoryPipelineFromMap } from "../../libs";

export function useFetchFactoryPipelineById() {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryPipelineById = useCallback(
    async (id: string): Promise<FactoryPipeline_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.factoryPipeline.getById({
          id: id,
          query: {
            lazyRelation: false,
            showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
            showFactoryPipeline2FactoryMode: "DETAILED",
            showFactoryPipelineMode: "DETAILED",
            showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
            showFactoryPipeline2TwinClassMode: "DETAILED",
            showFactoryPipelineOutputTwinStatus2StatusMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch factory pipeline due to API error",
            error
          );
        }

        if (isUndefined(data.pipeline)) {
          throw new Error(
            "Response does not have factory pipeline data",
            error
          );
        }

        if (data.pipeline && data.relatedObjects) {
          return hydrateFactoryPipelineFromMap(
            data.pipeline,
            data.relatedObjects
          );
        }

        return hydrateFactoryPipelineFromMap(data.pipeline);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryPipelineById, loading };
}
