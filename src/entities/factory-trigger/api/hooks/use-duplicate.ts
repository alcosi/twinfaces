import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryTriggerDuplicateRq } from "../types";

export const useFactoryTriggerDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryTrigger = useCallback(
    async (body: FactoryTriggerDuplicateRq) => {
      try {
        const { data, error } = await api.factoryTrigger.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory trigger");
        }

        return data;
      } catch {
        throw new Error("An error occurred while duplicating factory trigger");
      }
    },
    [api]
  );

  return { duplicateFactoryTrigger };
};
