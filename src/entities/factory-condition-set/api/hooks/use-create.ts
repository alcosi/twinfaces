import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryConditionSetCreateRq } from "../types";

export const useFactoryConditionSetCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryConditionSet = useCallback(
    async ({ body }: { body: FactoryConditionSetCreateRq }) => {
      try {
        const { error } = await api.factoryConditionSet.create({ body });

        if (error) {
          throw new Error("Failed to create factory condition set");
        }
      } catch (error) {
        console.error("Failed to create factory condition set:", error);
        throw new Error(
          "An error occured while creating factory condition set"
        );
      }
    },
    [api]
  );

  return { createFactoryConditionSet };
};
