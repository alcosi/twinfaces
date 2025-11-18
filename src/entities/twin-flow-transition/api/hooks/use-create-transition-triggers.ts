import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTransitionTriggerCreate } from "../types";

export const useCreateTransitionTrigger = () => {
  const api = useContext(PrivateApiContext);

  const createTransitionTrigger = useCallback(
    async ({ body }: { body: TwinTransitionTriggerCreate }) => {
      try {
        const result = await api.twinFlowTransition.createTrigger({ body });

        if (result.error) {
          throw new Error("Failed to create transition trigger");
        }

        return result;
      } catch {
        throw new Error("An error occurred while creating transition trigger");
      }
    },
    [api]
  );

  return { createTransitionTrigger };
};
