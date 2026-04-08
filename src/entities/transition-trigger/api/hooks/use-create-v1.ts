import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TransitionTriggerCreateRq } from "../types";

export function useTransitionTriggerCreate() {
  const api = useContext(PrivateApiContext);

  const createTransitionTrigger = useCallback(
    async ({ body }: { body: TransitionTriggerCreateRq }) => {
      try {
        const { error } = await api.transitionTrigger.create({ body });

        if (error) {
          throw new Error("Failed to create transition trigger");
        }
      } catch {
        throw new Error("An error occured while creating transition trigger");
      }
    },
    [api]
  );

  return { createTransitionTrigger };
}
