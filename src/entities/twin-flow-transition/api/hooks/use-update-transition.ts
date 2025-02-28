import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { TwinFlowTransitionUpdateRq } from "../types";

// TODO: Apply caching-strategy
export const useUpdateTransition = () => {
  const api = useContext(ApiContext);

  const updateTransition = useCallback(
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

  return { updateTransition };
};
