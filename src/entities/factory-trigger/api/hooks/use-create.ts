import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryTriggerCreateRq } from "../types";

export function useFactoryTriggerCreate() {
  const api = useContext(PrivateApiContext);

  const createFactoryTrigger = useCallback(
    async ({ body }: { body: FactoryTriggerCreateRq }) => {
      try {
        const { error } = await api.factoryTrigger.create({ body });

        if (error) {
          throw new Error("Failed to create factory trigger");
        }
      } catch {
        throw new Error("An error occured while creating factory trigger");
      }
    },
    [api]
  );

  return { createFactoryTrigger };
}
