import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryConditionDuplicateRq } from "../types";

export const useFactoryConditionDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryCondition = useCallback(
    async (body: FactoryConditionDuplicateRq) => {
      try {
        const { data, error } = await api.factoryCondition.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory condition");
        }

        return data;
      } catch {
        throw new Error(
          "An error occurred while duplicating factory condition"
        );
      }
    },
    [api]
  );

  return { duplicateFactoryCondition };
};
