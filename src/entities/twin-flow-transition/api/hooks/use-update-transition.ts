import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowTransitionUpdateRq } from "../types";

// TODO: Apply caching-strategy
export const useUpdateTwinFlowTransition = () => {
  const api = useContext(PrivateApiContext);

  const updateTransitionTransition = useCallback(
    async ({
      transitionId,
      body,
    }: {
      transitionId: string;
      body: TwinFlowTransitionUpdateRq;
    }) => {
      return await api.twinFlowTransition.update({ transitionId, body });
    },
    [api]
  );

  return { updateTransitionTransition };
};
