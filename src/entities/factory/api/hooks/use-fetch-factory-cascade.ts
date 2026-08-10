import { useCallback, useContext, useState } from "react";

import { PrivateApiContext, RelatedObjects } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { Factory } from "../types";

export type FactoryCascade = {
  factory: Factory;
  /**
   * Every entity of the cascade, flat and keyed by id. The graph is assembled
   * from these maps rather than from nested payloads — the API returns the whole
   * tree as related objects and only id lists on the entities themselves.
   */
  relatedObjects: RelatedObjects;
};

/**
 * Loads a factory together with its entire cascade — pipelines and their steps,
 * branches, multipliers and their filters, erasers, triggers, condition sets,
 * and the factories the pipelines/branches hand over to. One request backs the
 * whole Graph tab: both the factory tree and every node view read from it.
 */
export const useFetchFactoryCascade = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryCascade = useCallback(
    async (id: string): Promise<FactoryCascade | undefined> => {
      setLoading(true);
      try {
        const { data, error } = await api.factory.getById({
          id,
          query: {
            lazyRelation: false,
            showFactoryMode: "DETAILED",
            // Pulls the transitively reachable factories into `factoryMap`, so
            // a pipeline's "next factory" can be expanded in place.
            showFactoryCascadeMode: "SHOW",
            showFactory2UserMode: "DETAILED",
            showFactory2FactoryPipelineMode: "DETAILED",
            showFactoryPipeline2FactoryPipelineStepMode: "DETAILED",
            showFactoryPipeline2TwinClassMode: "DETAILED",
            showFactoryPipeline2FactoryConditionSetMode: "DETAILED",
            showFactoryPipelineNextTwinFactory2FactoryMode: "DETAILED",
            showFactoryPipelineOutputTwinStatus2StatusMode: "DETAILED",
            showFactoryPipelineStep2FactoryConditionSetMode: "DETAILED",
            showFactoryPipelineStep2FeaturerMode: "DETAILED",
            showFactory2FactoryBranchMode: "DETAILED",
            showFactoryBranch2FactoryConditionSetMode: "DETAILED",
            showFactoryBranch2FactoryMode: "DETAILED",
            showFactory2FactoryMultiplierMode: "DETAILED",
            showFactoryMultiplier2TwinClassMode: "DETAILED",
            showFactoryMultiplier2FeaturerMode: "DETAILED",
            showFactoryMultiplier2FactoryMultiplierFilterMode: "DETAILED",
            showFactoryMultiplierFilter2TwinClassMode: "DETAILED",
            showFactoryMultiplierFilter2FactoryConditionSetMode: "DETAILED",
            showTwinFactory2FactoryConditionSetMode: "DETAILED",
            showFactoryConditionSet2FactoryConditionMode: "DETAILED",
            showFactory2FactoryEraserMode: "DETAILED",
            showFactoryEraser2TwinClassMode: "DETAILED",
            showFactoryEraser2FactoryConditionSetMode: "DETAILED",
            showFactory2FactoryTriggerMode: "DETAILED",
            showFeaturerParamMode: "SHOW",
          },
        });

        if (error) {
          throw new Error("Failed to fetch factory cascade due to API error");
        }

        if (!data || isUndefined(data.factory)) {
          throw new Error("Response does not have factory data");
        }

        return {
          factory: data.factory,
          relatedObjects: data.relatedObjects ?? {},
        };
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryCascade, loading };
};
