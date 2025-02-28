import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { FactoryPipelineStepUpdateRq } from "../types";

// TODO: Apply caching-strategy
export const useFactoryPipelineStepUpdate = () => {
  const api = useContext(ApiContext);

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
