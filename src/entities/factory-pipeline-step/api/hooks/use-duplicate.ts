import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineStepDuplicateRq } from "../types";

export const useFactoryPipelineStepDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryPipelineStep = useCallback(
    async (body: FactoryPipelineStepDuplicateRq) => {
      try {
        const { data, error } = await api.pipelineStep.duplicate({
          body,
        });

        if (error) {
          throw new Error("Failed to duplicate factory pipeline step");
        }

        return data;
      } catch {
        throw new Error(
          "An error occurred while duplicating factory pipeline step"
        );
      }
    },
    [api]
  );

  return { duplicateFactoryPipelineStep };
};
