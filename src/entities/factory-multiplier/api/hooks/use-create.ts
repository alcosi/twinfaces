import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryMultiplierCreateRq } from "../types";

export const useFactoryMultiplierCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryMultiplier = useCallback(
    async ({ id, body }: { id: string; body: FactoryMultiplierCreateRq }) => {
      try {
        const { error } = await api.factoryMultiplier.create({ id, body });

        if (error) {
          throw new Error("Failed to create fctory multiplier");
        }
      } catch (error) {
        throw new Error("An error occured while creating factory multiplier");
      }
    },
    [api]
  );

  return { createFactoryMultiplier };
};
