import { useCallback, useContext } from "react";

import { TwinFlowTransitionCreateRq } from "@/entities/twin-flow-transition";
import { PrivateApiContext } from "@/shared/api";

export const useCreateTwinFlowTransition = () => {
  const api = useContext(PrivateApiContext);

  const createTwinFlowTransition = useCallback(
    async ({
      twinFlowId,
      body,
    }: {
      twinFlowId: string;
      body: TwinFlowTransitionCreateRq;
    }) => {
      try {
        const result = await api.twinFlowTransition.create({
          twinFlowId,
          body,
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
