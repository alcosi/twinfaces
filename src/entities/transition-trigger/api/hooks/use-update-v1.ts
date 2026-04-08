import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TransitionTriggerUpdateRq } from "../types";

export function useTransitionTriggerUpdate() {
  const api = useContext(PrivateApiContext);

  const updateTransitionTrigger = useCallback(
    async ({ body }: { body: TransitionTriggerUpdateRq }) => {
      const { error } = await api.transitionTrigger.update({ body });

      if (error) {
        throw new Error("Failed to update transition trigger due to API error");
      }
    },
    [api]
  );

  return { updateTransitionTrigger };
}
