import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryConditionCreateRq } from "../types";

export const useFactoryConditionCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryCondition = useCallback(
    async ({ body }: { id: string; body: FactoryConditionCreateRq }) => {
      try {
        const { error } = await api.factoryCondition.create({ body });

        if (error) {
          throw new Error("Failed to create factory condition");
        }
      } catch {
        throw new Error("An error occured while creating factory condition");
      }
    },
    [api]
  );

  return { createFactoryCondition };
};
