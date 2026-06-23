import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryConditionSetDuplicateRq } from "../types";

export const useFactoryConditionSetDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryConditionSet = useCallback(
    async (body: FactoryConditionSetDuplicateRq) => {
      try {
        const { data, error } = await api.factoryConditionSet.duplicate({
          body,
        });

        if (error) {
          throw new Error("Failed to duplicate factory condition set");
        }

        return data;
      } catch {
        throw new Error(
          "An error occurred while duplicating factory condition set"
        );
      }
    },
    [api]
  );

  return { duplicateFactoryConditionSet };
};
