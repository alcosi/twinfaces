import { useCallback, useContext } from "react";

import { TwinFlowTransitionUpdateRq } from "@/entities/twin-flow-transition";
import { PrivateApiContext } from "@/shared/api";

export const useCreateTwinFlowTransition = () => {
  const api = useContext(PrivateApiContext);

  const createTwinFlowTransition = useCallback(
    async ({
      transitionId,
      body,
    }: {
      transitionId: string;
      body: TwinFlowTransitionUpdateRq;
    }) => {
      try {
        const result = await api.twinFlowTransition.update({
          transitionId: transitionId,
          body: body,
        });
        if (result.error) {
          throw new Error("Failed to create transition");
        }
      } catch (error) {
        throw new Error("An error occurred while create transition");
      }
    },
    [api]
  );

  return { createTwinFlowTransition };
};
