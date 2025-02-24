"use client";

import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext, useState } from "react";
import { FactoryPipelineStepRqQuery, PipelineStep_DETAILED } from "../../api";
import { hydratePipelineStepFromMap } from "@/entities/factory-pipeline-step";

// TODO: Apply caching-strategy after discussing with team
export const useFetchFactoryPipelineStepById = () => {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryPipelineStepById = useCallback(
    async ({
      stepId,
      query,
    }: {
      stepId: string;
      query: FactoryPipelineStepRqQuery;
    }): Promise<PipelineStep_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.pipelineStep.getById({
          stepId,
          query,
        });

        if (error) {
          throw new Error(
            "Failed to fetch pipeline step due to API error",
            error
          );
        }

        if (isUndefined(data?.step)) {
          throw new Error("Response does not have pipeline step data", error);
        }

        const step = hydratePipelineStepFromMap(data.step, data.relatedObjects);

        return step;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryPipelineStepById, loading };
};
