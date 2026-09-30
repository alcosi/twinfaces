import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { PipelineStepCreate } from "../types";

export const usePipelineStepCreate = () => {
  const api = useContext(PrivateApiContext);

  const createPipelineStep = useCallback(
    async ({ body }: { body: PipelineStepCreate }) => {
      try {
        const { data, error } = await api.pipelineStep.create({
          body: { factoryPipelineSteps: [body] },
        });

        if (error) {
          throw new Error("Failed to create pipeline step");
        }

        return data?.steps?.[0]?.id;
      } catch (error) {
        throw new Error("An error occured while creating pipeline step");
      }
    },
    [api]
  );

  return { createPipelineStep };
};
