import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { TwinFlowTransitionUpdateRq } from "@/entities/twinFlowTransition";

export const useCreateTwinFlowTransition = () => {
  const api = useContext(ApiContext);

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
