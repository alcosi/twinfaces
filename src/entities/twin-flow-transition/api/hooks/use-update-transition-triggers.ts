import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTransitionTriggerUpdate } from "../types";

export const useUpdateTransitionTrigger = () => {
  const api = useContext(PrivateApiContext);

  const updateTransitionTrigger = useCallback(
    async ({
      triggerId,
      body,
    }: {
      triggerId: string;
      body: TwinTransitionTriggerUpdate;
    }) => {
      try {
        const result = await api.twinFlowTransition.updateTrigger({
          triggerId,
          body,
        });

        if (result.error) {
          throw new Error("Failed to update transition trigger");
        }

        return result;
      } catch {
        throw new Error("An error occurred while updating transition trigger");
      }
    },
    [api]
  );

  return { updateTransitionTrigger };
};
