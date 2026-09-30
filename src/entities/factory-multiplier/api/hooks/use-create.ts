import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryMultiplierCreate } from "../types";

export const useFactoryMultiplierCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryMultiplier = useCallback(
    async ({ body }: { body: FactoryMultiplierCreate }) => {
      try {
        const { data, error } = await api.factoryMultiplier.create({
          body: { factoryMultipliers: [body] },
        });

        if (error) {
          throw new Error("Failed to create factory multiplier");
        }

        return data?.factoryMultiplierList?.[0]?.id;
      } catch (error) {
        throw new Error("An error occured while creating factory multiplier");
      }
    },
    [api]
  );

  return { createFactoryMultiplier };
};
