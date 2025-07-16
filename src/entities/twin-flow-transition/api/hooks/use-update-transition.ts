import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowTransitionUpdateRq } from "../types";

export const useUpdateTwinFlowTransition = () => {
  const api = useContext(PrivateApiContext);

  const updateTwinFlowTransition = useCallback(
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

  return { updateTwinFlowTransition };
};
