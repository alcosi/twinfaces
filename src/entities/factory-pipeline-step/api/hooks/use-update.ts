import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineStepUpdate } from "../types";

export const useFactoryPipelineStepUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateFactoryPipelineStep = useCallback(
    async ({
      factoryPipelineStepId,
      body,
    }: {
      factoryPipelineStepId: string;
      body: Omit<FactoryPipelineStepUpdate, "id">;
    }) => {
      return await api.pipelineStep.update({
        body: {
          factoryPipelineSteps: [{ id: factoryPipelineStepId, ...body }],
        },
      });
    },
    [api]
  );

  return { updateFactoryPipelineStep };
};
