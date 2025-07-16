import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineStepUpdateRq } from "../types";

export const useFactoryPipelineStepUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateFactoryPipelineStep = useCallback(
    async ({
      factoryPipelineStepId,
      body,
    }: {
      factoryPipelineStepId: string;
      body: FactoryPipelineStepUpdateRq;
    }) => {
      return await api.pipelineStep.update({ factoryPipelineStepId, body });
    },
    [api]
  );

  return { updateFactoryPipelineStep };
};
