import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryMultiplierFilterDuplicateRq } from "../types";

export const useFactoryMultiplierFilterDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryMultiplierFilter = useCallback(
    async (body: FactoryMultiplierFilterDuplicateRq) => {
      try {
        const { data, error } = await api.factoryMultiplierFilter.duplicate({
          body,
        });

        if (error) {
          throw new Error("Failed to duplicate factory multiplier filter");
        }

        return data;
      } catch {
        throw new Error(
          "An error occurred while duplicating factory multiplier filter"
        );
      }
    },
    [api]
  );

  return { duplicateFactoryMultiplierFilter };
};
