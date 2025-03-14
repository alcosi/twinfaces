import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { PipelineStepCreateRq } from "../types";

export const usePipelineStepCreate = () => {
  const api = useContext(PrivateApiContext);

  const createPipelineStep = useCallback(
    async ({ id, body }: { id: string; body: PipelineStepCreateRq }) => {
      try {
        const { error } = await api.pipelineStep.create({ id, body });

        if (error) {
          throw new Error("Failed to create pipeline step");
        }
      } catch (error) {
        throw new Error("An error occured while creating pipeline step");
      }
    },
    [api]
  );

  return { createPipelineStep };
};
