import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryMultiplierDuplicateRq } from "../types";

export const useFactoryMultiplierDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryMultiplier = useCallback(
    async (body: FactoryMultiplierDuplicateRq) => {
      try {
        const { data, error } = await api.factoryMultiplier.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory multiplier");
        }

        return data;
      } catch {
        throw new Error(
          "An error occurred while duplicating factory multiplier"
        );
      }
    },
    [api]
  );

  return { duplicateFactoryMultiplier };
};
